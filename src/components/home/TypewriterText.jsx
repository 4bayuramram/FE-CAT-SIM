import { useEffect, useState, useRef } from "react";

/**
 * TypewriterText
 * Menampilkan teks dengan efek mengetik, lalu setelah jeda sebentar,
 * teks di-reset dan diketik ulang lagi dari awal — berulang (loop).
 * Tidak ada animasi menghapus huruf, murni ketik -> jeda -> ketik lagi.
 *
 * Props:
 * - text: string yang diketik
 * - typingSpeed: ms per karakter saat mengetik (default 55)
 * - pauseAfterTyping: jeda (ms) setelah selesai mengetik sebelum mulai ketik ulang
 */
export default function TypewriterText({
  text,
  typingSpeed = 55,
  pauseAfterTyping = 1400,
  className = "",
}) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pausing
  const timeoutRef = useRef(null);

  // Hormati preferensi user yang mematikan animasi — langsung tampilkan
  // teks penuh tanpa efek ketik berulang.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        setPhase("pausing");
      }
    } else if (phase === "pausing") {
      timeoutRef.current = setTimeout(() => {
        // Reset instan (tanpa animasi hapus), lalu mulai ketik lagi
        setDisplayed("");
        setPhase("typing");
      }, pauseAfterTyping);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [
    displayed,
    phase,
    text,
    typingSpeed,
    pauseAfterTyping,
    prefersReducedMotion,
  ]);

  return (
    <span className={className}>
      {displayed}
      {!prefersReducedMotion && (
        <span className="typewriter-cursor" aria-hidden="true">
          |
        </span>
      )}
    </span>
  );
}
