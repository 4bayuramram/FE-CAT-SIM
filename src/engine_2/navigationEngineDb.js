/**
 * navigationEngineDb.js
 *
 * Tanggung jawab (dokumen perencanaan, bagian 4.6):
 * - jumpIndex(index, totalSoal): validasi batas rentang sebelum index
 *   diterima (perbaikan bug lama #8 — dulu setCurrentIndex menerima index
 *   apa saja tanpa lewat navigationEngine)
 *
 * Engine ini TIDAK menyimpan state sendiri — hanya fungsi
 * validasi/transformasi murni yang dipanggil reducer.
 */

/**
 * Memvalidasi & menormalisasi index soal yang ingin dituju.
 * Reducer WAJIB memanggil ini sebelum menyimpan current_index baru —
 * tidak boleh menerima index mentah langsung dari UI.
 *
 * @param {number} index - index tujuan (0-based)
 * @param {number} totalSoal - jumlah total soal dalam sesi
 * @returns {{ valid: boolean, index: number | null, reason?: string }}
 */
function jumpIndex(index, totalSoal) {
  if (typeof totalSoal !== 'number' || totalSoal <= 0) {
    return { valid: false, index: null, reason: 'totalSoal tidak valid' };
  }
  if (typeof index !== 'number' || !Number.isInteger(index)) {
    return { valid: false, index: null, reason: 'index harus bilangan bulat' };
  }
  if (index < 0 || index >= totalSoal) {
    return {
      valid: false,
      index: null,
      reason: `index di luar rentang (0 - ${totalSoal - 1})`,
    };
  }
  return { valid: true, index };
}

/**
 * Index soal berikutnya, di-clamp supaya tidak melewati batas terakhir.
 *
 * @param {number} currentIndex
 * @param {number} totalSoal
 * @returns {number}
 */
function nextIndex(currentIndex, totalSoal) {
  return Math.min(currentIndex + 1, totalSoal - 1);
}

/**
 * Index soal sebelumnya, di-clamp supaya tidak kurang dari 0.
 *
 * @param {number} currentIndex
 * @returns {number}
 */
function previousIndex(currentIndex) {
  return Math.max(currentIndex - 1, 0);
}

export { jumpIndex, nextIndex, previousIndex };
