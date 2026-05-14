import { createSlice } from "@reduxjs/toolkit";


/*
set up awal 
--------------------------
session - data ujian
currentIndex - soal yang sedang dibuka
answers - jawaban user
flagged - tanda soal (ragu)
status - status ujian
remainingTime - sisa waktu
*/

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
    // rule of session
    setSession(state, action) {
      state.session = action.payload;
      state.currentIndex = action.payload.currentIndex;
      state.answers = action.payload.answers;
      state.flagged = action.payload.flagged;
      state.status = action.payload.status;
    },

    syncSession(state, action) {
      const session = action.payload;
      state.session = session;
      state.currentIndex = session.currentIndex;
      state.answers = session.answers;
      state.flagged = session.flagged;
    },
    
    //rule of current index
    setCurrentIndex(state, action) {
      state.currentIndex = action.payload;
      if (state.session) {
        state.session.currentIndex = action.payload;
      }
    },

    //rule of user answer
    setAnswer(state, action) {
      const { questionNumber, answer } = action.payload;

      state.answers[questionNumber] = answer;

      if (state.session) {
        state.session.answers[questionNumber] = answer;
      }
    },

    // rule of mark question
    toggleFlag(state, action) {
      const q = action.payload;

      state.flagged[q] = !state.flagged[q];

      if (state.session) {
        state.session.flagged[q] = state.flagged[q];
      }
    },

    //rule of exam status
    setStatus(state, action) {
      state.status = action.payload;

      if (state.session) {
        state.session.status = action.payload;
      }
    },

    //rule of time remaining 
    setRemainingTime(state, action) {
      state.remainingTime = action.payload;
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
