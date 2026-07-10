/**
 * Kartu "Pencapaian Anda": rata-rata skor + progress bar + keterangan.
 *
 * Props:
 * - avgScore: number | string, ditampilkan mentah (mis. 412.5)
 * - percentile: 0-100, dipakai sebagai lebar progress bar
 * - description: teks penjelasan (kalau tidak diisi, dibuat otomatis dari
 *   `comparisonPercent` + `totalParticipants`)
 * - comparisonPercent: mis. 15 -> "Skor Anda 15% lebih tinggi dari rata-rata"
 * - totalParticipants: number
 */
export default function LeaderboardPersonalStatsCard({
  avgScore,
  percentile = 0,
  comparisonPercent,
  totalParticipants,
  description,
}) {
  const autoDescription =
    description ??
    (typeof comparisonPercent === "number" && typeof totalParticipants === "number"
      ? `Skor Anda ${comparisonPercent}% lebih tinggi dari rata-rata ${totalParticipants.toLocaleString(
          "id-ID"
        )} peserta lainnya. Terus tingkatkan performa Anda!`
      : null);

  return (
    <div className="bg-[var(--lb-surface-container)] p-6 rounded-3xl border border-[var(--lb-outline-variant)]">
      <h3 className="text-sm font-bold text-[var(--lb-primary)] uppercase tracking-wider mb-4">
        Pencapaian Anda
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-[var(--lb-on-surface-variant)]">
            Rata-rata Skor
          </span>
          <span className="text-xl font-black text-[var(--lb-primary)]">
            {avgScore}
          </span>
        </div>
        <div className="w-full bg-[var(--lb-outline-variant)] rounded-full h-2">
          <div
            className="bg-[var(--lb-primary-container)] h-2 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, percentile))}%` }}
          />
        </div>
        {autoDescription && (
          <p className="text-[10px] text-[var(--lb-on-surface-variant)] leading-relaxed">
            {autoDescription}
          </p>
        )}
      </div>
    </div>
  );
}
