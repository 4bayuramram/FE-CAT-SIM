/**
 * mockDashboardData.js
 *
 * Data contoh (hardcode) untuk halaman Dashboard, dipakai sebagai
 * FALLBACK oleh DashboardPageContainer ketika data asli dari Supabase
 * belum ada (mis. user belum pernah beli paket, tabel masih kosong
 * saat development, atau query gagal). Pola sama seperti
 * components/result/mockResultData.js (MOCK_RESULT) yang sudah ada di
 * project ini.
 *
 * PENTING -- future-proof: bentuk object ini SAMA PERSIS dengan bentuk
 * data asli yang disusun DashboardPageContainer (lihat komentar
 * props di DashboardPageDb.jsx). Begitu data asli tersedia, tidak ada
 * perubahan apa pun yang dibutuhkan di komponen manapun -- cukup
 * DashboardPageContainer berhenti memakai fallback ini.
 *
 * `featuredLeaderboard.rows` sengaja mengikuti bentuk keluaran
 * services/leaderboard/mapToLeaderboardRows.js (rank, id, name,
 * avatarUrl, location, score, duration, variant) supaya
 * DashboardMiniLeaderboardCard tidak perlu tahu bedanya data asli vs
 * contoh.
 */

export const MOCK_DASHBOARD_DATA = {
  isMock: true,

  profile: {
    name: "Ahmad Sujadi",
    email: "ahmad.sujadi@contoh.id",
    avatarUrl: null,
    domicile: "Kota Bengkulu, Bengkulu",
  },

  stats: {
    totalPackages: 4,
    attemptedPackages: 2,
    avgScore: 412,
    bestRank: 3,
  },

  nextPackage: { id: "mock-3", title: "Try Out Akbar Vol. 2" },

  packages: [
    {
      id: "mock-1",
      title: "SKD Masterclass 2024",
      category: "skd",
      questionCount: 110,
      durationMinutes: 100,
      attempted: true,
      score: 425,
      rank: 3,
    },
    {
      id: "mock-2",
      title: "TIU Drill Intensif #1",
      category: "tiu",
      questionCount: 35,
      durationMinutes: 40,
      attempted: true,
      score: 398,
      rank: 12,
    },
    {
      id: "mock-3",
      title: "Try Out Akbar Vol. 2",
      category: "skd",
      questionCount: 110,
      durationMinutes: 100,
      attempted: false,
      score: null,
      rank: null,
    },
    {
      id: "mock-4",
      title: "TWK Fokus Pancasila & UUD 1945",
      category: "twk",
      questionCount: 30,
      durationMinutes: 30,
      attempted: false,
      score: null,
      rank: null,
    },
  ],

  scoreSummaryRows: [
    { id: "mock-1", title: "SKD Masterclass 2024", category: "skd", score: 425, rank: 3 },
    { id: "mock-2", title: "TIU Drill Intensif #1", category: "tiu", score: 398, rank: 12 },
  ],

  featuredLeaderboard: {
    packageTitle: "SKD Masterclass 2024",
    rows: [
      {
        rank: 1,
        id: "mock-user-1",
        name: "Riana Putri",
        avatarUrl: null,
        location: "Jakarta Selatan - DKI Jakarta",
        score: 495,
        duration: "78m",
        variant: "normal",
      },
      {
        rank: 2,
        id: "mock-user-2",
        name: "Budi Santoso",
        avatarUrl: null,
        location: "Surabaya - Jawa Timur",
        score: 488,
        duration: "82m",
        variant: "normal",
      },
      {
        rank: 3,
        id: "mock-user-self",
        name: "Ahmad Sujadi",
        avatarUrl: null,
        location: "Kota Bengkulu - Bengkulu",
        score: 425,
        duration: "90m",
        variant: "current",
      },
    ],
    currentUserRow: {
      rank: 3,
      id: "mock-user-self",
      name: "Ahmad Sujadi",
      avatarUrl: null,
      location: "Kota Bengkulu - Bengkulu",
      score: 425,
      duration: "90m",
      variant: "current",
    },
  },
};
