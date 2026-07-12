import InventoryRoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

function StatCard({ label, value, context, icon: Icon, accent = "primary", onClick }) {
  const borderClass =
    accent === "secondary"
      ? "border-[var(--db-secondary-container)]"
      : "border-[var(--db-primary)]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`dashboard-card w-full text-left bg-white rounded-3xl p-5 border-l-4 ${borderClass} shadow-sm disabled:cursor-default`}
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
      {context && (
        <p className="text-[11px] text-[var(--db-on-surface-variant)] mt-1.5">
          {context}
        </p>
      )}
    </button>
  );
}

/**
 * DashboardStatsGrid — "Card Statistik" di roadmap: 4 kartu ringkasan,
 * sekarang punya baris KONTEKS kecil di bawah angka (bukan cuma
 * angka polos), dan bisa DIKLIK untuk berfokus ke detailnya (lihat
 * DashboardOverviewTab). Tiap handler opsional — kalau tidak diisi,
 * kartu itu otomatis tampil non-interaktif.
 *
 * Props:
 * - totalPackages, attemptedPackages: number
 * - avgScore, bestRank: number | null
 * - onOwnedClick, onAttemptedClick, onScoreClick, onRankClick: () => void
 */
export default function DashboardStatsGrid({
  totalPackages = 0,
  attemptedPackages = 0,
  avgScore = null,
  bestRank = null,
  onOwnedClick,
  onAttemptedClick,
  onScoreClick,
  onRankClick,
}) {
  const percent =
    totalPackages > 0 ? Math.round((attemptedPackages / totalPackages) * 100) : null;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Paket Dimiliki"
        value={totalPackages}
        context={totalPackages > 0 ? "Semua aktif" : null}
        icon={InventoryRoundedIcon}
        onClick={onOwnedClick}
      />
      <StatCard
        label="Sudah Dikerjakan"
        value={attemptedPackages}
        context={percent != null ? `${percent}% selesai` : null}
        icon={CheckCircleRoundedIcon}
        onClick={onAttemptedClick}
      />
      <StatCard
        label="Rata-rata Skor"
        value={avgScore ?? "—"}
        context={avgScore != null ? "Dari paket yang dikerjakan" : null}
        icon={TrendingUpRoundedIcon}
        accent="secondary"
        onClick={onScoreClick}
      />
      <StatCard
        label="Peringkat Terbaik"
        value={bestRank ? `#${bestRank}` : "—"}
        context={bestRank ? "Peringkat terbaik" : null}
        icon={EmojiEventsRoundedIcon}
        accent="secondary"
        onClick={onRankClick}
      />
    </section>
  );
}
