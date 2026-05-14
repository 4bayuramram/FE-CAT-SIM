import { createSelector } from "@reduxjs/toolkit";

// base selector
export const selectExam = (state) => state.exam;

export const selectSession = createSelector(
  [selectExam],
  (exam) => exam.session
);

export const selectQuestions = createSelector(
  [selectSession],
  (session) => session?.questions || []
);

export const selectCurrentIndex = createSelector(
  [selectExam],
  (exam) => exam.currentIndex
);

export const selectCurrentQuestion = createSelector(
  [selectQuestions, selectCurrentIndex],
  (questions, index) => questions?.[index] || null
);

export const selectAnswers = createSelector(
  [selectExam],
  (exam) => exam.answers || {}
);

export const selectFlagged = createSelector(
  [selectExam],
  (exam) => exam.flagged || {}
);

export const selectStatus = createSelector([selectExam], (exam) => exam.status);

export const selectRemainingTime = createSelector(
  [selectExam],
  (exam) => exam.remainingTime
);

// derived
export const selectTotalQuestions = createSelector(
  [selectQuestions],
  (questions) => questions.length
);

export const selectAnsweredCount = createSelector(
  [selectAnswers],
  (answers) => Object.keys(answers).length
);

export const selectProgress = createSelector(
  [selectAnsweredCount, selectTotalQuestions],
  (answered, total) => ({
    answered,
    total,
    percent: total ? Math.round((answered / total) * 100) : 0,
  })
);

export const selectIsFlagged = (questionNumber) =>
  createSelector([selectFlagged], (flagged) => !!flagged?.[questionNumber]);

export const selectAnswerByQuestion = (questionNumber) =>
  createSelector([selectAnswers], (answers) => answers?.[questionNumber]);
