import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";
import { DashboardPageDb } from "../../components/dashboard";
import { MOCK_DASHBOARD_DATA } from "../../components/dashboard/mockDashboardData";
import { initUserProfile } from "../../services/auth/initUserProfile";
import { getPackageLeaderboard } from "../../services/leaderboard/getPackageLeaderboard";
import { mapToLeaderboardRows } from "../../services/leaderboard/mapToLeaderboardRows";
import { resolvePackageCategory } from "../../utils/packageCategory";

/**
 * DashboardPageContainer — halaman "/home/dashboard".
 *
 * Reuse murni, tidak ada service/RPC baru:
 * - user_package_access + packages: paket apa saja yang dimiliki user
 *   (pola sama seperti PackageSim.jsx / LeaderboardPageContainer.jsx)
 * - questions (count): jumlah soal per paket (pola sama seperti
 *   PackageSim.jsx, best-effort)
 * - getPackageLeaderboard.js (RPC get_package_leaderboard): dipakai
 *   untuk menentukan apakah user sudah pernah mengerjakan tiap paket
 *   (skor & peringkat) -- exam_results tidak bisa dibaca langsung dari
 *   client (RLS tanpa policy), jadi ini SATU-SATUNYA sumber skor/
 *   peringkat yang tersedia dari sisi client. Konsekuensinya: tabel
 *   ringkasan di dashboard ini per-paket (bukan per-tanggal), karena
 *   RPC tidak membawa timestamp pengerjaan.
 * - mapToLeaderboardRows.js: reshape entries leaderboard untuk widget
 *   mini leaderboard (sama seperti dipakai LeaderboardPageContainer)
 * - user_profile: nama, domisili (province/city) untuk kartu akun
 *
 * FALLBACK KE DATA CONTOH (mockDashboardData.js):
 * Dipakai kalau (a) user belum punya paket sama sekali (packageIds
 * kosong), atau (b) query paket/leaderboard gagal (mis. RLS belum
 * dikonfigurasi saat development) -- supaya dashboard tetap enak
 * dilihat & dicoba, BUKAN kosong melompong atau layar error. Ditandai
 * jelas lewat prop `isMock` (badge "Data Contoh" di top bar, lihat
 * DashboardPageDb.jsx) supaya tidak disalahartikan sebagai data asli.
 *
 * FUTURE-PROOF: begitu `packages`/`packagesRes` di Supabase sudah
 * terisi data asli untuk user tsb, cabang fallback ini otomatis tidak
 * lagi terpakai -- tidak ada perubahan kode yang dibutuhkan di
 * komponen manapun, karena bentuk MOCK_DASHBOARD_DATA persis sama
 * dengan bentuk data asli (lihat komentar di mockDashboardData.js).
 */
