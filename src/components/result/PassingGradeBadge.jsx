/**
 * PassingGradeBadge — badge status lulus/belum lulus passing grade SKD
 * + rincian 3 subtes (TWK/TIU/TKP). Terpisah dari ResultHeroScore
 * (yang modelnya salah untuk konsep ini — bandingkan total skor,
 * bukan per-subtes).
 *
 * @param {object|null} status - hasil checkPassingGrade(breakdown, rule)
 */
export default function PassingGradeBadge({ status }) {
  if (!status) return null;

  const { allPassed, subtests, ruleName } = status;

  return (
    <div
      className={`rounded-xl p-5 border ${
        allPassed
          ? "bg-[#4de082]/10 border-[#4de082]/30"
          : "bg-[#ffb4ab]/10 border-[#ffb4ab]/30"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`font-bold text-lg ${
            allPassed ? "text-[#4de082]" : "text-[#ffb4ab]"
          }`}
        >
          {allPassed ? "Lulus Passing Grade" : "Belum Lulus Passing Grade"}
        </span>
        {ruleName && (
          <span className="text-xs text-white/60 uppercase tracking-wide">
            {ruleName}
          </span>
        )}
      </div>

      <div
        className={`grid gap-3 ${
          Object.keys(subtests).length === 1
            ? "grid-cols-1"
            : Object.keys(subtests).length === 2
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {Object.entries(subtests).map(([code, s]) => (
          <div key={code} className="text-center">
            <div className="text-xs text-white/60 mb-1">{code}</div>
            <div
              className={`font-bold ${
                s.passed ? "text-[#4de082]" : "text-[#ffb4ab]"
              }`}
            >
              {s.score} / min {s.min}
            </div>
          </div>
        ))}
      </div>

      {!allPassed && (
        <p className="text-white/70 text-sm mt-3">
          Passing grade bukan penentu kelulusan akhir, tapi syarat minimal
          untuk ikut proses perangkingan ke tahap SKB.
        </p>
      )}
    </div>
  );
}
