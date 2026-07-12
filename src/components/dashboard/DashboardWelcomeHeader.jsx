/**
 * DashboardWelcomeHeader — Hero Section (pilar "Hero" di roadmap).
 * Subtitle sekarang DINAMIS berdasarkan stats/nextPackage (peringkat
 * terbaik, sisa paket, atau ajakan ke leaderboard) — bukan teks statis
 * seperti sebelumnya. Prop `subtitle` tetap bisa dipakai untuk
 * override manual kalau suatu saat dibutuhkan.
 *
 * Props:
 * - name: nama depan/lengkap user (fallback "Peserta")
 * - subtitle: override manual (opsional, kalau diisi menang dari hasil hitung)
 * - stats: { totalPackages, attemptedPackages, bestRank }
 * - nextPackage: { id, title } | null
 * - hasAnyPackage: boolean
 */
export default function DashboardWelcomeHeader({
  name,
  subtitle,
  stats = {},
  nextPackage = null,
  hasAnyPackage = false,
}) {
  const displayName = name?.trim() || "Peserta";
  const computedSubtitle = subtitle ?? buildSubtitle({ stats, nextPackage, hasAnyPackage });

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--db-primary)]">
          Selamat Datang, {displayName}! 👋
        </h2>
        <p className="text-sm md:text-base text-[var(--db-on-surface-variant)] max-w-2xl mt-2">
          {computedSubtitle}
        </p>
      </div>
    </section>
  );
}

function buildSubtitle({ stats, nextPackage, hasAnyPackage }) {
  if (!hasAnyPackage) {
    return "Konsistensi adalah kunci keberhasilan. Pilih paket try out pertamamu dan mulai berlatih.";
  }

  const remaining = Math.max(
    (stats?.totalPackages ?? 0) - (stats?.attemptedPackages ?? 0),
    0
  );
  const rankText = stats?.bestRank
    ? `Kamu berada di Peringkat #${stats.bestRank}. `
    : "";

  if (nextPackage) {
    return `${rankText}${remaining} paket masih menunggu untuk dikerjakan.`;
  }

  return `${rankText}Semua paket telah selesai. Saatnya bersaing di Leaderboard.`;
}
