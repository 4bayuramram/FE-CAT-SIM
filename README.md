# CPNZ — Platform Try Out CAT CPNS

CPNZ adalah platform simulasi ujian CAT (Computer Assisted Test) untuk seleksi CPNS, menyediakan try out SKD (TWK, TIU, TKP) dengan sistem penilaian, peringkat, dan pembahasan soal — dibangun untuk membantu peserta berlatih dalam kondisi yang mendekati ujian sesungguhnya.

🔗 **Live demo:** [cpnz.my.id](https://cpnz.my.id)

## Fitur Utama

- **Simulasi Ujian CAT** — timer real-time, navigasi soal, auto-submit saat waktu habis
- **Try Out Gratis & Berbayar** — beberapa paket latihan gratis (non-DB) tanpa perlu login, paket premium tersimpan di database dengan sistem akses per user
- **Penilaian Otomatis** — skor per subtes (TWK/TIU/TKP), status kelulusan berdasarkan passing grade aktif, dan pembahasan tiap soal
- **Leaderboard & Peringkat** — peringkat nasional, provinsi, dan kabupaten/kota berbasis skor SKD
- **Dashboard Peserta** — ringkasan progres, riwayat skor, performa antar percobaan, dan riwayat transaksi
- **Pembayaran Terintegrasi** — checkout paket premium via Midtrans, webhook otomatis untuk aktivasi akses
- **Notifikasi Real-time** — pemberitahuan hasil ujian & status pembayaran tanpa perlu refresh halaman
- **Autentikasi** — login manual dan Google OAuth, dengan pengisian data domisili wajib untuk keperluan peringkat wilayah

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL, Auth, Realtime) |
| Serverless Function | Cloudflare Workers (webhook pembayaran) |
| Payment Gateway | Midtrans |
| Rendering Matematika | KaTeX |
| PDF Generation | react-pdf (struk transaksi & hasil ujian) |

## Struktur Proyek

```
src/
├── components/       # Komponen UI per fitur (dashboard, exam, leaderboard, dll)
├── pages/             # Halaman utama (auth, payment, dashboard, simulasi)
├── services/          # Fungsi query ke Supabase (auth, payment, leaderboard)
├── engine/            # Logika eksekusi soal untuk paket try out gratis (non-DB)
├── lib/               # Klien Supabase & util inti
├── utils/             # Helper functions (format, validasi, transformasi data)
├── hooks/             # Custom React hooks
├── routes/            # Definisi routing aplikasi
└── data/              # Data soal untuk paket try out gratis
```

## Menjalankan Secara Lokal

### Prasyarat
- Node.js 18+
- Akun [Supabase](https://supabase.com) (untuk database & auth)
- Akun [Midtrans](https://midtrans.com) sandbox (opsional, untuk fitur pembayaran)

### Instalasi

```bash
git clone https://github.com/<username>/cpnz.git
cd cpnz
npm install
```

### Konfigurasi Environment

Buat file `.env` di root project:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Anon key Supabase aman diekspos ke client selama Row Level Security (RLS) aktif di seluruh tabel. Secret key (service role, Midtrans server key) disimpan terpisah di environment Cloudflare Worker, tidak pernah masuk ke kode frontend.

### Jalankan Development Server

```bash
npm run dev
```

## Skema Database (Ringkas)

Beberapa tabel utama di Supabase:
- `user_profile` — data profil & domisili peserta
- `packages` — daftar paket try out premium
- `user_package_access` — kepemilikan akses paket per user
- `exam_results` — hasil ujian & skor per subtes
- `payments` — riwayat transaksi Midtrans
- `notifications` — notifikasi real-time per user

Semua tabel dilindungi RLS policy agar user hanya bisa mengakses datanya sendiri.

## Lisensi

Project ini dibuat untuk keperluan portofolio pribadi.
