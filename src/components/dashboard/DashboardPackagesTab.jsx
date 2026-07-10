import DashboardPackagesSection from "./DashboardPackagesSection";

/**
 * DashboardPackagesTab — isi tab "Paket Saya". Pembungkus tipis di atas
 * DashboardPackagesSection supaya konsisten dengan tab lain (punya
 * heading halaman sendiri, bukan cuma judul section kecil).
 */
export default function DashboardPackagesTab({
  packages,
  onDetailClick,
  onLeaderboardClick,
  onExploreClick,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[var(--db-primary)]">
          Paket Saya
        </h2>
        <p className="text-sm text-[var(--db-on-surface-variant)] mt-1">
          Semua paket try out yang kamu miliki, lengkap dengan status
          pengerjaan.
        </p>
      </div>

      <DashboardPackagesSection
        packages={packages}
        onDetailClick={onDetailClick}
        onLeaderboardClick={onLeaderboardClick}
        onExploreClick={onExploreClick}
      />
    </div>
  );
}
