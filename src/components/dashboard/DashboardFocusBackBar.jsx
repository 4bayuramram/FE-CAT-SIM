import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/**
 * DashboardFocusBackBar — bar "kembali" di ATAS view fokus (dipakai
 * saat user klik salah satu section di tab Ringkasan). Murni state
 * lokal (bukan route baru) supaya dashboard tetap ringan — lihat
 * mekanisme `focus` di DashboardOverviewTab.jsx.
 *
 * Props:
 * - title: judul section yang sedang difokuskan
 * - onBack(): kembali ke daftar Ringkasan penuh
 */
export default function DashboardFocusBackBar({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-2 sticky top-16 z-20 bg-[var(--db-surface)]/95 backdrop-blur-md -mx-4 md:-mx-8 px-4 md:px-8 py-2">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[var(--db-primary-container)] font-bold text-sm hover:bg-[var(--db-surface-container-low)] transition-colors -ml-2"
      >
        <ArrowBackRoundedIcon fontSize="small" />
        Kembali
      </button>
      {title && (
        <h3 className="text-base md:text-lg font-black text-[var(--db-primary)] truncate">
          {title}
        </h3>
      )}
    </div>
  );
}
