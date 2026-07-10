import InventoryRoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

function StatCard({ label, value, icon: Icon, accent = "primary" }) {
  const borderClass =
    accent === "secondary"
      ? "border-[var(--db-secondary-container)]"
      : "border-[var(--db-primary)]";

  return (
    <div
      className={`dashboard-card bg-white rounded-3xl p-5 border-l-4 ${borderClass} shadow-sm`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--db-on-surface-variant)]">
        {label}
      </p>
      <div className="flex justify-between items-center mt-2">
        <h3 className="text-2xl font-black text-[var(--db-primary)]">
          {value}
        </h3>
        <Icon
          style={{ fontSize: 34 }}
          className="text-[var(--db-primary-container)] opacity-20"
        />
      </div>
    </div>
  );
}

/**
 * DashboardStatsGrid — 4 kartu ringkasan.
 *
 * Props:
 * - totalPackages: jumlah paket yang sudah dimiliki (owned/aktif)
 * - attemptedPackages: jumlah paket yang sudah pernah dikerjakan
 *   (punya baris di leaderboard-nya)
 * - avgScore: rata-rata skor dari paket yang sudah dikerjakan (number | null)
 * - bestRank: peringkat terbaik di antara paket yang sudah dikerjakan
 *   (number | null)
 */
export default function DashboardStatsGrid({
  totalPackages = 0,
  attemptedPackages = 0,
  avgScore = null,
  bestRank = null,
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Paket Dimiliki" value={totalPackages} icon={InventoryRoundedIcon} />
      <StatCard
        label="Sudah Dikerjakan"
        value={attemptedPackages}
        icon={CheckCircleRoundedIcon}
      />
      <StatCard
        label="Rata-rata Skor"
        value={avgScore ?? "—"}
        icon={TrendingUpRoundedIcon}
        accent="secondary"
      />
      <StatCard
        label="Peringkat Terbaik"
        value={bestRank ? `#${bestRank}` : "—"}
        icon={EmojiEventsRoundedIcon}
        accent="secondary"
      />
    </section>
  );
}
