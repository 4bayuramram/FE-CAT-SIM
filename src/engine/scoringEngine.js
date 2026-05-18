export const scoringEngine = {
  calculateScore(questions, answers) {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.nomor];

      // =========================
      // UNANSWERED CHECK (GLOBAL)
      // =========================
      if (!userAnswer) {
        unanswered++;
        return;
      }

      // =========================
      // TKP MODE (DATA DRIVEN)
      // =========================
      if (q.mode === "TKP") {
        const tkpMap = q.scoringMap;

        if (tkpMap) {
          score += tkpMap[userAnswer] || 0;
        }

        return;
      }

      // =========================
      // TWK / TIU MODE (NORMAL)
      // =========================
      if (userAnswer === q.jawabanBenar) {
        score += q.poin;
        correct++;
      } else {
        wrong++;
      }
    });

    return {
      score,
      correct,
      wrong,
      unanswered,
      total: questions.length,
    };
  },
};
