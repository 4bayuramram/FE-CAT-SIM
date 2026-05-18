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
    //memasukkan/mensinkronkan seluruh data session ujian ke Redux state
    setSession(state, action) {
      state.session = action.payload;
      state.currentIndex = action.payload.currentIndex;
      state.answers = action.payload.answers;
      state.flagged = action.payload.flagged;
      state.status = action.payload.status;
    },

    //singkroniasai redux dengan sesi terbaru
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

    //menyimpan jawaban user ke state
    setAnswer(state, action) {
      const { questionNumber, answer } = action.payload;

      state.answers[questionNumber] = answer;

      if (state.session) {
        state.session.answers[questionNumber] = answer;
      }
    },

    // menandai dan cancel soal yang dianggap ragu
    toggleFlag(state, action) {
      const q = action.payload;

      state.flagged[q] = !state.flagged[q];

      if (state.session) {
        state.session.flagged[q] = state.flagged[q];
      }
    },

    // mengubah status ujian dan memastikan Redux + session tetap sama.
    setStatus(state, action) {
      state.status = action.payload;

      if (state.session) {
        state.session.status = action.payload;
      }
    },

    // menyimpan dan menampilkan sisa waktu ujian di UI.
    setRemainingTime(state, action) {
      state.remainingTime = action.payload;
    },

    //mengembalikan state ujian ke kondisi awal (reset total)
    resetExam() {
      return initialState;
    },
  },
});


//membuat fungsi Redux bisa digunakan di UI
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
//mengirim reducer agar Redux store bisa menggunakan state exam