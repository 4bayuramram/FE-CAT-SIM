import DashboardPackageCard from "./DashboardPackageCard";

/**
 * DashboardPackagesSection — grid "Paket Saya" + empty state.
 *
 * Props:
 * - packages: [{
 *     id, title, category, questionCount, durationMinutes,
 *     attempted, score, rank
 *   }]
 * - onDetailClick(pkg), onLeaderboardClick(pkg), onExploreClick
 */
export default function DashboardPackagesSection({
  packages = [],
  onDetailClick,
  onLeaderboardClick,
  onExploreClick,
}) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-[var(--db-on-surface)]">
          Paket Saya
        </h4>
        <button
          type="button"
          onClick={onExploreClick}
          className="text-sm text-[var(--db-primary-container)] font-semibold hover:underline"
        >
          Jelajahi Paket Lain
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[var(--db-outline-variant)] p-10 text-center text-[var(--db-on-surface-variant)]">
          <p className="font-semibold">Kamu belum memiliki paket try out.</p>
          <p className="text-sm mt-1">
            Paket yang kamu beli (atau paket gratis yang kamu kerjakan) akan
            muncul di sini.
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="mt-4 px-5 py-2 bg-[var(--db-primary-container)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Lihat Paket Try Out
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <DashboardPackageCard
              key={pkg.id}
              title={pkg.title}
              category={pkg.category}
              questionCount={pkg.questionCount}
              durationMinutes={pkg.durationMinutes}
              attempted={pkg.attempted}
              score={pkg.score}
              rank={pkg.rank}
              onDetailClick={() => onDetailClick?.(pkg)}
              onLeaderboardClick={() => onLeaderboardClick?.(pkg)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
