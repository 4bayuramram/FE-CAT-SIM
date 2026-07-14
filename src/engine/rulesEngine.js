import { timerEngine } from "./timerEngine";

export const rulesEngine = {
  canSubmit(session) {
    return session.status === "running";
  },

  // BUGFIX: sebelumnya salah manggil sessionEngine.isExpired (method itu
  // sebenarnya milik timerEngine), akibatnya selalu undefined dan
  // auto-submit gak pernah ke-trigger dari sini.
  shouldAutoSubmit(session) {
    if (!session || session.status !== "running") return false;
    return timerEngine.isExpired(session);
  },

  isValidAnswer(answer) {
    return ["a", "b", "c", "d", "e"].includes(answer);
  },
};
