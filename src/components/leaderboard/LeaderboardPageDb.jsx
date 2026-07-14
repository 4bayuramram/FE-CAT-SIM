import { useState } from "react";
import "./leaderboard-theme.css";


import LeaderboardSideNav from "./LeaderboardSideNav";
import LeaderboardCategoryTabs from "./LeaderboardCategoryTabs";
import PackageLeaderboardCard from "./PackageLeaderboardCard";
import LeaderboardSearchCard from "./LeaderboardSearchCard";
import LeaderboardPersonalStatsCard from "./LeaderboardPersonalStatsCard";
import LeaderboardLocationSearchSection from "./LeaderboardLocationSearchSection";
import LeaderboardBottomNav from "./LeaderboardBottomNav";

/**
 * Halaman Leaderboard (versi lengkap, bukan widget ringkas seperti di
 * PackageInfoPage). Sesuai TODO item 1: per paket, bukan gabungan/aggregate
 * semua paket.
 *
 * Komponen ini PURE / PRESENTATIONAL -- semua data & aksi datang dari props,
 * tidak melakukan fetch sendiri. Untuk versi yang benar-benar konek ke
 * Supabase (reuse getPackageLeaderboard.js + RPC get_package_leaderboard),
 * lihat contoh wrapper di:
 *   src/pages/leaderboard/LeaderboardPageContainer.jsx
 *
 * Props:
 * - userName: string, nama user login (tampil di TopBar)
 * - categories: [{ key, label }]
 * - packages: [{
 *     id, name, badge?, participantsCount, locked,
 *     rows: [{ rank, id, name, avatarUrl, location, score, duration, variant }],
 *     category: string  // dipakai untuk filter tab, samakan dengan `categories[].key`
 *   }]
 * - stats: { avgScore, percentile, comparisonPercent, totalParticipants }
 * - locations: [{ key, label }]  untuk filter di sidebar kanan
 * - showSideNav / showBottomNav: boolean, matikan kalau project sudah
 *   punya navigasi sendiri (default true)
 * - onBack, onDetailClick(packageId), onNavigate(key)
 *
 * Kartu bawah sidebar (LeaderboardSideNav) menampilkan info paket yang
 * sedang dilihat -- diambil otomatis dari `packages[0]` (halaman ini
 * memang selalu 1 paket per URL, lihat TODO item 1), BUKAN teks promo
 * generik lagi. CTA-nya reuse onDetailClick yang sudah ada.
 */
