import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const CATEGORY_LABEL = { skd: "SKD", twk: "TWK", tiu: "TIU", tkp: "TKP" };

/**
 * DashboardRecentActivityCard — pilar "Aktivitas Terakhir".
 *
 * CATATAN DATA: scoreSummaryRows (hasil getPackageLeaderboard) belum
 * membawa timestamp pengerjaan (lihat catatan di
 * DashboardScoreSummaryTable.jsx), jadi "terakhir" di sini sementara
 * mengambil entri TERAKHIR dari scoreSummaryRows — BUKAN benar-benar
 * diurutkan berdasarkan tanggal. Begitu backend menambah kolom
 * tanggal, tinggal urutkan scoreSummaryRows berdasarkan itu sebelum
 * dikirim ke sini; komponen ini tidak perlu diubah.
 *
 * Props:
 * - activity: { id, title, category, score, rank } | null
 * - onClick(): buka focus view detail aktivitas (opsional)
 */
export default function DashboardRecentActivityCard({ activity, onClick }) {
  if (!activity) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="dashboard-card w-full text-left bg-white rounded-3xl p-5 border border-[var(--db-outline-variant)] shadow-sm flex items-center gap-4 disabled:cursor-default"
    >
      <div className="w-11 h-11 rounded-2xl bg-[var(--db-surface-container-low)] flex items-center justify-center shrink-0">
        <HistoryRoundedIcon
          fontSize="small"
          className="text-[var(--db-primary-container)]"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--db-outline)]">
          Aktivitas Terakhir
        </p>
        <p className="text-sm font-bold text-[var(--db-on-surface)] truncate">
          {activity.title}
        </p>
        <p className="text-xs text-[var(--db-on-surface-variant)]">
          {CATEGORY_LABEL[activity.category] ?? "SKD"} · Skor {activity.score}
          {activity.rank ? ` · Peringkat #${activity.rank}` : ""}
        </p>
      </div>

      {onClick && (
        <ChevronRightRoundedIcon
          fontSize="small"
          className="text-[var(--db-outline)] shrink-0"
        />
      )}
    </button>
  );
}
