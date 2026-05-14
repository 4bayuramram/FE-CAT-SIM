import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { examEngine } from "../engine/examEngine";

import { setSession, syncSession } from "../features/exam/examSlice";

import QuestionCard from "../components/question/QuestionCard";
import ReviewPanel from "../components/question/ReviewPanel";

import useTimer from "../hooks/useTimer";

export default function ExamPage() {
  const dispatch = useDispatch();

  const session = useSelector((state) => state.exam.session);

  const { paketId } = useParams();

  const [mode, setMode] = useState("exam");

  useTimer();

  /**
   * RESTORE SESSION
   */
  useEffect(() => {
    const restored = examEngine.restoreSession();

    if (restored) {
      dispatch(syncSession(restored));
    }
  }, [dispatch]);

  /**
   * START EXAM
   */
  const startExam = () => {
    const created = examEngine.createSession(Number(paketId));
    const running = examEngine.startSession(created);

    dispatch(setSession(running));
  };

  /**
   * SUBMIT EXAM
   */
  const submitExam = () => {
    if (!session) return;

    const result = examEngine.submitSession(session);

    console.log("FINAL RESULT:", result);

    setMode("finished");
  };

  /**
   * EMPTY SESSION
   */
  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white shadow rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">Mulai Ujian</h1>

          <p className="text-slate-500 mb-6">
            Tekan tombol di bawah untuk memulai ujian.
          </p>

          <button
            onClick={startExam}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  /**
   * FINISHED
   */
  if (mode === "finished") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Ujian Selesai
          </h1>

          <p className="text-slate-600">Jawaban berhasil disubmit.</p>
        </div>
      </div>
    );
  }

  /**
   * MAIN EXAM
   */
  return (
    <div className="w-full space-y-4">
      <QuestionCard />

      {mode === "review" && <ReviewPanel onSubmit={submitExam} />}

      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-3 justify-end">
        {mode !== "review" ? (
          <button
            onClick={() => setMode("review")}
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Review Jawaban
          </button>
        ) : (
          <button
            onClick={() => setMode("exam")}
            className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Kembali
          </button>
        )}

        <button
          onClick={submitExam}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Submit Ujian
        </button>
      </div>
    </div>
  );
}
