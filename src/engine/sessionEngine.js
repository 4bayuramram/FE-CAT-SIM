export const sessionEngine = {
  // status constants
  STATUS: {
    READY: "ready",
    RUNNING: "running",
    FINISHED: "finished",
  },

  // buat session baru
  initSession({ sessionId, paketId, questions, duration }) {
    return {
      sessionId,
      paketId,
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
