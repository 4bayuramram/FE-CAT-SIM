import { useDispatch, useSelector } from "react-redux";
import {
  selectSession,
  selectQuestions,
  selectCurrentIndex,
  selectFlagged,
  goToQuestionDb,
  toggleFlagDb,
  setCurrentIndexOptimistic,
  setFlagOptimistic,
} from "../../features/exam/examSliceDb";
import * as navigationEngineDb from "../../engine_2/navigationEngineDb";

/**
 * QuestionNavPaid
 *
 * CATATAN: versi hardcode (QuestionNav.jsx) manggil navigationEngine.prev()
 * / .next() dengan (session) sebagai argumen — fungsi itu TIDAK ADA di
 * navigationEngine.js (yang ada nextIndex/prevIndex dengan signature
 * {currentIndex, total}). Bug itu TIDAK diwarisi ke sini: dipakai
 * navigationEngineDb.nextIndex(currentIndex, totalSoal) /
 * previousIndex(currentIndex) yang memang ada dan sudah diverifikasi
 * dari file engine yang dikirim.
 *
 * Index hasil clamp lokal ini divalidasi lewat navigationEngineDb di sini,
 * lalu dipakai dua kali:
 *  1. setCurrentIndexOptimistic(target) — update tampilan INSTAN di client
 *     (fix "navigasi terasa berat": sebelumnya UI nunggu round-trip
 *     network /autosave-session dulu baru ganti soal).
 *  2. goToQuestionDb(target) — tetap dikirim di background untuk
 *     divalidasi ulang oleh navigationEngineDb.jumpIndex() di
 *     examEngineDb DAN ter-autosave ke backend (current_index), supaya
 *     resume-session tetap akurat. Backend tetap sumber kebenaran akhir.
 */
export default function QuestionNavPaid() {
  const dispatch = useDispatch();

  const session = useSelector(selectSession);
  const questions = useSelector(selectQuestions);
  const currentIndex = useSelector(selectCurrentIndex);
  const flagged = useSelector(selectFlagged);

  if (!questions?.length) return null;

  const isFinished = session?.status !== "running";
  const currentQuestion = questions[currentIndex];
  const isFlagged = !!flagged?.[currentQuestion?.nomor_soal];

  const prev = () => {
    const target = navigationEngineDb.previousIndex(currentIndex);
    dispatch(setCurrentIndexOptimistic(target)); // tampilan langsung ganti
    dispatch(goToQuestionDb(target)); // autosave current_index di background
  };

  const next = () => {
    const target = navigationEngineDb.nextIndex(currentIndex, questions.length);
    dispatch(setCurrentIndexOptimistic(target)); // tampilan langsung ganti
    dispatch(goToQuestionDb(target)); // autosave current_index di background
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    const nomorSoal = currentQuestion.nomor_soal;
    const nextValue = !isFlagged;
    // BARU (fix delay tombol ragu-ragu): tampilan langsung ganti,
    // autosave ke backend tetap jalan di background lewat toggleFlagDb.
    dispatch(setFlagOptimistic({ nomorSoal, value: nextValue }));
    dispatch(toggleFlagDb({ nomorSoal, value: nextValue }));
  };

  return (
    <div className="flex justify-between items-center gap-2 mt-6">
      <button
        onClick={prev}
        disabled={currentIndex === 0}
        className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base bg-slate-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-400 transition"
      >
        Sebelumnya
      </button>

      {!isFinished && (
        <button
          onClick={handleToggleFlag}
          className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base text-white rounded-lg transition bg-[#ba1a1a] hover:opacity-90"
        >
          {isFlagged ? "Batalkan Ragu" : "Ragu-ragu"}
        </button>
      )}

      <button
        onClick={next}
        disabled={currentIndex === questions.length - 1}
        className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base bg-[#00467f] text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
      >
        Selanjutnya
      </button>
    </div>
  );
}
