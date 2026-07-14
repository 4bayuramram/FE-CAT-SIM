# Changelog — Optimasi Jalur Gratis / Simulasi (Non-DB)

Perubahan ini menyasar jalur hardcode (`src/engine/*`, `src/data/*`,
`src/pages/ExamPage.jsx`, dst) — bukan jalur berbayar (`engine_2/*Db.js`,
`/try-out/*`), yang tidak disentuh.

## Selesai dikerjakan

1. **Durasi per paket dari data (bukan hardcode)**
   - `src/data/paket1.js`–`paket4.js`: tambah field `duration` (ms) di
     level paket.
   - `src/services/questionService.js`: tambah `getPaketMeta(id)` yang
     mengembalikan `{ id, nama, duration, totalQuestions }`.
   - `src/engine/examEngine.js`: `createSession(paketId, durationOverride?)`
     sekarang membaca `duration` dari data paket lewat `getPaketMeta`,
     dengan fallback 60 menit kalau field belum diisi.
   - Nilai durasi yang dipasang sekarang (silakan sesuaikan lagi sesuai
     kebutuhan produk):
     - Paket 1 (80 soal): 75 menit
     - Paket 2 (12 soal): 15 menit
     - Paket 3 (30 soal TWK): 30 menit
     - Paket 4 (6 soal contoh): 10 menit

2. **Panel perbandingan Gratis vs Berbayar sebelum mulai ujian**
   - Baru: `src/data/examComparisonFeatures.js` — data checklist +
     disclaimer, gampang diubah tanpa sentuh komponen.
   - Baru: `src/components/exam/FreeExamIntroPanel.jsx` — dua card
     berdampingan (checklist gratis vs berbayar), termasuk penjelasan
     eksplisit bahwa level soal gratis "dasar/menengah untuk membiasakan
     pola ujian CAT", sedangkan berbayar "HOTS/ultra-HOTS untuk mengukur
     kemampuan real". Ada tombol lanjut ke `/try-out`.
   - `src/pages/ExamPage.jsx` dirombak untuk menampilkan panel ini sebelum
     user mulai ujian (menggantikan card "Mulai Ujian" polos sebelumnya).

3. **Sinkron sesi ke local storage, end-to-end**
   - Sebelumnya jawaban/flag/navigasi soal HANYA ada di Redux state —
     `storageService.saveSession()` cuma dipanggil saat create/start/
     submit. Kalau user refresh browser di tengah ujian, progres terbaru
     bisa hilang.
   - Fix: `ExamPage.jsx` sekarang punya `useEffect` yang mem-persist
     `session` Redux ke `storageService.saveSession()` setiap kali
     berubah (kecuali status `finished`, karena `submitSession` sudah
     `clearSession()`).
   - Alur lanjut/mulai-baru dibuat eksplisit: saat halaman dibuka, sesi
     lama di storage dibaca tapi TIDAK otomatis di-restore ke Redux.
     `FreeExamIntroPanel` menawarkan "Lanjutkan Sesi" atau "Mulai Ulang"
     kalau ada sesi lama yang belum selesai untuk paket yang sama.

4. **Bug fix: `rulesEngine.shouldAutoSubmit`**
   - Sebelumnya salah manggil `sessionEngine.isExpired()` (method itu
     sebenarnya milik `timerEngine`), jadi selalu `undefined` dan
     auto-submit gak pernah kepicu dari fungsi ini.
   - Sekarang benar memanggil `timerEngine.isExpired(session)`.

5. **Auto-submit saat waktu ujian habis**
   - `src/components/question/QuestionCard.jsx`: tambah `useEffect` yang
     memantau `remainingTime` (di-update tiap detik oleh `useTimer`) dan
     memanggil `submitExam()` otomatis begitu `rulesEngine.shouldAutoSubmit`
     bernilai true. Sebelumnya waktu habis cuma menghentikan angka timer,
     ujian tidak ter-submit otomatis.

6. **Empty-state paket tanpa soal**
   - `ExamPage.jsx` sekarang cek `paketMeta.totalQuestions === 0` dan
     menampilkan pesan "Soal Belum Tersedia" alih-alih layar kosong/blank.

7. **Fix: sidebar & bottom-nav ujian ikut muncul sebelum ujian dimulai**
   - `components/layout/Sidebar.jsx` sebelumnya render TANPA cek sesi sama
     sekali (beda dengan `ExamTopbar`/`TimerPanel` yang memang sudah benar
     `return null` kalau belum ada sesi) — jadi "Panel Informasi Peserta
     dan Navigasi Soal" tetap tampil walau user masih di
     `FreeExamIntroPanel`. File ini juga ada baris sampah
     (`Sidebar.jsx;`) di baris pertama, sudah dibuang.
   - `components/layout/ExamLayout.jsx`: `Sidebar`, `BottomNav`, overlay
     navigasi/bantuan mobile, dan margin `md:ml-72` sekarang hanya
     dirender ketika ada sesi aktif untuk paket yang sama
     (`session.paketId === paketId`). Sebelum ujian dimulai, halaman
     cuma menampilkan `FreeExamIntroPanel` tanpa sisa layout ujian.

