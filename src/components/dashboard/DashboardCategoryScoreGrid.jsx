import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

const CATEGORY_META = {
  skd: {
    label: "Rata-rata SKD",
    context: "Gabungan TWK, TIU & TKP",
    icon: MenuBookRoundedIcon,
  },
  twk: {
    label: "Rata-rata TWK",
    context: "Paket TWK saja",
    icon: AccountBalanceRoundedIcon,
  },
  tiu: {
    label: "Rata-rata TIU",
    context: "Paket TIU saja",
    icon: PsychologyRoundedIcon,
  },
  tkp: {
    label: "Rata-rata TKP",
    context: "Paket TKP saja",
    icon: FavoriteRoundedIcon,
  },
};

function CategoryCard({ category, value, onClick }) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  const hasValue = value != null;

  return (
    <button
      type="button"
      onClick={hasValue ? onClick : undefined}
      disabled={!hasValue || !onClick}
      className="dashboard-card w-full text-left bg-white rounded-3xl p-5 border-l-4 border-[var(--db-primary)] shadow-sm disabled:cursor-default"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--db-on-surface-variant)]">
        {meta.label}
      </p>
      <div className="flex justify-between items-center mt-2">
        <h3 className="text-2xl font-black text-[var(--db-primary)]">
          {hasValue ? Math.round(value) : "—"}
        </h3>
        <Icon
          style={{ fontSize: 34 }}
          className="text-[var(--db-primary-container)] opacity-20"
        />
      </div>
      <p className="text-[11px] text-[var(--db-on-surface-variant)] mt-1.5">
        {hasValue ? meta.context : "Belum ada paket dikerjakan"}
      </p>
    </button>
  );
}

/**
 * DashboardCategoryScoreGrid — 4 kartu rata-rata skor per kategori
 * paket (SKD, TWK, TIU, TKP), pelengkap DashboardStatsGrid.
 *
 * "SKD" di sini = rata-rata paket berkategori `skd` (try out gabungan
 * TWK+TIU+TKP), BUKAN rata-rata TWK/TIU/TKP satuan — konsisten dengan
 * resolvePackageCategory. Nilai TWK/TIU/TKP satuan cuma insight
 * pribadi, tidak diranking nasional (yang diranking cuma skor SKD,
 * lihat DashboardSkdRankingSection).
 *
 * Props:
 * - values: { skd, twk, tiu, tkp } — number | null, "—" kalau belum
 *   pernah dikerjakan.
 * - onCategoryClick(category): opsional, dipanggil saat kartu ber-nilai diklik.
 */
export default function DashboardCategoryScoreGrid({ values = {}, onCategoryClick }) {
  const categories = ["skd", "twk", "tiu", "tkp"];
  const hasAnyValue = categories.some((c) => values[c] != null);

  if (!hasAnyValue) return null;

  return (
    <section>
      <h3 className="text-sm font-bold text-[var(--db-on-surface)] mb-3">
        Rata-rata Skor per Kategori
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            value={values[category] ?? null}
            onClick={() => onCategoryClick?.(category)}
          />
        ))}
      </div>
    </section>
  );
}
