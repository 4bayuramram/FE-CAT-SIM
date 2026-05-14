import { sessionEngine } from "../engine/sessionEngine";
import { storageService } from "./storageService";

/**
 * SESSION SERVICE = orchestration layer
 * - menghubungkan engine + storage
 * - tidak punya logic bisnis berat
 */
export const sessionService = {
  // =========================
  // CREATE NEW SESSION
  // =========================
  createSession({ sessionId, paketId, questions, duration }) {
    const session = sessionEngine.initSession({
      sessionId,
      paketId,
      questions,
      duration,
    });

    storageService.saveSession(session);
    return session;
  },

  // =========================
  // RESTORE SESSION
  // =========================
  restoreSession() {
    return storageService.getSession();
  },

  // =========================
  // START SESSION (timer ready)
  // =========================
  startSession(session) {
    const started = {
      ...session,
      status: "active",
      startTime: Date.now(),
    };

    storageService.saveSession(started);
    return started;
  },

  // =========================
  // UPDATE ANSWER
  // =========================
  updateAnswer(session, questionNumber, answer) {
    const updated = sessionEngine.updateAnswer(session, questionNumber, answer);

    storageService.saveSession(updated);
    return updated;
  },

  // =========================
  // TOGGLE FLAG
  // =========================
  toggleFlag(session, questionNumber) {
    const updated = sessionEngine.toggleFlag(session, questionNumber);

    storageService.saveSession(updated);
    return updated;
  },

  // =========================
  // NAVIGATION
  // =========================
  setCurrentIndex(session, index) {
    const updated = sessionEngine.setCurrentIndex(session, index);

    storageService.saveSession(updated);
    return updated;
  },

  // =========================
  // CLEAR SESSION
  // =========================
  clearSession() {
    storageService.clearSession();
  },
};
