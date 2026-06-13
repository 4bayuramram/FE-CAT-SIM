export const scoringEngine = {
  calculateScore(questions, answers) {
    let totalScore = 0;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    // =========================
    // TWK / TIU SUMMARY
    // =========================

    let twkCorrect = 0;
    let twkWrong = 0;

    let tiuCorrect = 0;
    let tiuWrong = 0;

    // =========================
    // TKP SUMMARY
    // =========================

    const tkpStats = {
      score5: 0,
      score4: 0,
      score3: 0,
      score2: 0,
      score1: 0,
      totalScore: 0,
    };

    const categoryScores = {};
    const categoryMaxScores = {};
    const topicStats = {};

    questions.forEach((q) => {
      const userAnswer = answers[q.nomor];

      const isTKP =
        q.mode === "TKP" || q.kategori?.toUpperCase().includes("TKP");

      const isTWK =
        q.mode === "TWK" || q.kategori?.toUpperCase().includes("TWK");

      const isTIU =
        q.mode === "TIU" || q.kategori?.toUpperCase().includes("TIU");

      // INIT TOPIC

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = {
          kategori: q.kategori,
          total: 0,
          unanswered: 0,

          // TWK/TIU
          correct: 0,
          wrong: 0,

          // TKP
          score5: 0,
          score4: 0,
          score3: 0,
          score2: 0,
          score1: 0,
          totalScore: 0,
        };
      }

      const t = topicStats[q.topic];
      // MAX SCORE CATEGORY
 
      let maxPoint = 0;

      if (isTKP) {
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

      // TKP

      if (isTKP) {
        const point = q.scoringMap?.[userAnswer] || 0;

        totalScore += point;

        categoryScores[q.kategori] = (categoryScores[q.kategori] || 0) + point;

        tkpStats.totalScore += point;
        t.totalScore += point;

        if (point === 5) {
          tkpStats.score5++;
          t.score5++;
        } else if (point === 4) {
          tkpStats.score4++;
          t.score4++;
        } else if (point === 3) {
          tkpStats.score3++;
          t.score3++;
        } else if (point === 2) {
          tkpStats.score2++;
          t.score2++;
        } else if (point === 1) {
          tkpStats.score1++;
          t.score1++;
        }

        t.total++;

        return;
      }

      // TWK / TIU
      const isCorrect = userAnswer === q.jawabanBenar;

      if (isCorrect) {
        correct++;

        const point = q.poin || 0;

        totalScore += point;

        categoryScores[q.kategori] = (categoryScores[q.kategori] || 0) + point;

        t.correct++;
        t.total++;

        if (isTWK) twkCorrect++;
        if (isTIU) tiuCorrect++;
      } else {
        wrong++;

        t.wrong++;
        t.total++;

        if (isTWK) twkWrong++;
        if (isTIU) tiuWrong++;
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

      twkCorrect,
      twkWrong,

      tiuCorrect,
      tiuWrong,

      tkpStats,
    };
  },
};
