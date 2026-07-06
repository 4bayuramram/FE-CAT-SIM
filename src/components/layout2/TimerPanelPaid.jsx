import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRemainingSeconds } from "../../engine_2/timerEngineDb";

/**
 * TimerPanelPaid — TAMPILAN SAJA. Tidak dispatch apa pun.
 *
 * Beda dari TimerPanel lama yang baca state.exam.remainingTime dari Redux:
 * di sini remainingSeconds tidak di-update Redux tiap detik (lihat
 * examSliceDb — tickTimerDb.fulfilled hanya mengubah state kalau
 * auto-submit betulan terpicu, bukan tiap tick). Jadi panel ini hitung
 * ulang sendiri secara lokal tiap detik dari session.started_at +
 * session.duration (menit), sesuai dokumen arsitektur bagian 2 (baris
 * "TimerPanel baca session.started_at + session.duration dari Redux,
 * hitung lokal").
 *
 * session.duration dalam MENIT (Kontrak API) — dikonversi ke detik untuk
 * perhitungan progress bar.
 */
export default function TimerPanelPaid() {
  const session = useSelector((state) => state.examDb.session);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!session?.started_at || session?.duration == null) return;

    // Hitung langsung sekali saat session berubah, lalu tiap detik.
    setRemainingSeconds(getRemainingSeconds(session));

    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(session));
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.started_at, session?.duration]);

  if (!session || session.status !== "running") return null;

  const totalSeconds = session.duration * 60;
  const progress =
    totalSeconds > 0
      ? Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100))
      : 0;

  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const barColor = remainingMinutes <= 10 ? "#ba1a1a" : "#00467f";

  const format = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed top-20 right-4 w-48 p-3 bg-white rounded-lg shadow-lg z-30 border">
      <div className="flex justify-between mb-2 text-sm font-semibold text-black">
        <span>Sisa Waktu</span>
        <span>{format(remainingSeconds)}</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
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
