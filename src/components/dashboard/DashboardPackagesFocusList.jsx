import DashboardPackageCard from "./DashboardPackageCard";

/**
 * DashboardPackagesFocusList — focus view untuk klik DashboardProgressCard
 * / kartu statistik "Paket Dimiliki" & "Sudah Dikerjakan" di tab
 * Ringkasan. Reuse DashboardPackageCard yang sudah dipakai di tab
 * "Paket Saya", cuma di-filter sesuai konteks klik — tidak ada bentuk
 * data baru.
 *
 * Props:
 * - packages: sama seperti DashboardPackagesSection
 * - filter: "all" | "done" | "todo"
 * - onDetailClick(pkg), onLeaderboardClick(pkg)
 */
export default function DashboardPackagesFocusList({
  packages = [],
  filter = "all",
  onDetailClick,
  onLeaderboardClick,
}) {
  const filtered =
    filter === "done"
      ? packages.filter((p) => p.status === "completed" || p.attempted)
      : filter === "todo"
      ? packages.filter((p) => (p.status ?? (p.attempted ? "completed" : "not_started")) !== "completed")
      : packages;

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-[var(--db-on-surface-variant)] py-6 text-center">
        Tidak ada paket untuk ditampilkan di sini.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filtered.map((pkg) => (
        <DashboardPackageCard
          key={pkg.id}
          title={pkg.title}
          category={pkg.category}
          questionCount={pkg.questionCount}
          durationMinutes={pkg.durationMinutes}
          status={pkg.status}
          attempted={pkg.attempted}
          score={pkg.score}
          rank={pkg.rank}
          onDetailClick={() => onDetailClick?.(pkg)}
          onLeaderboardClick={() => onLeaderboardClick?.(pkg)}
        />
      ))}
    </div>
  );
}
