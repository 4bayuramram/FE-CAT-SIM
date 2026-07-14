import { useState } from "react";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import "./dashboard-theme.css";

import DashboardSideNav from "./DashboardSideNav";
import DashboardBottomNav from "./DashboardBottomNav";
import DashboardOverviewTab from "./DashboardOverviewTab";
import DashboardPackagesTab from "./DashboardPackagesTab";
import DashboardLatihanTab from "./DashboardLatihanTab";
import DashboardScoresTab from "./DashboardScoresTab";
import DashboardPerformanceTab from "./DashboardPerformanceTab";
import DashboardAccountTab from "./DashboardAccountTab";

const TAB_TITLES = {
  overview: "Ringkasan",
  packages: "Paket Saya",
  latihan: "Latihan",
  scores: "Hasil",
  performa: "Performa",
  account: "Akun",
};

/**
 * DashboardPageDb — APP SHELL Dashboard.
 *
 * Model "dashboard pada umumnya": sidebar (desktop) / bottom nav
 * (mobile) MURNI untuk berpindah TAB di konten kanan lewat state
 * `activeTab` -- bukan link yang pindah route/halaman. Sidebar fixed
 * penuh tinggi layar (h-screen dari top-0), konten utama full-width di
 * sisa layar (bukan dibatasi max-w-6xl kecil di tengah).
 *
 * Navigasi yang BENERAN pindah halaman (mis. mulai ujian, ke halaman
 * Try Out/Leaderboard/Bantuan) tetap lewat props onNavigate /
 * onPackageDetail / onContinueStart -- dipanggil dari dalam tab "Akun"
 * (mobile) atau blok "Lainnya" di sidebar (desktop), bukan dari tab
 * utama.
 *
 * Komponen ini PURE / PRESENTATIONAL -- semua data & aksi datang dari
 * props. Untuk versi yang konek ke Supabase (dengan fallback data
 * contoh kalau belum ada data asli, lihat mockDashboardData.js), lihat
 * src/pages/dashboard/DashboardPageContainer.jsx.
 *
 * Props:
 * - isMock: boolean — kalau true, tampilkan penanda "Data Contoh" di
 *   top bar (dashboard sedang menampilkan fallback dari
 *   mockDashboardData.js, bukan data asli user)
 * - profile: { name, email, avatarUrl, domicile }
 * - stats: { totalPackages, attemptedPackages, avgScore, bestRank,
 *     categoryAverages: { skd, twk, tiu, tkp } }
 * - nextPackage: { id, title } | null
 * - packages: [{ id, title, category, questionCount, durationMinutes,
 *     attempted, score, rank }]
 * - scoreSummaryRows: [{ id, title, category, score, rank }]
 * - featuredLeaderboard: { packageTitle, rows, currentUserRow } | null
 * - skdRanking: { national, province, city } | null — lihat
 *   DashboardSkdRankingSection untuk bentuk tiap cakupan
 * - attempts: riwayat multi-percobaan untuk tab Performa, lihat
 *   DashboardPerformanceTab
 * - transactions: riwayat transaksi (pembelian paket) untuk menu
 *   "Riwayat Transaksi" di tab Akun, lihat DashboardAccountTab &
 *   services/payment/getTransactionHistory.js
 * - onNavigate(key): "try-out" | "leaderboard" | "bantuan"
 * - onPackageDetail(pkg), onPackageLeaderboard(pkg), onExplorePackages()
 * - onContinueStart(), onSeeFullLeaderboard(), onLogout()
 * - onStartLatihan(paketId): tab "Latihan" — paket hardcode/non-DB
 *   (src/data/paket1-4.js), beda sumber dari `packages` di atas. Diisi
 *   dari DashboardPageContainer, navigate ke `/exam-page/:paketId`.
 */
export default function DashboardPageDb({
  isMock = false,
  profile = {},
  stats = {},
  nextPackage = null,
  packages = [],
  scoreSummaryRows = [],
  featuredLeaderboard = null,
  skdRanking = null,
  attempts = [],
  transactions = [],
  onNavigate,
  onPackageDetail,
  onPackageLeaderboard,
  onExplorePackages,
  onContinueStart,
  onSeeFullLeaderboard,
  onLogout,
  onLeaderboardConsentChange,
  onStartLatihan,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard-page min-h-screen bg-[var(--db-surface)] text-[var(--db-on-surface)]">
      <DashboardSideNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNavigate={onNavigate}
        onLogout={onLogout}
        profile={profile}
      />

      {/* lg:pl-64/xl:pl-72 menyisakan ruang untuk sidebar fixed di
          desktop; konten sisanya full-width (bukan dibatasi max-w
          sempit), supaya benar-benar memenuhi layar seperti dashboard
          pada umumnya. */}
      <div className="lg:pl-64 xl:pl-72 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[var(--db-surface)]/90 backdrop-blur-md border-b border-[var(--db-outline-variant)] px-4 md:px-8 h-16 flex items-center justify-between gap-3">
          <h1 className="text-base md:text-lg font-bold text-[var(--db-primary)]">
            {TAB_TITLES[activeTab] ?? "Dashboard"}
          </h1>

          {isMock && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--db-secondary-container)]/30 text-[var(--db-on-secondary-container)] text-[11px] font-bold uppercase tracking-wide shrink-0">
              <InfoRoundedIcon style={{ fontSize: 14 }} />
              Data Contoh
            </span>
          )}
        </header>

        <main className="flex-1 w-full max-w-[1600px] px-4 md:px-8 py-6 pb-28 lg:pb-10">
          {activeTab === "overview" && (
            <DashboardOverviewTab
              profile={profile}
              stats={stats}
              nextPackage={nextPackage}
              hasAnyPackage={packages.length > 0}
              packages={packages}
              scoreSummaryRows={scoreSummaryRows}
              featuredLeaderboard={featuredLeaderboard}
              skdRanking={skdRanking}
              onContinueStart={onContinueStart}
              onSeeFullLeaderboard={onSeeFullLeaderboard}
              onPackageDetail={onPackageDetail}
              onPackageLeaderboard={onPackageLeaderboard}
              onGoToScoresTab={() => setActiveTab("scores")}
            />
          )}

          {activeTab === "packages" && (
            <DashboardPackagesTab
              packages={packages}
              onDetailClick={onPackageDetail}
              onLeaderboardClick={onPackageLeaderboard}
              onExploreClick={onExplorePackages}
            />
          )}

          {activeTab === "latihan" && (
            <DashboardLatihanTab onStartPackage={onStartLatihan} />
          )}

          {activeTab === "scores" && (
            <DashboardScoresTab
              scoreSummaryRows={scoreSummaryRows}
              onRowClick={(row) =>
                onPackageDetail?.(packages.find((p) => p.id === row.id) ?? row)
              }
              featuredLeaderboard={featuredLeaderboard}
              onSeeFullLeaderboard={onSeeFullLeaderboard}
            />
          )}

          {activeTab === "performa" && (
            <DashboardPerformanceTab
              attempts={attempts}
              onExplorePackages={onExplorePackages}
            />
          )}

          {activeTab === "account" && (
            <DashboardAccountTab
              profile={profile}
              transactions={transactions}
              onNavigate={onNavigate}
              onLogout={onLogout}
              onLeaderboardConsentChange={onLeaderboardConsentChange}
            />
          )}
        </main>
      </div>

      <DashboardBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
