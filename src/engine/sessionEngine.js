export const sessionEngine = {
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

  updateAnswer(session, questionNumber, answer) {
    return {
      ...session,
      answers: {
        ...session.answers,
        [questionNumber]: answer,
      },
    };
  },

  toggleFlag(session, questionNumber) {
    return {
      ...session,
      flagged: {
        ...session.flagged,
        [questionNumber]: !session.flagged[questionNumber],
      },
    };
  },

  setCurrentIndex(session, index) {
    return {
      ...session,
      currentIndex: index,
    };
  },
};
