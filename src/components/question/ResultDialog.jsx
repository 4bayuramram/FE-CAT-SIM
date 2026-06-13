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

  const tkpStats = result?.tkpStats || {};

  const allCategories = Object.keys(categoryMaxScores);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Hasil Ujian</DialogTitle>

      <DialogContent>
        {result ? (
          <div className="space-y-4 mt-2 ">
            {/* TOTAL */}
            <div className="p-4 border rounded-lg bg-slate-50">
              <p>Total Skor</p>

              <h2 className="text-2xl font-bold">{result.totalScore ?? 0}</h2>
            </div>

            <Divider />

            {/* SCORE PER KATEGORI */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {allCategories.map((cat) => (
                <div key={cat}>
                  <p>{cat.match(/\((.*?)\)/)?.[1] || cat}</p>

                  <b>{categoryScores[cat] || 0}</b>
                </div>
              ))}
            </div>

            <Divider />

            {/* SUMMARY */}
            <div className="text-sm space-y-1">
              <p className="font-semibold">
                Benar (TWK dan TIU) :{" "}
                {(result.twkCorrect || 0) + (result.tiuCorrect || 0)}
              </p>
              <p className="font-semibold">
                Salah (TWK dan TIU) :{" "}
                {(result.twkWrong || 0) + (result.tiuWrong || 0)}
              </p>

              <Divider className="my-2" />

              <p>Perolehan skor TKP </p>
              <p className="font-semibold">Skor +5 : {tkpStats.score5 || 0}</p>
              <p className="font-semibold">Skor +4 : {tkpStats.score4 || 0}</p>
              <p className="font-semibold">Skor +3 : {tkpStats.score3 || 0}</p>
              <p className="font-semibold">Skor +2 : {tkpStats.score2 || 0}</p>
              <p className="font-semibold">Skor +1 : {tkpStats.score1 || 0}</p>

              <Divider className="my-2" />

              <p>Total Soal: {result.total || 0}</p>
              <p>Tidak dijawab: {result.unanswered || 0}</p>
            </div>

            {/* CATEGORY SCORE */}
            {allCategories.length > 0 && (
              <>
                <Divider />

                <div className="text-sm space-y-2">
                  <p className="font-semibold">Skor per Kategori</p>

                  {allCategories.map((cat) => (
                    <div key={cat} className="flex justify-between">
                      <span>{cat}</span>

                      <span>
                        {categoryScores[cat] || 0}
                        {" / "}
                        {categoryMaxScores[cat] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TOPIC ANALYSIS */}
            {Object.keys(topicStats).length > 0 && (
              <>
                <Divider />

                <div className="text-sm space-y-2">
                  <p className="font-semibold">Analisis Topik</p>

                  {Object.entries(topicStats).map(([topic, t]) => {
                    const isTKP = t.kategori?.toUpperCase().includes("TKP");

                    return (
                      <div key={topic} className="border p-3 rounded">
                        <p>{t.kategori}</p>

                        <p className="font-medium">Topik: {topic}</p>

                        <p>Total soal: {t.total}</p>

                        <p>Tidak dijawab: {t.unanswered}</p>

                        {isTKP ? (
                          <>
                            <Divider className="my-2" />

                            <p>+5 : {t.score5}</p>

                            <p>+4 : {t.score4}</p>

                            <p>+3 : {t.score3}</p>

                            <p>+2 : {t.score2}</p>

                            <p>+1 : {t.score1}</p>

                            <p className="font-semibold">
                              Total Skor : {t.totalScore}
                            </p>
                          </>
                        ) : (
                          <>
                            <p>Benar: {t.correct}</p>

                            <p>Salah: {t.wrong}</p>
                          </>
                        )}
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
