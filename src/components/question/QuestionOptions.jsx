import MathText from "../common/MathText"; // render teks + notasi matematika ($...$/$$...$$), sama seperti jalur paid

export default function QuestionOptions({
  question,
  answers,
  isFinished,
  onSelect,
}) {
  const getSelected = (key) => {
    if (isFinished) return false;
    return answers?.[question.nomor] === key;
  };

  return (
    <div className="space-y-3 font-times text-slate-800 leading-6">
      {Object.entries(question.pilihan).map(([key, val]) => {
        const selected = getSelected(key);
        const isObject = typeof val === "object";

        return (
          <label
            key={key}
            onClick={() => onSelect(key)}
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
            {/* RADIO */}
            <div
              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected ? "border-[#00467f]" : "border-slate-400"
              }`}
            >
              {selected && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#00467f]" />
              )}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <span className="font-semibold mr-2">{key.toUpperCase()}.</span>

              {!isObject && <MathText text={val} />}

              {isObject && (
                <div className="space-y-2">
                  {val.image && (
                    <img
                      src={val.image}
                      alt={key}
                      className="w-full max-w-[180px] rounded border"
                    />
                  )}
                  <div>
                    <MathText text={val.text} />
                  </div>
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