export default function LeaderboardPageDb({
  userName = "Peserta",
  categories,
  packages = [],
  stats,
  locations,
  showSideNav = true,
  showBottomNav = true,
  onBack,
  onDetailClick,
  onNavigate,
}) {
  // Tab level halaman: "paket" = leaderboard per paket (perilaku lama,
  // tidak berubah), "wilayah" = fitur baru "Cari Peringkat SKD per
  // Provinsi/Kota" (search bebas, lihat LeaderboardLocationSearchSection).
  // Dua hal ini SENGAJA dipisah dari activeCategory (SKD/TWK/TIU/TKP di
  // bawah) karena beda level: activeCategory memfilter paket, sedangkan
  // ini menentukan konten utama apa yang tampil di halaman.
  const [activeView, setActiveView] = useState("paket");

  const [activeCategory, setActiveCategory] = useState(
    categories?.[0]?.key ?? "semua"
  );
  const [activeLocation, setActiveLocation] = useState(
    locations?.[0]?.key ?? "semua"
  );
  const [search, setSearch] = useState("");

  const visiblePackages = packages.filter((pkg) => {
    const matchesCategory =
      activeCategory === "semua" || pkg.category === activeCategory;

    const matchesSearch =
      !search.trim() ||
      pkg.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      pkg.rows?.some((row) =>
        row.location?.toLowerCase().includes(search.trim().toLowerCase())
      );

    const matchesLocation =
      activeLocation === "semua" ||
      pkg.rows?.some((row) => row.locationKey === activeLocation);

    return matchesCategory && matchesSearch && matchesLocation;
  });

  // Paket info di sidebar cuma masuk akal kalau halaman ini lagi fokus
  // ke SATU paket (mis. dibuka lewat entry point tertentu). Di halaman
  // hub "/home/leaderboard" (semua paket dibeli), currentPackage tidak
  // dipakai karena tidak ada satu paket yang lebih relevan dari lainnya.
  const currentPackage = packages.length === 1 ? packages[0] : null;
  const packageInfo = currentPackage
    ? {
        eyebrow: currentPackage.category
          ? currentPackage.category.toUpperCase()
          : "Paket ini",
        title: currentPackage.name,
        description: currentPackage.description,
        cta: "LIHAT INFO PAKET",
      }
    : null;

  return (
    <div className="leaderboard-page min-h-screen pt-24 bg-[var(--lb-surface)] text-[var(--lb-on-surface)]">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-6 pb-24 lg:pb-8">
        {showSideNav && (
          <LeaderboardSideNav
            activeKey="leaderboard"
            onNavigate={onNavigate}
            packageInfo={packageInfo}
            onPackageInfoClick={
              currentPackage
                ? () => onDetailClick?.(currentPackage.id)
                : undefined
            }
          />
        )}

        <section className="flex-1 flex flex-col gap-8 min-w-0">
          <div role="tablist" className="flex gap-2">
            <button
              type="button"
              role="tab"
              aria-selected={activeView === "paket"}
              onClick={() => setActiveView("paket")}
              className={
                activeView === "paket"
                  ? "px-5 py-2.5 rounded-xl bg-[var(--lb-primary)] text-white font-bold text-sm"
                  : "px-5 py-2.5 rounded-xl border border-[var(--lb-outline-variant)] text-[var(--lb-on-surface-variant)] font-bold text-sm hover:bg-[var(--lb-surface-container)]"
              }
            >
              Leaderboard Paket
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === "wilayah"}
              onClick={() => setActiveView("wilayah")}
              className={
                activeView === "wilayah"
                  ? "px-5 py-2.5 rounded-xl bg-[var(--lb-primary)] text-white font-bold text-sm"
                  : "px-5 py-2.5 rounded-xl border border-[var(--lb-outline-variant)] text-[var(--lb-on-surface-variant)] font-bold text-sm hover:bg-[var(--lb-surface-container)]"
              }
            >
              Cari Peringkat Wilayah
            </button>
          </div>

          {activeView === "wilayah" ? (
            <LeaderboardLocationSearchSection
              onStartSkd={() => onNavigate?.("try-out")}
            />
          ) : (
            <>
              <LeaderboardCategoryTabs
                categories={categories}
                activeKey={activeCategory}
                onChange={setActiveCategory}
              />

              {visiblePackages.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[var(--lb-outline-variant)] p-10 text-center text-[var(--lb-on-surface-variant)]">
                  {packages.length === 0
                    ? "Kamu belum membeli paket apa pun. Leaderboard akan muncul di sini setelah kamu punya akses ke minimal satu paket."
                    : "Belum ada data leaderboard untuk kategori ini."}
                </div>
              ) : (
                visiblePackages.map((pkg) => (
                  <PackageLeaderboardCard
                    key={pkg.id}
                    name={pkg.name}
                    badge={pkg.badge}
                    participantsCount={pkg.participantsCount}
                    rows={pkg.rows}
                    locked={pkg.locked}
                    onDetailClick={() => onDetailClick?.(pkg.id)}
                  />
                ))
              )}
            </>
          )}
        </section>

        {activeView === "paket" && (
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">
              <LeaderboardSearchCard
                searchValue={search}
                onSearchChange={setSearch}
                locations={locations}
                activeLocation={activeLocation}
                onLocationChange={setActiveLocation}
              />
              {stats && <LeaderboardPersonalStatsCard {...stats} />}
            </div>
          </aside>
        )}
      </main>

      {showBottomNav && (
        <LeaderboardBottomNav activeKey="leaderboard" onNavigate={onNavigate} />
      )}
    </div>
  );
}
