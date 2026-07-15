/**
 * checkPassingGrade — bandingkan skor subtes user ke ambang batas
 * passing grade aktif. Lulus = SEMUA subtes YANG ADA DI PAKET lulus
 * (bukan total skor), sesuai mekanisme resmi SKD CPNS.
 *
 * PENTING: hanya mengevaluasi kategori yang benar-benar muncul di
 * breakdown paket (mendukung paket TWK-saja / TIU-saja / TKP-saja,
 * bukan cuma paket SKD lengkap). Sebelumnya 3 subtes di-hardcode
 * dengan fallback skor 0 untuk kategori yang tidak ada di paket —
 * itu membuat paket single-kategori SELALU gagal passing grade
 * (mis. paket TWK-saja: TIU/TKP fallback 0, otomatis < ambang batas).
 *
 * @param {object} breakdown - exam_results.breakdown, shape:
 *   { TWK: { score, maxScore, ... }, TIU: {...}, TKP: {...} }
 *   — hanya berisi key kategori yang memang ada soalnya di paket.
 * @param {object} rule - hasil getActivePassingGrade(): { twkMin, tiuMin, tkpMin }
 * @returns {object|null} null kalau breakdown/rule belum tersedia,
 *   atau kalau tidak ada satupun kategori di breakdown yang punya rule.
 */
export function checkPassingGrade(breakdown, rule) {
  if (!breakdown || !rule) return null;

  const minByCategory = {
    TWK: rule.twkMin,
    TIU: rule.tiuMin,
    TKP: rule.tkpMin,
  };

  const subtests = {};
  let allPassed = true;
  let hasAnySubtest = false;

  for (const [category, min] of Object.entries(minByCategory)) {
    // Skip kategori yang memang tidak ada di paket ini — jangan
    // dianggap skor 0 / otomatis gagal.
    if (!breakdown[category] || min === undefined || min === null) continue;

    hasAnySubtest = true;
    const score = breakdown[category].score ?? 0;
    const passed = score >= min;

    subtests[category] = { score, min, passed };
    if (!passed) allPassed = false;
  }

  if (!hasAnySubtest) return null;

  return {
    ruleName: rule.name ?? null,
    subtests,
    allPassed,
  };
}
