// src/config/seo.js
//
// Konfigurasi SEO terpusat. Kalau domain production sudah siap
// (custom domain, bukan lagi *.vercel.app), CUKUP UBAH satu baris
// SITE_URL di bawah ini -- tidak perlu ubah file lain.

export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "https://cpnz-demo.vercel.app";

export const SITE_NAME = "CPNZ";

export const DEFAULT_TITLE =
  "CPNZ - Tryout CPNS Online | Latihan Soal SKD TWK TIU TKP";

export const DEFAULT_DESCRIPTION =
  "Platform tryout CPNS online terpercaya. Latihan soal SKD (TWK, TIU, TKP) dengan sistem CAT sungguhan, skor otomatis, dan ranking nasional. Persiapkan seleksi CPNS-mu sekarang.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
