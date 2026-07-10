import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";

/**
 * DashboardMiniLeaderboardCard — cuplikan top 3 + posisi user untuk 1
 * paket "unggulan" (biasanya paket dengan peringkat terbaik user).
 *
 * Menerima `rows` yang SUDAH di-map lewat
 * services/leaderboard/mapToLeaderboardRows.js (reuse langsung, bukan
 * bentuk data baru) — field yang dipakai: rank, id, name, avatarUrl,
 * score, variant ("current" | "normal" | "hidden").
 *
 * Props:
 * - packageTitle: string
 * - rows: hasil mapToLeaderboardRows, akan diambil top 3-nya
 * - currentUserRow: row user sendiri (dari mapToLeaderboardRows), tetap
 *   ditampilkan terpisah di bawah kalau posisinya di luar top 3
 * - onSeeAllClick
 */
export default function DashboardMiniLeaderboardCard({
  packageTitle,
  rows = [],
  currentUserRow,
  onSeeAllClick,
}) {
  const top3 = rows.slice(0, 3);
  const currentInTop3 = currentUserRow
    ? top3.some((r) => r.id === currentUserRow.id)
    : true;

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="min-w-0">
          <h4 className="text-lg font-bold text-[var(--db-on-surface)]">
            Top Peserta
          </h4>
          {packageTitle && (
            <p className="text-xs text-[var(--db-on-surface-variant)] truncate">
              {packageTitle}
            </p>
          )}
        </div>
        <MilitaryTechRoundedIcon
          className="text-[var(--db-secondary-container)]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        />
      </div>

      {top3.length === 0 ? (
        <p className="text-sm text-[var(--db-on-surface-variant)] py-4 text-center">
          Belum ada data leaderboard. Kerjakan paket try out untuk mulai
          bersaing.
        </p>
      ) : (
        <div className="space-y-2">
          {top3.map((row) => (
            <LeaderRow key={row.id ?? row.rank} row={row} />
          ))}
          {!currentInTop3 && currentUserRow && (
            <LeaderRow row={currentUserRow} highlight />
          )}
        </div>
      )}

      {onSeeAllClick && rows.length > 0 && (
        <button
          type="button"
          onClick={onSeeAllClick}
          className="mt-4 w-full text-sm font-bold text-[var(--db-primary-container)] hover:underline"
        >
          Lihat Leaderboard Lengkap
        </button>
      )}
    </div>
  );
}

function LeaderRow({ row, highlight }) {
  const isCurrent = highlight || row.variant === "current";
  const initial = (row.name || "?").trim().charAt(0).toUpperCase();

  return (
    <div
      className={
        isCurrent
          ? "flex items-center gap-3 p-2.5 bg-[var(--db-surface-container-low)] rounded-xl border border-[var(--db-primary-container)]"
          : "flex items-center gap-3 p-2.5 rounded-xl"
      }
    >
      <span
        className={
          isCurrent
            ? "text-base font-black text-white bg-[var(--db-primary-container)] w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            : "text-base font-black text-[var(--db-on-surface-variant)] w-7 h-7 flex items-center justify-center shrink-0"
        }
      >
        {row.rank}
      </span>

      {row.avatarUrl ? (
        <img
          src={row.avatarUrl}
          alt={row.name}
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[var(--db-primary-container)] text-white flex items-center justify-center font-bold shrink-0">
          {initial}
        </div>
      )}

      <div className="flex-grow min-w-0">
        <p className="text-sm font-bold truncate text-[var(--db-on-surface)]">
          {row.name}
          {isCurrent && (
            <span className="ml-1.5 text-[8px] bg-[var(--db-primary)] text-white px-1.5 py-0.5 rounded uppercase align-middle">
              Anda
            </span>
          )}
        </p>
        <p className="text-xs text-[var(--db-on-surface-variant)]">
          Skor: {row.score}
        </p>
      </div>
    </div>
  );
}
