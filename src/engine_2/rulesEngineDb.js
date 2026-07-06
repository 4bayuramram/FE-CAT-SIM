/**
 * rulesEngineDb.js
 *
 * Tanggung jawab (dokumen perencanaan, bagian 4.4):
 * - canSubmit(session): hanya true jika status "running"
 * - isValidAnswer(nomorSoal, jawaban): validasi format sebelum autosave
 * - shouldAutoSubmit(session): memanggil timerEngineDb.isExpired() dengan
 *   referensi yang BENAR (perbaikan bug lama #1 — sebelumnya salah
 *   memanggil sessionEngine.isExpired() yang tidak pernah ada/di-import)
 * - Validasi transisi status (mis. running -> finished valid,
 *   finished -> running tidak)
 *
 * Engine ini adalah SATU-SATUNYA tempat keputusan "boleh/tidak boleh".
 * Reducer/UI wajib memanggil fungsi di sini sebelum mengubah state terkait
 * (perbaikan bug lama #8 — validasi engine yang dulu tidak pernah
 * benar-benar dipanggil dari examSlice).
 */

import * as timerEngineDb from './timerEngineDb';
import { VALID_STATUSES } from './sessionEngineDb';

// Pilihan jawaban yang sah untuk soal pilihan ganda standar.
const VALID_ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E'];

// Transisi status yang diperbolehkan. running bisa ke finished/expired;
// finished dan expired adalah status akhir (tidak bisa kembali ke running).
const ALLOWED_TRANSITIONS = {
  running: ['finished', 'expired'],
  finished: [],
  expired: [],
};

/**
 * Apakah session boleh di-submit sekarang.
 * Hanya session berstatus "running" yang boleh diproses submit —
 * mencegah submit ganda / race condition (perbaikan bug lama #2).
 *
 * @param {object} session
 * @returns {boolean}
 */
function canSubmit(session) {
  return session?.status === 'running';
}

/**
 * Validasi format jawaban sebelum dikirim ke autosave.
 * Sesuai Kontrak API: answer = { nomor_soal: number, jawaban: string }.
 *
 * @param {number} nomorSoal
 * @param {string} jawaban
 * @returns {boolean}
 */
function isValidAnswer(nomorSoal, jawaban) {
  if (typeof nomorSoal !== 'number' || nomorSoal <= 0) {
    return false;
  }
  if (typeof jawaban !== 'string') {
    return false;
  }
  return VALID_ANSWER_OPTIONS.includes(jawaban.toUpperCase());
}

/**
 * Validasi format flag (bookmark) sebelum dikirim ke autosave.
 * Sesuai Kontrak API: flag = { nomor_soal: number, value: boolean }.
 *
 * @param {number} nomorSoal
 * @param {boolean} value
 * @returns {boolean}
 */
function isValidFlag(nomorSoal, value) {
  return typeof nomorSoal === 'number' && nomorSoal > 0 && typeof value === 'boolean';
}

/**
 * Apakah sistem harus memicu auto-submit sekarang.
 * Memanggil timerEngineDb (bukan sessionEngine) untuk cek waktu —
 * ini fungsi yang dulu salah referensi (bug lama #1).
 *
 * @param {object} session
 * @returns {boolean}
 */
function shouldAutoSubmit(session) {
  if (!canSubmit(session)) {
    // Sudah bukan running -> tidak relevan untuk auto-submit.
    return false;
  }
  return timerEngineDb.isExpired(session);
}

/**
 * Validasi apakah perpindahan status dari `currentStatus` ke `nextStatus`
 * diperbolehkan.
 *
 * @param {string} currentStatus
 * @param {string} nextStatus
 * @returns {boolean}
 */
function isValidStatusTransition(currentStatus, nextStatus) {
  if (!VALID_STATUSES.includes(currentStatus) || !VALID_STATUSES.includes(nextStatus)) {
    return false;
  }
  return ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus);
}

export {
  canSubmit,
  isValidAnswer,
  isValidFlag,
  shouldAutoSubmit,
  isValidStatusTransition,
  VALID_ANSWER_OPTIONS,
};
