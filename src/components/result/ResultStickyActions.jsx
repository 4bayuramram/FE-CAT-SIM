/**
 * ResultStickyActions — sticky footer, 2-3 aksi:
 * - "Keluar & Hapus Sesi": destructive, dikonfirmasi dulu di parent
 *   sebelum reset (bukan tanggung jawab komponen presentational ini).
 * - "Bahas Soal": kembali ke mode review (ExamPagePaid + QuestionCardPaid)
 *   — TETAP satu-satunya tempat bahas soal per-nomor (keputusan
 *   sebelumnya), halaman ini murni statistik.
 * - "Unduh PDF" (BARU, opsional): hanya dirender kalau prop onDownloadPdf
 *   diberikan — pemanggilan lama tanpa prop ini tidak berubah tampilannya.
 *
 * @param {() => void} onExit
 * @param {() => void} onReview
 * @param {(() => void)=} onDownloadPdf
 */
export default function ResultStickyActions({
  onExit,
  onReview,
  onDownloadPdf,
}) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-[#051424]/80 backdrop-blur-xl border-t border-white/10 px-5 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="hidden md:block text-white/40 text-xs font-mono">
          hanya skor percobaan pertama yang digunakan untuk pemeringkatan 
        </p>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onExit}
            className="w-full md:w-auto px-8 py-3 rounded-xl border border-[#ffb4ab]/40 text-[#ffb4ab] font-bold hover:bg-[#ffb4ab]/10 transition-colors active:scale-95 duration-150"
          >
            Keluar &amp; Hapus Sesi
          </button>
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="w-full md:w-auto px-8 py-3 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10 transition-colors active:scale-95 duration-150"
            >
              Unduh PDF
            </button>
          )}
          <button
            onClick={onReview}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-white text-[#00467f] font-extrabold shadow-lg shadow-white/10 hover:shadow-white/20 transition-all active:scale-95 duration-150"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
