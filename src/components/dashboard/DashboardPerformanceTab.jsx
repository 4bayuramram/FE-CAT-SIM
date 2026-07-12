import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";

/**
 * DashboardPerformanceTab — isi tab "Performa".
 *
 * Beda dengan tab "Skor & Peringkat" (yang menampilkan skor TERBARU
 * per paket), tab ini fokus pada PROGRES ANTAR PERCOBAAN: begitu user
 * mengerjakan ulang paket yang sama (Try Out edisi ke-2, ke-3, dst),
 * di sinilah perbandingan naik/turun skornya ditampilkan per paket.
 *
 * CATATAN SUMBER DATA: exam_results saat ini hanya menyimpan attempt
 * PERTAMA per paket per user (lihat catatan di
 * services/leaderboard/getPackageLeaderboard.js & submit-exam Edge
 * Function) -- riwayat multi-attempt BELUM ditrack di backend. Karena
 * itu prop `attempts` defaultnya kosong dan tab ini akan tampil dalam
 * kondisi "belum ada data" untuk kebanyakan user, sampai backend
 * menambah tracking attempt ke-2+ (mis. tabel exam_attempts / kolom
 * attempt_number). BEGITU data itu tersedia, cukup kirim lewat prop
 * `attempts` -- tidak ada perubahan yang dibutuhkan di komponen ini.
 *
 * Props:
 * - attempts: [{
 *     packageId, packageTitle, category,
 *     history: [{ attemptNumber, score, date }]  // urut attempt 1..n
 *   }]
 * - onExplorePackages(): CTA saat belum ada data sama sekali
 */
export default function DashboardPerformanceTab({ attempts = [], onExplorePackages }) {
  const withHistory = attempts.filter((a) => (a.history?.length ?? 0) >= 2);

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[var(--db-primary)]">
          Performa
        </h2>
        <p className="text-sm text-[var(--db-on-surface-variant)] mt-1">
          Progres skormu setiap kali mengerjakan ulang paket try out yang
          sama (percobaan ke-2 dan seterusnya).
        </p>
      </div>

      {withHistory.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-8 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[var(--db-surface-container-low)] flex items-center justify-center">
            <TimelineRoundedIcon className="text-[var(--db-primary-container)]" />
          </div>
          <h3 className="text-base font-bold text-[var(--db-on-surface)]">
            Belum ada progres untuk ditampilkan
          </h3>
          <p className="text-sm text-[var(--db-on-surface-variant)] max-w-sm">
            Kerjakan ulang salah satu paket try out yang sudah kamu selesaikan
            untuk mulai melihat perbandingan skor antar percobaan di sini.
          </p>
          {onExplorePackages && (
            <button
              type="button"
              onClick={onExplorePackages}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--db-primary-container)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <RocketLaunchRoundedIcon style={{ fontSize: 18 }} />
              Jelajahi Try Out
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {withHistory.map((pkg) => (
            <PerformancePackageCard key={pkg.packageId} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}

function PerformancePackageCard({ pkg }) {
  const history = pkg.history;
  const first = history[0];
  const latest = history[history.length - 1];
  const delta = (latest?.score ?? 0) - (first?.score ?? 0);

  const Trend =
    delta > 0 ? TrendingUpRoundedIcon : delta < 0 ? TrendingDownRoundedIcon : TrendingFlatRoundedIcon;
  const trendColor =
    delta > 0
      ? "text-[var(--db-success)]"
      : delta < 0
      ? "text-[var(--db-error)]"
      : "text-[var(--db-on-surface-variant)]";

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--db-on-surface)] truncate">
            {pkg.packageTitle}
          </p>
          <p className="text-xs text-[var(--db-on-surface-variant)] uppercase">
            {pkg.category}
          </p>
        </div>
        <div className={`flex items-center gap-1 font-bold text-sm shrink-0 ${trendColor}`}>
          <Trend style={{ fontSize: 20 }} />
          {delta > 0 ? "+" : ""}
          {delta}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto dashboard-scrollbar pb-1">
        {history.map((h, idx) => (
          <div key={h.attemptNumber ?? idx} className="flex items-center gap-2 shrink-0">
            <div className="bg-[var(--db-surface-container-low)] rounded-xl px-3 py-2 text-center min-w-[4.5rem]">
              <p className="text-[10px] uppercase tracking-wide text-[var(--db-on-surface-variant)]">
                Percobaan {h.attemptNumber ?? idx + 1}
              </p>
              <p className="text-sm font-black text-[var(--db-primary)]">{h.score}</p>
            </div>
            {idx < history.length - 1 && (
              <span className="text-[var(--db-outline)]">&rarr;</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
