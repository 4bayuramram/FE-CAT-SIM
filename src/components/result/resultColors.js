/**
 * resultColors.js
 *
 * Palet dari referensi desain (M3 dark scheme) dipetakan ke HEX arbitrary
 * Tailwind langsung (bg-[#...], text-[#...]) — BUKAN token custom
 * (bg-secondary, text-primary, dst) seperti di file HTML referensi,
 * karena token itu didefinisikan lewat tailwind.config yang di-generate
 * on-the-fly oleh Tailwind CDN di file referensi. Project ini pakai
 * Tailwind build biasa (lihat komponen Paid lain: bg-[#00467f], dst),
 * jadi token custom itu TIDAK otomatis ada di sini — dipetakan ke hex
 * langsung supaya visualnya identik tanpa perlu utak-atik
 * tailwind.config project (yang tidak ada di source ini).
 *
 * colorKey dipakai komponen untuk pilih varian warna per kategori/topik
 * (dikirim dari data, misal categories[].colorKey = "primary").
 */
export const RESULT_PALETTE = {
  background: "#051424",
  backgroundSoft: "#0d1c2d",
  onSurface: "#d4e4fa",
  onSurfaceVariant: "#c2c6d1",
  outlineVariant: "#424750",

  primary: "#a3c9ff", // biru terang — dipakai TIU & aksen umum
  primaryContainer: "#00467f", // biru brand (konsisten dgn palet Paid lain)

  secondary: "#4de082", // hijau — dipakai TKP & "benar"
  secondaryContainer: "#00b55d",

  error: "#ffb4ab", // dipakai "salah" & topik lemah
  errorContainer: "#93000a",

  tertiary: "#ffb3b0", // dipakai TWK
  tertiaryContainer: "#851b23",
};

/**
 * Kelas Tailwind siap pakai per colorKey — dot-indicator, teks, badge.
 * Menghindari string template dinamis (Tailwind JIT butuh class literal),
 * jadi dipetakan lewat lookup object, bukan `bg-[${hex}]`.
 */
export const COLOR_VARIANTS = {
  primary: {
    dot: "bg-[#a3c9ff]",
    text: "text-[#a3c9ff]",
    bgSoft: "bg-[#a3c9ff]/20",
    bar: "bg-[#a3c9ff]",
  },
  secondary: {
    dot: "bg-[#4de082]",
    text: "text-[#4de082]",
    bgSoft: "bg-[#4de082]/20",
    bar: "bg-[#4de082]",
  },
  error: {
    dot: "bg-[#ffb4ab]",
    text: "text-[#ffb4ab]",
    bgSoft: "bg-[#ffb4ab]/20",
    bar: "bg-[#ffb4ab]",
  },
  tertiary: {
    dot: "bg-[#ffb3b0]",
    text: "text-[#ffb3b0]",
    bgSoft: "bg-[#ffb3b0]/20",
    bar: "bg-[#ffb3b0]",
  },
  neutral: {
    dot: "bg-white/40",
    text: "text-white/40",
    bgSoft: "bg-white/10",
    bar: "bg-white/40",
  },
};

export function getColorVariant(colorKey) {
  return COLOR_VARIANTS[colorKey] ?? COLOR_VARIANTS.neutral;
}
