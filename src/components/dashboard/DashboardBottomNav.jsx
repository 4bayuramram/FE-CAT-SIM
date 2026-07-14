import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { DASHBOARD_TABS } from "./DashboardSideNav";

/**
 * DashboardBottomNav — versi mobile dari tab sidebar, model TABBED
 * INTERFACE (bukan link pindah halaman) — tab yang SAMA PERSIS
 * dengan DashboardSideNav (DASHBOARD_TABS), supaya perilaku desktop &
 * mobile konsisten satu sumber. Tautan "Lainnya" (try-out/leaderboard/
 * bantuan/logout) dipindah ke dalam tab "Akun" (lihat DashboardAccountTab),
 * karena ruang bottom-nav mobile terbatas.
 *
 * Props:
 * - activeTab (default "overview")
 * - onTabChange(key)
 */
const ICONS = {
  overview: SpaceDashboardRoundedIcon,
  packages: Inventory2RoundedIcon,
  latihan: MenuBookRoundedIcon,
  scores: BarChartRoundedIcon,
  performa: TimelineRoundedIcon,
  account: PersonRoundedIcon,
};

export default function DashboardBottomNav({ activeTab = "overview", onTabChange }) {
  return (
    <nav
      role="tablist"
      aria-label="Bagian dashboard"
      className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[var(--db-surface)]/95 backdrop-blur-md border-t border-[var(--db-outline-variant)] flex justify-around items-center px-2 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
    >
      {DASHBOARD_TABS.map((tab) => {
        const Icon = ICONS[tab.key];
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
                ? "flex flex-col items-center justify-center text-[var(--db-primary)] bg-[var(--db-secondary-container)]/20 rounded-xl px-4 py-1.5 scale-95 min-w-[4.5rem]"
                : "flex flex-col items-center justify-center text-[var(--db-on-surface-variant)] px-4 py-1.5 min-w-[4.5rem]"
            }
          >
            <Icon
              fontSize="small"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            />
            <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