export default function DashboardPageContainer() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      // Pastikan row user_profile ada (pola sama seperti
      // PackageInfoPage.jsx / DomicileGuard.jsx).
      await initUserProfile();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/cpn-z/login", { replace: true });
        return;
      }

      if (cancelled) return;

      const currentUser = session.user;
      const currentUserId = currentUser.id;

      try {
        const [profileRes, accessRes] = await Promise.all([
          supabase
            .from("user_profile")
            .select("first_name, last_name, email, province, city")
            .eq("id", currentUserId)
            .maybeSingle(),
          supabase
            .from("user_package_access")
            .select("package_id")
            .eq("user_id", currentUserId)
            .eq("status", "active"),
        ]);

        if (cancelled) return;

        if (accessRes.error) throw accessRes.error;

        const profile = profileRes.data;
        const fullName =
          [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
          currentUser.user_metadata?.full_name ||
          currentUser.email ||
          "Peserta";

        const domicile = [profile?.city, profile?.province].filter(Boolean).join(", ");

        const avatarUrl =
          currentUser.user_metadata?.avatar_url ||
          currentUser.user_metadata?.picture ||
          null;

        const realProfile = {
          name: fullName,
          email: profile?.email || currentUser.email,
          avatarUrl,
          domicile: domicile || null,
        };

        const packageIds = [
          ...new Set((accessRes.data || []).map((row) => row.package_id)),
        ];

        if (packageIds.length === 0) {
          // Belum punya paket sama sekali -- pakai data contoh untuk
          // sisi paket/skor/leaderboard, tapi identitas tetap asli.
          if (cancelled) return;
          setData({ ...MOCK_DASHBOARD_DATA, isMock: true, profile: realProfile });
          setLoading(false);
          return;
        }

        // Detail paket + jumlah soal + leaderboard tiap paket, diambil
        // paralel (pola sama seperti PackageSim.jsx / LeaderboardPageContainer.jsx).
        const [packagesRes, leaderboardResults] = await Promise.all([
          supabase.from("packages").select("*").in("id", packageIds),
          Promise.all(packageIds.map((id) => getPackageLeaderboard(id))),
        ]);

        if (cancelled) return;
        if (packagesRes.error) throw packagesRes.error;

        const questionCounts = await Promise.all(
          packageIds.map(async (id) => {
            const { count, error: countError } = await supabase
              .from("questions")
              .select("id", { count: "exact", head: true })
              .eq("package_id", id);
            return [id, !countError && typeof count === "number" ? count : null];
          })
        );
        const questionCountById = new Map(questionCounts);

        const packagesById = new Map((packagesRes.data || []).map((p) => [p.id, p]));

        const packagesForUI = packageIds.map((id, idx) => {
          const paket = packagesById.get(id);
          const leaderboardRes = leaderboardResults[idx];
          const entries = leaderboardRes.error ? [] : leaderboardRes.data || [];
          const ownRow = entries.find((row) => row.userId === currentUserId);

          return {
            id,
            title: paket?.title ?? "Paket",
            description: paket?.description,
            category: resolvePackageCategory(paket),
            questionCount: questionCountById.get(id),
            durationMinutes: paket?.duration_minutes,
            attempted: !!ownRow,
            score: ownRow?.score,
            rank: ownRow?.rank,
            entries,
          };
        });

        const attemptedPackages = packagesForUI.filter((p) => p.attempted);
        const avgScore =
          attemptedPackages.length > 0
            ? Math.round(
                attemptedPackages.reduce((sum, p) => sum + (p.score || 0), 0) /
                  attemptedPackages.length
              )
            : null;
        const bestRank =
          attemptedPackages.length > 0
            ? Math.min(...attemptedPackages.map((p) => p.rank).filter(Boolean))
            : null;

        const nextPkg = packagesForUI.find((p) => !p.attempted) || null;

        // Paket "unggulan" untuk mini leaderboard: yang peringkatnya
        // terbaik, kalau tidak ada yang dikerjakan, tidak ditampilkan.
        const featuredPkg =
          attemptedPackages.length > 0
            ? attemptedPackages.reduce(
                (best, p) => (!best || (p.rank && p.rank < best.rank) ? p : best),
                null
              )
            : null;

        const featuredLeaderboard = featuredPkg
          ? {
              packageTitle: featuredPkg.title,
              rows: mapToLeaderboardRows(featuredPkg.entries, currentUserId),
              currentUserRow: mapToLeaderboardRows(
                featuredPkg.entries.filter((e) => e.userId === currentUserId),
                currentUserId
              )[0],
            }
          : null;

        setData({
          isMock: false,
          profile: realProfile,
          stats: {
            totalPackages: packagesForUI.length,
            attemptedPackages: attemptedPackages.length,
            avgScore,
            bestRank,
          },
          nextPackage: nextPkg ? { id: nextPkg.id, title: nextPkg.title } : null,
          packages: packagesForUI,
          scoreSummaryRows: attemptedPackages.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            score: p.score,
            rank: p.rank,
          })),
          featuredLeaderboard,
        });
        setLoading(false);
      } catch (err) {
        // Query gagal (mis. RLS/skema belum siap saat development) --
        // fallback ke data contoh daripada layar error, lihat catatan
        // di header file ini. Tetap dilog supaya gampang di-debug.
        console.error("DashboardPageContainer: gagal memuat data asli, pakai data contoh.", err);
        if (cancelled) return;
        setData({
          ...MOCK_DASHBOARD_DATA,
          isMock: true,
          profile: {
            ...MOCK_DASHBOARD_DATA.profile,
            name:
              currentUser.user_metadata?.full_name ||
              currentUser.email ||
              MOCK_DASHBOARD_DATA.profile.name,
            email: currentUser.email || MOCK_DASHBOARD_DATA.profile.email,
          },
        });
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = (key) => {
    if (key === "try-out") navigate("/home/simulasi");
    if (key === "leaderboard") navigate("/home/leaderboard");
    if (key === "bantuan") navigate("/home/bantuan");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/home", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--db-surface,_#f8f9ff)] text-[var(--db-on-surface-variant,_#424750)]">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <DashboardPageDb
      isMock={data.isMock}
      profile={data.profile}
      stats={data.stats}
      nextPackage={data.nextPackage}
      packages={data.packages}
      scoreSummaryRows={data.scoreSummaryRows}
      featuredLeaderboard={data.featuredLeaderboard}
      onNavigate={handleNavigate}
      onPackageDetail={(pkg) => {
        if (data.isMock) return; // paket contoh tidak beneran ada di DB
        navigate(`/try-out/${pkg.id}/info`);
      }}
      onPackageLeaderboard={() => navigate("/home/leaderboard")}
      onExplorePackages={() => navigate("/home/simulasi")}
      onSeeFullLeaderboard={() => navigate("/home/leaderboard")}
      onContinueStart={() => {
        if (!data.isMock && data.nextPackage) {
          navigate(`/try-out/${data.nextPackage.id}/info`);
        } else {
          navigate("/home/simulasi");
        }
      }}
      onLogout={handleLogout}
    />
  );
}
