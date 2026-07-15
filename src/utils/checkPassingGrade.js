/**
 * checkPassingGrade — bandingkan skor TWK/TIU/TKP user ke ambang batas
 * passing grade aktif. Lulus = SEMUA subtes lulus (bukan total skor),
 * sesuai mekanisme resmi SKD CPNS.
 *
 * @param {object} breakdown - exam_results.breakdown, shape:
 *   { TWK: { score, maxScore, ... }, TIU: {...}, TKP: {...} }
 * @param {object} rule - hasil getActivePassingGrade(): { twkMin, tiuMin, tkpMin }
 * @returns {object|null} null kalau breakdown/rule belum tersedia
 */
export function checkPassingGrade(breakdown, rule) {
  if (!breakdown || !rule) return null;

  const twkScore = breakdown.TWK?.score ?? 0;
  const tiuScore = breakdown.TIU?.score ?? 0;
  const tkpScore = breakdown.TKP?.score ?? 0;

  const twkPassed = twkScore >= rule.twkMin;
  const tiuPassed = tiuScore >= rule.tiuMin;
  const tkpPassed = tkpScore >= rule.tkpMin;

  return {
    ruleName: rule.name ?? null,
    subtests: {
      TWK: { score: twkScore, min: rule.twkMin, passed: twkPassed },
      TIU: { score: tiuScore, min: rule.tiuMin, passed: tiuPassed },
      TKP: { score: tkpScore, min: rule.tkpMin, passed: tkpPassed },
    },
    allPassed: twkPassed && tiuPassed && tkpPassed,
  };
}
