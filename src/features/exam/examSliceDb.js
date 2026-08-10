import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as examEngineDb from "../../engine_2/examEngineDb";

/**
 * examSliceDb — (lihat header versi sebelumnya untuk prinsip dasar,
 * tidak diulang di sini supaya tidak duplikatif).
 *
 * PATCH (pengembangan sisi UI soal, tahap ResultDialogPaid):
 * submitExamDb & tickTimerDb (saat auto-submit terpicu) dulu MEMBUANG
 * `result` dari examEngineDb.submitExam() — hanya `session` yang
 * disimpan. Akibatnya skor resmi dari backend (POST /submit-session)
 * tidak pernah sampai ke UI, dan halaman hasil terpaksa pakai
 * scoringEngineDb.previewResult() yang SECARA EKSPLISIT didokumentasikan
 * "TIDAK PERNAH jadi skor final resmi, hanya preview".
 *
 * Fix: tambah field `submitResult` di state, diisi dari `result` yang
 * sama-sama dikembalikan examEngineDb.submitExam()/checkAutoSubmit().
 * Ini murni PENAMBAHAN field baru — initialState lama & selector lama
 * tidak diubah/dihapus, jadi non-breaking untuk kode yang sudah
 * menggunakan slice ini.
 *
 * PATCH (fix navigasi terasa berat): sebelumnya current_index HANYA
 * berubah lewat goToQuestionDb.fulfilled — artinya tampilan soal baru
 * berganti SETELAH round-trip network ke /autosave-session selesai.
 * Ditambah reducer sync `setCurrentIndexOptimistic` supaya tampilan bisa
 * langsung berpindah di client, sementara goToQuestionDb tetap jalan di
 * background untuk autosave current_index ke backend (dipakai resume-
 * session). Ini murni PENAMBAHAN reducer baru — tidak mengubah/menghapus
 * goToQuestionDb, thunk, atau extraReducers yang sudah ada, jadi
 * non-breaking. Backend tetap sumber kebenaran akhir untuk current_index
 * (tetap tervalidasi ulang tiap request lewat navigationEngineDb.jumpIndex
 * di examEngineDb.goToQuestion).
 *
 * PATCH v2 (fix delay klik jawaban + "jumping" tiba-tiba saat klik cepat):
 * 1. Delay jawaban: `answers` (dibaca QuestionOptionsPaid utk highlight
 *    pilihan) sebelumnya hanya berubah lewat answerQuestionDb.fulfilled —
 *    sama seperti current_index dulu, nunggu network dulu baru keliatan
 *    terpilih. Ditambah reducer sync `setAnswerOptimistic`.
 * 2. "Jumping": kalau user klik cepat (next-next-next, atau ganti jawaban
 *    beruntun), beberapa request /autosave-session jalan bersamaan.
 *    Network tidak menjamin urutan SELESAI sama dengan urutan DIKIRIM —
 *    response yg lebih lama tapi lambat sampai bisa menimpa balik state
 *    yang sudah lebih baru lewat spread total `{...session, ...payload}`.
 *    Fix dua lapis:
 *      a. Staleness guard per requestId — disimpan di `_latestGoToReqId`
 *         (utk goToQuestionDb) & `_latestAnswerReqId` per nomor_soal (utk
 *         answerQuestionDb). Response yang requestId-nya BUKAN yang
 *         terbaru untuk key itu diabaikan sepenuhnya (dianggap stale).
 *      b. Merge dipersempit per-field, bukan spread total session —
 *         goToQuestionDb.fulfilled cuma boleh menulis `current_index`
 *         (+ id), answerQuestionDb.fulfilled cuma `answers` (+ id),
 *         toggleFlagDb.fulfilled cuma `flagged` (+ id). Jadi walau
 *         responsnya berisi snapshot penuh session dari backend, operasi
 *         satu tidak bisa tidak sengaja menimpa field milik operasi lain
 *         yang sedang berjalan bersamaan.
 *    `_latestGoToReqId`/`_latestAnswerReqId` murni bookkeeping internal
 *    slice (prefix underscore), tidak diekspos lewat selector manapun.
 *
 * PATCH v3 (fix delay tombol "Ragu-ragu"): pola identik dengan jawaban —
 * `flagged` sebelumnya hanya berubah lewat toggleFlagDb.fulfilled, jadi
 * tombol ragu-ragu nunggu network dulu baru berubah warna/label. Ditambah
 * reducer sync `setFlagOptimistic` + staleness guard `_latestFlagReqId`
 * per nomor_soal, pola & alasan sama persis seperti `_latestAnswerReqId`.
 */

