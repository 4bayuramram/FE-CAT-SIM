import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";
import { LeaderboardPageDb } from "../../components/leaderboard";
import { mapToLeaderboardRows } from "../../services/leaderboard/mapToLeaderboardRows";
import { getPackageLeaderboard } from "../../services/leaderboard/getPackageLeaderboard";
import { resolvePackageCategory } from "../../utils/packageCategory";

/**
 * LeaderboardPageContainer — halaman leaderboard INDEPENDEN.
 *
 * Dipasang di route "/home/leaderboard" (src/routes/HomePage.jsx),
 * sejajar dengan "/home/simulasi", "/home/materi", dll -- BUKAN lagi
 * nested di bawah "/try-out/:packageId/*". Sebelumnya halaman ini
 * scoped ke 1 packageId dari URL; sekarang menampilkan leaderboard
 * SEMUA paket yang sudah dibeli & aktif user (user_package_access),
 * satu card per paket, tetap ranking per paket masing-masing (tidak
 * digabung/aggregate).
 *
 * Kalau user belum beli paket apa pun -> `packages` kosong -> tidak
 * ada row/card sama sekali (LeaderboardPageDb sudah punya empty state
 * bawaan untuk kondisi ini).
 *
 * Reuse murni, tidak ditulis ulang:
 * - getPackageLeaderboard.js + RPC get_package_leaderboard (masking
 *   identitas dilakukan di DB)
 * - resolvePackageCategory (utils/packageCategory.js) supaya tab
 *   kategori konsisten dengan Tabbed Interface di /home/simulasi
 * - Query user_package_access pakai pola yang sama dengan
 *   ProtectedExamLayoutDb.jsx / PackageSim.jsx (package_id + status
 *   'active'), bukan RPC baru.
 */
export default function LeaderboardPageContainer() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/cpn-z/login", { replace: true });
        return;
      }

      if (cancelled) return;

      const currentUserId = session.user.id;
      setUserName(session.user.user_metadata?.full_name || session.user.email);

      // 1) Paket mana saja yang sudah dibeli & aktif -- pola sama
      //    dengan ProtectedExamLayoutDb.jsx / PackageSim.jsx.
      const { data: accessRows, error: accessError } = await supabase
        .from("user_package_access")
        .select("package_id")
        .eq("user_id", currentUserId)
        .eq("status", "active");

      if (cancelled) return;

      if (accessError) {
        console.error(accessError);
        setError("Leaderboard belum bisa dimuat.");
        setLoading(false);
        return;
      }

      const packageIds = [
        ...new Set((accessRows || []).map((row) => row.package_id)),
      ];

      if (packageIds.length === 0) {
        setPackages([]);
        setLoading(false);
        return;
      }

      // 2) Detail paket (nama/deskripsi) + leaderboard tiap paket,
      //    diambil paralel. Leaderboard tetap per paket, TIDAK
      //    digabung -- lihat getPackageLeaderboard.js.
      const [packagesRes, leaderboardResults] = await Promise.all([
        supabase.from("packages").select("*").in("id", packageIds),
        Promise.all(packageIds.map((id) => getPackageLeaderboard(id))),
      ]);

      if (cancelled) return;

      if (packagesRes.error) {
        console.error(packagesRes.error);
        setError("Leaderboard belum bisa dimuat.");
        setLoading(false);
        return;
      }

      const packagesById = new Map(
        (packagesRes.data || []).map((p) => [p.id, p])
      );

      const packagesForUI = packageIds.map((id, idx) => {
        const paket = packagesById.get(id);
        const leaderboardRes = leaderboardResults[idx];

        if (leaderboardRes.error) {
          console.error(leaderboardRes.error);
        }

        const entries = leaderboardRes.data || [];

        return {
          id,
          name: paket?.title ?? "Paket",
          description: paket?.description,
          participantsCount: entries.length,
          category: resolvePackageCategory(paket),
          locked: false,
          rows: mapToLeaderboardRows(entries, currentUserId),
        };
      });

      setPackages(packagesForUI);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--lb-surface,_#f8f9ff)] text-[var(--lb-on-surface-variant,_#424750)]">
        Memuat leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 bg-[var(--lb-surface,_#f8f9ff)] text-[var(--lb-on-surface-variant,_#424750)]">
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <LeaderboardPageDb
      userName={userName}
      onBack={() => navigate("/home")}
      onDetailClick={(packageId) => navigate(`/try-out/${packageId}/info`)}
      onNavigate={(key) => {
        if (key === "home") navigate("/home");
        if (key === "try-out") navigate("/home/simulasi");
      }}
      packages={packages}
      showSideNav={false}
    />
  );
}
