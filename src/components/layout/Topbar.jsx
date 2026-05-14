import { useSelector } from "react-redux";

export default function Topbar() {
  const remaining = useSelector((state) => state.exam.remainingTime);

  const format = (ms) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-between p-3 border-b">
      <div>CAT EXAM</div>
      <div className="font-bold">{format(remaining || 0)}</div>
    </div>
  );
}
