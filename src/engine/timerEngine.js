export const timerEngine = {
  start(session) {
    return {
      ...session,
      startTime: Date.now(),
      status: "running",
    };
  },

  getRemainingTime(session) {
    if (!session.startTime) return session.duration;

    const elapsed = Date.now() - session.startTime;
    return Math.max(session.duration - elapsed, 0);
  },

  isExpired(session) {
    return this.getRemainingTime(session) <= 0;
  },
};
