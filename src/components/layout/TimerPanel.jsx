import { useSelector } from "react-redux";

export default function TimerPanel() {
  const remaining = useSelector((state) => state.exam.remainingTime);
  const session = useSelector((state) => state.exam.session);

  // Panel timer cuma relevan selama ujian benar-benar berjalan.
  if (!session || session.status !== "running") return null;

  const duration = session.duration;

  // Fallback: kalau remainingTime belum sempat ke-set oleh useTimer
  // (mis. render pertama sebelum effect jalan), tampilkan durasi penuh
  // dulu daripada "0:00" yang menyesatkan seolah waktu sudah habis.
  const displayRemaining =
    remaining === null || remaining === undefined ? duration : remaining;

  // progress sisa waktu (100% = full, 0% = habis)
  const progress = duration ? (displayRemaining / duration) * 100 : 0;

  // konversi ke menit
  const remainingMinutes = Math.floor(displayRemaining / 1000 / 60);

  // warna berubah jika <= 15 menit
  const barColor = remainingMinutes <= 10 ? "#ba1a1a" : "#00467f";

  const format = (ms) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed top-20 right-4 w-48 p-3 bg-white rounded-lg shadow-lg z-30 border">
      {/* HEADER */}
      <div className="flex justify-between mb-2 text-sm font-semibold text-black">
        <span>Sisa Waktu</span>
        <span>{format(displayRemaining)}</span>
      </div>

      {/* BACKGROUND BAR */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* FILL BAR (DINAMIS) */}
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}
