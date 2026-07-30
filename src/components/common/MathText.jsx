import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Render satu ekspresi LaTeX ke HTML string pakai katex.renderToString
 * secara langsung (BUKAN lewat react-katex). Ini untuk menghindari bug
 * di mana react-katex gagal mendaftarkan fungsi-fungsi KaTeX
 * (\sqrt, \dfrac, \times, \text, dll — semua command berupa "kata")
 * di lingkungan Vite/esbuild, sementara operator dasar (+, -, =, ^)
 * tetap jalan karena itu ditangani langsung oleh parser inti KaTeX,
 * bukan lewat sistem plugin fungsi yang gagal ke-load lewat react-katex.
 */
function renderKatex(math, displayMode) {
  try {
    return katex.renderToString(math, {
      displayMode,
      throwOnError: false,
      strict: false,
      errorColor: "#dc2626",
    });
  } catch (e) {
    return `<span style="color:#dc2626">Rumus tidak valid: ${math}</span>`;
  }
}

/**
 * MathText
 *
 * Komponen presentational reusable untuk menampilkan teks biasa yang
 * di dalamnya diselipkan notasi matematika (LaTeX), memakai KaTeX.
 *
 * Bisa dipakai di mana saja yang menampilkan teks dari DB/konten soal —
 * tidak khusus untuk pembahasan. Contoh: content.text soal, pertanyaan,
 * pilihan jawaban, dll — tinggal bungkus teksnya dengan <MathText>.
 *
 * Sintaks di dalam teks:
 *   - Rumus inline (nempel di tengah kalimat): $...$
 *       contoh: "Diperoleh $60 \\times 4 = 80 \\times x$ sehingga..."
 *   - Rumus blok (baris sendiri, biasanya untuk perhitungan panjang): $$...$$
 *       contoh: "$$x = \\dfrac{240}{80} = 3$$"
 *
 * Teks di luar $...$ / $$...$$ dirender apa adanya sebagai teks biasa
 * (whitespace-pre-line tetap dipertahankan agar baris baru dari DB
 * tetap terjaga).
 *
 * Kalau rumus LaTeX-nya tidak valid, KaTeX akan menampilkan pesan error
 * kecil di tempat rumus itu alih-alih meng-crash seluruh halaman
 * (strict: "ignore" di bawah membuat KaTeX diam-diam menampilkan best
 * effort-nya, bukan melempar exception ke React).
 */
export default function MathText({ text, className = "" }) {
  if (!text) return null;

  // Pisahkan teks berdasarkan blok $$...$$ dan inline $...$.
  // Urutan regex penting: cek $$...$$ dulu supaya tidak "dimakan" oleh
  // pola inline $...$.
  const tokens = [];
  const regex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith("$$")) {
      tokens.push({ type: "block", value: raw.slice(2, -2) });
    } else {
      tokens.push({ type: "inline", value: raw.slice(1, -1) });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return (
    <span className={`whitespace-pre-line ${className}`}>
      {tokens.map((token, i) => {
        if (token.type === "block") {
          return (
            <span
              key={i}
              className="block my-1 overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: renderKatex(token.value, true),
              }}
            />
          );
        }
        if (token.type === "inline") {
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{
                __html: renderKatex(token.value, false),
              }}
            />
          );
        }
        return <span key={i}>{token.value}</span>;
      })}
    </span>
  );
}