import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DashboardAccountCard from "./DashboardAccountCard";

const LINKS = [
  { key: "try-out", label: "Jelajahi Try Out", icon: AssignmentRoundedIcon },
  { key: "leaderboard", label: "Leaderboard Lengkap", icon: LeaderboardRoundedIcon },
  { key: "bantuan", label: "Bantuan", icon: HelpRoundedIcon },
];

/**
 * DashboardAccountTab — isi tab "Akun".
 *
 * Sengaja menampung tautan ke halaman lain (try-out/leaderboard/
 * bantuan) + tombol keluar -- di desktop tautan yang sama juga ada di
 * sidebar ("Lainnya"), tapi di MOBILE bottom-nav tidak ada ruang untuk
 * itu, jadi tab ini adalah satu-satunya tempat aksesnya di mobile.
 */
export default function DashboardAccountTab({ profile, onNavigate, onLogout }) {
  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[var(--db-primary)]">
          Akun
        </h2>
        <p className="text-sm text-[var(--db-on-surface-variant)] mt-1">
          Info profil dan akses cepat ke halaman lain.
        </p>
      </div>

      <DashboardAccountCard
        name={profile?.name}
        email={profile?.email}
        avatarUrl={profile?.avatarUrl}
        domicile={profile?.domicile}
      />

      <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] overflow-hidden">
        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate?.(item.key)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--db-surface-container-low)] transition-colors border-b border-[var(--db-outline-variant)] last:border-b-0"
            >
              <Icon fontSize="small" className="text-[var(--db-primary-container)]" />
              <span className="flex-1 text-sm font-semibold text-[var(--db-on-surface)]">
                {item.label}
              </span>
              <ChevronRightRoundedIcon
                fontSize="small"
                className="text-[var(--db-outline)]"
              />
            </button>
          );
        })}
      </div>

      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-[var(--db-error)] text-[var(--db-error)] font-bold hover:bg-[var(--db-error-container)] transition-colors"
        >
          <LogoutRoundedIcon fontSize="small" />
          Keluar
        </button>
      )}
    </div>
  );
}
