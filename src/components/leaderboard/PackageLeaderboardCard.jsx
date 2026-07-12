import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LeaderboardTableHeader from "./LeaderboardTableHeader";
import LeaderboardRow from "./LeaderboardRow";

/**
 * Kartu leaderboard untuk satu paket. Dua mode:
 * - locked = true  -> tampilkan CTA "Beli paket ini untuk melihat statistik..."
 * - locked = false -> tampilkan header kolom + daftar LeaderboardRow
 *
 * Props:
 * - name: nama paket ("Paket SKD Premium")
 * - badge: label kecil opsional di sebelah nama (mis. "Hot")
 * - participantsCount: number, dipakai untuk teks "X Peserta terdaftar"
 * - rows: [{ rank, id, name, avatarUrl, location, score, duration, variant }]
 * - locked: boolean
 * - onDetailClick: handler tombol "Detail Paket"
 */
export default function PackageLeaderboardCard({
  name,
  badge,
  participantsCount,
  rows = [],
  locked = false,
  onDetailClick,
}) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--lb-primary-container)] shadow-md overflow-hidden">
      <div className="p-4 md:p-6 bg-[var(--lb-surface-container-low)] border-b border-[var(--lb-outline-variant)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[var(--lb-primary-container)]">
              {name}
            </h2>
            {badge && (
              <span className="bg-[var(--lb-secondary-container)] text-[var(--lb-primary)] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {badge}
              </span>
            )}
          </div>
          {typeof participantsCount === "number" && (
            <p className="text-sm text-[var(--lb-on-surface-variant)] flex items-center gap-1 mt-1">
              <GroupsRoundedIcon style={{ fontSize: 18 }} />
              {participantsCount.toLocaleString("id-ID")} Peserta terdaftar
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onDetailClick}
          className="px-5 py-2 border-2 border-[var(--lb-primary-container)] text-[var(--lb-primary-container)] font-bold rounded-xl hover:bg-[var(--lb-primary-container)] hover:text-white transition-colors uppercase text-sm shrink-0"
        >
          Detail Paket
        </button>
      </div>

      {locked ? (
        <div className="p-8 text-center bg-[var(--lb-surface-container-lowest)]">
          <VisibilityOffRoundedIcon
            style={{ fontSize: 48 }}
            className="text-[var(--lb-outline-variant)]"
          />
          <p className="mt-4 text-[var(--lb-on-surface-variant)] font-medium">
            Beli paket ini untuk melihat statistik lengkap peringkat Anda.
          </p>
        </div>
      ) : (
        <div className="p-2 md:p-4">
          <LeaderboardTableHeader />
          <div className="flex flex-col gap-2 max-h-[420px] md:max-h-[560px] overflow-y-auto pr-1 leaderboard-scrollbar">
            {rows.map((row) => (
              <LeaderboardRow key={row.id ?? row.rank} {...row} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