const initialState = {
  session: null,
  questions: [],
  remainingSeconds: 0,
  status: "idle",
  error: null,
  firstAttemptResult: null,
  pembahasan: null,
  submitResult: null, // BARU — { status, score, correct, wrong, unanswered, duration } dari backend
  attemptCount: 0, // BARU — jumlah attempt keseluruhan (perdana + non-perdana), resmi dari backend
  progressResult: null, // BARU — hasil attempt ke-2/3/dst dari exam_progress (di-overwrite tiap attempt baru), terpisah dari firstAttemptResult
  _latestGoToReqId: null, // BARU (v2) — bookkeeping internal, staleness guard goToQuestionDb
  _latestAnswerReqId: {}, // BARU (v2) — bookkeeping internal, { [nomor_soal]: requestId }
  _latestFlagReqId: {}, // BARU (v3) — bookkeeping internal, { [nomor_soal]: requestId }
};

// ---------------------------------------------------------------------
// Thunks (tidak berubah dari versi sebelumnya)
// ---------------------------------------------------------------------

export const startOrResumeExamDb = createAsyncThunk(
  "examDb/startOrResumeExam",
  async (packageId) => {
    return examEngineDb.startOrResumeExam(packageId);
  }
);

// BARU — tombol "Coba Lagi": mulai attempt baru (ke-2/3/dst) secara sadar
// dari UI. Thunk terpisah dari startOrResumeExamDb karena begitu ada
// attempt yang sudah selesai, startOrResumeExamDb SELALU balik ke mode
// 'completed' (tidak akan pernah otomatis bikin sesi baru) — memulai
// attempt baru harus eksplisit, bukan side-effect dari resume.
export const startNewAttemptDb = createAsyncThunk(
  "examDb/startNewAttempt",
  async (packageId) => {
    return examEngineDb.startNewAttempt(packageId);
  }
);

export const answerQuestionDb = createAsyncThunk(
  "examDb/answerQuestion",
  async ({ nomorSoal, jawaban }, { getState }) => {
    const { session } = getState().examDb;
    return examEngineDb.autosave(session, {
      answer: { nomor_soal: nomorSoal, jawaban },
    });
  }
);

export const toggleFlagDb = createAsyncThunk(
  "examDb/toggleFlag",
  async ({ nomorSoal, value }, { getState }) => {
    const { session } = getState().examDb;
    return examEngineDb.autosave(session, {
      flag: { nomor_soal: nomorSoal, value },
    });
  }
);

export const goToQuestionDb = createAsyncThunk(
  "examDb/goToQuestion",
  async (targetIndex, { getState }) => {
    const { session, questions } = getState().examDb;
    return examEngineDb.goToQuestion(session, targetIndex, questions.length);
  }
);

export const tickTimerDb = createAsyncThunk(
  "examDb/tickTimer",
  async (_, { getState }) => {
    const { session } = getState().examDb;
    return examEngineDb.checkAutoSubmit(session); // null | {session, result}
  }
);

export const submitExamDb = createAsyncThunk(
  "examDb/submitExam",
  async (_, { getState }) => {
    const { session } = getState().examDb;
    return examEngineDb.submitExam(session); // {session, result}
  }
);

export const loadPembahasanDb = createAsyncThunk(
  "examDb/loadPembahasan",
  async (_, { getState }) => {
    const { session } = getState().examDb;
    return examEngineDb.getPembahasan(session);
  }
);

// ---------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------

