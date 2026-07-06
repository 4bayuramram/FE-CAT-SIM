import { useSelector } from "react-redux";
import {
  selectQuestions,
  selectAnswers,
  selectFlagged,
} from "../../features/exam/examSliceDb";

/**
 * ReviewPanelPaid
 *
 * Beda dari ReviewPanel hardcode: `questions` diambil dari selector
 * terpisah (state.examDb.questions), BUKAN session.questions — di
 * arsitektur DB, questions dan session memang dua hal terpisah
 * (session cuma nyimpan answers/flagged/current_index, soal datang
 * dari get-questions). Key jawaban pakai `nomor_soal`.
 */
export default function ReviewPanelPaid({ onSubmit }) {
  const questions = useSelector(selectQuestions);
  const answers = useSelector(selectAnswers);
  const flagged = useSelector(selectFlagged);

  if (!questions?.length) return null;

  const unanswered = questions.filter(
    (q) => answers[q.nomor_soal] === undefined
  ).length;

  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold">Review Ujian</h2>

      <p>Belum dijawab: {unanswered}</p>
      <p>Ditandai ragu: {Object.values(flagged).filter(Boolean).length}</p>

      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Submit Ujian
      </button>
    </div>
  );
}
