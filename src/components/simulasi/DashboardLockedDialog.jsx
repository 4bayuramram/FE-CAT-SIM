import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

/**
 * DashboardLockedDialog — muncul di halaman Try Out ("/home/simulasi")
 * KHUSUS kalau user baru saja di-redirect ke sini oleh
 * DashboardPageContainer.jsx karena belum punya paket sama sekali (lihat
 * catatan "LOCK UNTUK USER TANPA PAKET" di sana).
 *
 * Sebelumnya redirect ini "diam" -- user mendarat di halaman Try Out
 * tanpa konteks kenapa dia nggak bisa buka dashboard. Dialog ini kasih
 * penjelasan singkat + 1 tombol aksi ("Ya, paham") buat dismiss.
 *
 * Trigger murni dari `location.state.reason ===
 * "dashboard-locked-no-package"` yang dikirim lewat `navigate(..., {
 * state })` di DashboardPageContainer -- lihat pemakaian di
 * pages/simulasi/Simulasi.jsx (baca state sekali lalu di-clear via
 * `navigate(pathname, { replace: true })`, supaya dialog tidak muncul
 * lagi kalau user reload / kembali ke halaman ini nanti).
 *
 * @param {boolean} open
 * @param {() => void} onClose - dipanggil saat tombol "Ya, paham" diklik
 */
export default function DashboardLockedDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="flex items-center gap-2">
        <LockRoundedIcon color="action" fontSize="small" />
        Dashboard Belum Bisa Dibuka
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Kamu belum memiliki paket try out apa pun, jadi Dashboard belum
          bisa dibuka. Pilih dan beli paket pertamamu dulu di bawah ini --
          Dashboard akan otomatis bisa diakses setelah kamu punya minimal
          satu paket.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose} autoFocus>
          Ya, Paham
        </Button>
      </DialogActions>
    </Dialog>
  );
}
