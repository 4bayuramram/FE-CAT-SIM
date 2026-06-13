import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../features/exam/examSlice";
import ParticipantCard from "../layout/ParticipantCard";

export default function QuestionGrid({ onSelect }) {
  const dispatch = useDispatch();

  const session = useSelector((state) => state.exam.session);
  const currentIndex = useSelector((state) => state.exam.currentIndex);
  const answers = useSelector((state) => state.exam.answers);

  if (!session) return null;

  const questions = session.questions || [];
  const isFinished = session.status === "finished";

  const handleClick = (i) => {
    dispatch(setCurrentIndex(i));
    onSelect?.();
  };

  const getResultMark = (q) => {
    const userAnswer = answers?.[q.nomor];

    if (!userAnswer) return "";

    if (q.mode === "TKP") {
      const point = q.scoringMap?.[userAnswer];
      if (point === undefined || point === null) return "";
      return point > 0 ? `+${point}` : `${point}`;
    }

    if (userAnswer === q.jawabanBenar) return "✓";

    return "✕";
  };

  const getUserAnswerLabel = (q) => {
    const userAnswer = answers?.[q.nomor];
    return userAnswer ? userAnswer.toUpperCase() : "";
  };

  const grouped = questions.reduce((acc, q, i) => {
    if (!acc[q.kategori]) acc[q.kategori] = [];
    acc[q.kategori].push({ ...q, index: i });
    return acc;
  }, {});

  return (
    <div>
      <ParticipantCard />

      {/* LEGEND */}
      <div className="mb-4 space-y-2 border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
        {!isFinished ? (
          <>
            <Legend color="#fcd400" label="Soal Aktif" />
            <Legend color="#00467f" label="Sudah Dijawab" />
            <Legend color="#ba1a1a" label="Ditandai" />
            <Legend color="#e2e8f0" label="Belum Dijawab" />
          </>
        ) : (
          <>
            <Legend color="#16a34a" label="Benar ✓" />
            <Legend color="#dc2626" label="Salah ✕" />
            <Legend color="#2563eb" label="TKP Point" />
            <Legend color="#e2e8f0" label="Kosong" />
          </>
        )}
      </div>

      {/* TITLE */}
      {isFinished && (
        <div className="mb-3 text-sm font-bold text-slate-700">
          Jawaban Peserta
        </div>
      )}

      {/* GRID */}
      <div className="space-y-6">
        {isFinished ? (
          Object.entries(grouped).map(([kategori, list]) => (
            <div key={kategori}>
              <div className="mb-2 font-bold text-sm text-slate-700 border-l-4 border-[#00467f] pl-2">
                {kategori}
              </div>

              {/* row */}
              <div className="grid grid-cols-5 gap-2">
                {list.map((q) => {
                  const isActive = currentIndex === q.index;
                  const userAnswer = answers?.[q.nomor];
                  const mark = getResultMark(q);
                  const answerLabel = getUserAnswerLabel(q);

                  return (
                    <button
                      key={q.nomor}
                      onClick={() => handleClick(q.index)}
                      className={`
                        relative w-12 h-10 rounded-lg text-[11px] font-bold border
                        flex items-center justify-center
                        transition-all duration-200
                        px-1

                        ${
                          isActive
                            ? "bg-[#fcd400] text-black border-yellow-500"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      {/* NOMOR + JAWABAN */}
                      <div className="flex items-center gap-1">
                        <span>{q.nomor}.</span>
                        {userAnswer && (
                          <span className="text-slate-500 font-semibold">
                            {answerLabel}
                          </span>
                        )}
                      </div>

                      {/* TKP / MARK BADGE */}
                      {mark && (
                        <span
                          className={`
                          absolute top-0 right-0 translate-x-0 -translate-y-2
                          text-[13px] font-bold
                          ${
                            mark === "✓"
                              ? "text-green-600"
                              : mark === "✕"
                              ? "text-red-600"
                              : mark.includes("+")
                              ? "text-blue-600"
                              : "text-slate-400"
                          }
                        `}
                        >
                          {mark}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <>
            {/* ================= MOBILE ================= */}
            <div className="md:hidden w-full">
              <div className="grid grid-cols-5 gap-1">
                {questions.map((q, i) => {
                  const isActive = currentIndex === i;
                  const isAnswered = !!answers?.[q.nomor];

                  return (
                    <button
                      key={q.nomor}
                      onClick={() => handleClick(i)}
                      className={`
            w-full h-7
            rounded-md
            text-[12px]
            font-semibold
            border
            flex items-center justify-center
            transition-all duration-150

            ${
              isActive
                ? "bg-[#fcd400] text-black border-yellow-500"
                : isAnswered
                ? "bg-[#00467f] text-white border-blue-700"
                : "bg-slate-100 text-slate-700 border-slate-300"
            }
          `}
                    >
                      {q.nomor}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden md:block overflow-x-auto">
              <div className="grid grid-cols-5 gap-1 w-max">
                {questions.map((q, i) => {
                  const isActive = currentIndex === i;
                  const isAnswered = !!answers?.[q.nomor];

                  return (
                    <button
                      key={`${q.nomor}-${i}`}
                      onClick={() => handleClick(i)}
                      className={`
              w-11 h-10 rounded-lg text-[13px] font-bold border
              flex items-center justify-center
              transition-all duration-200 px-1

              ${
                isActive
                  ? "bg-[#fcd400] text-black border-yellow-500"
                  : isAnswered
                  ? "bg-[#00467f] text-white border-blue-700"
                  : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
              }
            `}
                    >
                      {q.nomor}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// LEGEND
function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className="w-4 h-4 rounded border border-slate-300"
        style={{ backgroundColor: color }}
      />
      <span className="text-slate-700">{label}</span>
    </div>
  );
}
