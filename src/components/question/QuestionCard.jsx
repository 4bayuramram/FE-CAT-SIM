import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setCurrentIndex } from "../../features/exam/examSlice";
import { navigationEngine } from "../../engine/navigationEngine";

export default function QuestionCard() {
  const dispatch = useDispatch();

  const session = useSelector((state) => state.exam.session);
  const currentIndex = useSelector((state) => state.exam.currentIndex);
  const answers = useSelector((state) => state.exam.answers);

  if (!session) return null;

  const question = session.questions?.[currentIndex];

  if (!question) {
    return (
      <div className="bg-white p-6 rounded-xl border">Soal tidak ditemukan</div>
    );
  }

  const handleAnswer = (choiceKey) => {
    dispatch(
      setAnswer({
        questionNumber: question.nomor,
        answer: choiceKey,
      })
    );
  };

  const next = () => {
    const nextIndex = navigationEngine.nextIndex({
      currentIndex,
      total: session.questions.length,
    });

    dispatch(setCurrentIndex(nextIndex));
  };

  const prev = () => {
    const prevIndex = navigationEngine.prevIndex({
      currentIndex,
    });

    dispatch(setCurrentIndex(prevIndex));
  };

  const isSelected = (key) => {
    return answers?.[question.nomor] === key;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm font-sans leading-relaxed">
      {/* QUESTION */}
      <p className="text-lg md:text-xl text-slate-800 mb-8">{question.soal}</p>

      {/* CHOICES */}
      <div className="space-y-3">
        {Object.entries(question.pilihan).map(([key, val]) => {
          const selected = isSelected(key);

          return (
            <label
              key={key}
              onClick={() => handleAnswer(key)}
              className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200

                ${
                  selected
                    ? "bg-blue-50 border-[#00467f]"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }
              `}
            >
              <div
                className={`
                  mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  transition-all
                  ${selected ? "border-[#00467f]" : "border-slate-400"}
                `}
              >
                {selected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00467f]" />
                )}
              </div>

              <div className="flex-1 text-[15px] text-slate-800 leading-6">
                <span className="font-semibold mr-2">{key.toUpperCase()}.</span>
                {val}
              </div>
            </label>
          );
        })}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between mt-8 pt-4 border-t">
        <button
          onClick={prev}
          className="px-4 py-2 rounded-lg border hover:bg-slate-100 transition"
        >
          Prev
        </button>

        <button
          onClick={next}
          className="px-4 py-2 rounded-lg bg-[#00467f] text-white hover:opacity-90 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
