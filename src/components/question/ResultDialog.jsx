import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default function ResultDialog({ open, result, onExit, onReview }) {
  const categoryScores = result?.categoryScores || {};
  const categoryMaxScores = result?.categoryMaxScores || {};
  const topicStats = result?.topicStats || {};

  const allCategories = Object.keys(categoryMaxScores || {});

  // =================================
  // MAP CATEGORY → SCORE (SOURCE OF TRUTH)
  // =================================
  const twkScore = categoryScores["TWK"] || 0;
  const tiuScore = categoryScores["TIU"] || 0;
  const tkpScore = categoryScores["TKP"] || 0;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Hasil Ujian</DialogTitle>

      <DialogContent>
        {result ? (
          <div className="space-y-4 mt-2">
            {/* TOTAL SCORE */}
            <div className="p-4 border rounded-lg bg-slate-50">
              <p>Total Skor</p>
              <h2 className="text-2xl font-bold">{result.totalScore ?? 0}</h2>
            </div>

            <Divider />

            {/* SCORE PER JENIS (FROM CATEGORY) */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {allCategories.map((cat) => (
                <div key={cat}>
                  <p>{cat.match(/\((.*?)\)/)?.[1]}</p>
                  <b>{categoryScores[cat] || 0}</b>
                </div>
              ))}
            </div>

            <Divider />

            {/* SUMMARY */}
            <div className="text-sm">
              <p>Benar: {result.correct ?? 0}</p>
              <p>Salah: {result.wrong ?? 0}</p>
              <p>Tidak dijawab: {result.unanswered ?? 0}</p>
              <p>Total Soal: {result.total ?? 0}</p>
            </div>

            {/* CATEGORY SCORE */}
            {allCategories.length > 0 && (
              <>
                <Divider />

                <div className="text-sm space-y-2">
                  {/* HEADER */}
                  <p className="font-semibold">Skor per Kategori</p>

                  {/* LIST CATEGORY */}
                  {allCategories.map((cat) => {
                    const score = categoryScores[cat] || 0;
                    const max = categoryMaxScores[cat] || 0;

                    return (
                      <div key={cat} className="flex justify-between">
                        <span>{cat}</span>
                        <span>
                          {score} / {max}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* TOPIC STATS */}
            {Object.keys(topicStats).length > 0 && (
              <>
                <Divider />

                <div className="text-sm space-y-2">
                  {/* HEADER */}
                  <p className="font-semibold">Analisis Topik</p>

                  {/* LIST TOPIC */}
                  {Object.keys(topicStats).map((topic) => {
                    const t = topicStats[topic];

                    return (
                      <div key={topic} className="border p-2 rounded">
                        <p> {t.kategori}</p>
                        <p className="font-medium">Topik: {topic}</p>
                        <p>Total soal: {t.total ?? 0}</p>
                        <p>Benar: {t.correct ?? 0}</p>
                        <p>Salah: {t.wrong ?? 0}</p>
                        <p>Tidak dijawab: {t.unanswered ?? 0}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
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
