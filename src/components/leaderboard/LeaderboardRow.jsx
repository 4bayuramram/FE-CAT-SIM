import LockRoundedIcon from "@mui/icons-material/LockRounded";

/**
 * Satu baris peringkat peserta. Reusable untuk 3 kondisi:
 * - "normal": peserta biasa
 * - "current": baris milik user yang sedang login (highlight + badge "Anda")
 * - "hidden": identitas disembunyikan (mis. peserta opt-out leaderboard,
 *    atau baris "terkunci" karena user belum beli paket)
 *
 * Props:
 * - rank: number
 * - name: string (untuk variant "hidden" biasanya diisi "Peserta")
 * - avatarUrl: string | undefined (kalau kosong & variant normal/current,
 *   dipakai fallback inisial dari `name`)
 * - location: string (nama instansi/lokasi formasi, atau teks masking)
 * - score: number | string
 * - duration: string (misal "85m")
 * - variant: "normal" | "current" | "hidden"
 */
export default function LeaderboardRow({
  rank,
  name,
  avatarUrl,
  location,
  score,
  duration,
  variant = "normal",
}) {
  const isCurrent = variant === "current";
  const isHidden = variant === "hidden";

  const rankBadgeClass = isCurrent
    ? "bg-[var(--lb-primary-container)] text-white"
    : isHidden
    ? "bg-[var(--lb-surface-variant)] text-[var(--lb-on-surface-variant)]"
    : "bg-[var(--lb-secondary-container)] text-[var(--lb-primary)]";

  const cardClass = isCurrent
    ? "leaderboard-card grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 bg-[var(--lb-surface-container-low)] border-2 border-[var(--lb-primary-container)] rounded-2xl shadow-lg relative"
    : isHidden
    ? "leaderboard-card grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 bg-white border border-[var(--lb-outline-variant)] rounded-2xl opacity-80"
    : "leaderboard-card grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 bg-white border border-[var(--lb-outline-variant)] rounded-2xl";

  const nameClass = isCurrent
    ? "font-black text-[var(--lb-primary-container)]"
    : isHidden
    ? "font-bold text-[var(--lb-outline)]"
    : "font-bold text-[var(--lb-on-surface)]";

  const locationClass = isCurrent
    ? "text-[var(--lb-primary-container)] font-bold"
    : isHidden
    ? "text-[var(--lb-outline)]"
    : "text-[var(--lb-on-surface-variant)] font-medium";

  const scoreClass = isHidden
    ? "text-[var(--lb-outline)]"
    : isCurrent
    ? "text-[var(--lb-primary)]"
    : "text-[var(--lb-primary-container)]";

  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className={cardClass}>
      {isCurrent && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-[var(--lb-primary-container)] rounded-r-full hidden md:block" />
      )}

      {/* Rank */}
      <div className="md:col-span-1 flex items-center">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${rankBadgeClass}`}
        >
          {rank}
        </div>
      </div>

      {/* Peserta (avatar + nama, lokasi tampil di sini khusus mobile) */}
      <div className="md:col-span-5 flex items-center gap-4">
        {isHidden ? (
          <div className="w-12 h-12 rounded-full bg-[var(--lb-surface-container)] flex items-center justify-center shrink-0">
            <LockRoundedIcon fontSize="small" className="text-[var(--lb-outline)]" />
          </div>
        ) : avatarUrl ? (
          <img
            className={`w-12 h-12 rounded-full object-cover shrink-0 ${
              isCurrent ? "" : "border-2 border-[var(--lb-secondary-container)]"
            }`}
            src={avatarUrl}
            alt={name}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--lb-primary-container)] text-white flex items-center justify-center font-black shrink-0">
            {initial}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`${nameClass} truncate`}>{name}</h4>
            {isCurrent && (
              <span className="bg-[var(--lb-primary)] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                Anda
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--lb-outline)] md:hidden italic truncate">
            {location}
          </p>
        </div>
      </div>

      {/* Lokasi formasi (desktop only) */}
      <div
        className={`hidden md:block md:col-span-3 text-right text-sm italic truncate ${locationClass}`}
      >
        {location}
      </div>

      {/* Skor */}
      <div className={`md:col-span-1 text-right font-black ${scoreClass}`}>
        {score}
      </div>

      {/* Durasi */}
      <div
        className={`md:col-span-2 text-right text-sm ${
          isCurrent ? "text-[var(--lb-primary-container)] font-bold" : "text-[var(--lb-outline)]"
        }`}
      >
        {duration}
      </div>
    </div>
  );
}
