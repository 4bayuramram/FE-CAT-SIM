export const scoringEngine = {
  calculateScore(questions, answers) {
    let totalScore = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const categoryScores = {};
    const categoryMaxScores = {};
    const topicStats = {};

    questions.forEach((q) => {
      const userAnswer = answers[q.nomor];

      // INIT TOPIC STATS (WAJIB KONSISTEN)
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = {
          kategori: q.kategori,
          correct: 0,
          wrong: 0,
          unanswered: 0,
          total: 0,
        };
      }

      const t = topicStats[q.topic];

      // MAX SCORE PER KATEGORI
      let maxPoint = 0;
      if (q.mode === "TKP") {
        maxPoint = Math.max(...Object.values(q.scoringMap || {}));
      } else {
        maxPoint = q.poin || 0;
      }

      categoryMaxScores[q.kategori] =
        (categoryMaxScores[q.kategori] || 0) + maxPoint;

      // UNANSWERED
      if (!userAnswer) {
        unanswered++;
        t.unanswered++;
        t.total++;
        return;
      }

      // TKP MODE
      if (q.mode === "TKP") {
        const point = q.scoringMap?.[userAnswer] || 0;

        categoryScores[q.kategori] = (categoryScores[q.kategori] || 0) + point;

        totalScore += point;

        t.total++;
        t.correct += point === maxPoint ? 1 : 0;
        t.wrong += point < maxPoint ? 1 : 0;

        return;
      }

      // TWK / TIU MODE
      if (userAnswer === q.jawabanBenar) {
        correct++;
        const point = q.poin || 0;

        categoryScores[q.kategori] = (categoryScores[q.kategori] || 0) + point;

        totalScore += point;

        t.correct++;
        t.total++;
      } else {
        wrong++;
        t.wrong++;
        t.total++;
      }
    });

    return {
      totalScore,
      correct,
      wrong,
      unanswered,
      total: questions.length,
      categoryScores,
      categoryMaxScores,
      topicStats,
    };
  },
};