8. **Fix: timer sempat/selalu tampil "0:00" saat ujian baru dimulai**
   - Dibuktikan lewat simulasi terpisah (tanpa React) bahwa logic durasi
     di `examEngine`/`sessionEngine`/`timerEngine` sudah benar (75 menit
     terhitung tepat begitu sesi `running`) — bug-nya murni di
     `hooks/useTimer.js`:
     - `remainingTime` di Redux mulai dari `null` dan sebelumnya CUMA
       di-update di dalam `setInterval`, yang baru tick pertama kali
       1 detik SETELAH ujian dimulai. Selama window itu `TimerPanel`
       nampilin `format(null || 0)` = "0:00".
     - Selain itu, `useEffect` di `useTimer` depend ke seluruh objek
       `session`, padahal `session` berubah tiap detik (`setRemainingTime`
       menulis ulang `session.remainingTime`) — jadi interval-nya
       kebongkar-pasang tiap detik, bikin hitungan mundur jadi tidak
       stabil/jitter.
   - Fix: `useTimer` sekarang (1) langsung menghitung & dispatch
     `remainingTime` begitu timer terpasang (tidak menunggu tick
     pertama), dan (2) effect-nya depend ke field yang stabil
     (`sessionId`, `startTime`, `duration`, `status`) bukan seluruh objek
     `session`, supaya interval tidak dibuat ulang tiap detik.

9. **Fix: timer statis "0:00" selamanya (bukan cuma sekilas) kalau ada
   sesi lama/corrupt di local storage**
   - Root cause: `useTimer` sengaja cuma mulai interval kalau
     `session.status === "running"`. Kalau sesi yang di-*restore* dari
     local storage adalah sesi lama yang nyangkut di status lain (mis.
     `"ready"`, sisa testing sebelum fix durasi kemarin, atau proses
     `startSession()` yang belum sempat kesimpan sempurna), maka
     `TimerPanel` tetap tampil (dia cuma cek `!session`) tapi
     `remainingTime` selamanya `null` → macet di "0:00".
   - Fix di `pages/ExamPage.jsx`: sesi hasil restore cuma ditawarkan
     sebagai "Lanjutkan Sesi" kalau benar-benar valid (status
     `"running"`, punya `startTime` dan `duration`). Kalau ternyata
     stale/corrupt, otomatis dibuang (`examEngine.resetSession()`) dan
     user langsung diarahkan ke "Mulai Ujian" biasa, tidak ditawarkan
     lanjutkan ke state rusak.
   - Fix tambahan di `TimerPanel.jsx`: kalau `remainingTime` belum sempat
     ke-set, sekarang fallback ke `session.duration` (durasi penuh),
     bukan `0`, supaya tidak ada kondisi manapun yang salah nampilin
     "waktu sudah habis". Panel timer juga sekarang cuma render kalau
     `session.status === "running"` (sebelumnya tampil selama ada
     `session`, termasuk saat sudah `finished`).
   - **Catatan buat testing**: karena format session di local storage
     berubah seiring iterasi fix di atas, disarankan clear
     `localStorage` (key `active_exam_session` / `exam_results`) sekali
     di browser sebelum testing ulang, supaya tidak ada sisa data lama
     yang formatnya beda dari kode terbaru. Setelah ini, kode juga sudah
     defensif menangani kasus itu otomatis ke depannya.

## Belum dikerjakan / perlu tindak lanjut tim (bukan tugas engineering)

- **Konten soal Paket 2 masih draft.** `src/data/2/twk2.js`,
  `tiu2.js`, `tkp2.js` cuma berisi 12 soal total (2 TWK, 8 TIU, 2 TKP),
  jauh dari paket lain. `twk2Pembahasan.js` juga baru berisi 2 placeholder
  teks ("Pembahasan soal nomor 1/2"), bukan pembahasan asli. Ini murni
  soal konten (materi TWK/TIU/TKP + kunci jawaban + pembahasan), sengaja
  TIDAK saya isi otomatis karena berisiko salah materi — perlu diisi oleh
  tim konten sebelum paket 2 dianggap siap pakai.
- **Copy di `examComparisonFeatures.js`** silakan direview/disesuaikan
  bahasa marketing-nya; strukturnya sudah siap untuk diubah tanpa sentuh
  kode.
- **Link CTA "Lihat paket try out HOTS berbayar"** di
  `FreeExamIntroPanel.jsx` mengarah ke `/try-out` (route dilindungi
  `ProtectedLayoutDb`). Kalau ada halaman katalog paket khusus
  (mis. `PackageInfoPage.jsx`), sesuaikan target link-nya.
- Belum ada test/build environment (repo yang di-upload cuma folder
  `src/`, tanpa `package.json`/`node_modules`), jadi validasi yang
  dilakukan sebatas syntax-check (`esbuild`) untuk semua file yang
  diubah — bukan full runtime test di browser. Disarankan jalankan
  `npm run dev` / build penuh di environment asli sebelum deploy.
