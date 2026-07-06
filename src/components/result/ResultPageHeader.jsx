/**
 * ResultPageHeader — judul halaman + identitas peserta + logo brand.
 * Beda dari ResultTopbar (nav fixed di paling atas) — ini bagian dari
 * alur konten (<main>), ikut men-scroll.
 *
 * PATCH: tombol "Unduh PDF" di header ini dibuang (fitur unduh PDF sudah
 * ada & berfungsi di ResultStickyActions/footer — dua tombol untuk aksi
 * yang sama cuma bikin bingung, salah satunya juga sempat tidak
 * ke-wire propnya). Diganti logo brand, diambil dari /public (Vite/CRA
 * serve file di public/ langsung dari root "/", jadi tidak perlu
 * import — cukup path string "/cpnz.png").
 *
 * @param {string} candidateName
 * @param {string} examDate
 */
export default function ResultPageHeader({ candidateName, examDate }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="text-[32px] md:text-5xl font-extrabold tracking-tight text-white">
          HASIL TRY-OUT
        </h2>
        <p className="text-[#fcd401] mt-1">
          {candidateName} · {examDate}
        </p>
      </div>

      <div className="flex items-center">
        <img
          src="/cpnz.png"
          alt="CPNZ"
          className="h-12 md:h-24 w-auto object-contain"
        />
      </div>
    </div>
  );
}
