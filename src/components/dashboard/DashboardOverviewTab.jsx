import { useState } from "react";
import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import DashboardContinueCard from "./DashboardContinueCard";
import DashboardProgressCard from "./DashboardProgressCard";
import DashboardStatsGrid from "./DashboardStatsGrid";
import DashboardCategoryScoreGrid from "./DashboardCategoryScoreGrid";
import { buildCategoryAverages } from "../../utils/categoryScoreUtils";
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
 * DashboardOverviewTab — isi tab "Ringkasan".
 *
 * Urutan halaman: Hero → Next Action (CTA utama) → Progress → Stats
 * Grid → Rata-rata Skor per Kategori (statis) → Insight (statis) →
 * Aktivitas Terakhir → Peringkat SKD (CTA sendiri, tidak focus-click
 * supaya tidak dobel pola).
 *
 * Klik section (kecuali Next Action & Peringkat SKD) ganti konten tab
 * ke detail section via state lokal `focus` (bukan route baru),
 * dengan DashboardFocusBackBar buat kembali.
 *
 * Insight & Aktivitas Terakhir dihitung sederhana dari
 * scoreSummaryRows (lihat buildInsights() & pickRecentActivity()).
 * Field yang belum ada dari backend pakai fallback (lihat
 * DashboardPositionCard), otomatis kepakai begitu backend kirim field
 * itu — tanpa perlu ubah kode komponen.
 *
 * Props: sama DashboardPageDb + packages, scoreSummaryRows,
 * onPackageDetail, onPackageLeaderboard, onGoToScoresTab.
 */
export default function DashboardOverviewTab({
  profile,
  stats,
  nextPackage,
  hasAnyPackage,
  packages = [],
  scoreSummaryRows = [],
  passingRule = null,
  skdRanking = null,
  onContinueStart,
  onSeeFullLeaderboard,
  onPackageDetail,
  onScoreRowClick,
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
            passingRule={passingRule}
            onRowClick={(row) =>
              onScoreRowClick
                ? onScoreRowClick(packages.find((p) => p.id === row.id) ?? row)
                : onPackageDetail?.(packages.find((p) => p.id === row.id) ?? row)
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
