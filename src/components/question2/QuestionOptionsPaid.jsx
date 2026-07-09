/**
 * QuestionOptionsPaid
 *
 * Beda dari QuestionOptions hardcode: key jawaban di `answers` pakai
 * `question.nomor_soal` (kontrak API), bukan `question.nomor`.
 *
 * `question.pilihan` datang apa adanya dari kolom `pilihan` di endpoint
 * get-questions/resume-session (tidak lewat contentParserDb — parser
 * hanya menyentuh kolom `content`), jadi bentuknya sama dengan hardcode:
 * objek { a: ..., b: ..., ... } — nilai bisa string atau { image, text }.
 *
 * Tidak ada jawabanBenar di sini sama sekali (sesuai desain Level 3:
 * kunci jawaban tidak pernah dikirim ke client selama sesi berjalan).
 *
 * PATCH (opsi jawaban benar-benar pure saat review — hilangkan bekas
 * pilihan user): sebelumnya walau highlight benar/salah sudah dihapus,
 * opsi yang tadinya dipilih user MASIH tampil "selected" (radio terisi +
 * border/bg biru) meski isFinished. Itu tetap bocor sedikit info. Sekarang
 * status "selected" HANYA dipakai untuk styling saat sesi masih berjalan
 * (!isFinished) — begitu selesai, semua opsi dirender polos/netral tanpa
 * radio terisi maupun border/bg pembeda, walau data userAnswer tetap
 * dihitung (dibutuhkan QuestionCardPaid untuk teks "Jawaban kamu" di
 * panel Pembahasan). Klik juga sudah nonaktif lewat isFinished sejak awal.
 */
export default function QuestionOptionsPaid({
  question,
  answers,
  isFinished,
  onSelect,
}) {
  const userAnswer = answers?.[question.nomor_soal];
  const getSelected = (key) => userAnswer === key;

  if (!question?.pilihan) return null;

  return (
    <div className="space-y-3 font-times text-slate-800 leading-6">
      {Object.entries(question.pilihan).map(([key, val]) => {
        // Selected styling cuma berlaku selagi ujian masih berjalan.
        // Saat isFinished, opsi selalu netral — bekas pilihan user tidak
        // ditampilkan di sini sama sekali, murni lewat panel Pembahasan.
        const selected = !isFinished && getSelected(key);
        const isObject = typeof val === "object" && val !== null;

        return (
          <label
            key={key}
            onClick={() => !isFinished && onSelect(key)}
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
            <div
              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected ? "border-[#00467f]" : "border-slate-400"
              }`}
            >
              {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#00467f]" />}
            </div>

            <div className="flex-1">
              <span className="font-semibold mr-2">{key.toUpperCase()}.</span>

              {!isObject && <span>{val}</span>}

              {isObject && (
                <div className="space-y-2">
                  {val.image && (
                    <img src={val.image} alt={key} className="w-full max-w-[180px] rounded border" />
                  )}
                  <div>{val.text}</div>
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
