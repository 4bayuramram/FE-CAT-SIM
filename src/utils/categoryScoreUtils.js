/**
 * Hitung rata-rata skor per kategori dari scoreSummaryRows (bentuk
 * sama dipakai buildInsights() di DashboardOverviewTab). Fallback
 * ringan kalau container belum kirim stats.categoryAverages eksplisit.
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
