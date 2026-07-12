import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

/**
 * DashboardProgressCard — pilar "Progress": ringkasan "X dari Y paket
 * selesai" + bar visual sederhana (bukan grafik kompleks, sesuai OUT
 * OF SCOPE roadmap). Klik kartu → berfokus ke daftar paket (lihat
 * DashboardOverviewTab + DashboardPackagesFocusList), BUKAN langsung
 * pindah halaman.
 *
 * Props:
 * - totalPackages, attemptedPackages: number
 * - onClick(): buka focus view daftar paket (opsional — kalau tidak
 *   diisi, kartu tampil non-interaktif)
 */
export default function DashboardProgressCard({
  totalPackages = 0,
  attemptedPackages = 0,
  onClick,
}) {
  const percent =
    totalPackages > 0 ? Math.round((attemptedPackages / totalPackages) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="dashboard-card w-full text-left bg-white rounded-3xl p-5 border border-[var(--db-outline-variant)] shadow-sm disabled:cursor-default"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-[var(--db-on-surface)]">
          Progress Belajar
        </p>
        {onClick && (
          <ChevronRightRoundedIcon
            fontSize="small"
            className="text-[var(--db-outline)]"
          />
        )}
      </div>

      <div className="h-3 w-full bg-[var(--db-surface-container)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--db-primary-container)] rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-[var(--db-on-surface-variant)] mt-2">
        {attemptedPackages} dari {totalPackages} paket selesai ({percent}%)
      </p>
    </button>
  );
}
