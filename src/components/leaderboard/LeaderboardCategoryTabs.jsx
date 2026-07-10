/**
 * Baris tab kategori (Semua / SKD / TWK / TIU / TKP), scroll horizontal
 * di layar sempit. Generik: bisa dipakai untuk kategori apapun lewat
 * prop `categories`.
 *
 * Props:
 * - categories: [{ key, label }]
 * - activeKey
 * - onChange(key)
 */
export default function LeaderboardCategoryTabs({
  categories = [
    { key: "semua", label: "Semua" },
    { key: "skd", label: "SKD" },
    { key: "twk", label: "TWK" },
    { key: "tiu", label: "TIU" },
    { key: "tkp", label: "TKP" },
  ],
  activeKey = "semua",
  onChange,
}) {
  return (
    <div
      role="tablist"
      className="flex gap-2 overflow-x-auto pb-2 leaderboard-scrollbar"
    >
      {categories.map((cat) => {
        const isActive = cat.key === activeKey;
        return (
          <button
            key={cat.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(cat.key)}
            className={
              isActive
                ? "px-6 py-2 rounded-full bg-[var(--lb-primary-container)] text-white font-bold border border-[var(--lb-primary-container)] whitespace-nowrap"
                : "px-6 py-2 rounded-full border border-[var(--lb-outline)] text-[var(--lb-on-surface-variant)] font-bold whitespace-nowrap hover:bg-[var(--lb-surface-container)]"
            }
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
