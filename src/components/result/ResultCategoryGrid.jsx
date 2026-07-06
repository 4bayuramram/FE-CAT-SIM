import { getColorVariant } from "./resultColors";

/**
 * ResultCategoryGrid — kartu skor per kategori NON-TKP (mis. TIU, TWK,
 * atau kategori lain yang dipakai paket ke depannya — generik, tidak
 * hardcode "cuma 2 kategori").
 *
 * @param {{code:string, label:string, tag:string, colorKey:string, score:number, maxScore:number}[]} categories
 */
export default function ResultCategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((cat) => {
        const variant = getColorVariant(cat.colorKey);
        const pct = cat.maxScore ? Math.min(100, Math.round((cat.score / cat.maxScore) * 100)) : 0;

        return (
          <div
            key={cat.code}
            className="rounded-xl p-6 bg-white/10 backdrop-blur-xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm font-mono uppercase ${variant.text}`}>{cat.code}</span>
              <span className={`${variant.bgSoft} ${variant.text} text-[10px] px-2 py-0.5 rounded-full font-bold`}>
                {cat.tag}
              </span>
            </div>

            <div className="text-3xl font-bold mb-1 text-white">
              {cat.score} <span className="text-white/40 text-lg font-normal">/ {cat.maxScore}</span>
            </div>
            <p className="text-xs text-white/60 mb-4">{cat.label}</p>

            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className={`h-full ${variant.bar}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
