import { useDispatch, useSelector } from "react-redux";
import {
  selectQuestions,
  selectAnswers,
  selectFlagged,
  selectCurrentIndex,
  goToQuestionDb,
  setCurrentIndexOptimistic,
} from "../../features/exam/examSliceDb";

/**
 * QuestionGridPaid — belum ada padanan lama untuk sumber DB (versi lama
 * belum dikirim), jadi dibuat baru mengikuti kontrak examSliceDb.
 *
 * Klik nomor -> setCurrentIndexOptimistic(index) langsung (tampilan
 * instan, fix "navigasi terasa berat") -> lalu goToQuestionDb(index) di
 * background, tetap lewat navigationEngineDb.jumpIndex() untuk validasi
 * batas, dan tetap autosave current_index ke backend. Index yang dipakai
 * untuk highlight "aktif" adalah posisi ARRAY (0-based), bukan
 * nomor_soal — supaya konsisten dengan session.current_index dari
 * Kontrak API.
 *
 * onSelect (opsional): dipanggil setelah pilih soal, dipakai
 * ExamLayoutPaid di mobile untuk balik ke view "ujian" setelah user
 * pilih dari overlay navigasi — pola sama seperti QuestionGrid lama.
 */
export default function QuestionGridPaid({ onSelect }) {
  const dispatch = useDispatch();
  const questions = useSelector(selectQuestions);
  const answers = useSelector(selectAnswers);
  const flagged = useSelector(selectFlagged);
  const currentIndex = useSelector(selectCurrentIndex);

  if (!questions?.length) {
    return <div className="text-sm text-slate-400">Memuat soal...</div>;
  }

  const handleClick = (index) => {
    dispatch(setCurrentIndexOptimistic(index)); // tampilan langsung ganti
    dispatch(goToQuestionDb(index)); // autosave current_index di background
    onSelect?.();
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, index) => {
        const isAnswered = answers[q.nomor_soal] !== undefined;
        const isFlagged = !!flagged[q.nomor_soal];
        const isActive = index === currentIndex;

        let base =
          "relative w-9 h-9 rounded-md text-xs font-semibold flex items-center justify-center border transition-colors";

        let colorClass = "bg-white border-slate-300 text-slate-600";
        if (isAnswered) colorClass = "bg-[#12345b] border-[#12345b] text-white";
        if (isActive) colorClass += " ring-2 ring-offset-1 ring-blue-500";

        return (
          <button
            key={q.id ?? q.nomor_soal}
            onClick={() => handleClick(index)}
            className={`${base} ${colorClass}`}
            title={`Soal ${q.nomor_soal}`}
          >
            {q.nomor_soal}
            {isFlagged && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}
