import { useEffect, useState } from "react";

/**
 * ResultHeroBar — bar progres skor total. Mulai dari 0% lalu animasi ke
 * `pct`% begitu komponen mount (requestAnimationFrame supaya browser
 * sempat render frame 0% dulu sebelum transisi CSS jalan) -- jalan
 * BARENGAN dengan CountUp angka di atasnya, tidak ditunda seperti pesan
 * afirmasi/peringkat di bawahnya.
 */
export default function ResultHeroBar({ pct }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setBarWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className="w-full max-w-md bg-white/10 h-1.5 rounded-full overflow-hidden mb-6">
      <div
        className="bg-[#4de082] h-full transition-all duration-1000 ease-out"
        style={{ width: `${barWidth}%` }}
      />
    </div>
  );
}
