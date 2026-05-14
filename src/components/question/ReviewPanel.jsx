import { useSelector } from "react-redux";

export default function ReviewPanel({ onSubmit }) {
  const session = useSelector((state) => state.exam.session);
  const answers = useSelector((state) => state.exam.answers);
  const flagged = useSelector((state) => state.exam.flagged);

  if (!session) return null;

  const unanswered = session.questions.filter((q) => !answers[q.nomor]).length;

  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold">Review Ujian</h2>

      <p>Belum dijawab: {unanswered}</p>
      <p>Flag: {Object.keys(flagged).length}</p>

      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Submit Ujian
      </button>
    </div>
  );
}
