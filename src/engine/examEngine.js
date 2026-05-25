import { v4 as uuidv4 } from "uuid";
import { questionService } from "../services/questionService";
import { sessionEngine } from "./sessionEngine";
import { timerEngine } from "./timerEngine";
import { scoringEngine } from "./scoringEngine";
import { storageService } from "../services/storageService";

export const examEngine = {
  // buat sesi ujian
  createSession(paketId, duration = 60 * 60 * 1000) {
    const questions = questionService.getByPaket(paketId);

    const session = sessionEngine.initSession({
      sessionId: uuidv4(),
      paketId,
      questions,
      duration,
    });

    storageService.saveSession(session);
    return session;
  },

  // mulai sesi ujian
  startSession(session) {
    const started = sessionEngine.setStatus(
      timerEngine.start(session),
      "running"
    );

    storageService.saveSession(started);
    return started;
  },

  // submit sesi ujian
  submitSession(session) {
    const result = scoringEngine.calculateScore(
      session.questions,
      session.answers
    );

    const finishedSession = sessionEngine.setStatus(session, "finished");

    const finalResult = {
      sessionId: session.sessionId,
      ...result,
      status: finishedSession.status,
      finishedAt: Date.now(),
    };

    storageService.saveResult(finalResult);
    storageService.clearSession();

    return finalResult;
  },

  restoreSession() {
    return storageService.getSession();
  },

  resetSession() {
    storageService.clearSession();
  },
};
