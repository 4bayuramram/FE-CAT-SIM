import { useEffect, useState } from "react";
import { getColorVariant } from "./resultColors";
import CountUp from "../common/CountUp";

/**
 * ResultCategoryGrid — kartu skor per kategori NON-TKP (mis. TIU, TWK,
 * atau kategori lain yang dipakai paket ke depannya — generik, tidak
 * hardcode "cuma 2 kategori").
 *
 * @param {{code:string, label:string, tag:string, colorKey:string, score:number, maxScore:number}[]} categories
 * @param {Object.<string, {passed:boolean}>} [passingSubtests] - dari
 *   checkPassingGrade().subtests. Kategori yang tidak ada di map ini
 *   (belum ada rule/breakdown) tetap pakai warna default.
 */
export default function ResultCategoryGrid({ categories, passingSubtests }) {
  if (!categories?.length) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.code}
          cat={cat}
          failed={passingSubtests?.[cat.code]?.passed === false}
        />
      ))}
    </section>
  );
}

function CategoryCard({ cat, failed }) {
  const variant = getColorVariant(cat.colorKey);
  const pct = cat.maxScore ? Math.min(100, Math.round((cat.score / cat.maxScore) * 100)) : 0;

  // Bar mulai 0% lalu animasi ke pct% setelah mount, senada dengan
  // ResultHeroScore (biar semua bar di halaman hasil "naik" bareng).
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setBarWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className="rounded-xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <span className={`text-sm font-mono uppercase ${variant.text}`}>{cat.code}</span>
        <span className={`${variant.bgSoft} ${variant.text} text-[10px] px-2 py-0.5 rounded-full font-bold`}>
          {cat.tag}
        </span>
      </div>

      <div className={`text-3xl font-bold mb-1 ${failed ? "text-red-500" : "text-white"}`}>
        <CountUp to={cat.score} duration={1.5} />{" "}
        <span className="text-white/40 text-lg font-normal">/ {cat.maxScore}</span>
      </div>
      <p className="text-xs text-white/60 mb-4">{cat.label}</p>

      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
        <div
          className={`h-full ${variant.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}
