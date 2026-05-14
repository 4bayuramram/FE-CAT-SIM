import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex, toggleFlag } from "../../features/exam/examSlice";
import { navigationEngine } from "../../engine/navigationEngine";

export default function QuestionNav() {
  const dispatch = useDispatch();

  const session = useSelector((state) => state.exam.session);
  const currentIndex = useSelector((state) => state.exam.currentIndex);
  const flagged = useSelector((state) => state.exam.flagged);

  if (!session) return null;

  const questions = session.questions || [];
  const currentQuestion = questions[currentIndex];

  const isFlagged = !!flagged?.[currentQuestion?.nomor];

  const prev = () => {
    const updated = navigationEngine.prev(session);
    dispatch({ type: "exam/syncSession", payload: updated });
  };

  const next = () => {
    const updated = navigationEngine.next(session);
    dispatch({ type: "exam/syncSession", payload: updated });
  };

  const toggleFlag = () => {
    dispatch(toggleFlag(currentQuestion.nomor));
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {/* PREVIOUS */}
      <button
        onClick={prev}
        disabled={currentIndex === 0}
        className="
          px-4 py-2 bg-slate-300 rounded-lg
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-slate-400 transition
        "
      >
        Sebelumnya
      </button>

      {/* FLAG / RAGU */}
      <button
        onClick={toggleFlag}
        className={`
          px-4 py-2 text-white rounded-lg transition

          ${
            isFlagged
              ? "bg-[#ba1a1a] hover:opacity-90"
              : "bg-[#ba1a1a] hover:opacity-90"
          }
        `}
      >
        {isFlagged ? "Batalkan Ragu" : "Ragu-ragu"}
      </button>

      {/* NEXT */}
      <button
        onClick={next}
        disabled={currentIndex === questions.length - 1}
        className="
          px-4 py-2 bg-[#00467f] text-white rounded-lg
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:opacity-90 transition
        "
      >
        Selanjutnya
      </button>
    </div>
  );
}
