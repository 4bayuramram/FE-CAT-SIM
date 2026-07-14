import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";

const CATEGORY_LABEL = { skd: "SKD", twk: "TWK", tiu: "TIU", tkp: "TKP" };

// Label & style badge per status. "status" adalah sumber kebenaran baru;
// prop `attempted` (boolean lama) tetap didukung sebagai fallback supaya
// pemanggil yang belum diupdate tidak rusak (lihat resolveStatus di bawah).
const STATUS_META = {
  completed: {
    label: "Sudah Dikerjakan",
    badgeClass:
      "bg-[var(--db-success-container)] text-[var(--db-success)]",
  },
  in_progress: {
    label: "Sedang Dikerjakan",
    badgeClass:
      "bg-amber-100 text-amber-700",
  },
  not_started: {
    label: "Belum Dikerjakan",
    badgeClass:
      "bg-[var(--db-secondary-container)]/30 text-[var(--db-on-secondary-container)]",
  },
};

function resolveStatus(status, attempted) {
  if (status === "completed" || status === "in_progress" || status === "not_started") {
    return status;
  }
  // Fallback kalau pemanggil masih pakai `attempted` lama (belum kirim status).
  return attempted ? "completed" : "not_started";
}

/**
 * DashboardPackageCard — kartu ringkas 1 paket di grid "Paket Saya".
 *
 * Props:
 * - title, category, questionCount, durationMinutes
 * - status: "not_started" | "in_progress" | "completed" (sumber
 *   kebenaran utama, dikirim dari DashboardPageContainer)
 * - attempted: boolean — DEPRECATED, dipertahankan sebagai fallback
 *   kalau `status` belum dikirim
 * - score, rank: hanya relevan kalau status === "completed"
 * - onDetailClick, onLeaderboardClick
 */
export default function DashboardPackageCard({
  title,
  category,
  questionCount,
  durationMinutes,
  status,
  attempted = false,
  score,
  rank,
  onDetailClick,
  onLeaderboardClick,
}) {
  const resolvedStatus = resolveStatus(status, attempted);
  const meta = STATUS_META[resolvedStatus];
  const isCompleted = resolvedStatus === "completed";
  const isInProgress = resolvedStatus === "in_progress";

  return (
    <div className="dashboard-card bg-white rounded-2xl border border-[var(--db-outline-variant)] p-4 flex flex-col">
      <div className="flex justify-between items-start mb-3 gap-2">
        <span className="px-2 py-1 bg-[var(--db-surface-container)] text-[var(--db-primary-container)] text-[10px] font-bold rounded uppercase tracking-wide">
          {CATEGORY_LABEL[category] ?? "SKD"}
        </span>
        <span
          className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${meta.badgeClass}`}
        >
          {meta.label}
        </span>
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

      {isCompleted && (
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

      {isInProgress && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-amber-50 rounded-xl">
          <PlayCircleRoundedIcon
            style={{ fontSize: 18 }}
            className="text-amber-600"
          />
          <p className="text-xs text-amber-700">
            Kamu punya sesi yang belum diselesaikan.
          </p>
        </div>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onDetailClick}
          className="text-[var(--db-primary-container)] font-bold text-sm hover:underline"
        >
          {isCompleted ? "Coba Lagi" : isInProgress ? "Lanjutkan" : "Mulai Simulasi"}
        </button>
        {isCompleted && (
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
