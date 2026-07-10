import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

const CATEGORY_LABEL = { skd: "SKD", twk: "TWK", tiu: "TIU", tkp: "TKP" };

/**
 * DashboardPackageCard — kartu ringkas 1 paket di grid "Paket Saya".
 *
 * Props:
 * - title, category, questionCount, durationMinutes
 * - attempted: boolean — sudah pernah dikerjakan (ada baris di leaderboard)
 * - score, rank: hanya relevan kalau attempted true
 * - onDetailClick, onLeaderboardClick
 */
export default function DashboardPackageCard({
  title,
  category,
  questionCount,
  durationMinutes,
  attempted = false,
  score,
  rank,
  onDetailClick,
  onLeaderboardClick,
}) {
  return (
    <div className="dashboard-card bg-white rounded-2xl border border-[var(--db-outline-variant)] p-4 flex flex-col">
      <div className="flex justify-between items-start mb-3 gap-2">
        <span className="px-2 py-1 bg-[var(--db-surface-container)] text-[var(--db-primary-container)] text-[10px] font-bold rounded uppercase tracking-wide">
          {CATEGORY_LABEL[category] ?? "SKD"}
        </span>
        {attempted ? (
          <span className="px-2 py-1 bg-[var(--db-success-container)] text-[var(--db-success)] text-[10px] font-bold rounded uppercase">
            Sudah Dikerjakan
          </span>
        ) : (
          <span className="px-2 py-1 bg-[var(--db-secondary-container)]/30 text-[var(--db-on-secondary-container)] text-[10px] font-bold rounded uppercase">
            Belum Dikerjakan
          </span>
        )}
      </div>

      <h5 className="font-bold text-[var(--db-primary)] mb-1 line-clamp-2">
        {title}
      </h5>

      <div className="flex flex-wrap gap-3 text-xs text-[var(--db-on-surface-variant)] mt-1">
        <span className="flex items-center gap-1">
          <QuizRoundedIcon style={{ fontSize: 14 }} />
          {questionCount ?? "—"} Soal
        </span>
        <span className="flex items-center gap-1">
          <ScheduleRoundedIcon style={{ fontSize: 14 }} />
          {durationMinutes ? `${durationMinutes} Menit` : "—"}
        </span>
      </div>

      {attempted && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-[var(--db-surface-container-low)] rounded-xl">
          <EmojiEventsRoundedIcon
            style={{ fontSize: 18 }}
            className="text-[var(--db-secondary-container)]"
          />
          <p className="text-xs text-[var(--db-on-surface)]">
            Skor <span className="font-black text-[var(--db-primary)]">{score}</span>
            {" · "}Peringkat{" "}
            <span className="font-black text-[var(--db-primary)]">#{rank}</span>
          </p>
        </div>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onDetailClick}
          className="text-[var(--db-primary-container)] font-bold text-sm hover:underline"
        >
          {attempted ? "Coba Lagi" : "Mulai Simulasi"}
        </button>
        {attempted && (
          <button
            type="button"
            onClick={onLeaderboardClick}
            className="text-xs text-[var(--db-on-surface-variant)] hover:text-[var(--db-primary-container)] hover:underline"
          >
            Lihat Leaderboard
          </button>
        )}
      </div>
    </div>
  );
}
