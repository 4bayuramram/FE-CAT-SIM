/**
 * ResultTkpSection — khusus kategori TKP (Tes Karakteristik Pribadi):
 * skema skornya beda dari kategori lain (poin +1..+5 per pilihan, tidak
 * ada "salah" mutlak), jadi ditampilkan sebagai distribusi poin, bukan
 * benar/salah biasa.
 *
 * Kalau paket tidak punya kategori TKP, parent cukup tidak me-render
 * komponen ini (bukan tanggung jawab komponen ini untuk decide).
 *
 * @param {number} score
 * @param {number} maxScore
 * @param {{points:number, count:number}[]} pointDistribution - urut dari poin tertinggi ke terendah
 */
export default function ResultTkpSection({ score, maxScore, pointDistribution }) {
  return (
    <section className="rounded-xl p-6 bg-white/10 backdrop-blur-xl border border-white/10 border-l-4 border-l-[#4de082]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Tes Karakteristik Pribadi (TKP)
          </h3>
          <p className="text-sm text-white/60">
            Analisis respon perilaku dan integritas
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#4de082]">{score}</div>
          <div className="text-[10px] font-mono text-white/40">MAX: {maxScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {pointDistribution.map((item) => (
          <div
            key={item.points}
            className="bg-white/5 rounded-lg p-3 text-center border border-white/5"
          >
            <div className="text-xs font-mono text-white/40 mb-1">+{item.points}</div>
            <div className="text-lg font-bold text-white">{item.count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
