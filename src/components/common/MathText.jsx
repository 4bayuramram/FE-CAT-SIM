import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Render satu ekspresi LaTeX ke HTML pakai katex.renderToString langsung
 * (bukan react-katex, karena react-katex gagal load command KaTeX
 * berupa "kata" seperti \sqrt, \dfrac, \text di Vite/esbuild).
 */
function renderKatex(math, displayMode) {
  try {
    return katex.renderToString(math, {
      displayMode,
      throwOnError: false,
      strict: false,
      errorColor: "#dc2626",
    });
  } catch {
    return `<span style="color:#dc2626">Rumus tidak valid: ${math}</span>`;
  }
}

/**
 * MathText — render teks dengan notasi matematika LaTeX (KaTeX).
 * Sintaks: $...$ untuk inline, $$...$$ untuk blok baris sendiri.
 * Teks di luar itu dirender apa adanya (whitespace-pre-line dipertahankan).
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
