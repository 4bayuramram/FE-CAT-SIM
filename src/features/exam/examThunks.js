import { createAsyncThunk } from "@reduxjs/toolkit";
import { examEngine } from "../../engine/examEngine";
import { sessionEngine } from "../../engine/sessionEngine";
import { storageService } from "../../services/storageService";

// =========================
// LOAD SESSION (restore)
// =========================
export const loadSession = createAsyncThunk(
  "exam/loadSession",
  async (_, { rejectWithValue }) => {
    try {
      const session = examEngine.restoreSession();
      return session || null;
    } catch (err) {
      return rejectWithValue("Failed to load session");
    }
  }
);

// =========================
// CREATE NEW SESSION
// =========================
export const createSession = createAsyncThunk(
  "exam/createSession",
  async ({ paketId, duration }, { rejectWithValue }) => {
    try {
      const session = examEngine.createSession(paketId, duration);
      return session;
    } catch (err) {
      return rejectWithValue("Failed to create session");
    }
  }
);

// =========================
// START SESSION
// =========================
export const startSession = createAsyncThunk(
  "exam/startSession",
  async (session, { rejectWithValue }) => {
    try {
      const started = examEngine.startSession(session);
      return started;
    } catch (err) {
      return rejectWithValue("Failed to start session");
    }
  }
);

// =========================
// SUBMIT EXAM
// =========================
export const submitExam = createAsyncThunk(
  "exam/submitExam",
  async (session, { rejectWithValue }) => {
    try {
      const result = examEngine.submitSession(session);
      return result;
    } catch (err) {
      return rejectWithValue("Failed to submit exam");
    }
  }
);

// =========================
// SAVE ANSWER (future API)
// =========================
export const saveAnswerAsync = createAsyncThunk(
  "exam/saveAnswer",
  async ({ session, questionNumber, answer }, { rejectWithValue }) => {
    try {
      const updated = sessionEngine.updateAnswer(
        session,
        questionNumber,
        answer
      );

      storageService.saveSession(updated);

      return updated;
    } catch (err) {
      return rejectWithValue("Failed to save answer");
    }
  }
);

// =========================
// TOGGLE FLAG (future API)
// =========================
export const toggleFlagAsync = createAsyncThunk(
  "exam/toggleFlag",
  async ({ session, questionNumber }, { rejectWithValue }) => {
    try {
      const updated = sessionEngine.toggleFlag(session, questionNumber);

      storageService.saveSession(updated);

      return updated;
    } catch (err) {
      return rejectWithValue("Failed to toggle flag");
    }
  }
);

// =========================
// RESET SESSION
// =========================
export const resetSession = createAsyncThunk("exam/resetSession", async () => {
  examEngine.resetSession();
  return true;
});
