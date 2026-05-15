import { renderMathText } from "./mathRenderer";

export default function QuestionSequence({ data }) {
  if (!Array.isArray(data)) return null;

  return (
    <div className="my-6 flex justify-center">
      <div className="flex items-center gap-2 flex-nowrap font-times text-lg">
        {data.map((item, index) => (
          <span key={index} className="inline">
            {renderMathText(item)}
          </span>
        ))}
      </div>
    </div>
  );
}
