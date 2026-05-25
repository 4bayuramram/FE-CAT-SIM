import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { examEngine } from "../engine/examEngine";
import { setSession, syncSession } from "../features/exam/examSlice";

import QuestionCard from "../components/question/QuestionCard";
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
   * MAIN EXAM
   */
  return (
    <div className="w-full space-y-4">
      <QuestionCard />
    </div>
  );
}
