const ACTIVE_SESSION_KEY = "active_exam_session";
const RESULT_KEY = "exam_results";

export const storageService = {
  saveSession(session) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  },

  getSession() {
    const data = localStorage.getItem(ACTIVE_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearSession() {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  },

  saveResult(result) {
    const old = JSON.parse(localStorage.getItem(RESULT_KEY) || "[]");
    old.push(result);
    localStorage.setItem(RESULT_KEY, JSON.stringify(old));
  },
};
