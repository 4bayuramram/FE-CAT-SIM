/**
 * mockResultData.js
 *
 * DATA HARDCODE / PERUMPAMAAN — dokumen acuan §8 sudah menandai bahwa
 * statistik per topik dari DB belum dirancang sama sekali (belum ada
 * kolom kategori-terverifikasi, belum ada agregasi per topik/cluster di
 * backend). Jadi UI ExamResultPageDb dibangun DULU dengan bentuk data
 * (shape) yang MASUK AKAL untuk versi final, diisi angka contoh di sini,
 * supaya begitu backend siap, penggantiannya cukup:
 *
 *   ganti `import { MOCK_RESULT } from ".../mockResultData"`
 *   jadi   `const result = useSelector(selectResultStatistics)` (nanti)
 *
 * tanpa perlu bongkar komponen manapun — semua komponen di folder ini
 * murni terima props sesuai shape MOCK_RESULT, tidak tahu-menahu soal
 * mock vs asli.
 */
export const MOCK_RESULT = {
  candidateName: "Bayu Ramadhan",
  examDate: "24 Agt 2024",
  sessionLabel: "PERTAMA",

  totalScore: 421,
  maxScore: 550, // TKP(225) + TIU(175) + TWK(150) = 550
  passingGrade: 370,
  percentile: 89,

  correct: 84,
  wrong: 11,
  unanswered: 5,

  // TKP: distribusi poin per pilihan (skema umum SKD: +5..+1, tidak ada 0/salah)
  tkp: {
    score: 192,
    maxScore: 225,
    pointDistribution: [
      { points: 5, count: 32 },
      { points: 4, count: 10 },
      { points: 3, count: 3 },
      { points: 2, count: 0 },
      { points: 1, count: 0 },
    ],
  },

  // Kategori non-TKP (benar/salah biasa) — bentuk generik, bukan hardcode
  // "cuma 2 kategori", supaya kalau paket punya kategori lain jumlahnya
  // tetap fleksibel.
  categories: [
    {
      code: "TIU",
      label: "Tes Intelegensia Umum",
      tag: "LOGIC",
      colorKey: "primary",
      score: 145,
      maxScore: 175,
    },
    {
      code: "TWK",
      label: "Tes Wawasan Kebangsaan",
      tag: "NATIONALISM",
      colorKey: "tertiary",
      score: 84,
      maxScore: 150,
    },
  ],

  // Topik/cluster — granularitas di bawah kategori. questionBreakdown
  // opsional (hanya diisi kalau user expand & datanya tersedia).
  topics: [
    {
      id: "pelayanan-publik",
      name: "Pelayanan Publik",
      groupCode: "TKP",
      questionCount: 10,
      focusLabel: "Strategy Focus",
      correct: 48,
      total: 50,
      proficiencyLabel: "High Proficiency",
      colorKey: "secondary",
      questionBreakdown: [
        { label: "Q1", points: "+5" },
        { label: "Q2", points: "+5" },
        { label: "Q3", points: "+5" },
        { label: "Q4", points: "+4" },
        { label: "Q5", points: "+4" },
      ],
    },
    {
      id: "penalaran-analitis",
      name: "Penalaran Analitis",
      groupCode: "TIU",
      questionCount: 15,
      focusLabel: "Logic Cluster",
      correct: 65,
      total: 75,
      proficiencyLabel: "Solid Logic",
      colorKey: "primary",
      questionBreakdown: [],
    },
    {
      id: "pilar-negara",
      name: "Pilar Negara",
      groupCode: "TWK",
      questionCount: 12,
      focusLabel: "History Focus",
      correct: 40,
      total: 60,
      proficiencyLabel: "Needs Improvement",
      colorKey: "error",
      questionBreakdown: [],
    },
  ],
};
