/**
 * examEngineDb.js
 *
 * Tanggung jawab (dokumen perencanaan, bagian 4.1 — Orchestrator):
 * - Titik masuk utama yang mengoordinasikan sessionEngineDb, timerEngineDb,
 *   rulesEngineDb, scoringEngineDb, navigationEngineDb, contentParserDb
 *   untuk satu alur ujian penuh: mulai -> ambil soal -> jawab -> autosave
 *   -> submit -> pembahasan.
 * - TIDAK mengandung logika bisnis sendiri — setiap keputusan didelegasikan
 *   ke engine yang relevan. Fungsi di sini murni urutan pemanggilan.
 *
 * Ini satu-satunya modul yang boleh dipanggil langsung oleh reducer
 * (examSliceDb). UI tidak pernah memanggil engine manapun secara langsung.
 *
 * PATCH (3 Juli 2026): autosave() sekarang MERGE hasil dari backend ke
 * session lama, bukan menimpa total. Endpoint /autosave-session hanya
 * mengembalikan { id, answers, flagged, current_index } — kalau session
 * ditimpa penuh dengan response ini, field status/started_at/duration
 * hilang dari state, dan seluruh gerbang rulesEngineDb.canSubmit()
 * setelahnya jadi selalu false (session.status jadi undefined). Efeknya:
 * autosave kedua dst gagal, auto-submit tidak pernah terpicu, submit
 * manual ditolak — semuanya tanpa error yang terlihat jelas ke user.
 * Fix ini menutup celah tersebut di sisi client.
 */

import { postDb } from "./httpClientDb";
import * as sessionEngineDb from "./sessionEngineDb";
import * as timerEngineDb from "./timerEngineDb";
import * as rulesEngineDb from "./rulesEngineDb";
import * as navigationEngineDb from "./navigationEngineDb";
import * as contentParserDb from "./contentParserDb";

/**
 * Membuka halaman ujian: coba lanjutkan sesi aktif, atau mulai sesi baru
 * jika belum pernah ada sama sekali. Tidak otomatis membuat sesi baru jika
 * user sudah pernah menyelesaikan attempt pertama (biar reducer/UI yang
 * putuskan alur non-perdana, di luar cakupan engine ini untuk saat ini).
 *
 * @param {string} packageId
 * @returns {Promise<object>} bentuk siap dikonsumsi reducer, lihat di bawah
 */
async function startOrResumeExam(packageId) {
  const resumeResult = await sessionEngineDb.resumeSession(packageId);

  if (resumeResult.kind === "active") {
    const remaining = timerEngineDb.syncTimer(resumeResult.session);
    const parsedQuestions = contentParserDb.parseQuestions(
      resumeResult.questions
    );

    return {
      mode: "resumed",
      session: resumeResult.session,
      questions: parsedQuestions,
      remainingSeconds: remaining.remainingSeconds,
    };
  }

  if (resumeResult.kind === "completed" || resumeResult.kind === "expired") {
    // BARU — kalau backend mengirim completedSession (session_id +
    // breakdown skor + questions dari attempt terakhir), hidrasi jadi
    // bentuk siap pakai reducer, supaya halaman /hasil bisa langsung
    // render tanpa fetch tambahan meski dibuka lewat refresh/URL langsung.
    // Tidak mengubah bentuk return lama (firstAttemptResult tetap ada)
    // — murni tambahan field, non-breaking untuk pemanggil yang belum tahu
    // soal completedSession.
    const cs = resumeResult.completedSession;

    return {
      mode: resumeResult.kind,
      firstAttemptResult: resumeResult.firstAttemptResult,
      progressResult: resumeResult.progressResult ?? null,
      attemptCount: resumeResult.attemptCount ?? 0,
      completedSession: cs
        ? {
            session: {
              id: cs.sessionId,
              status: cs.status,
              answers: cs.answers,
            },
            questions: contentParserDb.parseQuestions(cs.questions),
            result: cs.result,
          }
        : null,
    };
  }

  // kind === 'not_started' -> buat sesi baru lalu ambil soal.
  return createFreshSession(packageId);
}

