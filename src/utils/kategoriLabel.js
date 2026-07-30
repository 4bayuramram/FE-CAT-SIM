// kategoriLabel.js
//
// Helper untuk kategori soal (TWK/TIU/TKP) di jalur paid.
//
// Kenapa ini perlu ada: `question.kategori` dari API get-questions
// (kontrak DB, lihat engine_2/*) isinya cuma kode singkat, mis. "TKP"
// atau "TWK" -- SATU KATA, tanpa spasi. Beda dari data statis lama di
// data/2/*.js yang isinya sudah kalimat lengkap ("Tes Karakteristik
// Pribadi (TKP)").
//
// Kedua helper di bawah ini menerima kedua bentuk itu (kode singkat
// ATAU kalimat lengkap) supaya sama-sama aman dipakai di jalur paid
// maupun free-flow lama.

export const KATEGORI_FULL_LABEL = {
  TWK: "Tes Wawasan Kebangsaan",
  TIU: "Tes Intelegensia Umum",
  TKP: "Tes Karakteristik Pribadi",
};

/**
 * Ambil kode singkat (TWK/TIU/TKP) dari kategori, apapun bentuk
 * inputnya:
 * - "TKP"                              -> "TKP"
 * - "tkp"                              -> "TKP"
 * - "Tes Karakteristik Pribadi (TKP)"  -> "TKP"
 *
 * BUG LAMA yang diperbaiki: sebelumnya topbar mengambil huruf
 * pertama dari tiap kata (split(" ")[i][0]) untuk bikin singkatan.
 * Itu benar kalau inputnya kalimat lengkap ("Tes Wawasan Kebangsaan"
 * -> T+W+K -> "TWK"), TAPI salah kalau inputnya sudah berupa kode
 * singkat SATU KATA ("TKP" -> cuma diambil huruf pertama -> "T").
 * Makanya topbar sempat cuma nongol "T".
 */
export function getKategoriShort(kategori) {
  if (!kategori) return "";

  const text = String(kategori).trim();

  // Kalau ada kode dalam kurung, mis. "... (TKP)", prioritaskan itu.
  const inParens = text.match(/\(([^)]+)\)/);
  if (inParens) return inParens[1].trim().toUpperCase();

  // Kalau sudah satu kata pendek (kode), langsung pakai apa adanya.
  if (!text.includes(" ")) return text.toUpperCase();

  // Fallback lama: kalimat tanpa kode di kurung -> ambil inisial
  // tiap kata (maks 3 kata pertama).
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Ambil label lengkap yang enak dibaca, mis. untuk kartu soal:
 * - "TIU"                              -> "Tes Intelegensia Umum"
 * - "Tes Intelegensia Umum (TIU)"      -> "Tes Intelegensia Umum (TIU)" (dipakai apa adanya)
 * - kategori tak dikenal               -> dikembalikan apa adanya
 */
export function getKategoriFullLabel(kategori) {
  if (!kategori) return "";

  const text = String(kategori).trim();
  const short = getKategoriShort(text);
  const full = KATEGORI_FULL_LABEL[short];

  if (!full) return text; // kategori tak dikenal, tampilkan apa adanya

  // Kalau input sudah kalimat lengkap (ada spasi), jangan diubah lagi.
  if (text.includes(" ")) return text;

  // Input berupa kode singkat -> lengkapi jadi "Tes ... (KODE)".
  return `${full} (${short})`;
}
