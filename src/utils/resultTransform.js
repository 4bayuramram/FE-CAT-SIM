/**
 * resultTransform.js
 *
 * Mengubah `submitResult.breakdown` (dari POST /submit-session &
 * /resume-session, lihat submit-exam.ts & resume-session.ts) menjadi
 * shape yang dikonsumsi komponen presentational di components/result/
 * (ResultHeroScore, ResultStatsGrid, ResultCategoryGrid, ResultTkpSection,
 * ResultTopicAnalysis) — komponen-komponen itu TIDAK diubah, tetap
 * generik seperti semula, cuma sumber datanya yang diganti dari
 * mockResultData.js ke fungsi ini.
 *
 * BELUM TERSEDIA di kontrak backend manapun (tetap TODO, bukan gap baru
 * dari perubahan ini): candidateName, examDate, passingGrade, percentile.
 * Field ini dikembalikan null/placeholder — ResultPageHeader &
 * ResultHeroScore sudah didesain aman menerima null (lihat komentar di
 * komponennya masing-masing).
 */

const CATEGORY_COLOR_KEY = {
  TWK: "tertiary",
  TIU: "primary",
  TKP: "secondary",
};
const CATEGORY_TAG = { TWK: "NATIONALISM", TIU: "LOGIC", TKP: "PERSONALITY" };

function proficiencyLabel(pct) {
  if (pct >= 80) return "Kemampuan Tinggi";
  if (pct >= 50) return "Kemampuan Cukup";
  return "Perlu Ditingkatkan";
}

function proficiencyColorKey(pct) {
  if (pct >= 80) return "secondary";
  if (pct >= 50) return "primary";
  return "error";
}

/**
 * @param {object|null} submitResult - dari selectSubmitResult (examSliceDb)
 * @returns {object|null} shape siap pakai ExamResultPageDb, null kalau
 *   submitResult belum ada ATAU belum punya breakdown (data lama/legacy
 *   sebelum migration kolom breakdown) — parent yang putuskan fallback-nya.
 */
export function transformSubmitResultToView(submitResult) {
  if (!submitResult || !submitResult.breakdown) return null;

  const breakdown = submitResult.breakdown;
  const categoryEntries = Object.entries(breakdown);

  let maxScore = 0;
  const categories = [];
  const topics = [];
  let tkp = null;

  for (const [code, cat] of categoryEntries) {
    maxScore += cat.maxScore || 0;
    const isTkp = code === "TKP";

    if (isTkp) {
      // Distribusi poin TOTAL kategori TKP = jumlah distribusi semua topiknya.
      const totalDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      for (const t of Object.values(cat.topics || {})) {
        for (const p of [5, 4, 3, 2, 1]) {
          totalDistribution[p] += t.pointDistribution?.[String(p)] || 0;
        }
      }
      tkp = {
        score: cat.score || 0,
        maxScore: cat.maxScore || 0,
        pointDistribution: [5, 4, 3, 2, 1].map((p) => ({
          points: p,
          count: totalDistribution[p],
        })),
      };
    } else {
      categories.push({
        code,
        label: cat.label || code,
        tag: CATEGORY_TAG[code] || code,
        colorKey: CATEGORY_COLOR_KEY[code] || "neutral",
        score: cat.score || 0,
        maxScore: cat.maxScore || 0,
      });
    }

    for (const [topicName, t] of Object.entries(cat.topics || {})) {
      const total = t.total || 0;
      const pct = isTkp
        ? total
          ? Math.round(((t.totalSkor || 0) / (total * 5)) * 100)
          : 0
        : total
        ? Math.round(((t.correct || 0) / total) * 100)
        : 0;

      // Skema skor SKD: TWK/TIU = benar/salah biner tapi tiap soal benar
      // bernilai 5 poin (bukan 1), TKP = per-soal 1..5 sesuai scoring_map.
      // `correct`/`total` di bawah TETAP jumlah soal (dipakai proficiencyPct
      // & konsumen lama yang butuh rasio soal). `scoreObtained`/`scoreMax`
      // BARU — nilai POIN asli, dipakai tampilan skor (mis. PDF) supaya
      // 1 soal benar TWK/TIU tampil "5", bukan "1".
      const scoreObtained = isTkp ? t.totalSkor || 0 : (t.correct || 0) * 5;
      const scoreMax = total * 5;

      topics.push({
        id: `${code}-${topicName}`.toLowerCase().replace(/\s+/g, "-"),
        name: topicName,
        groupCode: code,
        questionCount: total,
        focusLabel: cat.label || code,
        // Untuk TKP dipetakan correct=totalSkor & total=maks. mungkin
        // (total*5), sekadar supaya ResultTopicAnalysis (generik,
        // correct/total ratio) tetap menampilkan proporsi yang masuk akal.
        // Detail poin +5..+1 per topik dikirim lewat field tambahan
        // `pointDistribution`/`totalSkor` — TIDAK dirender ResultTopicAnalysis
        // saat ini (komponen itu generik, belum ada varian TKP).
        correct: isTkp ? t.totalSkor || 0 : t.correct || 0,
        total: isTkp ? total * 5 : total,
        scoreObtained,
        scoreMax,
        proficiencyLabel: proficiencyLabel(pct),
        proficiencyPct: pct, // BARU — dipakai generateResultPdf untuk sortir kekuatan/kelemahan
        colorKey: proficiencyColorKey(pct),
        // Data mentah, dijaga tersedia kalau nanti ResultTopicAnalysis mau
        // diperluas untuk render pointDistribution per topik TKP.
        unanswered: t.unanswered,
        wrong: t.wrong ?? null,
        pointDistribution: t.pointDistribution ?? null,
        totalSkor: t.totalSkor ?? null,
      });
    }
  }

  return {
    candidateName: null, // TODO: belum ada endpoint user_profile di alur ini
    examDate: submitResult.submitted_at
      ? new Date(submitResult.submitted_at).toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      : null,
    sessionLabel: submitResult.attempt_count
      ? `KE-${submitResult.attempt_count}`
      : null,

    totalScore: submitResult.score ?? 0,
    maxScore,
    passingGrade: null, // TODO: belum ada di kontrak backend manapun
    percentile: null, // TODO: belum ada di kontrak backend manapun

    correct: submitResult.correct ?? 0,
    wrong: submitResult.wrong ?? 0,
    unanswered: submitResult.unanswered ?? 0,

    tkp,
    categories,
    topics,
  };
}
