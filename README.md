# CPNZ — Platform Try Out CAT CPNS

CPNZ adalah platform simulasi ujian CAT (Computer Assisted Test) untuk seleksi CPNS, menyediakan try out SKD (TWK, TIU, TKP) dengan sistem penilaian, peringkat, dan pembahasan soal — dibangun untuk membantu peserta berlatih dalam kondisi yang mendekati ujian sesungguhnya.

🔗 **Live demo:** [cpnz.my.id](https://cpnz.my.id)

> Repositori ini ditampilkan sebagai portofolio teknis. Ini adalah produk bisnis aktif — lihat bagian [Lisensi](#lisensi) di bawah.

## Fitur Utama

- **Simulasi Ujian CAT** — timer real-time, navigasi soal, auto-submit saat waktu habis
- **Try Out Gratis & Berbayar** — beberapa paket latihan gratis tanpa perlu login, paket premium dengan sistem akses per user
- **Penilaian Otomatis** — skor per subtes (TWK/TIU/TKP), status kelulusan berdasarkan passing grade aktif, dan pembahasan tiap soal
- **Leaderboard & Peringkat** — peringkat nasional, provinsi, dan kabupaten/kota berbasis skor SKD
- **Dashboard Peserta** — ringkasan progres, riwayat skor, performa antar percobaan, dan riwayat transaksi
- **Pembayaran Terintegrasi** — checkout paket premium, webhook otomatis untuk aktivasi akses
- **Notifikasi Real-time** — pemberitahuan hasil ujian & status pembayaran tanpa perlu refresh halaman
- **Autentikasi** — login manual dan Google OAuth

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL, Auth, Realtime) |
| Serverless Function | Cloudflare Workers |
| Payment Gateway | Midtrans |
| Rendering Matematika | KaTeX |
| PDF Generation | react-pdf |

## Struktur Proyek

```
src/
├── components/    # Komponen UI per fitur (dashboard, exam, leaderboard, dll)
├── pages/         # Halaman utama (auth, payment, dashboard, simulasi)
├── services/      # Fungsi query ke Supabase (auth, payment, leaderboard)
├── engine/        # Logika eksekusi soal untuk paket try out gratis
├── lib/           # Klien Supabase & util inti
├── utils/         # Helper functions
├── hooks/         # Custom React hooks
└── routes/        # Definisi routing aplikasi
```

## Keamanan

Semua tabel database dilindungi Row Level Security (RLS), sehingga setiap user hanya dapat mengakses datanya sendiri. Kredensial rahasia (service role key, payment gateway server key) disimpan di environment server-side terpisah dan tidak pernah masuk ke kode frontend.

## Lisensi

**Hak cipta © 2026 Bayu Ramram. Seluruh hak dilindungi.**

Kode dalam repositori ini dipublikasikan **khusus untuk tujuan portofolio dan peninjauan teknis** (misalnya oleh perekrut/recruiter). Tidak ada izin yang diberikan untuk:
- Menyalin, memodifikasi, atau mendistribusikan kode ini
- Menjalankan, men-deploy, atau menggunakan kode ini untuk tujuan apa pun, termasuk komersial maupun non-komersial
- Membuat karya turunan berdasarkan kode ini

Untuk pertanyaan terkait lisensi atau kolaborasi, silakan hubungi pemilik repositori.
