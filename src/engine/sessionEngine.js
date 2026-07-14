export const sessionEngine = {
  // status constants
  STATUS: {
    READY: "ready",
    RUNNING: "running",
    FINISHED: "finished",
  },

  // buat session baru
  initSession({ sessionId, paketId, paketNama, questions, duration }) {
    return {
      sessionId,
      paketId,
      // Nama asli paket (mis. "Mini SKD 1"), dipakai ExamTopbar.jsx dkk
      // supaya tidak perlu nebak/bangun ulang teks dari paketId.
      // Fallback null kalau pemanggil lama belum kirim ini.
      paketNama: paketNama ?? null,
      questions,

      answers: {},
      flagged: {},

      currentIndex: 0,

      status: "ready",

      startTime: null,
      duration,
    };
  },

  // update jawaban
  updateAnswer(session, questionNumber, answer) {
    return {
      ...session,
      answers: {
        ...session.answers,
        [questionNumber]: answer,
      },
    };
  },

  // toggle flag soal
  toggleFlag(session, questionNumber) {
    return {
      ...session,
      flagged: {
        ...session.flagged,
        [questionNumber]: !session.flagged[questionNumber],
      },
    };
  },

  // pindah soal
  setCurrentIndex(session, index) {
    return {
      ...session,
      currentIndex: index,
    };
  },

  // update status (NEW)
  setStatus(session, status) {
    return {
      ...session,
      status,
    };
  },
};
