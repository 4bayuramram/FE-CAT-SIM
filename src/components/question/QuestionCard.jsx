import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setCurrentIndex } from "../../features/exam/examSlice";
import { navigationEngine } from "../../engine/navigationEngine";
import QuestionTable from "./QuestionTable";
import QuestionSequence from "./QuestionSequence";

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

  const isSelected = (key) => answers?.[question.nomor] === key;

  const renderQuestionContent = () => {
    // Soal teks biasa
    if (!question.type) {
      return (
        <p
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          {question.soal}
        </p>
      );
    }

    // Soal deret / sequence
    if (question.type === "sequence") {
      return <QuestionSequence data={question.soal} />;
    }

    // Soal tabel
    if (question.type === "table") {
      return <QuestionTable table={question.table} />;
    }

    // Soal tambahan pertanyaan jika ada
    if (question.pertanyaan) {
      return (
        <p className="text-lg text-slate-800 font-times text-justify mt-4 mb-6">
          {question.pertanyaan}
        </p>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <div className="text-[18px] text-black font-bold mb-2">
          Soal {question.nomor} dari {session.questions.length}
        </div>

        <div className="text-lg font-bold text-[#00467f]">
          {question.kategori}
        </div>

        <div className="text-sm text-slate-600 mt-1 capitalize">
          Topic: {question.topic || "-"}
        </div>
      </div>

      {/* CONTENT */}
      {renderQuestionContent()}

      {/* CHOICES */}
      <div className="space-y-3 font-times">
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
