export const scoringEngine = {
  calculateScore(questions, answers) {
    let score = 0;
    let correct = 0;
    let wrong = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.nomor];

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
      total: questions.length,
    };
  },
};
