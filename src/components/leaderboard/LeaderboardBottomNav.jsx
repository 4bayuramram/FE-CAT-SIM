import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const DEFAULT_ITEMS = [
  { key: "home", label: "Beranda", icon: HomeRoundedIcon },
  { key: "try-out", label: "Tryout", icon: AssignmentRoundedIcon },
  { key: "leaderboard", label: "Ranking", icon: MilitaryTechRoundedIcon },
  { key: "profil", label: "Profil", icon: PersonRoundedIcon },
];

/**
 * Navigasi bawah untuk mobile (disembunyikan di layar lg ke atas lewat
 * pemanggilnya, lihat LeaderboardPageDb). OPSIONAL, sama seperti
 * LeaderboardSideNav -- kalau project sudah punya bottom nav sendiri
 * (mis. BottomNavPaid), lewati komponen ini.
 *
 * Props:
 * - activeKey (default "leaderboard")
 * - items: override daftar menu
 * - onNavigate(key)
 */
export default function LeaderboardBottomNav({
  activeKey = "leaderboard",
  items = DEFAULT_ITEMS,
  onNavigate,
}) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[var(--lb-surface)]/90 backdrop-blur-md border-t border-[var(--lb-outline-variant)] flex justify-around items-center px-4 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate?.(item.key)}
            className={
              isActive
                ? "flex flex-col items-center justify-center text-[var(--lb-primary)] bg-[var(--lb-secondary-container)]/20 rounded-xl px-4 py-1 scale-90"
                : "flex flex-col items-center justify-center text-[var(--lb-on-surface-variant)]"
            }
          >
            <Icon
              fontSize="small"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
