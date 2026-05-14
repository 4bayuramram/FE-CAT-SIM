import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { timerEngine } from "../engine/timerEngine";
import { setRemainingTime } from "../features/exam/examSlice";

export default function useTimer() {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.exam.session);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const remaining = timerEngine.getRemainingTime(session);

      dispatch(setRemainingTime(remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);
}
