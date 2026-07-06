import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { tickTimerDb } from "../../features/exam/examSliceDb";

/**
 * ExamGuardPaid — tidak render UI ujian, dua tanggung jawab saja:
 *
 * 1. Polling ringan (interval 1 detik): dispatch(tickTimerDb()) supaya
 *    examEngineDb.checkAutoSubmit() -> rulesEngineDb.shouldAutoSubmit()
 *    dicek berkala. Kalau waktu habis, auto-submit terpicu dari sini,
 *    bukan dari TimerPanelPaid (TimerPanelPaid hanya tampilan lokal).
 *
 * 2. Notifikasi ke shell (ExamLayoutPaid) begitu state.examDb.status
 *    berubah jadi 'submitted' (baik dari submit manual maupun
 *    auto-submit), lewat prop onSubmitted().
 *
 * PATCH (mode review inline): auto-navigate ke /hasil DIHAPUS dari sini
 * — sebelumnya begitu status jadi 'submitted', guard ini langsung
 * navigate() sehingga ExamPagePaid/QuestionCardPaid tidak sempat
 * menampilkan mode review (read-only + panel pembahasan) di halaman
 * ujian itu sendiri. Sekarang perilakunya: soal terakhir tetap tampil di
 * tempat (QuestionCardPaid otomatis masuk mode read-only karena
 * session.status !== 'running'), dan guard ini hanya memberi tahu shell
 * untuk memunculkan popup ResultDialogPaid (flash-confirmation) di atas
 * halaman itu. /hasil sekarang jadi tujuan navigasi SADAR (tombol/link),
 * bukan otomatis — baik untuk submit manual maupun auto-submit karena
 * waktu habis, keduanya diperlakukan sama (tidak ada percabangan
 * berdasarkan penyebab, hanya status akhir yang menentukan tampilan).
 *
 * Sengaja dipasang di ExamLayoutPaid (shell), BUKAN di dalam kondisi
 * mobileView tertentu — supaya polling tetap jalan walau user sedang
 * buka drawer "Navigasi"/"Bantuan" di mobile. Ini menjawab open item
 * "mobileView state lokal vs Redux" di dokumen arsitektur: karena
 * ExamGuardPaid tidak butuh tahu mobileView sama sekali, mobileView
 * boleh tetap jadi state lokal di ExamLayoutPaid tanpa masalah.
 *
 * Guard back-button di sini murni UX (mencegah user tidak sengaja
 * keluar saat status 'running') — bukan otoritas keamanan, otoritas
 * tetap di backend.
 *
 * @param {() => void} [onSubmitted] - dipanggil sekali begitu status
 *   transisi ke 'submitted' (dari 'ready'/'submitting'). Dipakai
 *   ExamLayoutPaid untuk membuka ResultDialogPaid.
 */
export default function ExamGuardPaid({ onSubmitted }) {
  const dispatch = useDispatch();

  const status = useSelector((state) => state.examDb.status);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const prevStatusRef = useRef(status);

  // 1. Interval tick — hanya jalan saat status 'ready' (sesi sedang berjalan).
  useEffect(() => {
    if (status !== "ready") return;

    const interval = setInterval(() => {
      dispatch(tickTimerDb());
    }, 1000);

    return () => clearInterval(interval);
  }, [status, dispatch]);

  // 2. Notifikasi shell begitu status transisi ke 'submitted' — TIDAK lagi
  // navigate() sendiri (lihat catatan header).
  useEffect(() => {
    if (prevStatusRef.current !== "submitted" && status === "submitted") {
      onSubmitted?.();
    }
    prevStatusRef.current = status;
  }, [status, onSubmitted]);

  // 3. Cegah back-button meninggalkan halaman selama sesi berjalan.
  useEffect(() => {
    if (status !== "ready") return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      setBlockDialogOpen(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [status]);

  return (
    <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
      <DialogTitle>Ujian Sedang Berlangsung</DialogTitle>
      <DialogContent>
        Silakan submit ujian terlebih dahulu sebelum keluar.
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setBlockDialogOpen(false)}>
          Mengerti
        </Button>
      </DialogActions>
    </Dialog>
  );
}
