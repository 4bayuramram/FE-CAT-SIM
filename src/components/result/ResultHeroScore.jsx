/**
 * ResultHeroScore — kartu besar skor total, glass-morphism, jadi hero
 * halaman /hasil.
 *
 * Bar progres = totalScore / maxScore (dibatasi 0-100%). Pesan lulus/
 * tidak lulus dihitung dari passingGrade — kalau passingGrade tidak
 * dikirim (null), pesan itu disembunyikan (bukan dipaksa tampil dengan
 * angka 0).
 *
 * @param {number} totalScore
 * @param {number} maxScore
 * @param {number|null} passingGrade
 * @param {number|null} percentile
 */
export default function ResultHeroScore({ totalScore, maxScore, passingGrade, percentile }) {
  const pct = maxScore ? Math.min(100, Math.round((totalScore / maxScore) * 100)) : 0;
  const marginPct =
    passingGrade && passingGrade > 0
      ? Math.round(((totalScore - passingGrade) / passingGrade) * 100)
      : null;
  const passed = passingGrade ? totalScore >= passingGrade : null;

  return (
    <section className="relative">
      <div
        className="rounded-xl p-8 md:p-12 text-center flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-white/10 backdrop-blur-xl border border-white/10"
      >
        <span className="text-xs text-[#a3c9ff] uppercase tracking-[0.2em] mb-2 font-mono">
          Total Skor
        </span>

        <div
          className="text-[64px] md:text-[100px] leading-none text-white font-extrabold mb-4"
          style={{ textShadow: "0 0 20px rgba(163, 201, 255, 0.4)" }}
        >
          {totalScore}
        </div>

        <div className="w-full max-w-md bg-white/10 h-1.5 rounded-full overflow-hidden mb-6">
          <div className="bg-[#4de082] h-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        {marginPct !== null && (
          <p className="text-white/80 max-w-lg">
            {passed ? (
              <>
                Selamat! Anda melampaui ambang batas nilai (Passing Grade)
                sebesar <span className="text-[#4de082] font-bold">{marginPct}%</span>.
                {percentile != null && (
                  <> Hasil ini menempatkan Anda di persentil ke-{percentile}.</>
                )}
              </>
            ) : (
              <>
                Nilai Anda masih{" "}
                <span className="text-[#ffb4ab] font-bold">{Math.abs(marginPct)}%</span>{" "}
                di bawah ambang batas nilai (Passing Grade).
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
