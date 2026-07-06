import QuestionTable from "../question/QuestionTable";
import QuestionSequence from "../question/QuestionSequence";

/**
 * QuestionRendererPaid
 *
 * Beda dari QuestionRenderer hardcode:
 * - Switch berdasarkan `question.parsed.variant` (hasil contentParserDb),
 *   bukan `question.type` mentah — parser sudah menormalisasi & validasi
 *   field wajib sebelum sampai sini.
 * - Gambar dari `question.image_url` (kontrak get-questions), bukan
 *   `question.image`.
 * - Variant 'unsupported' ditangani eksplisit (bukan return null diam-diam)
 *   supaya soal dengan type yang belum didukung parser tetap kelihatan
 *   ada masalah di UI, bukan hilang tanpa jejak — konsisten dengan prinsip
 *   fail-loud di contentParserDb.
 *
 * QuestionTable & QuestionSequence di-reuse langsung dari folder soal
 * hardcode — keduanya presentational murni (terima props, tidak baca
 * Redux), jadi aman dipakai di kedua jalur tanpa melanggar independensi.
 */
export default function QuestionRendererPaid({ question }) {
  if (!question?.parsed) return null;

  const { parsed } = question;
  const imageUrl = question.image_url;

  if (parsed.variant === "unsupported") {
    return (
      <div className="mb-6 p-4 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-sm">
        Soal ini belum bisa ditampilkan ({parsed.reason}). Hubungi admin.
      </div>
    );
  }

  if (parsed.variant === "standar") {
    return (
      <>
        {imageUrl && (
          <img src={imageUrl} alt="soal" className="mb-4 rounded-lg border max-w-full" />
        )}
        <p
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          {parsed.soal}
        </p>
      </>
    );
  }

  if (parsed.variant === "bacaan") {
    return (
      <>
        {imageUrl && (
          <img src={imageUrl} alt="soal" className="mb-4 rounded-lg border max-w-full" />
        )}
        <p
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          <i>{parsed.textref}</i>
          <br />
          {parsed.soal}
          <br />
          <br />
          {parsed.ditanya}
        </p>
      </>
    );
  }

  if (parsed.variant === "bacaan2") {
    return (
      <>
        {imageUrl && (
          <img src={imageUrl} alt="soal" className="mb-4 rounded-lg border max-w-full" />
        )}
        <p
          className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
          style={{ lineHeight: "1.8" }}
        >
          <i>{parsed.textref}</i>
          <br />
          {parsed.p1}
          <br />
          <br />
          {parsed.p2}
          <br />
          <br />
          {parsed.ditanya}
        </p>
      </>
    );
  }

  if (parsed.variant === "sequence") {
    return (
      <>
        {imageUrl && (
          <img src={imageUrl} alt="soal" className="mb-4 rounded-lg border max-w-full" />
        )}
        <QuestionSequence data={parsed.soal} />
        {parsed.pertanyaan && (
          <p className="text-lg text-slate-800 font-times text-justify mt-4 mb-6">
            {parsed.pertanyaan}
          </p>
        )}
      </>
    );
  }

  if (parsed.variant === "table") {
    return (
      <>
        {imageUrl && (
          <div className="flex justify-center my-4">
            <img
              src={imageUrl}
              alt="soal"
              className="max-w-[500px] w-full h-auto rounded-lg border"
            />
          </div>
        )}
        {parsed.soal && (
          <p
            className="text-lg md:text-xl text-slate-800 font-times text-justify mb-6"
            style={{ lineHeight: "1.8" }}
          >
            {parsed.soal}
          </p>
        )}
        <QuestionTable table={parsed.table} />
        {parsed.pertanyaan && (
          <p className="text-lg text-slate-800 font-times text-justify mt-4 mb-6">
            {parsed.pertanyaan}
          </p>
        )}
      </>
    );
  }

  return null;
}
