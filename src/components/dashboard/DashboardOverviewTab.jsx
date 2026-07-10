import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import DashboardStatsGrid from "./DashboardStatsGrid";
import DashboardContinueCard from "./DashboardContinueCard";
import DashboardMiniLeaderboardCard from "./DashboardMiniLeaderboardCard";

/**
 * DashboardOverviewTab — isi tab "Ringkasan" (tab default/pertama).
 *
 * Props: lihat DashboardPageDb — diteruskan apa adanya.
 */
export default function DashboardOverviewTab({
  profile,
  stats,
  nextPackage,
  hasAnyPackage,
  featuredLeaderboard,
  onContinueStart,
  onSeeFullLeaderboard,
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <DashboardWelcomeHeader name={profile?.name} />

        <DashboardStatsGrid
          totalPackages={stats?.totalPackages}
          attemptedPackages={stats?.attemptedPackages}
          avgScore={stats?.avgScore}
          bestRank={stats?.bestRank}
        />

        <DashboardContinueCard
          nextPackage={nextPackage}
          hasAnyPackage={hasAnyPackage}
          onStart={onContinueStart}
        />
      </div>

      {featuredLeaderboard && (
        <div className="w-full xl:w-80 shrink-0">
          <DashboardMiniLeaderboardCard
            packageTitle={featuredLeaderboard.packageTitle}
            rows={featuredLeaderboard.rows}
            currentUserRow={featuredLeaderboard.currentUserRow}
            onSeeAllClick={onSeeFullLeaderboard}
          />
        </div>
      )}
    </div>
  );
}
