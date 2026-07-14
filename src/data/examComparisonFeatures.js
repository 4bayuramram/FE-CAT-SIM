// Konten checklist untuk panel perbandingan "Ujian Gratis (Simulasi)" vs
// "Ujian Berbayar (Try Out)" yang tampil sebelum user mulai ujian pada
// jalur hardcode/non-DB (src/pages/ExamPage.jsx).
//
// Sengaja dipisah dari komponennya supaya tim non-engineer / marketing bisa
// update copy tanpa perlu sentuh kode React.
//
// `showInFree`: kontrol baris mana yang ditampilkan di card "Ujian Gratis".
// Card "Ujian Berbayar" SELALU menampilkan semua baris (tidak difilter),
// supaya list gratis bisa dibuat lebih pendek/ringkas tanpa mengurangi
// data pada sisi berbayar. Set `false` untuk sembunyikan baris dari card
// gratis saja.

export const examComparisonFeatures = [
  {
    label: "Level & jenis soal",
    free: "Lower Order Thinking Skills (LOTS) - Middle Order Thinking Skills (MOTS)",
    paid: "Higher Order Thinking Skills (HOTS)  - ultra HOTS",
    showInFree: true,
  },
  {
    label: "Tujuan utama",
    free: "Beradaptasi dengan sistem CAT dan berlatih pola soal",
    paid: "Mengukur kemampuan & kesiapan seleksi",
    showInFree: true,
  },
  {
    label: "Skor & pembahasan",
    free: "tidak ada pembahasan",
    paid: "Skor + pembahasan mendalam per topik",
    showInFree: true,
  },
  {
    label: "Analisis topik hasil ujian",
    free: "Ringkasan singkat (tanpa grafik)",
    paid: "Analisis topik detail per cluster, lengkap dengan grafik visual",
    showInFree: true,
  },
  {
    label: "Leaderboard / perangkingan",
    free: false,
    paid: true,
    showInFree: false,
  },
  {
    label: "Riwayat tersimpan ke akun",
    free: false,
    paid: true,
    showInFree: false,
  },
  {
    label: "Sinkron lintas perangkat",
    free: "progres tidak tersimpan ke akun.",
    paid: "Ya, hasil ujian dan progres tersimpan ke akun & bisa diakses dari perangkat lain",
    showInFree: true,
  },
  {
    label: "Jumlah paket soal",
    free: "Terbatas",
    paid: "Lengkap & terus diperbarui",
    showInFree: false,
  },
];

// Fitur TAMBAHAN yang HANYA dimiliki paket berbayar (tidak punya padanan
// di paket gratis sama sekali). Dipisah dari `examComparisonFeatures`
// (yang baris-nya selalu simetris kiri-kanan) supaya card "Ujian Berbayar"
// bisa tampil lebih panjang/lebih kaya fitur daripada card "Ujian Gratis",
// bukan cuma beda teks di baris yang sama.
export const paidOnlyFeatures = [
  "Laporan hasil bisa diunduh (PDF)",
];

// Disclaimer yang tampil di bawah dua card perbandingan.
export const freeExamDisclaimer =
  "Simulasi ini murni untuk membiasakan kamu dengan pola dan alur ujian CAT. " +
  "Skor pada simulasi gratis TIDAK mencerminkan skor atau tingkat kesiapan " +
  "sebenarnya untuk seleksi. Hasil tidak tercatat di leaderboard resmi. " +
  "Untuk mengukur kemampuan secara akurat dengan soal HOTS/ultra-HOTS, " +
  "gunakan paket try out berbayar.";
