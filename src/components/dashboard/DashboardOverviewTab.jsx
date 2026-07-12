import { useState } from "react";
import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import DashboardContinueCard from "./DashboardContinueCard";
import DashboardProgressCard from "./DashboardProgressCard";
import DashboardStatsGrid from "./DashboardStatsGrid";
import DashboardCategoryScoreGrid, {
  buildCategoryAverages,
} from "./DashboardCategoryScoreGrid";
import DashboardInsightCard from "./DashboardInsightCard";
import DashboardRecentActivityCard from "./DashboardRecentActivityCard";
import DashboardSkdRankingSection from "./DashboardSkdRankingSection";
import DashboardFocusBackBar from "./DashboardFocusBackBar";
import DashboardPackagesFocusList from "./DashboardPackagesFocusList";
import DashboardScoreFocusView from "./DashboardScoreFocusView";
import DashboardPositionCard from "./DashboardPositionCard";

const FOCUS_TITLES = {
  "packages-all": "Paket Saya",
  "packages-done": "Paket Selesai",
  scores: "Rata-rata Skor",
  position: "Posisi Kamu",
  activity: "Aktivitas Terakhir",
};

/**
 * DashboardOverviewTab — isi tab "Ringkasan" (Home Dashboard utama
 * peserta), v2 sesuai roadmap "dashboard optimize".
 *
 * STRUKTUR HALAMAN (urutan, dari atas ke bawah — sengaja lebih
 * panjang/scroll ke bawah dibanding v1):
 * 1. Hero (DashboardWelcomeHeader) — sapaan + subtitle dinamis
 * 2. Next Action (DashboardContinueCard) — SATU CTA utama, langsung aksi
 * 3. Progress (DashboardProgressCard) — klik → focus daftar paket
 * 4. Card Statistik (DashboardStatsGrid) — tiap kartu klik → focus terkait
 * 4b. Rata-rata Skor per Kategori (DashboardCategoryScoreGrid) — 4
 *    kartu SKD/TWK/TIU/TKP, statis (tidak diklik)
 * 5. Insight (DashboardInsightCard) — statis, tidak diklik
 * 6. Aktivitas Terakhir (DashboardRecentActivityCard) — klik → focus detail
 * 7. Peringkat SKD (DashboardSkdRankingSection) — PENGGANTI "Top
 *    Peserta" lama: 3 kartu (nasional/provinsi/kabupaten-kota), murni
 *    posisi relatif user berbasis skor SKD, sudah punya CTA langsung
 *    sendiri ("Lihat Leaderboard Lengkap"), sengaja TIDAK dibuat
 *    focus-click juga supaya tidak ada 2 pola berbeda untuk aksi yang
 *    sama.
 *
 * MEKANISME FOCUS: klik section (kecuali Next Action & Peringkat SKD,
 * yang CTA-nya sudah final) mengganti konten tab ini ke DETAIL section
 * itu lewat state lokal `focus` (BUKAN route baru → dashboard tetap
 * ringan), dengan DashboardFocusBackBar ("Kembali") di atasnya. Dari
 * view fokus itulah baru ada aksi yang benar-benar pindah
 * halaman/tab (mulai simulasi, buka pembahasan, buka leaderboard,
 * pindah ke tab Skor & Peringkat).
 *
 * SUMBER DATA: Insight & Aktivitas Terakhir dihitung SEDERHANA (bukan
 * AI) langsung dari `scoreSummaryRows` yang SUDAH dikirim container —
 * lihat buildInsights() & pickRecentActivity() di bawah. Field yang
 * belum tersedia dari backend (peringkat real-time, total peserta,
 * tanggal pengerjaan) ditampilkan best-effort dengan fallback yang
 * jelas (lihat DashboardPositionCard), siap tersambung otomatis begitu
 * DashboardPageContainer mengirim field itu — TIDAK ADA perubahan kode
 * yang dibutuhkan di komponen manapun.
 *
 * Props: sama seperti DashboardPageDb, ditambah `packages`,
 * `scoreSummaryRows`, `onPackageDetail`, `onPackageLeaderboard`,
 * `onGoToScoresTab` untuk kebutuhan focus view.
 */
