export const scoringEngine = {
  calculateScore(questions, answers) {
    let totalScore = 0;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    let twkScore = 0;
    let tiuScore = 0;
    let tkpScore = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.nomor];

      // unanswered
      if (!userAnswer) {
        unanswered++;
        return;
      }

      // ======================
      // TKP MODE
      // ======================
      if (q.mode === "TKP") {
        const point = q.scoringMap?.[userAnswer] || 0;

        tkpScore += point;
        totalScore += point;

        return;
      }

      // ======================
      // TWK / TIU MODE
      // ======================
      if (userAnswer === q.jawabanBenar) {
        correct++;

        const point = q.poin || 0;
        totalScore += point;

        if (q.kategori === "TWK") twkScore += point;
        if (q.kategori === "TIU") tiuScore += point;
      } else {
        wrong++;
      }
    });

    return {
      totalScore,
      twkScore,
      tiuScore,
      tkpScore,
      correct,
      wrong,
      unanswered,
      total: questions.length,
    };
  },
};
