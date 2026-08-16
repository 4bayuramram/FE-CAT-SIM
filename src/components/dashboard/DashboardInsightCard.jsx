import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";

/**
 * DashboardInsightCard — daftar insight singkat, dihitung sederhana
 * dari scoreSummaryRows — lihat buildInsights() di
 * DashboardOverviewTab.jsx. Tidak interaktif.
 *
 * Props:
 * - insights: string[]
 */
export default function DashboardInsightCard({ insights = [] }) {
  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <LightbulbRoundedIcon
          fontSize="small"
          className="text-[var(--db-secondary-container)]"
        />
        <p className="text-sm font-bold text-[var(--db-on-surface)]">Insight</p>
      </div>
      <ul className="flex flex-col gap-2">
        {insights.map((text, idx) => (
          <li
            key={idx}
            className="text-sm text-[var(--db-on-surface-variant)] flex items-start gap-2"
          >
            <span className="text-[var(--db-success)] font-bold shrink-0">
              ✓
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
