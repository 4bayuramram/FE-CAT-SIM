/**
 * sessionEngineDb.js
 *
 * Tanggung jawab (sesuai dokumen perencanaan, bagian 4.2):
 * - Create session: POST /create-session
 * - Resume session: POST /resume-session, membedakan 3 kondisi respons
 *   (sesi aktif / sudah selesai / kedaluwarsa)
 * - Satu-satunya titik penulis status sesi (running/finished/expired)
 *   lewat setStatus() — mencegah dua tempat berbeda saling menimpa status
 *   (perbaikan bug lama #3 & #4)
 *
 * PENTING: engine ini TIDAK memutuskan kapan status berubah karena waktu
 * habis — itu wewenang rulesEngineDb (shouldAutoSubmit) yang memanggil
 * timerEngineDb. sessionEngineDb hanya menjalankan/mencatat hasil akhirnya.
 */

import { postDb } from './httpClientDb';

const VALID_STATUSES = ['running', 'finished', 'expired'];

/**
 * Membuat sesi ujian baru untuk suatu paket.
 *
 * @param {string} packageId
 * @returns {Promise<object>} session dari backend (lihat Kontrak API create-session)
 */
async function createSession(packageId) {
  if (!packageId) {
    throw new Error('sessionEngineDb.createSession: packageId wajib diisi');
  }
  const result = await postDb('/create-session', { package_id: packageId });
  return result.session;
}

/**
 * Melanjutkan sesi ujian yang mungkin masih berjalan untuk suatu paket.
 * Mengembalikan bentuk yang sudah dinormalisasi supaya examEngineDb tidak
 * perlu tahu detail 3 variasi response dari Kontrak API.
 *
 * @param {string} packageId
 * @returns {Promise<{
 *   kind: 'active' | 'completed' | 'expired',
 *   session?: object,
 *   questions?: object[],
 *   firstAttemptResult?: object,
 *   attemptCount?: number,
 *   completedSession?: { sessionId: string, status: string, answers: object, result: object|null, questions: object[] } | null,
 * }>}
 */
async function resumeSession(packageId) {
  if (!packageId) {
    throw new Error('sessionEngineDb.resumeSession: packageId wajib diisi');
  }
  const result = await postDb('/resume-session', { package_id: packageId });

  if (result.has_active_session) {
    return {
      kind: 'active',
      session: result.session,
      questions: result.questions,
      attemptCount: result.attempt_count ?? 0,
    };
  }

  if (result.reason === 'expired') {
    return {
      kind: 'expired',
      firstAttemptResult: result.first_attempt_result ?? null,
      progressResult: result.progress_result ?? null,
      attemptCount: result.attempt_count ?? 0,
    };
  }

  if (result.has_completed_first_attempt) {
    // BARU — bawa juga "completedSession" (session_id + breakdown skor +
    // questions dari attempt terakhir), supaya /hasil bisa dimuat ulang
    // tanpa Redux state (fix refresh halaman hasil, dokumen acuan §8-2).
    const cs = result.completed_session;
    return {
      kind: 'completed',
      firstAttemptResult: result.first_attempt_result ?? null,
      // BARU — hasil attempt ke-2/3/dst (dari exam_progress), TERPISAH
      // dari firstAttemptResult karena keduanya harus tetap bisa
      // ditampilkan berdampingan ("nilai perdana X, nilai terakhir Y") —
      // progressResult DI-OVERWRITE tiap attempt baru, firstAttemptResult
      // TIDAK PERNAH berubah setelah attempt pertama.
      progressResult: result.progress_result ?? null,
      attemptCount: result.attempt_count ?? 0,
      completedSession: cs
        ? {
            sessionId: cs.session_id,
            status: cs.status,
            answers: cs.answers,
            result: cs.result,
            questions: cs.questions,
          }
        : null,
    };
  }

  // Tidak ada sesi aktif, belum pernah attempt sama sekali (paket belum pernah dikerjakan).
  return { kind: 'not_started' };
}

/**
 * Satu-satunya fungsi yang boleh mengubah status sesi di sisi client.
 * Tidak melakukan panggilan API sendiri — dipakai untuk sinkronisasi state
 * lokal setelah backend mengembalikan status baru (mis. dari submit-exam).
 *
 * @param {object} session - state session saat ini (dari reducer)
 * @param {string} newStatus - 'running' | 'finished' | 'expired'
 * @returns {object} session dengan status ter-update
 */
function setStatus(session, newStatus) {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error(
      `sessionEngineDb.setStatus: status "${newStatus}" tidak valid`
    );
  }
  if (!session) {
    throw new Error('sessionEngineDb.setStatus: session tidak boleh kosong');
  }
  return { ...session, status: newStatus };
}

export { createSession, resumeSession, setStatus, VALID_STATUSES };
