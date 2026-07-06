import { configureStore } from "@reduxjs/toolkit";
import examReducer from "../features/exam/examSlice"; // sistem lama (sumber data statis)
import examDbReducer from "../features/exam/examSliceDb"; // sistem baru (sumber data DB)

export const store = configureStore({
  reducer: {
    exam: examReducer,
    examDb: examDbReducer,
  },
});