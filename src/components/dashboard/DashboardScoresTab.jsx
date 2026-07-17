import DashboardScoreSummaryTable from "./DashboardScoreSummaryTable";
import DashboardMiniLeaderboardCard from "./DashboardMiniLeaderboardCard";

/**
 * DashboardScoresTab — isi tab "Skor & Peringkat".
 */
export default function DashboardScoresTab({
  scoreSummaryRows,
  passingRule,
  onRowClick,
  featuredLeaderboard,
  onSeeFullLeaderboard,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[var(--db-primary)]">
           Hasil 
        </h2>
        <p className="text-sm text-[var(--db-on-surface-variant)] mt-1">
          Ringkasan skor dan posisi peringkatmu di tiap paket yang sudah
          dikerjakan pada percobaan pertama (nilai pemeringkatan ).
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <DashboardScoreSummaryTable
            rows={scoreSummaryRows}
            passingRule={passingRule}
            onRowClick={onRowClick}
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
    </div>
  );
}
