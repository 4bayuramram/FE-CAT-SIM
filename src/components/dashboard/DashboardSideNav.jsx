import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Avatar from "../common/Avatar";

export const DASHBOARD_TABS = [
  { key: "overview", label: "Ringkasan", icon: SpaceDashboardRoundedIcon },
  { key: "packages", label: "Paket Saya", icon: Inventory2RoundedIcon },
  { key: "latihan", label: "Latihan", icon: MenuBookRoundedIcon },
  { key: "scores", label: "Hasil", icon: BarChartRoundedIcon },
  { key: "performa", label: "Performa", icon: TimelineRoundedIcon },
  { key: "account", label: "Akun", icon: PersonRoundedIcon },
];

const QUICK_LINKS = [
  { key: "try-out", label: "Jelajahi Try Out", icon: AssignmentRoundedIcon },
  { key: "leaderboard", label: "Leaderboard Lengkap", icon: LeaderboardRoundedIcon },
  { key: "bantuan", label: "Bantuan", icon: HelpRoundedIcon },
];

/**
 * DashboardSideNav — sidebar APP-SHELL, fixed penuh tinggi layar
 * (h-screen, dari top-0), bukan sidebar yang ikut scroll di bawah
 * navbar situs. Ini dashboard "pada umumnya": sidebar murni untuk
 * BERPINDAH TAB di dalam halaman yang sama (activeTab), bukan link
 * yang pindah halaman/route.
 *
 * "Tautan Lain" di bagian bawah TETAP link beneran (pindah route) --
 * dipisah jelas dari menu tab, karena tujuannya memang keluar dari
 * shell dashboard ini (mis. mulai ujian di /home/simulasi).
 *
 * Props:
 * - activeTab: key tab yang aktif, lihat DASHBOARD_TABS
 * - onTabChange(key): ganti tab (murni state, tidak ada navigasi)
 * - onNavigate(key): untuk QUICK_LINKS (route beneran)
 * - onLogout
 * - profile: { name, avatarUrl }
 */
export default function DashboardSideNav({
  activeTab = "overview",
  onTabChange,
  onNavigate,
  onLogout,
  profile = {},
}) {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 xl:w-72 bg-white border-r border-[var(--db-outline-variant)] py-6 px-4 z-40">
      {/* Brand */}
      <div className="px-2 mb-8">
        <h1 className="text-xl font-black text-[var(--db-primary)]">CPNZ</h1>
        <p className="text-xs text-[var(--db-on-surface-variant)]">Dashboard Peserta</p>
      </div>

      {/* Profil ringkas */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <Avatar src={profile.avatarUrl} name={profile.name} size="w-10 h-10" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--db-on-surface)] truncate">
            {profile.name || "Peserta"}
          </p>
          <p className="text-[11px] text-[var(--db-on-surface-variant)]">Member</p>
        </div>
      </div>

      {/* TAB MURNI — ganti konten main di kanan, TIDAK pindah halaman */}
      <nav className="flex flex-col gap-1" role="tablist" aria-label="Bagian dashboard">
        {DASHBOARD_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange?.(tab.key)}
              className={
                isActive
                  ? "flex items-center gap-3 px-3 py-2.5 bg-[var(--db-secondary-container)] text-[var(--db-on-secondary-container)] rounded-xl font-bold text-left transition-colors"
                  : "flex items-center gap-3 px-3 py-2.5 text-[var(--db-on-surface-variant)] hover:bg-[var(--db-surface-container-high)] rounded-xl text-left transition-colors"
              }
            >
              <Icon
                fontSize="small"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tautan lain — route beneran, sengaja dipisah dari tab di atas */}
      <div className="mt-8 pt-4 border-t border-[var(--db-outline-variant)]">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--db-outline)]">
          Lainnya
        </p>
        <nav className="flex flex-col gap-1">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate?.(item.key)}
                className="flex items-center gap-3 px-3 py-2.5 text-[var(--db-on-surface-variant)] hover:bg-[var(--db-surface-container-high)] rounded-xl text-left transition-colors"
              >
                <Icon fontSize="small" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-[var(--db-error)] hover:bg-[var(--db-error-container)] rounded-xl transition-all text-left mt-4"
        >
          <LogoutRoundedIcon fontSize="small" />
          <span className="text-sm font-semibold">Keluar</span>
        </button>
      )}
    </aside>
  );
}
