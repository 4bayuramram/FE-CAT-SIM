import QuestionTable from "./QuestionTable";
import QuestionSequence from "./QuestionSequence";
import MathText from "../common/MathText"; // render teks + notasi matematika ($...$/$$...$$), sama seperti jalur paid

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
          <MathText text={question.soal} />
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

        <div
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          <i>
            <MathText text={question.textref} />
          </i>
          <br />
          <MathText text={question.soal} />
          <br />
          <br />
          <MathText text={question.ditanya} />
        </div>
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

        <div
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          <i>
            <MathText text={question.textref} />
          </i>
          <br />
          <MathText text={question.p1} />
          <br />
          <br />
          <MathText text={question.p2} />
          <br />
          <br />
          <MathText text={question.ditanya} />
        </div>
      </>
    );
  }

  // PERNYATAAN + PERTANYAAN
  // Type sederhana buat soal yang cukup 2 bagian: teks pernyataan/premis
  // (field `soal`) lalu diberi jarak (baris kosong), baru kalimat
  // pertanyaannya (field `pertanyaan`). Beda dari "bacaan": tidak perlu
  // `textref` (tidak ada teks acuan bacaan terpisah) dan tidak dicetak
  // miring — cocok buat soal silogisme/logika, bukan soal bacaan teks.
  if (question.type === "pernyataan") {
    return (
      <>
        {question.image && (
          <img
            src={question.image}
            alt="soal"
            className="mb-4 rounded-lg border max-w-full"
          />
        )}

        <div
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          <MathText text={question.soal} />
          <br />
          <br />
          <MathText text={question.pertanyaan} />
        </div>
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
            <MathText text={question.pertanyaan} />
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
            <MathText text={question.soal} />
          </p>
        )}

        <QuestionTable table={question.table} />

        {question.pertanyaan && (
          <p className="text-lg text-slate-800 font-times text-justify mt-4 mb-6">
            <MathText text={question.pertanyaan} />
          </p>
        )}
      </>
    );
  }

  return null;
}
