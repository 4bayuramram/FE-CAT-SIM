import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../features/exam/examSlice";

export default function QuestionGrid({ onSelect }) {
  const dispatch = useDispatch();

  const session = useSelector((state) => state.exam.session);
  const currentIndex = useSelector((state) => state.exam.currentIndex);
  const answers = useSelector((state) => state.exam.answers);
  const flagged = useSelector((state) => state.exam.flagged);

  if (!session) return null;

  const questions = session.questions || [];

  const handleClick = (i) => {
    dispatch(setCurrentIndex(i));
    onSelect?.(); // balik ke ujian (mobile)
  };

  return (
    <div>
      {/* LEGEND (TETAP DIPERTAHANKAN) */}
      <div className="mb-4 space-y-2 border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
        <Legend color="#fcd400" label="Soal Aktif" />
        <Legend color="#00467f" label="Sudah Dijawab" />
        <Legend color="#ba1a1a" label="Ragu-ragu" />
        <Legend color="#e2e8f0" label="Belum Dijawab" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const isActive = currentIndex === i;
          const isAnswered = !!answers?.[q.nomor];
          const isFlagged = !!flagged?.[q.nomor];

          return (
            <button
              key={q.nomor}
              onClick={() => handleClick(i)}
              className={`
                w-10 h-10 rounded-lg text-xs font-semibold border
                transition-all duration-200

                ${
                  isActive
                    ? "bg-[#fcd400] text-black border-yellow-500 shadow-sm"
                    : isFlagged
                    ? "bg-[#ba1a1a] text-white border-red-700"
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
  );
}

/* =========================
   LEGEND COMPONENT (TETAP)
   ========================= */
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