/**
 * Helper bersama: buat sesi baru (POST /create-session) lalu ambil soal
 * (POST /get-questions), dipakai baik untuk attempt pertama (kind
 * 'not_started' di startOrResumeExam) maupun attempt ke-2/3/dst lewat
 * startNewAttempt() di bawah — dua jalur ini secara backend sama persis
 * (create-session sudah otomatis menentukan attempt_type perdana/
 * non_perdana berdasarkan ada-tidaknya row exam_results, bukan dari
 * client), jadi tidak perlu endpoint terpisah.
 *
 * PATCH (badge "Pengerjaan ke-X", lihat sessionEngineDb.createSession):
 * `attemptCount` sekarang ikut dibawa balik dari createSession, supaya
 * kedua reducer pemanggil (startOrResumeExamDb & startNewAttemptDb)
 * bisa langsung sinkronkan state.attemptCount begitu sesi BARU mulai —
 * tidak nunggu submit dulu.
 */
async function createFreshSession(packageId) {
  const { session, attemptCount } = await sessionEngineDb.createSession(
    packageId
  );
  const rawQuestions = await fetchQuestionsWithRetry(session.id);
  const parsedQuestions = contentParserDb.parseQuestions(rawQuestions);
  const remaining = timerEngineDb.syncTimer(session);

  return {
    mode: "started",
    session,
    questions: parsedQuestions,
    remainingSeconds: remaining.remainingSeconds,
    attemptCount,
  };
}

/**
 * FIX (bug "Gagal memuat ujian" di attempt pertama): sesaat setelah
 * create-session, backend kadang belum selesai meng-assign soal ke sesi
 * yang baru dibuat, sehingga get-questions langsung sesudahnya bisa
 * balik kosong/tidak valid (race condition sisi backend). Daripada
 * langsung menampilkan error ke user, coba ulang sekali dengan jeda
 * singkat sebelum benar-benar menyerah.
 *
 * Tidak dipakai di jalur resume (kind 'active') karena di situ sesi
 * sudah lama ada — soal pasti sudah ter-assign, race ini hanya relevan
 * tepat setelah create-session.
 */
async function fetchQuestionsWithRetry(sessionId, attempt = 1) {
  const { questions: rawQuestions } = await postDb("/get-questions", {
    session_id: sessionId,
  });

  const isEmpty = !Array.isArray(rawQuestions) || rawQuestions.length === 0;

  if (isEmpty && attempt < 2) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return fetchQuestionsWithRetry(sessionId, attempt + 1);
  }

  return rawQuestions;
}

/**
 * BARU — tombol "Coba Lagi": mulai attempt baru (ke-2/3/dst) untuk paket
 * yang sebelumnya sudah pernah diselesaikan. Dipanggil eksplisit dari UI
 * (bukan otomatis lewat startOrResumeExam), karena begitu ada attempt yang
 * selesai, startOrResumeExam akan selalu balik ke mode 'completed' —
 * mulai attempt baru harus jadi keputusan sadar user, bukan otomatis.
 *
 * Backend (create-session) sendiri yang memvalidasi ulang akses & duration
 * — tidak ada bypass dari sisi client.
 *
 * @param {string} packageId
 */
async function startNewAttempt(packageId) {
  return createFreshSession(packageId);
}

/**
 * Menyimpan perubahan (jawaban / flag / index) via autosave. Validasi lewat
 * rulesEngineDb dulu sebelum request dikirim — mencegah data tidak valid
 * terkirim ke backend.
 *
 * PENTING: /autosave-session hanya mengembalikan sebagian field session
 * (id, answers, flagged, current_index). Session hasil fungsi ini di-MERGE
 * dari session lama + response backend, supaya field seperti status,
 * started_at, duration tidak hilang dari state setelah autosave pertama.
 *
 * @param {object} session - session saat ini (untuk cek totalSoal di navigasi jika perlu)
 * @param {{ answer?: {nomor_soal:number, jawaban:string}, flag?: {nomor_soal:number, value:boolean}, current_index?: number }} changes
 * @returns {Promise<object>} session ter-update (hasil merge, bukan replace)
 */
