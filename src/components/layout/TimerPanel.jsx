import { useSelector } from "react-redux";

export default function TimerPanel() {
  const remaining = useSelector((state) => state.exam.remainingTime);
  const session = useSelector((state) => state.exam.session);

  if (!session) return null;

  const duration = session.duration;

  // progress sisa waktu (100% = full, 0% = habis)
  const progress = (remaining / duration) * 100;

  // konversi ke menit
  const remainingMinutes = Math.floor(remaining / 1000 / 60);

  // warna berubah jika <= 15 menit
  const barColor = remainingMinutes <= 15 ? "#ba1a1a" : "#00467f";

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
        <span>{format(remaining || 0)}</span>
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
