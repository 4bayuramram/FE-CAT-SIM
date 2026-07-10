// packageCategory.js
//
// Sumber kebenaran untuk kategori paket (Semua/SKD/TWK/TIU/TKP) yang
// dipakai Tabbed Interface di halaman /home/simulasi.
//
// STATUS SAAT INI: tabel `packages` di Supabase BELUM punya kolom
// kategori. resolvePackageCategory() sudah siap membaca `pkg.category`
// kalau kolom itu ditambahkan nanti (lihat TODO §0) — tapi selama
// belum ada, dipakai fallback: tebak dari `title`/`description` paket
// via keyword TWK/TIU/TKP/SKD. Kalau tidak ketemu sama sekali,
// dianggap "skd" (paket try-out gabungan penuh), sesuai pola paket
// yang sudah ada sekarang (mis. "Paket 1" dengan deskripsi
// "Try-Out SKD (TWK,TIU,TKP)").
//
// PENTING kalau kolom `category` sudah ditambahkan di DB: cukup isi
// nilainya dengan salah satu dari CATEGORY_KEYS di bawah (case-insensitive),
// helper ini otomatis akan pakai nilai kolom itu duluan tanpa perlu
// ubah kode lain.

export const CATEGORY_KEYS = ["skd", "twk", "tiu", "tkp"];

export const PACKAGE_CATEGORIES = [
  { key: "semua", label: "Semua" },
  { key: "skd", label: "SKD" },
  { key: "twk", label: "TWK" },
  { key: "tiu", label: "TIU" },
  { key: "tkp", label: "TKP" },
];

const KEYWORD_PATTERNS = {
  twk: /\btwk\b/i,
  tiu: /\btiu\b/i,
  tkp: /\btkp\b/i,
  skd: /\bskd\b/i,
};

// Urutan cek sengaja TWK/TIU/TKP dulu baru SKD -- soalnya deskripsi
// paket SKD gabungan biasanya MENYEBUT ketiga kata itu juga
// ("Try-Out SKD (TWK,TIU,TKP)"), jadi kalau SKD dicek duluan, paket
// satuan TWK/TIU/TKP yang judulnya juga kebetulan menyebut "SKD" di
// deskripsi bisa salah kategori.
const CHECK_ORDER = ["twk", "tiu", "tkp", "skd"];

export function resolvePackageCategory(pkg) {
  const fromColumn = String(pkg?.category || "").toLowerCase();
  if (CATEGORY_KEYS.includes(fromColumn)) {
    return fromColumn;
  }

  const haystack = `${pkg?.title || ""} ${pkg?.description || ""}`;

  for (const key of CHECK_ORDER) {
    if (KEYWORD_PATTERNS[key].test(haystack)) {
      return key;
    }
  }

  // Fallback: paket tanpa penanda kategori sama sekali dianggap SKD
  // (paket gabungan penuh), bukan disembunyikan dari semua tab.
  return "skd";
}
