/**
 * DashboardSkdRankingCard — SATU kartu peringkat murni (bukan daftar
 * top peserta lain), menunjukan posisi RELATIF user terhadap peserta
 * lain dalam cakupan tertentu (nasional / provinsi / kabupaten-kota),
 * berbasis skor paket SKD saja.
 *
 * Sengaja tidak menampilkan nama/skor peserta lain (beda dengan
 * DashboardMiniLeaderboardCard) -- kartu ini murni "keunggulan
 * relatif" milik user sendiri: peringkat, total peserta dalam
 * cakupan itu, dan persentil.
 *
 * Props:
 * - label: judul kartu, mis. "Peringkat Nasional"
 * - scopeName: nama cakupan spesifik (nama provinsi/kabupaten), null
 *   untuk cakupan nasional
 * - icon: komponen ikon MUI
 * - rank, totalPeserta: number | null
 * - avgScore: number | null — rata-rata skor SKD user yang dipakai utk ranking
 * - percentile: number | null — "Top N%"
 * - emptyMessage: teks kalau belum ada data (default disediakan)
 */
export default function DashboardSkdRankingCard({
  label,
  scopeName = null,
  icon: Icon,
  rank = null,
  totalPeserta = null,
  avgScore = null,
  percentile = null,
  emptyMessage = "Kerjakan paket SKD untuk mulai bersaing di peringkat ini.",
}) {
  const hasData = rank != null;

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-4 md:p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--db-on-surface)]">{label}</p>
          {scopeName && (
            <p className="text-xs text-[var(--db-on-surface-variant)] truncate">
              {scopeName}
            </p>
          )}
        </div>
        {Icon && (
          <Icon
            className="text-[var(--db-secondary-container)] shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        )}
      </div>

      {hasData ? (
        <>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-[var(--db-primary)]">#{rank}</h3>
            {totalPeserta != null && (
              <span className="text-xs text-[var(--db-on-surface-variant)] mb-1">
                dari {totalPeserta} peserta
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            {avgScore != null && (
              <div className="bg-[var(--db-surface-container-low)] rounded-xl px-3 py-1.5">
                <p className="text-[10px] uppercase tracking-wide text-[var(--db-on-surface-variant)]">
                  Skor SKD
                </p>
                <p className="text-sm font-black text-[var(--db-primary)]">
                  {Math.round(avgScore)}
                </p>
              </div>
            )}
            {percentile != null && (
              <div className="bg-[var(--db-surface-container-low)] rounded-xl px-3 py-1.5">
                <p className="text-[10px] uppercase tracking-wide text-[var(--db-on-surface-variant)]">
                  Persentil
                </p>
                <p className="text-sm font-black text-[var(--db-primary)]">
                  Top {percentile}%
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-xs text-[var(--db-on-surface-variant)] py-2">{emptyMessage}</p>
      )}
    </div>
  );
}
