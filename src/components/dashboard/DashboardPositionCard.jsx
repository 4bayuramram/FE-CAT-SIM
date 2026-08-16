import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

/**
 * DashboardPositionCard — versi detail pilar "Position" (focus view
 * dari kartu "Peringkat Terbaik" di DashboardStatsGrid).
 *
 * currentRank/totalPeserta/percentile belum tersedia dari sumber data
 * (cuma bestRank dari RPC leaderboard) — fallback "segera hadir".
 * Otomatis tampil begitu container kirim field itu, tanpa ubah komponen.
 *
 * Props:
 * - bestRank, currentRank, totalPeserta, percentile: number | null
 * - onSeeFullLeaderboard()
 */
export default function DashboardPositionCard({
  bestRank = null,
  currentRank = null,
  totalPeserta = null,
  percentile = null,
  onSeeFullLeaderboard,
}) {
  const hasExtra = currentRank != null || totalPeserta != null || percentile != null;

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-5 md:p-6 max-w-xl">
      <div className="flex items-center gap-2 mb-4">
        <WorkspacePremiumRoundedIcon
          fontSize="small"
          className="text-[var(--db-secondary-container)]"
        />
        <p className="text-sm font-bold text-[var(--db-on-surface)]">
          Posisi Kamu
        </p>
      </div>

      <div className="flex items-end gap-2">
        <h3 className="text-4xl font-black text-[var(--db-primary)]">
          {bestRank ? `#${bestRank}` : "—"}
        </h3>
        <span className="text-xs text-[var(--db-on-surface-variant)] mb-1.5">
          Peringkat terbaik
        </span>
      </div>

      {hasExtra ? (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {currentRank != null && (
            <StatMini label="Peringkat Saat Ini" value={`#${currentRank}`} />
          )}
          {totalPeserta != null && (
            <StatMini label="Total Peserta" value={totalPeserta} />
          )}
          {percentile != null && (
            <StatMini label="Persentil" value={`Top ${percentile}%`} />
          )}
        </div>
      ) : (
        <p className="text-xs text-[var(--db-on-surface-variant)] mt-3">
          Detail peringkat saat ini &amp; persentil segera hadir.
        </p>
      )}

      {onSeeFullLeaderboard && (
        <button
          type="button"
          onClick={onSeeFullLeaderboard}
          className="mt-5 text-sm font-bold text-[var(--db-primary-container)] hover:underline text-left"
        >
          Lihat Leaderboard Lengkap
        </button>
      )}
    </div>
  );
}

function StatMini({ label, value }) {
  return (
    <div className="bg-[var(--db-surface-container-low)] rounded-xl px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--db-on-surface-variant)]">
        {label}
      </p>
      <p className="text-sm font-black text-[var(--db-primary)]">{value}</p>
    </div>
  );
}
