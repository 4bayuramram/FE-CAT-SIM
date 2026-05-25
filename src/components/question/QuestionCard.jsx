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

import QuestionTable from "./QuestionTable";
import QuestionSequence from "./QuestionSequence";
import ResultDialog from "./ResultDialog";

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
    if (!session) return;

    const result = examEngine.submitSession(session);

    dispatch(
      setSession({
        ...session,
        status: "finished",
      })
    );

    setResult(result);
    setOpenResultDialog(true);
  };

  const getSelected = (key) => {
    if (isFinished) return false;
    return answers?.[question.nomor] === key;
  };

  const renderQuestionContent = () => {
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

    if (question.type === "sequence") {
      return <QuestionSequence data={question.soal} />;
    }

    if (question.type === "table") {
      return <QuestionTable table={question.table} />;
    }

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

      {renderQuestionContent()}

      <div className="space-y-3 font-times">
        {Object.entries(question.pilihan).map(([key, val]) => {
          const selected = getSelected(key);

          return (
            <label
              key={key}
              onClick={() => handleAnswer(key)}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                isFinished
                  ? "cursor-default"
                  : "cursor-pointer hover:bg-slate-50 hover:border-slate-300"
              } ${
                selected
                  ? "bg-blue-50 border-[#00467f]"
                  : "bg-white border-slate-200"
              }`}
            >
              <div
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected ? "border-[#00467f]" : "border-slate-400"
                }`}
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

      <div className="flex justify-between mt-8 pt-4 border-t">
        <button onClick={prev} className="px-4 py-2 rounded-lg border">
          Sebelumnya
        </button>

        <button
          onClick={next}
          className="px-4 py-2 rounded-lg bg-[#00467f] text-white"
        >
          Selanjutnya
        </button>
      </div>

      {status === "finished" && (
        <div className="mt-4">
          <button
            onClick={() => setShowPembahasan(!showPembahasan)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            {showPembahasan ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          </button>

          {showPembahasan && pembahasan && (
            <div className="mt-4 p-5 rounded-xl border bg-green-50">
              <h3 className="font-bold text-green-800 mb-2">Pembahasan</h3>
              <p className="text-slate-700 whitespace-pre-line">{pembahasan}</p>
            </div>
          )}
        </div>
      )}

      {status !== "finished" && (
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Apakah Kamu yakin ingin menyelesaikan ujian?"
              );
              if (confirmed) submitExam();
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg"
          >
            Submit Ujian
          </button>
        </div>
      )}

      <ResultDialog
        open={openResultDialog}
        result={result}
        onExit={() => {
          dispatch(resetExam());
          setOpenResultDialog(false);
          navigate("/home/simulasi", { replace: true });
        }}
        onReview={() => {
          dispatch(
            setSession({
              ...session,
              status: "finished",
            })
          );
          setOpenResultDialog(false);
        }}
      />
    </div>
  );
}
