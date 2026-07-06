/**
 * scoringEngineDb.js
 *
 * Tanggung jawab (dokumen perencanaan, bagian 4.5):
 * - Perhitungan skor per kategori dengan fallback (|| 0) agar scoringMap
 *   kosong tidak menghasilkan -Infinity (perbaikan bug lama #6)
 * - HANYA untuk preview/tampilan sementara di client (mis. ringkasan kasar
 *   sebelum submit). TIDAK PERNAH dipakai sebagai skor final resmi — itu
 *   wewenang backend (POST /submit-exam), sesuai keputusan Level 3
 *   (server-side scoring, jawabanBenar tidak pernah dikirim ke client).
 */

/**
 * Skor maksimum yang mungkin dicapai untuk satu soal TKP berdasarkan
 * scoringMap-nya. Mengembalikan 0 (bukan -Infinity) jika scoringMap
 * kosong/tidak ada — perbaikan bug lama #6.
 *
 * @param {object} scoringMap - mis. { A: 0, B: 5, C: 0, D: 0, E: 0 }
 * @returns {number}
 */
function getMaxScoreFromMap(scoringMap) {
  const values = Object.values(scoringMap || {});
  if (values.length === 0) {
    return 0;
  }
  return Math.max(...values, 0);
}

/**
 * Menghitung skor maksimum per kategori dari daftar pembahasan
 * (hasil GET /get-pembahasan), untuk soal bertipe TKP yang pakai
 * scoring_map alih-alih benar/salah biasa.
 *
 * @param {object[]} pembahasanList - array item pembahasan per soal
 * @param {Map<string, string>} kategoriBySoal - nomor_soal -> kategori (dari data questions)
 * @returns {Record<string, number>} kategori -> total skor maksimum
 */
function getCategoryMaxScores(pembahasanList, kategoriBySoal) {
  const categoryMaxScores = {};

  for (const item of pembahasanList) {
    const kategori = kategoriBySoal.get(item.nomor_soal) ?? "unknown";
    const maxForThisQuestion = item.scoring_map
      ? getMaxScoreFromMap(item.scoring_map)
      : 0; // soal non-TKP tidak pakai scoring_map, tidak menambah kategori TKP

    categoryMaxScores[kategori] =
      (categoryMaxScores[kategori] || 0) + maxForThisQuestion;
  }

  return categoryMaxScores;
}

/**
 * Preview kasar hasil ujian di client berdasarkan jawaban lokal & kunci
 * yang SUDAH tersedia (mis. setelah get-pembahasan, bukan saat ujian
 * berlangsung — jawabanBenar tidak pernah ada di client sebelum itu).
 *
 * Fungsi ini sengaja terpisah dari alur submit resmi: hasil dari sini
 * tidak boleh dikirim balik sebagai skor final, hanya untuk ditampilkan.
 *
 * @param {object[]} pembahasanList
 * @param {Record<string, string>} userAnswers - nomor_soal(string) -> jawaban
 * @returns {{ correct: number, wrong: number, unanswered: number, previewScore: number }}
 */
function previewResult(pembahasanList, userAnswers) {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  let previewScore = 0;

  for (const item of pembahasanList) {
    const userAnswer = userAnswers[String(item.nomor_soal)];

    if (userAnswer == null) {
      unanswered += 1;
      continue;
    }

    if (item.scoring_map) {
      // Soal TKP: skor berdasarkan scoring_map, bukan benar/salah biner.
      // Disamakan dengan patch backend submit-session (2 Juli 2026):
      // poin > 0 dihitung correct, poin 0 dihitung wrong — bukan otomatis
      // correct semua seperti sebelumnya.
      const points = item.scoring_map[userAnswer] ?? 0;
      previewScore += points;
      if (points > 0) {
        correct += 1;
      } else {
        wrong += 1;
      }
      continue;
    }

    if (userAnswer === item.jawaban_benar) {
      correct += 1;
    } else {
      wrong += 1;
    }
  }

  return { correct, wrong, unanswered, previewScore };
}

export { getMaxScoreFromMap, getCategoryMaxScores, previewResult };
