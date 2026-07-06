import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

/**
 * ResultDialogPaid
 *
 * PATCH (murni visual, sesuai arahan): komponen ini SENGAJA tidak fetch
 * apa pun dan tidak mengambil keputusan apa pun — cuma render angka yang
 * sudah ada di `result` (submitResult, hasil RESMI dari POST
 * /submit-session via selectSubmitResult). Tidak ada breakdown kategori
 * (dihapus — dulu ada prop `breakdown` opsional yang tidak pernah
 * dipakai; breakdown kategori masih ditunda sesuai §8 dokumen acuan).
 *
 * Trigger munculnya dialog ini murni "sesi baru saja selesai" (dipanggil
 * dari ExamLayoutPaid lewat callback ExamGuardPaid.onSubmitted) — bukan
 * hal lain. Ini popup ringkasan cepat DI ATAS halaman ujian (mode
 * review), BUKAN halaman/tab terpisah.
 *
 * Bisa ditutup (`onClose` — dismiss saja, sesi tetap ada) dan dibuka
 * lagi kapan saja lewat tombol "Lihat Ringkasan Hasil" di SidebarPaid.
 *
 * @param {boolean} open
 * @param {{status:string, score:number, correct:number, wrong:number, unanswered:number, duration:number}|null} result - submitResult resmi
 * @param {() => void} onExit - reset sesi + keluar ke beranda
 * @param {() => void} onReview - navigasi ke halaman /hasil (versi lebih lengkap)
 * @param {() => void} [onClose] - tutup popup saja, sesi tetap ada
 */
export default function ResultDialogPaid({ open, result, onExit, onReview, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Hasil Ujian</DialogTitle>

      <DialogContent>
        {result ? (
          <div className="space-y-4 mt-2">
            <div className="p-4 border rounded-lg bg-slate-50">
              <p>Total Skor</p>
              <h2 className="text-2xl font-bold">{result.score ?? 0}</h2>
            </div>

            <Divider />

            <div className="text-sm space-y-1">
              <p className="font-semibold">Benar: {result.correct ?? 0}</p>
              <p className="font-semibold">Salah: {result.wrong ?? 0}</p>
              <p>Tidak dijawab: {result.unanswered ?? 0}</p>
              <p>Durasi pengerjaan: {result.duration ?? 0} menit</p>
              <p className="text-slate-500">
                Status akhir: {result.status === "expired" ? "Waktu habis" : "Selesai"}
              </p>
            </div>
          </div>
        ) : (
          <p>Tidak ada hasil</p>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onExit}>
          Keluar
        </Button>
        <Button onClick={onClose}>Tutup</Button>
        <Button variant="contained" onClick={onReview}>
          Lihat Hasil Lengkap
        </Button>
      </DialogActions>
    </Dialog>
  );
}
