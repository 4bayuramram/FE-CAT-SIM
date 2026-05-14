import { useDispatch, useSelector } from "react-redux";
import { setAnswer } from "../../features/exam/examSlice";

export default function Page1() {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.exam.answers);

  return (
    <div>
      <h1>Page 1</h1>

      <button
        onClick={() => dispatch(setAnswer({ questionNumber: 1, answer: "a" }))}
      >
        Jawab Soal 1 = A
      </button>

      <pre>{JSON.stringify(answers, null, 2)}</pre>
    </div>
  );
}
