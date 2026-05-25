
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default function ResultDialog({ open, result, onExit, onReview }) {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Hasil Ujian</DialogTitle>

      <DialogContent>
        {result ? (
          <div className="space-y-4 mt-2">
            <div className="p-4 border rounded-lg bg-slate-50">
              <p>Total Skor</p>
              <h2 className="text-2xl font-bold">{result.totalScore}</h2>
            </div>

            <Divider />

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p>TWK</p>
                <b>{result.twkScore}</b>
              </div>
              <div>
                <p>TIU</p>
                <b>{result.tiuScore}</b>
              </div>
              <div>
                <p>TKP</p>
                <b>{result.tkpScore}</b>
              </div>
            </div>

            <Divider />

            <div className="text-sm">
              <p>Benar: {result.correct}</p>
              <p>Salah: {result.wrong}</p>
              <p>Tidak dijawab: {result.unanswered}</p>
              <p>Total Soal: {result.total}</p>
            </div>
          </div>
        ) : (
          <p>Tidak ada hasil</p>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onExit}>
          Keluar & Hapus Sesi
        </Button>

        <Button variant="contained" onClick={onReview}>
          Bahas Soal
        </Button>
      </DialogActions>
    </Dialog>
  );
}
