import { useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";

import "./bantuan-theme.css";
import SEO from "../../components/seo/SEO";

/**
 * BantuanPage — halaman Pusat Bantuan / FAQ.
 *
 * Dikonversi dari file desain HTML statis ("Pusat Bantuan - CPNZ") jadi
 * komponen React. Beberapa penyesuaian dari desain asli:
 *
 * - Header (TopAppBar), BottomNavBar, dan <footer> versi mockup DIHAPUS
 *   -- halaman ini dipasang di dalam <HomePage/> yang sudah otomatis
 *   merender <Navbar/> & <FooterSection/> di sekeliling route (lihat
 *   src/routes/HomePage.jsx), jadi tidak perlu duplikat.
 * - Warna diambil dari komponen desain lewat CSS variable di
 *   ./bantuan-theme.css (pola sama dengan
 *   components/leaderboard/leaderboard-theme.css), dipakai via
 *   arbitrary value Tailwind seperti bg-[var(--help-primary)] dan
 *   variabel --help-* lainnya, supaya tidak bergantung pada
 *   tailwind.config.js project utama.
 * - Ikon "material-symbols-outlined" (butuh <link> Google Fonts
 *   tambahan) diganti @mui/icons-material yang sudah dipakai di
 *   FooterSection.jsx, supaya tidak perlu edit index.html.
 * - Search box sekarang fungsional: memfilter FAQ_ITEMS secara
 *   client-side (desain asli cuma dekoratif / non-fungsional).
 * - Link "WhatsApp Support" & "Email Us" diarahkan ke wa.me / mailto:
 *   placeholder -- ganti nomor & alamat email di WHATSAPP_NUMBER /
 *   SUPPORT_EMAIL sesuai kontak resmi.
 */

const WHATSAPP_NUMBER = "6281234567890"; // TODO: ganti nomor WA resmi CPNZ
const SUPPORT_EMAIL = "support@cpnz.id"; // TODO: ganti email resmi CPNZ

const FAQ_ITEMS = [
  {
    id: "pembayaran",
    title: "Pembayaran & Akses Paket",
    answer:
      "Pembayaran dapat dilakukan melalui Transfer Bank, E-Wallet (OVO, Dana, GoPay), atau QRIS. Setelah pembayaran berhasil, paket akan aktif secara otomatis dalam waktu maksimal 5 menit.",
  },
  {
    id: "try-out",
    title: "Try-Out & Ujian",
    answer:
      "Try-out dapat diakses melalui menu 'Try-Out' di dashboard. Anda bisa mengerjakan soal sesuai waktu yang ditentukan dan hasil akan muncul seketika setelah ujian selesai.",
  },
  {
    id: "leaderboard",
    title: "Leaderboard",
    answer:
      "Leaderboard diperbarui setiap hari. Peringkat dihitung berdasarkan skor tertinggi dan kecepatan pengerjaan soal try-out nasional.",
  },
  {
    id: "akun",
    title: "Akun",
    answer:
      "Untuk mengganti email atau password, silakan masuk ke menu Profil. Jika Anda lupa password, gunakan fitur 'Lupa Password' pada halaman login.",
  },
];

const TUTORIAL_STEPS = [
  {
    title: "Beli Paket",
    description:
      "Pilih paket try-out sesuai kebutuhan formasi CPNS Anda dan selesaikan pembayaran.",
  },
  {
    title: "Baca Aturan",
    description:
      "Pastikan Anda membaca tata tertib dan sistem penilaian sebelum menekan tombol mulai.",
  },
  {
    title: "Mulai Ujian",
    description:
      "Kerjakan soal dengan teliti dalam batas waktu yang tersedia. Gunakan fitur ragu-ragu jika perlu.",
  },
  {
    title: "Lihat Pembahasan",
    description:
      "Analisis hasil Anda melalui pembahasan mendalam dan statistik performa setelah selesai.",
  },
];

export default function BantuanPage() {
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="bantuan-page bg-[var(--help-surface)] text-[var(--help-on-surface)]">
      <SEO
        title="Pusat Bantuan & FAQ CPNS - CPNZ"
        description="Pertanyaan seputar tryout CPNS, cara bayar, cara ikut simulasi SKD, dan bantuan lainnya di CPNZ."
        path="/home/bantuan"
      />
      <main className="pt-28 pb-20 px-4 md:px-0 max-w-5xl mx-auto flex flex-col gap-16">
        {/* Hero Section */}
        <section className="text-center flex flex-col gap-4">
          <h1 className="bantuan-headline text-3xl md:text-4xl font-extrabold text-[var(--help-primary-container)]">
            Pusat Bantuan
          </h1>
          <p className="text-lg text-[var(--help-on-surface-variant)] max-w-2xl mx-auto">
            Butuh bantuan seputar try-out, pembayaran, atau akses paket? Kami
            siap bantu.
          </p>

          <div className="relative max-w-xl mx-auto w-full mt-6 group">
            <SearchRoundedIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--help-outline)] group-focus-within:text-[var(--help-primary-container)] transition-colors"
              fontSize="small"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci..."
              className="w-full pl-12 pr-4 py-4 bg-[var(--help-surface-container-lowest)] border border-[var(--help-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--help-primary-container)] focus:border-[var(--help-primary-container)] outline-none transition-all shadow-sm"
            />
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="flex flex-col gap-6">
          <h2 className="bantuan-headline text-2xl font-bold text-[var(--help-primary-container)] border-l-4 border-[var(--help-secondary-container)] pl-4">
            Pertanyaan Populer
          </h2>

          <div className="flex flex-col gap-4">
            {filteredFaqs.map((item) => (
              <details
                key={item.id}
                className="bantuan-faq group bg-[var(--help-surface-container-lowest)] border border-[var(--help-outline-variant)] rounded-2xl shadow-sm overflow-hidden transition-all hover:border-[var(--help-primary)]"
              >
                <summary className="flex justify-between items-center gap-4 p-6 cursor-pointer list-none">
                  <span className="font-semibold text-[var(--help-primary-container)] text-lg">
                    {item.title}
                  </span>
                  <ExpandMoreRoundedIcon className="bantuan-chevron flex-shrink-0 transition-transform text-[var(--help-primary-container)]" />
                </summary>
                <div className="px-6 pb-6 text-[var(--help-on-surface-variant)] leading-relaxed">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-10 text-[var(--help-on-surface-variant)]">
                Tidak ada hasil untuk &quot;{query}&quot;. Coba kata kunci lain
                atau hubungi tim support di bawah.
              </div>
            )}
          </div>
        </section>

        {/* Tutorial Section */}
        <section className="flex flex-col gap-8">
          <div className="text-center md:text-left">
            <h2 className="bantuan-headline text-2xl font-bold text-[var(--help-primary-container)]">
              Cara Ikut Try-Out
            </h2>
            <p className="text-[var(--help-on-surface-variant)]">
              Ikuti langkah mudah berikut untuk memulai simulasi ujian Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {TUTORIAL_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-6 p-6 bg-[var(--help-surface-container-lowest)] border border-[var(--help-outline-variant)] rounded-2xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--help-secondary-container)] text-[var(--help-primary-container)] font-bold flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div>
                  <h3 className="bantuan-headline text-[var(--help-primary-container)] text-lg mb-1 font-bold">
                    {step.title}
                  </h3>
                  <p className="text-[var(--help-on-surface-variant)]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Card */}
        <section className="bg-[var(--help-primary-container)] rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--help-primary)] opacity-20 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[var(--help-secondary-container)] opacity-10 rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4">
            <h2 className="bantuan-headline text-2xl md:text-3xl font-extrabold text-white">
              Masih butuh bantuan?
            </h2>
            <p className="text-[var(--help-on-primary-container)] text-lg">
              Tim support kami tersedia 24/7 untuk menjawab segala kendala
              teknis maupun administratif Anda.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-4 justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--help-secondary-container)] text-[var(--help-on-secondary-container)] font-bold rounded-xl hover:scale-105 active:scale-95 transition-all"
              >
                <ForumRoundedIcon fontSize="small" />
                WhatsApp Support
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 active:scale-95 transition-all"
              >
                <MailRoundedIcon fontSize="small" />
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