export default function DashboardOverviewTab({
  profile,
  stats,
  nextPackage,
  hasAnyPackage,
  packages = [],
  scoreSummaryRows = [],
  skdRanking = null,
  onContinueStart,
  onSeeFullLeaderboard,
  onPackageDetail,
  onPackageLeaderboard,
  onGoToScoresTab,
}) {
  // null | "packages-all" | "packages-done" | "scores" | "position" | "activity"
  const [focus, setFocus] = useState(null);

  const insights = buildInsights(scoreSummaryRows);
  const recentActivity = pickRecentActivity(scoreSummaryRows);
  // Fallback ringan kalau container belum mengirim stats.categoryAverages
  // eksplisit -- lihat DashboardCategoryScoreGrid.buildCategoryAverages.
  const categoryAverages = stats?.categoryAverages ?? buildCategoryAverages(scoreSummaryRows);

  if (focus) {
    return (
      <div className="flex flex-col gap-4">
        <DashboardFocusBackBar
          title={FOCUS_TITLES[focus]}
          onBack={() => setFocus(null)}
        />

        {focus === "packages-all" && (
          <DashboardPackagesFocusList
            packages={packages}
            filter="all"
            onDetailClick={onPackageDetail}
            onLeaderboardClick={onPackageLeaderboard}
          />
        )}

        {focus === "packages-done" && (
          <DashboardPackagesFocusList
            packages={packages}
            filter="done"
            onDetailClick={onPackageDetail}
            onLeaderboardClick={onPackageLeaderboard}
          />
        )}

        {focus === "scores" && (
          <DashboardScoreFocusView
            rows={scoreSummaryRows}
            onRowClick={(row) =>
              onPackageDetail?.(packages.find((p) => p.id === row.id) ?? row)
            }
            onOpenScoresTab={onGoToScoresTab}
          />
        )}

        {focus === "position" && (
          <DashboardPositionCard
            bestRank={stats?.bestRank}
            onSeeFullLeaderboard={onSeeFullLeaderboard}
          />
        )}

        {focus === "activity" && recentActivity && (
          <div className="max-w-xl flex flex-col gap-4">
            <DashboardRecentActivityCard activity={recentActivity} />
            <button
              type="button"
              onClick={() =>
                onPackageDetail?.(
                  packages.find((p) => p.id === recentActivity.id) ??
                    recentActivity
                )
              }
              className="self-start px-5 py-2.5 rounded-xl bg-[var(--db-primary-container)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Lihat Pembahasan
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <DashboardWelcomeHeader
          name={profile?.name}
          stats={stats}
          nextPackage={nextPackage}
          hasAnyPackage={hasAnyPackage}
        />

        <DashboardContinueCard
          nextPackage={nextPackage}
          hasAnyPackage={hasAnyPackage}
          onStart={onContinueStart}
        />

        {hasAnyPackage && (
          <DashboardProgressCard
            totalPackages={stats?.totalPackages}
            attemptedPackages={stats?.attemptedPackages}
            onClick={() => setFocus("packages-all")}
          />
        )}

        <DashboardStatsGrid
          totalPackages={stats?.totalPackages}
          attemptedPackages={stats?.attemptedPackages}
          avgScore={stats?.avgScore}
          bestRank={stats?.bestRank}
          onOwnedClick={() => setFocus("packages-all")}
          onAttemptedClick={() => setFocus("packages-done")}
          onScoreClick={
            stats?.avgScore != null ? () => setFocus("scores") : undefined
          }
          onRankClick={stats?.bestRank ? () => setFocus("position") : undefined}
        />

        <DashboardCategoryScoreGrid values={categoryAverages} />

        {insights.length > 0 && <DashboardInsightCard insights={insights} />}

        {recentActivity && (
          <DashboardRecentActivityCard
            activity={recentActivity}
            onClick={() => setFocus("activity")}
          />
        )}
      </div>

      <div className="w-full xl:w-80 shrink-0">
        <DashboardSkdRankingSection
          skdRanking={skdRanking}
          onSeeFullLeaderboard={onSeeFullLeaderboard}
        />
      </div>
    </div>
  );
}

const CATEGORY_LABEL = { skd: "SKD", twk: "TWK", tiu: "TIU", tkp: "TKP" };

/**
 * Insight sederhana (bukan AI): bandingkan rata-rata skor per kategori
 * dari scoreSummaryRows yang sudah ada. Butuh minimal 2 kategori
 * berbeda supaya perbandingan "terbaik vs perlu ditingkatkan" bermakna
 * — kalau belum cukup data, tidak menampilkan apa-apa (bukan
 * mengarang insight).
 */
function buildInsights(rows) {
  if (!rows || rows.length === 0) return [];

  const byCategory = new Map();
  rows.forEach((row) => {
    if (!row.category || row.score == null) return;
    const prev = byCategory.get(row.category) || { total: 0, count: 0 };
    byCategory.set(row.category, {
      total: prev.total + row.score,
      count: prev.count + 1,
    });
  });

  const averages = [...byCategory.entries()].map(([category, { total, count }]) => ({
    category,
    avg: total / count,
  }));

  if (averages.length < 2) return [];

  averages.sort((a, b) => b.avg - a.avg);
  const best = averages[0];
  const worst = averages[averages.length - 1];

  return [
    `${CATEGORY_LABEL[best.category] ?? best.category.toUpperCase()} merupakan kategori terbaikmu.`,
    `${CATEGORY_LABEL[worst.category] ?? worst.category.toUpperCase()} masih perlu ditingkatkan.`,
  ];
}

/**
 * Ambil 1 entri "aktivitas terakhir". CATATAN: scoreSummaryRows belum
 * membawa timestamp pengerjaan (lihat DashboardScoreSummaryTable.jsx),
 * jadi sementara diambil entri TERAKHIR di array — BUKAN benar-benar
 * diurutkan berdasarkan tanggal. Ganti ke sort-by-date begitu field
 * itu tersedia dari backend; komponen pemakainya tidak perlu diubah.
 */
function pickRecentActivity(rows) {
  if (!rows || rows.length === 0) return null;
  return rows[rows.length - 1];
}
