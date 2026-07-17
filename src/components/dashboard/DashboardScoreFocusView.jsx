import DashboardScoreSummaryTable from "./DashboardScoreSummaryTable";

/**
 * DashboardScoreFocusView — focus view untuk klik kartu statistik
 * "Rata-rata Skor" di tab Ringkasan. Reuse DashboardScoreSummaryTable
 * apa adanya + tombol untuk pindah ke tab "Skor & Peringkat" penuh
 * (tab beneran lewat activeTab, bukan route baru).
 *
 * Props:
 * - rows: scoreSummaryRows
 * - passingRule: diteruskan apa adanya ke DashboardScoreSummaryTable
 * - onRowClick(row)
 * - onOpenScoresTab()
 */
export default function DashboardScoreFocusView({
  rows = [],
  passingRule,
  onRowClick,
  onOpenScoresTab,
}) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <DashboardScoreSummaryTable
        rows={rows}
        passingRule={passingRule}
        onRowClick={onRowClick}
      />
      {onOpenScoresTab && (
        <button
          type="button"
          onClick={onOpenScoresTab}
          className="self-start text-sm font-bold text-[var(--db-primary-container)] hover:underline"
        >
          Buka Tab Skor &amp; Peringkat
        </button>
      )}
    </div>
  );
}
