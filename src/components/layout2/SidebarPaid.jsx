import QuestionGridPaid from "../layout2/QuestionGridPaid";
import ParticipantCard from "../layout/ParticipantCard"; // reused — presentational murni, tidak baca state.examDb

/**
 * SidebarPaid
 *
 * PATCH (tombol re-open ResultDialogPaid): sebelumnya tidak ada
 * ParticipantCard sama sekali di jalur paid (beda dari hardcode yang
 * menaruhnya di dalam QuestionGrid.jsx). Ditambahkan di sini, di level
 * SidebarPaid, karena posisinya memang "panel peserta" — sesuai
 * permintaan tombol muncul "di bagian bawah profil user". ParticipantCard
 * murni presentational (baca auth user, bukan state ujian), jadi aman
 * dipakai ulang langsung tanpa modifikasi.
 *
 * Tombol "Lihat Ringkasan Hasil" hanya muncul kalau `canShowResultDialog`
 * true (submitResult sudah ada di store — artinya sesi ini sudah pernah
 * disubmit), supaya tidak menyesatkan saat ujian masih berjalan.
 *
 * @param {boolean} canShowResultDialog
 * @param {() => void} onOpenResultDialog
 */
export default function SidebarPaid({ canShowResultDialog, onOpenResultDialog }) {
  return (
    <aside
      className="hidden lg:block fixed left-0 top-16 w-72 h-[calc(100vh-4rem)]
        bg-white
        border-r
        overflow-y-auto
      "
    >
      <div className="p-4 border-b">
        <p className="text-sm text-slate-500">
          Panel Informasi Peserta dan Navigasi Soal
        </p>
      </div>

      <div className="p-4 border-b">
        <ParticipantCard />

        {canShowResultDialog && (
          <button
            onClick={onOpenResultDialog}
            className="mt-3 w-full text-sm px-3 py-2 rounded-lg border border-[#00467f] text-[#00467f] font-semibold hover:bg-blue-50"
          >
            Lihat Ringkasan Hasil
          </button>
        )}
      </div>

      <div className="p-4">
        <QuestionGridPaid />
      </div>
    </aside>
  );
}
