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
    // Rata-rata skor PER KATEGORI paket (skd/twk/tiu/tkp), dipakai
    // DashboardCategoryScoreGrid. null = belum ada paket kategori itu
    // yang dikerjakan.
    categoryAverages: {
      skd: 425,
      twk: null,
      tiu: 398,
      tkp: null,
    },
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

  // Posisi relatif user, KHUSUS skor paket SKD, 3 cakupan sekaligus --
  // dipakai DashboardSkdRankingSection (pengganti "Top Peserta" lama).
  // Bentuk tiap cakupan lihat services/leaderboard/getSkdRanking.js.
  skdRanking: {
    national: {
      rank: 128,
      totalPeserta: 4820,
      avgScore: 425,
      percentile: 3,
    },
    province: {
      name: "Bengkulu",
      rank: 5,
      totalPeserta: 96,
      avgScore: 425,
      percentile: 6,
    },
    city: {
      name: "Kota Bengkulu",
      rank: 2,
      totalPeserta: 31,
      avgScore: 425,
      percentile: 7,
    },
  },

  // Riwayat multi-percobaan untuk tab "Performa" -- lihat catatan
  // sumber data di DashboardPerformanceTab.jsx (belum ditrack di
  // backend, ini contoh bagaimana tampilannya nanti begitu tersedia).
  attempts: [
    {
      packageId: "mock-1",
      packageTitle: "SKD Masterclass 2024",
      category: "skd",
      history: [
        { attemptNumber: 1, score: 380, date: "2024-05-01" },
        { attemptNumber: 2, score: 425, date: "2024-05-15" },
      ],
    },
  ],

  // Riwayat transaksi contoh untuk menu "Riwayat Transaksi" di tab
  // Akun -- bentuk sama persis dengan keluaran
  // services/payment/getTransactionHistory.js (lihat DashboardAccountTab
  // & DashboardTransactionHistoryCard).
  transactions: [
    {
      id: "mock-trx-1",
      orderId: "ORDER-ahmadsu-1715760000000",
      transactionId: "8a3c1e2b-mock-transaction-id-1",
      status: "success",
      amount: 49000,
      packageId: "mock-1",
      packageTitle: "SKD Masterclass 2024",
      paymentType: "bank_transfer",
      bank: "bca",
      vaNumber: "8808081234567890",
      paidAt: "2024-05-15T02:03:41.000Z",
      createdAt: "2024-05-15T02:00:00.000Z",
    },
    {
      id: "mock-trx-2",
      orderId: "ORDER-ahmadsu-1714521600000",
      transactionId: "8a3c1e2b-mock-transaction-id-2",
      status: "success",
      amount: 19000,
      packageId: "mock-2",
      packageTitle: "TIU Drill Intensif #1",
      paymentType: "qris",
      bank: null,
      vaNumber: null,
      paidAt: "2024-05-01T03:01:12.000Z",
      createdAt: "2024-05-01T03:00:00.000Z",
    },
  ],
};