async function autosave(session, changes) {
  if (!rulesEngineDb.canSubmit(session)) {
    // Sesi tidak lagi running -> autosave tidak relevan/tidak boleh dikirim.
    throw new Error("examEngineDb.autosave: sesi tidak berstatus running");
  }

  if (!changes.answer && !changes.flag && changes.current_index == null) {
    throw new Error(
      "examEngineDb.autosave: tidak ada perubahan untuk disimpan"
    );
  }

  if (
    changes.answer &&
    !rulesEngineDb.isValidAnswer(
      changes.answer.nomor_soal,
      changes.answer.jawaban
    )
  ) {
    throw new Error("examEngineDb.autosave: format answer tidak valid");
  }

  if (
    changes.flag &&
    !rulesEngineDb.isValidFlag(changes.flag.nomor_soal, changes.flag.value)
  ) {
    throw new Error("examEngineDb.autosave: format flag tidak valid");
  }

  const result = await postDb("/autosave-session", {
    session_id: session.id,
    ...changes,
  });

  // MERGE, bukan replace — result.session dari backend hanya berisi
  // { id, answers, flagged, current_index }. Field lain (status,
  // started_at, duration, package_id, dll) dipertahankan dari session lama.
  return { ...session, ...result.session };
}

/**
 * Memindahkan posisi soal yang sedang dibuka. Validasi index dulu lewat
 * navigationEngineDb sebelum dikirim sebagai bagian dari autosave.
 *
 * @param {object} session
 * @param {number} targetIndex
 * @param {number} totalSoal
 * @returns {Promise<object>} session ter-update
 */
async function goToQuestion(session, targetIndex, totalSoal) {
  const validation = navigationEngineDb.jumpIndex(targetIndex, totalSoal);
  if (!validation.valid) {
    throw new Error(`examEngineDb.goToQuestion: ${validation.reason}`);
  }
  return autosave(session, { current_index: validation.index });
}

/**
 * Cek apakah waktu habis dan, jika iya, langsung trigger submit otomatis.
 * Dipanggil berkala (mis. tiap tick timer UI) oleh reducer.
 *
 * @param {object} session
 * @returns {Promise<object|null>} hasil submitExam() jika auto-submit terpicu, null jika tidak
 */
async function checkAutoSubmit(session) {
  if (!rulesEngineDb.shouldAutoSubmit(session)) {
    return null;
  }
  return submitExam(session);
}

/**
 * Submit ujian (manual maupun dipicu auto-submit). Selalu cek
 * rulesEngineDb.canSubmit() dulu sebelum request dikirim — mencegah submit
 * ganda / race condition di sisi client (perbaikan bug lama #2), meskipun
 * backend tetap jadi penjaga akhir lewat unique constraint & pengecekan
 * status di endpoint submit-exam.
 *
 * @param {object} session
 * @returns {Promise<{ session: object, result: object }>}
 */
async function submitExam(session) {
  if (!rulesEngineDb.canSubmit(session)) {
    throw new Error(
      "examEngineDb.submitExam: sesi tidak dapat di-submit (bukan running)"
    );
  }

  const result = await postDb("/submit-session", { session_id: session.id });

  // result.status adalah 'finished' atau 'expired', ditentukan backend.
  const updatedSession = sessionEngineDb.setStatus(session, result.status);

  return { session: updatedSession, result };
}

/**
 * Mengambil pembahasan. Hanya boleh dipanggil jika sesi sudah selesai
 * (finished/expired) — dicek dulu di sisi client sebagai guard tambahan,
 * backend tetap jadi validator utama (403 jika belum selesai).
 *
 * @param {object} session
 * @returns {Promise<{ pembahasan: object[], userAnswers: Record<string,string> }>}
 */
async function getPembahasan(session) {
  if (session.status === "running") {
    throw new Error("examEngineDb.getPembahasan: sesi belum selesai");
  }

  const result = await postDb("/get-pembahasan", { session_id: session.id });

  return {
    pembahasan: result.pembahasan,
    userAnswers: result.user_answers,
  };
}

export {
  startOrResumeExam,
  startNewAttempt,
  autosave,
  goToQuestion,
  checkAutoSubmit,
  submitExam,
  getPembahasan,
};