const examSliceDb = createSlice({
  name: "examDb",
  initialState,
  reducers: {
    resetExamDb() {
      return initialState;
    },
    // BARU — update current_index instan di client (optimistic), tanpa
    // nunggu network. Hanya sentuh current_index; answers/flagged/status
    // tidak disentuh sama sekali, jadi tetap satu-satunya sumber
    // kebenaran untuk data itu tetap thunk+backend seperti sebelumnya.
    setCurrentIndexOptimistic(state, action) {
      if (state.session) {
        state.session = { ...state.session, current_index: action.payload };
      }
    },
    // BARU (v2) — update jawaban terpilih instan di client (optimistic),
    // sama seperti setCurrentIndexOptimistic. Hanya sentuh answers.
    setAnswerOptimistic(state, action) {
      if (state.session) {
        const { nomorSoal, jawaban } = action.payload;
        state.session = {
          ...state.session,
          answers: { ...(state.session.answers ?? {}), [nomorSoal]: jawaban },
        };
      }
    },
    // BARU (v3) — update status "ragu-ragu" instan di client (optimistic),
    // pola identik setAnswerOptimistic. Hanya sentuh flagged.
    setFlagOptimistic(state, action) {
      if (state.session) {
        const { nomorSoal, value } = action.payload;
        state.session = {
          ...state.session,
          flagged: { ...(state.session.flagged ?? {}), [nomorSoal]: value },
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startOrResumeExamDb.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(startOrResumeExamDb.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.mode === "resumed") {
          // Sesi LAMA yang masih aktif (refresh/buka lagi di tengah
          // jalan) — attempt_count dipercaya penuh dari backend
          // (/resume-session selalu mengirimnya), tidak perlu fallback.
          state.session = result.session;
          state.questions = result.questions;
          state.remainingSeconds = result.remainingSeconds;
          state.status = "ready";
          state.attemptCount = result.attemptCount ?? state.attemptCount;
        } else if (result.mode === "started") {
          // Sesi BARU (attempt pertama kali paket ini dikerjakan).
          // FIX (badge tidak muncul saat "sedang berlangsung"):
          // /create-session tidak selalu mengirim attempt_count (lihat
          // catatan sessionEngineDb.createSession) — kalau kosong,
          // hitung sendiri: attempt baru = attempt count yang sudah
          // diketahui (attempt-attempt sebelumnya yang sudah selesai,
          // di state.attemptCount) + 1. Untuk attempt pertama,
          // state.attemptCount awalnya 0, jadi hasilnya 1 — tetap benar.
          state.session = result.session;
          state.questions = result.questions;
          state.remainingSeconds = result.remainingSeconds;
          state.status = "ready";
          state.attemptCount = result.attemptCount || state.attemptCount + 1;
        } else {
          state.firstAttemptResult = result.firstAttemptResult ?? null;
          state.progressResult = result.progressResult ?? null;
          state.attemptCount = result.attemptCount ?? state.attemptCount;
          state.status = result.mode;

          // BARU — hidrasi session/questions/submitResult dari attempt
          // terakhir kalau backend mengirimnya (completedSession). Ini yang
          // membuat ExamResultPageDb bisa render ulang tanpa Redux state
          // lama (refresh browser / buka lagi besok), fix dokumen acuan
          // §8 poin 2. Kalau completedSession tidak ada (mis. race/limitasi
          // data lama), field ini tetap null seperti sebelumnya — tidak
          // breaking untuk kasus yang belum pernah tertangani.
          const cs = result.completedSession;
          if (cs) {
            state.session = cs.session;
            state.questions = cs.questions;
            state.submitResult = cs.result;
          }
        }
      })
      .addCase(startOrResumeExamDb.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })

      // BARU — startNewAttemptDb: pola SAMA seperti cabang 'started'
      // startOrResumeExamDb.fulfilled, PLUS reset submitResult/pembahasan
      // supaya popup/panel pembahasan dari attempt SEBELUMNYA tidak
      // "nyangkut" ke attempt yang baru saja dimulai.
      .addCase(startNewAttemptDb.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(startNewAttemptDb.fulfilled, (state, action) => {
        const result = action.payload;
        state.session = result.session;
        state.questions = result.questions;
        state.remainingSeconds = result.remainingSeconds;
        state.status = "ready";
        state.submitResult = null;
        state.pembahasan = null;
        // FIX (badge "Pengerjaan ke-X" nyangkut ke attempt sebelumnya +
        // lanjutan: tidak muncul sama sekali saat "sedang berlangsung"):
        // sama seperti cabang "started" di startOrResumeExamDb.fulfilled
        // di atas — /create-session tidak selalu mengirim attempt_count,
        // fallback ke state.attemptCount (attempt-attempt sebelumnya
        // yang sudah selesai) + 1 kalau backend tidak mengirimnya.
        state.attemptCount = result.attemptCount || state.attemptCount + 1;
      })
      .addCase(startNewAttemptDb.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })

      .addCase(answerQuestionDb.pending, (state, action) => {
        // BARU (v2) — catat requestId TERBARU untuk nomor_soal ini.
        const { nomorSoal } = action.meta.arg;
        state._latestAnswerReqId[nomorSoal] = action.meta.requestId;
      })
      .addCase(answerQuestionDb.fulfilled, (state, action) => {
        const { nomorSoal } = action.meta.arg;
        // BARU (v2) — kalau ada request lebih baru utk nomor_soal yg
        // sama sudah dikirim setelah ini, response ini stale -> abaikan.
        if (state._latestAnswerReqId[nomorSoal] !== action.meta.requestId) {
          return;
        }
        if (state.session) {
          // BARU (v2) — merge sempit: cuma ambil `answers` (+id) dari
          // response, JANGAN spread total, supaya tidak menimpa
          // current_index/flagged yang mungkin sedang diubah operasi lain
          // yang berjalan bersamaan.
          state.session = {
            ...state.session,
            id: action.payload.id ?? state.session.id,
            answers: action.payload.answers ?? state.session.answers,
          };
        }
      })
      .addCase(answerQuestionDb.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(toggleFlagDb.pending, (state, action) => {
        // BARU (v3) — catat requestId TERBARU untuk nomor_soal ini.
        const { nomorSoal } = action.meta.arg;
        state._latestFlagReqId[nomorSoal] = action.meta.requestId;
      })
      .addCase(toggleFlagDb.fulfilled, (state, action) => {
        const { nomorSoal } = action.meta.arg;
        // BARU (v3) — abaikan kalau ini response stale (sudah dilewati
        // request lebih baru utk nomor_soal yang sama).
        if (state._latestFlagReqId[nomorSoal] !== action.meta.requestId) {
          return;
        }
        if (state.session) {
          // Merge sempit: cuma `flagged` (+id), alasan sama seperti di atas.
          state.session = {
            ...state.session,
            id: action.payload.id ?? state.session.id,
            flagged: action.payload.flagged ?? state.session.flagged,
          };
        }
      })
      .addCase(toggleFlagDb.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(goToQuestionDb.pending, (state, action) => {
        // BARU (v2) — catat requestId TERBARU untuk operasi navigasi.
        state._latestGoToReqId = action.meta.requestId;
      })
      .addCase(goToQuestionDb.fulfilled, (state, action) => {
        // BARU (v2) — kalau sudah ada navigasi lebih baru dikirim setelah
        // ini, response ini stale -> abaikan (index sudah benar dari
        // optimistic update request yang lebih baru).
        if (state._latestGoToReqId !== action.meta.requestId) {
          return;
        }
        if (state.session) {
          // Merge sempit: cuma `current_index` (+id), alasan sama seperti
          // answerQuestionDb di atas.
          state.session = {
            ...state.session,
            id: action.payload.id ?? state.session.id,
            current_index:
              action.payload.current_index ?? state.session.current_index,
          };
        }
      })
      .addCase(goToQuestionDb.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // tickTimerDb — BARU: simpan juga submitResult kalau auto-submit terpicu.
      .addCase(tickTimerDb.fulfilled, (state, action) => {
        const autoSubmitResult = action.payload;
        if (autoSubmitResult) {
          state.session = autoSubmitResult.session;
          state.submitResult = autoSubmitResult.result;
          state.attemptCount =
            autoSubmitResult.result?.attempt_count ?? state.attemptCount;
          state.status = "submitted";
        }
      })
      .addCase(tickTimerDb.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // submitExamDb — BARU: simpan action.payload.result.
      .addCase(submitExamDb.pending, (state) => {
        state.status = "submitting";
      })
      .addCase(submitExamDb.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.submitResult = action.payload.result;
        state.attemptCount =
          action.payload.result?.attempt_count ?? state.attemptCount;
        state.status = "submitted";
      })
      .addCase(submitExamDb.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })

      .addCase(loadPembahasanDb.fulfilled, (state, action) => {
        state.pembahasan = action.payload;
      })
      .addCase(loadPembahasanDb.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  resetExamDb,
  setCurrentIndexOptimistic,
  setAnswerOptimistic,
  setFlagOptimistic,
} = examSliceDb.actions;
export default examSliceDb.reducer;

// ---------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------

export const selectSession = (state) => state.examDb.session;
export const selectQuestions = (state) => state.examDb.questions;
export const selectStatus = (state) => state.examDb.status;
export const selectRemainingSeconds = (state) => state.examDb.remainingSeconds;
export const selectAnswers = (state) => state.examDb.session?.answers ?? {};
export const selectFlagged = (state) => state.examDb.session?.flagged ?? {};
export const selectCurrentIndex = (state) =>
  state.examDb.session?.current_index ?? 0;
export const selectPembahasan = (state) => state.examDb.pembahasan;
export const selectFirstAttemptResult = (state) =>
  state.examDb.firstAttemptResult;
export const selectSubmitResult = (state) => state.examDb.submitResult; // BARU
export const selectAttemptCount = (state) => state.examDb.attemptCount; // BARU
export const selectProgressResult = (state) => state.examDb.progressResult; // BARU
