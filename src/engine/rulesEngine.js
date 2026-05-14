export const rulesEngine = {
  canSubmit(session) {
    return session.status === "running";
  },

  shouldAutoSubmit(session) {
    return sessionEngine?.isExpired?.(session);
  },

  isValidAnswer(answer) {
    return ["a", "b", "c", "d", "e"].includes(answer);
  },
};
