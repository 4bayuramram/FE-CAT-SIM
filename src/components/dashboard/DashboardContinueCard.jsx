import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";

/**
 * DashboardContinueCard — ajakan aksi utama di bagian atas dashboard.
 *
 * Empat kondisi:
 * 1. `nextPackage.status === "in_progress"` (ada sesi ujian yang
 *    belum diselesaikan) -> ajak LANJUTKAN paket itu, prioritas
 *    tertinggi karena paling mendesak.
 * 2. `nextPackage` diisi tapi belum in_progress (ada paket dimiliki
 *    yang belum pernah disentuh) -> ajak mulai paket itu.
 * 3. `nextPackage` kosong tapi `hasAnyPackage` true (semua paket yang
 *    dimiliki sudah pernah dikerjakan) -> ajak lihat leaderboard/eksplor
 *    paket baru.
 * 4. `hasAnyPackage` false (belum punya paket sama sekali) -> ajak ke
 *    halaman Try Out untuk beli paket pertama.
 *
 * Props:
 * - nextPackage: { id, title, status? } | null
 * - hasAnyPackage: boolean
 * - onStart(): handler tombol utama (arahkan ke /try-out/:id/info atau
 *   /home/simulasi tergantung kondisi, ditentukan oleh pemanggil)
 */
export default function DashboardContinueCard({
  nextPackage,
  hasAnyPackage,
  onStart,
}) {
  let eyebrow = "Mulai Sekarang";
  let title = "Jelajahi Paket Try Out";
  let description =
    "Kamu belum memiliki paket try out. Pilih paket pertamamu dan mulai berlatih.";
  let buttonText = "Lihat Paket Try Out";

  if (nextPackage?.status === "in_progress") {
    eyebrow = "Ada yang Belum Selesai";
    title = nextPackage.title;
    description = "Kamu punya sesi ujian yang belum diselesaikan. Yuk lanjutkan!";
    buttonText = "Lanjutkan Simulasi";
  } else if (nextPackage) {
    eyebrow = "Lanjutkan Belajar";
    title = nextPackage.title;
    description = "Paket ini sudah kamu miliki dan belum pernah dikerjakan.";
    buttonText = "Mulai Simulasi";
  } else if (hasAnyPackage) {
    eyebrow = "Kerja Bagus!";
    title = "Semua Paketmu Sudah Dikerjakan";
    description =
      "Cek posisimu di leaderboard, atau jelajahi paket try out lain untuk terus berlatih.";
    buttonText = "Lihat Leaderboard";
  }

  return (
    <section className="dashboard-card rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-5 bg-gradient-to-r from-[var(--db-primary)] to-[var(--db-primary-container)] text-white">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
        <RocketLaunchRoundedIcon
          style={{ fontSize: 44 }}
          className="text-[var(--db-secondary-container)]"
        />
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-xs uppercase tracking-widest opacity-80">
          {eyebrow}
        </p>
        <h3 className="text-lg md:text-xl font-bold mt-1 truncate">
          {title}
        </h3>
        <p className="text-sm opacity-80 mt-1">{description}</p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full md:w-auto bg-[var(--db-secondary-container)] text-[var(--db-on-secondary-container)] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shrink-0"
      >
        {buttonText}
      </button>
    </section>
  );
}
