/**
 * timerEngineDb.js
 *
 * Tanggung jawab (dokumen perencanaan, bagian 4.3):
 * - Menghitung waktu tersisa dari started_at + duration
 * - isExpired(session): deteksi waktu habis
 * - syncTimer(session): sinkronisasi ulang saat resume/restore, berbasis
 *   started_at ASLI dari server (bukan waktu lokal) — perbaikan bug lama #5
 *
 * ATURAN PENTING (perbaikan bug lama #3):
 * Engine ini TIDAK PERNAH mengubah session.status. Timer murni urusan
 * waktu. Perubahan status (mis. jadi "expired") sepenuhnya wewenang
 * sessionEngineDb.setStatus(), dipicu oleh rulesEngineDb yang membaca
 * hasil isExpired() di sini.
 *
 * Client-side timer ini bersifat SINYAL, bukan otoritas final — keputusan
 * akhir status finished/expired tetap ditentukan backend saat submit-exam,
 * sesuai desain "auto-submit berbasis server-side timeout".
 */

/**
 * Menghitung waktu kedaluwarsa (ms epoch) dari session.
 * duration di Kontrak API dalam satuan MENIT.
 *
 * @param {object} session - harus punya started_at (ISO string) & duration (menit)
 * @returns {number} epoch ms saat sesi kedaluwarsa
 */
function getExpiryTimestamp(session) {
  if (!session?.started_at || session?.duration == null) {
    throw new Error(
      'timerEngineDb.getExpiryTimestamp: session butuh started_at dan duration'
    );
  }
  const startedAtMs = new Date(session.started_at).getTime();
  const durationMs = session.duration * 60 * 1000;
  return startedAtMs + durationMs;
}

/**
 * Sisa waktu dalam detik, tidak pernah negatif.
 *
 * @param {object} session
 * @param {number} [now] - epoch ms, default Date.now() (bisa di-inject untuk testing)
 * @returns {number} detik tersisa (0 jika sudah habis)
 */
function getRemainingSeconds(session, now = Date.now()) {
  const expiryMs = getExpiryTimestamp(session);
  const remainingMs = expiryMs - now;
  return Math.max(0, Math.floor(remainingMs / 1000));
}

/**
 * Deteksi apakah waktu ujian sudah habis (sinyal client-side).
 *
 * @param {object} session
 * @param {number} [now]
 * @returns {boolean}
 */
function isExpired(session, now = Date.now()) {
  return getRemainingSeconds(session, now) <= 0;
}

/**
 * Sinkronisasi ulang timer saat session di-restore (resume setelah refresh
 * atau koneksi sempat terputus). Karena sisa waktu SELALU dihitung dari
 * started_at asli (bukan disimpan/di-decrement di client), fungsi ini pada
 * dasarnya adalah pemanggilan ulang getRemainingSeconds dengan sumber
 * started_at yang baru diterima dari backend — memastikan tidak ada waktu
 * "ter-reset" akibat state lokal yang basi.
 *
 * @param {object} session - session terbaru dari backend (resume-session)
 * @returns {{ remainingSeconds: number, expired: boolean }}
 */
function syncTimer(session) {
  const remainingSeconds = getRemainingSeconds(session);
  return {
    remainingSeconds,
    expired: remainingSeconds <= 0,
  };
}

export { getExpiryTimestamp, getRemainingSeconds, isExpired, syncTimer };
