
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  session: null,
  currentIndex: 0,
  answers: {},
  flagged: {},
  status: "idle",
  remainingTime: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setSession(state, action) {
      const session = action.payload;

      state.session = session;
      state.currentIndex = session?.currentIndex ?? 0;
      state.answers = session?.answers ?? {};
      state.flagged = session?.flagged ?? {};
      state.status = session?.status ?? "idle";
    },

    syncSession(state, action) {
      const session = action.payload;

      state.session = session;
      state.currentIndex = session?.currentIndex ?? state.currentIndex;
      state.answers = session?.answers ?? state.answers;
      state.flagged = session?.flagged ?? state.flagged;
      state.status = session?.status ?? state.status;
    },

    setCurrentIndex(state, action) {
      state.currentIndex = action.payload;

      if (state.session) {
        state.session = {
          ...state.session,
          currentIndex: action.payload,
        };
      }
    },

    setAnswer(state, action) {
      const { questionNumber, answer } = action.payload;

      state.answers = {
        ...state.answers,
        [questionNumber]: answer,
      };

      if (state.session) {
        state.session = {
          ...state.session,
          answers: {
            ...state.session.answers,
            [questionNumber]: answer,
          },
        };
      }
    },

    toggleFlag(state, action) {
      const q = action.payload;

      state.flagged = {
        ...state.flagged,
        [q]: !state.flagged[q],
      };

      if (state.session) {
        state.session = {
          ...state.session,
          flagged: {
            ...state.session.flagged,
            [q]: !state.session.flagged?.[q],
          },
        };
      }
    },

    setStatus(state, action) {
      state.status = action.payload;

      if (state.session) {
        state.session = {
          ...state.session,
          status: action.payload,
        };
      }
    },

    setRemainingTime(state, action) {
      state.remainingTime = action.payload;

      if (state.session) {
        state.session = {
          ...state.session,
          remainingTime: action.payload,
        };
      }
    },

    resetExam() {
      return initialState;
    },
  },
});

export const {
  setSession,
  syncSession,
  setCurrentIndex,
  setAnswer,
  toggleFlag,
  setStatus,
  setRemainingTime,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
