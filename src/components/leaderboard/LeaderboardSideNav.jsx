import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const DEFAULT_NAV_ITEMS = [
  { key: "home", label: "Home", icon: HomeRoundedIcon },
  { key: "try-out", label: "Try Out", icon: DescriptionRoundedIcon },
  { key: "leaderboard", label: "Leaderboard", icon: LeaderboardRoundedIcon },
  { key: "analisis", label: "Analisis", icon: BarChartRoundedIcon },
  { key: "profil", label: "Profil", icon: PersonRoundedIcon },
];

/**
 * Navigasi sisi kiri untuk desktop (disembunyikan di mobile, dipakai
 * BottomNav sebagai gantinya). Komponen ini OPSIONAL -- kalau project
 * sudah punya sidebar sendiri (mis. SidebarPaid), cukup jangan pakai
 * komponen ini dan render LeaderboardPageDb dengan showSideNav={false}.
 *
 * UPDATE: kartu bawah sidebar SEBELUMNYA teks generik "CPNS 2024 /
 * Upgrade Pro / Buka semua fitur analisis dan materi eksklusif / BELI
 * PAKET PRO" -- membingungkan karena user yang lihat halaman ini SUDAH
 * PUNYA akses paket (leaderboard cuma bisa diakses lewat paket yang
 * sudah dibeli, lihat ProtectedExamLayoutDb). Sekarang kartu itu
 * menampilkan info paket yang sedang dilihat leaderboard-nya, bukan
 * ajakan beli paket lain.
 *
 * Props:
 * - activeKey: key item yang sedang aktif (default "leaderboard")
 * - navItems: override daftar menu
 * - onNavigate(key): handler klik menu
 * - packageInfo: { eyebrow?, title, description?, cta? } — info paket
 *   yang lagi dilihat leaderboard-nya. Kalau tidak diisi, kartu ini
 *   disembunyikan (bukan fallback ke teks generik).
 * - onPackageInfoClick: handler tombol CTA di kartu (biasanya arahkan
 *   balik ke halaman info paket)
 */
export default function LeaderboardSideNav({
  activeKey = "leaderboard",
  navItems = DEFAULT_NAV_ITEMS,
  onNavigate,
  packageInfo,
  onPackageInfoClick,
}) {
  return (
    <aside className="hidden lg:flex flex-col w-64 gap-4 shrink-0">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate?.(item.key)}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 bg-[var(--lb-secondary-container)] text-[var(--lb-on-secondary-container)] rounded-xl font-bold translate-x-1 transition-transform text-left"
                  : "flex items-center gap-3 px-4 py-3 text-[var(--lb-on-surface-variant)] hover:bg-[var(--lb-surface-container-high)] rounded-xl transition-all text-left"
              }
            >
              <Icon
                fontSize="small"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {packageInfo && (
        <div className="mt-8 p-4 bg-[var(--lb-primary-container)] rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 opacity-80">
              <InfoRoundedIcon style={{ fontSize: 14 }} />
              <p className="text-xs font-bold uppercase tracking-widest">
                {packageInfo.eyebrow ?? "Paket ini"}
              </p>
            </div>
            <h3 className="text-lg font-bold mt-1 leading-snug">
              {packageInfo.title}
            </h3>
            {packageInfo.description && (
              <p className="text-sm mt-2 text-[#d3e3ff] leading-relaxed line-clamp-4">
                {packageInfo.description}
              </p>
            )}
            {onPackageInfoClick && (
              <button
                type="button"
                onClick={onPackageInfoClick}
                className="mt-4 w-full py-3 bg-[var(--lb-secondary-container)] text-[var(--lb-primary)] font-bold rounded-xl hover:scale-105 transition-transform text-sm"
              >
                {packageInfo.cta ?? "LIHAT INFO PAKET"}
              </button>
            )}
          </div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
        </div>
      )}
    </aside>
  );
}
