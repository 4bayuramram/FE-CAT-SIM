import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { timerEngine } from "../engine/timerEngine";
import { setRemainingTime } from "../features/exam/examSlice";

export default function useTimer() {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.exam.session);

  // Dipakai sebagai dependency effect: sengaja BUKAN seluruh objek
  // `session`, karena `session` berubah setiap detik (setRemainingTime
  // menulis ulang session.remainingTime -> objek baru). Kalau effect
  // depend ke seluruh `session`, interval-nya kebongkar-pasang tiap
  // detik dan menyebabkan hitungan mundur jadi tidak stabil.
  const sessionId = session?.sessionId;
  const startTime = session?.startTime;
  const duration = session?.duration;
  const status = session?.status;

  useEffect(() => {
    if (!session || status !== "running") return;

    // BUGFIX: sebelumnya remainingTime baru ke-update setelah tick
    // pertama setInterval (1 detik kemudian), jadi begitu ujian dimulai
    // UI sempat menampilkan "0:00" karena remainingTime masih null.
    // Sekarang dihitung & di-dispatch langsung begitu timer terpasang.
    dispatch(setRemainingTime(timerEngine.getRemainingTime(session)));

    const interval = setInterval(() => {
      const remaining = timerEngine.getRemainingTime(session);
      dispatch(setRemainingTime(remaining));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, startTime, duration, status]);
}
