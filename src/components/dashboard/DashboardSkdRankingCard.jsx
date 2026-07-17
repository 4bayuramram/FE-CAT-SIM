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
 * - avgScore: number | null — skor SKD user yang dipakai utk ranking.
 *   SEJAK REVISI v3 (16 Jul 2026): sudah melalui Bayesian shrinkage,
 *   ditarik mendekati rata-rata nasional selama jumlahPaket masih
 *   sedikit -- BUKAN rata-rata murni lagi. Makanya jumlahPaket WAJIB
 *   ditampilkan berdampingan supaya user paham kenapa skor ini bisa
 *   beda dari ekspektasi "rata-rata polos" mereka.
 * - jumlahPaket: number | null — jumlah paket SKD yang sudah
 *   dikerjakan user, dipakai utk label transparansi "(dari X paket)"
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
  jumlahPaket = null,
  percentile = null,
  emptyMessage = "Kerjakan paket SKD untuk mulai bersaing di peringkat ini.",
}) {
  const hasData = rank != null;

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-4 md:p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--db-on-surface)]">
            {label}
          </p>
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
            <h3 className="text-3xl font-black text-[var(--db-primary)]">
              #{rank}
            </h3>
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
                {jumlahPaket != null && (
                  <p className="text-[10px] text-[var(--db-on-surface-variant)] mt-0.5">
                    dari {jumlahPaket} paket
                  </p>
                )}
              </div>
            )}
            {percentile != null &&
              (() => {
                // unggulPercent = persentase peserta yang kamu ungguli.
                // >= 50 berarti kamu di atas rata-rata (hijau, "Unggul"),
                // < 50 berarti di bawah rata-rata (merah, "Di bawah") --
                // satu angka yang sama dipakai di kedua label, cuma beda
                // teks & warna supaya jujur (nggak selalu dibungkus kata
                // "unggul" walau sebenarnya di bawah rata-rata).
                const unggulPercent = 100 - percentile;
                const isAboveAverage = unggulPercent >= 50;
                return (
                  <div
                    className="rounded-xl px-3 py-1.5"
                    style={{
                      background: isAboveAverage
                        ? "var(--db-success-container)"
                        : "var(--db-error-container)",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-wide text-[var(--db-on-surface-variant)]">
                      Posisi Kamu
                    </p>
                    <p
                      className="text-sm font-black"
                      style={{
                        color: isAboveAverage
                          ? "var(--db-success)"
                          : "var(--db-error)",
                      }}
                    >
                      {isAboveAverage
                        ? `Unggul ${unggulPercent}%`
                        : `Di bawah ${unggulPercent}%`}
                    </p>
                  </div>
                );
              })()}
          </div>
        </>
      ) : (
        <p className="text-xs text-[var(--db-on-surface-variant)] py-2">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}
