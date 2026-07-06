import { useDispatch, useSelector } from "react-redux";
import {
  selectSession,
  selectQuestions,
  selectAnswers,
  selectFlagged,
  selectCurrentIndex,
  selectPembahasan,
  goToQuestionDb,
  setCurrentIndexOptimistic,
} from "../../features/exam/examSliceDb";

/**
 * QuestionGridPaid
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
 *
 * PATCH (mode review): begitu session.status !== 'running', grid ganti
 * mode — legend berubah dari (Aktif/Dijawab/Ditandai/Kosong) jadi
 * (Benar/Salah/TKP/Kosong), dan tiap kotak nomor dapat badge kecil
 * (✓/✕/poin) berdasarkan pembahasan yang sudah dimuat. Selama pembahasan
 * belum selesai dimuat (fetch async di QuestionCardPaid), grid tetap
 * tampil dengan warna "terjawab" biasa dulu tanpa badge — tidak nge-blank.
 */
export default function QuestionGridPaid({ onSelect }) {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const questions = useSelector(selectQuestions);
  const answers = useSelector(selectAnswers);
  const flagged = useSelector(selectFlagged);
  const currentIndex = useSelector(selectCurrentIndex);
  const pembahasan = useSelector(selectPembahasan);

  if (!questions?.length) {
    return <div className="text-sm text-slate-400">Memuat soal...</div>;
  }

  const isFinished = session?.status !== "running";

  const handleClick = (index) => {
    dispatch(setCurrentIndexOptimistic(index)); // tampilan langsung ganti
    dispatch(goToQuestionDb(index)); // autosave current_index di background
    onSelect?.();
  };

  const getDetail = (nomorSoal) =>
    pembahasan?.pembahasan?.find((item) => item.nomor_soal === nomorSoal);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3 text-[11px] text-slate-500">
        {isFinished ? (
          <>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[#43A047] inline-block" />{" "}
              Benar
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[#7C0A02] inline-block" />{" "}
              Salah
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[#12345b] inline-block" />{" "}
              TKP
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-white border inline-block" />{" "}
              Kosong
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[#12345b] inline-block" />{" "}
              Dijawab
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />{" "}
              Ditandai
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-white border inline-block" />{" "}
              Kosong
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, index) => {
          const userAnswer = answers[q.nomor_soal];
          const isAnswered = userAnswer !== undefined;
          const isFlagged = !!flagged[q.nomor_soal];
          const isActive = index === currentIndex;
          const detail = isFinished ? getDetail(q.nomor_soal) : null;

          let base =
            "relative w-9 h-9 rounded-md text-xs font-semibold flex items-center justify-center border transition-colors";
          let colorClass = "bg-white border-slate-300 text-slate-600";
          let badge = null;

          if (!isFinished) {
            if (isAnswered)
              colorClass = "bg-[#12345b] border-[#12345b] text-white";
          } else if (detail) {
            const isTkp = !!detail.scoring_map;
            if (isTkp) {
              colorClass = isAnswered
                ? "bg-[#12345b] border-[#12345b] text-white"
                : "bg-white border-slate-300 text-slate-600";
              if (isAnswered) badge = "•";
            } else if (!isAnswered) {
              colorClass = "bg-white border-slate-300 text-slate-600";
            } else if (userAnswer === detail.jawaban_benar) {
              colorClass = "bg-[#43A047] border-[#43A047] text-white";
              badge = "✓";
            } else {
              colorClass = "bg-[#7C0A02] border-[##7C0A02] text-white";
              badge = "✕";
            }
          } else if (isAnswered) {
            // pembahasan belum selesai dimuat — tampilkan status "terjawab" dulu
            colorClass = "bg-[#12345b] border-[#12345b] text-white";
          }

          if (isActive) colorClass += " ring-2 ring-offset-1 ring-blue-500";

          return (
            <button
              key={q.id ?? q.nomor_soal}
              onClick={() => handleClick(index)}
              className={`${base} ${colorClass}`}
              title={`Soal ${q.nomor_soal}`}
            >
              {q.nomor_soal}
              {!isFinished && isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
              )}
              {isFinished && badge && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white border text-[9px] flex items-center justify-center text-slate-700">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
