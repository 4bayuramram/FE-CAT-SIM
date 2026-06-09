import QuestionTable from "./QuestionTable";
import QuestionSequence from "./QuestionSequence";

export default function QuestionRenderer({ question }) {
  if (!question) return null;

  // SOAL TANPA TYPE
  if (!question.type) {
    return (
      <>
        {question.image && (
          <img
            src={question.image}
            alt="soal"
            className="mb-4 rounded-lg border max-w-full"
          />
        )}

        <p
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          {question.soal}
        </p>
      </>
    );
  }

  //bahasa indonesia - bacaan 1
  if (question.type === "bacaan") {
    return (
      <>
        {question.image && (
          <img
            src={question.image}
            alt="soal"
            className="mb-4 rounded-lg border max-w-full"
          />
        )}

        <p
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          <i>{question.textref}</i>
          <br />
          {question.soal}
          <br />
          <br />
          {question.ditanya}
        </p>
      </>
    );
  }

  //bahasa indonesia - bacaan 2
  if (question.type === "bacaan2") {
    return (
      <>
        {question.image && (
          <img
            src={question.image}
            alt="soal"
            className="mb-4 rounded-lg border max-w-full"
          />
        )}

        <p
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          <i>{question.textref}</i>
          <br />
          {question.p1}
          <br />
          <br />
          {question.p2}
          <br />
          <br />
          {question.ditanya}
        </p>
      </>
    );
  }

  // SEQUENCE
  if (question.type === "sequence") {
    return (
      <>
        {question.image && (
          <img
            src={question.image}
            alt="soal"
            className="mb-4 rounded-lg border max-w-full"
          />
        )}

        <QuestionSequence data={question.soal} />

        {question.pertanyaan && (
          <p className="text-lg text-slate-800 font-times text-justify mt-4 mb-6">
            {question.pertanyaan}
          </p>
        )}
      </>
    );
  }

  // TABLE
  if (question.type === "table") {
    return (
      <>
        {question.image && (
          <div className="flex justify-center my-4">
            <img
              src={question.image}
              alt="soal"
              className="max-w-[500px] w-full h-auto rounded-lg border"
            />
          </div>
        )}

        {question.soal && (
          <p
            className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
            style={{ lineHeight: "1.8" }}
          >
            {question.soal}
          </p>
        )}

        <QuestionTable table={question.table} />

        {question.pertanyaan && (
          <p className="text-lg text-slate-800 font-times text-justify mt-4 mb-6">
            {question.pertanyaan}
          </p>
        )}
      </>
    );
  }

  return null;
}
