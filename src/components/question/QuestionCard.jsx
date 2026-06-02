import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import {
  setAnswer,
  setCurrentIndex,
  setSession,
  resetExam,
} from "../../features/exam/examSlice";

import { navigationEngine } from "../../engine/navigationEngine";
import { examEngine } from "../../engine/examEngine";

import QuestionRenderer from "./QuestionRenderer";
import QuestionOptions from "./QuestionOptions";
import ResultDialog from "./ResultDialog";
import ConfirmSubmitModal from "./ConfirmSubmitModal"; 

export default function QuestionCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const session = useSelector((state) => state.exam.session);
  const currentIndex = useSelector((state) => state.exam.currentIndex);
  const answers = useSelector((state) => state.exam.answers);

  const status = session?.status;
  const isFinished = status === "finished";

  const [showPembahasan, setShowPembahasan] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [result, setResult] = useState(null);

  // NEW STATE (CONFIRM SUBMIT)
  const [openConfirmSubmit, setOpenConfirmSubmit] = useState(false);

  if (!session) return null;

  const question = session.questions?.[currentIndex];
  const pembahasan = question?.pembahasan;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  if (!question) {
    return (
      <div className="bg-white p-6 rounded-xl border">Soal tidak ditemukan</div>
    );
  }

  const handleAnswer = (choiceKey) => {
    if (isFinished) return;

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
    const prevIndex = navigationEngine.prevIndex({ currentIndex });
    dispatch(setCurrentIndex(prevIndex));
  };

  const submitExam = () => {
    const result = examEngine.submitSession(session);

    dispatch(setSession({ ...session, status: "finished" }));

    setResult(result);
    setOpenResultDialog(true);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <div className="text-[18px] font-bold">
          Soal {question.nomor} dari {session.questions.length}
        </div>

        <div className="text-lg font-bold text-[#00467f]">
          {question.kategori}
        </div>

        <div className="text-sm text-slate-600 mt-1 capitalize">
          Topik: {question.topic || "-"}
        </div>
      </div>

      {/* FONT WRAPPER (SOAL + OPSI SINKRON) */}
      <div className="text-[18px] md:text-[19px] font-times leading-7 text-slate-800">
        {/* SOAL */}
        <QuestionRenderer question={question} />

        {/* PILIHAN */}
        <QuestionOptions
          question={question}
          answers={answers}
          isFinished={isFinished}
          onSelect={handleAnswer}
        />
      </div>
      {/* NAV */}
      <div className="flex justify-between mt-8 pt-4 border-t">
        <button onClick={prev} className="px-4 py-2 border rounded-lg">
          Sebelumnya
        </button>

        <button
          onClick={next}
          className="px-4 py-2 bg-[#00467f] text-white rounded-lg"
        >
          Selanjutnya
        </button>
      </div>

      {/* SUBMIT */}
      {!isFinished && (
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => setOpenConfirmSubmit(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg"
          >
            Submit Ujian
          </button>
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmSubmitModal
        open={openConfirmSubmit}
        onCancel={() => setOpenConfirmSubmit(false)}
        onConfirm={() => {
          setOpenConfirmSubmit(false);
          submitExam();
        }}
      />

      {/* PEMBAHASAN */}
      {isFinished && (
        <div className="mt-4">
          <button
            onClick={() => setShowPembahasan(!showPembahasan)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {showPembahasan ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          </button>

          {showPembahasan && pembahasan && (
            <div className="mt-4 p-5 border bg-green-50 rounded-xl">
              <p className="whitespace-pre-line">{pembahasan}</p>
            </div>
          )}
        </div>
      )}

      {/* RESULT */}
      <ResultDialog
        open={openResultDialog}
        result={result}
        onExit={() => {
          dispatch(resetExam());
          setOpenResultDialog(false);
          navigate("/home/simulasi", { replace: true });
        }}
        onReview={() => {
          dispatch(setSession({ ...session, status: "finished" }));
          setOpenResultDialog(false);
        }}
      />
    </div>
  );
}
