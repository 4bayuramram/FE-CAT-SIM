/**
 * Jembatan antara data leaderboard yang SUDAH ADA (hasil
 * getPackageLeaderboard.js -> RPC get_package_leaderboard, sudah di-map
 * ke camelCase: rank, userId, score, duration, name, avatarUrl, province,
 * city, isAnonymous) dengan bentuk props yang dipakai LeaderboardRow /
 * PackageLeaderboardCard di halaman baru ini.
 *
 * Tidak menulis ulang service/RPC -- cuma reshape data di lapisan tampilan,
 * sesuai catatan TODO v13/v14 (reuse service layer, jangan dibangun ulang).
 *
 * @param {Array} entries - hasil dari getPackageLeaderboard(packageId)
 * @param {string} currentUserId - untuk menandai baris "current"
 * @returns {Array} rows siap dipakai <PackageLeaderboardCard rows={...} />
 */
export function mapToLeaderboardRows(entries = [], currentUserId) {
  return entries.map((entry) => {
    const isCurrentUser = entry.userId === currentUserId;

    // Masking: kalau isAnonymous, sembunyikan nama & lokasi persis seperti
    // pola yang sudah dipakai LeaderboardSection.jsx (widget di PackageInfoPage).
    if (entry.isAnonymous && !isCurrentUser) {
      return {
        rank: entry.rank,
        id: entry.userId,
        name: "Peserta",
        location: "Lokasi formasi disembunyikan",
        score: entry.score,
        duration: formatDuration(entry.duration),
        variant: "hidden",
      };
    }

    const location = [entry.province, entry.city].filter(Boolean).join(" - ");

    return {
      rank: entry.rank,
      id: entry.userId,
      name: entry.name,
      avatarUrl: entry.avatarUrl,
      location: location || "-",
      locationKey: entry.province,
      score: entry.score,
      duration: formatDuration(entry.duration),
      variant: isCurrentUser ? "current" : "normal",
    };
  });
}

/** Terima detik atau menit dari backend; sesuaikan kalau format aslinya beda. */
function formatDuration(duration) {
  if (duration == null) return "-";
  if (typeof duration === "string") return duration;
  return `${duration}m`;
}
