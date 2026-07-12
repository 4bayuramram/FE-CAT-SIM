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
 * DashboardCategoryScoreGrid — 4 kartu rata-rata skor PER KATEGORI
 * paket (SKD, TWK, TIU, TKP), pelengkap kartu "Peringkat Terbaik" &
 * "Rata-rata Skor" (gabungan semua paket) yang sudah ada di
 * DashboardStatsGrid.
 *
 * PENTING soal makna "SKD" di sini: rata-rata SKD dihitung dari paket
 * berkategori `skd` (paket try out gabungan TWK+TIU+TKP), BUKAN
 * rata-rata dari nilai TWK/TIU/TKP satuan -- konsisten dengan
 * `resolvePackageCategory` & bentuk data `scoreSummaryRows` yang sudah
 * ada (tiap paket cuma py 1 kategori). Nilai TWK/TIU/TKP satuan hanya
 * dipakai untuk insight pribadi di dashboard ini -- TIDAK diranking
 * secara nasional/provinsi/kabupaten (yang diranking cuma skor paket
 * SKD, lihat DashboardSkdRankingSection).
 *
 * Props:
 * - values: { skd, twk, tiu, tkp } — number | null tiap kategori,
 *   rata-rata skor dari paket kategori itu yang SUDAH dikerjakan user.
 *   Kategori yang belum pernah dikerjakan otomatis tampil "—".
 * - onCategoryClick(category): opsional, dipanggil saat kartu yang
 *   punya nilai diklik (mis. untuk fokus ke daftar skor kategori itu).
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

/**
 * Hitung rata-rata skor per kategori dari scoreSummaryRows (bentuk
 * yang sama dipakai buildInsights() di DashboardOverviewTab). Dipakai
 * sebagai fallback ringan kalau container belum mengirim
 * stats.categoryAverages secara eksplisit.
 */
export function buildCategoryAverages(rows = []) {
  const byCategory = new Map();
  rows.forEach((row) => {
    if (!row.category || row.score == null) return;
    const prev = byCategory.get(row.category) || { total: 0, count: 0 };
    byCategory.set(row.category, {
      total: prev.total + row.score,
      count: prev.count + 1,
    });
  });

  const result = { skd: null, twk: null, tiu: null, tkp: null };
  byCategory.forEach(({ total, count }, category) => {
    if (category in result) result[category] = total / count;
  });
  return result;
}
