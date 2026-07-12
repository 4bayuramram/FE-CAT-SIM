import { useState } from "react";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DashboardAccountCard from "./DashboardAccountCard";
import DashboardFocusBackBar from "./DashboardFocusBackBar";
import DashboardTransactionHistoryCard from "./DashboardTransactionHistoryCard";
import DashboardTransactionDetailModal from "./DashboardTransactionDetailModal";

const LINKS = [
  { key: "try-out", label: "Jelajahi Try Out", icon: AssignmentRoundedIcon },
  {
    key: "leaderboard",
    label: "Leaderboard Lengkap",
    icon: LeaderboardRoundedIcon,
  },
  { key: "bantuan", label: "Bantuan", icon: HelpRoundedIcon },
];

/**
 * DashboardAccountTab — isi tab "Akun".
 *
 * Sengaja menampung tautan ke halaman lain (try-out/leaderboard/
 * bantuan) + tombol keluar -- di desktop tautan yang sama juga ada di
 * sidebar ("Lainnya"), tapi di MOBILE bottom-nav tidak ada ruang untuk
 * itu, jadi tab ini adalah satu-satunya tempat aksesnya di mobile.
 *
 * "Riwayat Transaksi" SENGAJA tidak memakai onNavigate (bukan pindah
 * halaman/route) -- dipakai state lokal `view` ("main" | "history"),
 * pola sama persis dengan mekanisme `focus` di DashboardOverviewTab
 * (DashboardFocusBackBar untuk kembali), supaya dashboard tetap
 * ringan (bukan route baru) dan konsisten dengan pola focus-view yang
 * sudah ada.
 *
 * Props tambahan:
 * - transactions: [{ id, orderId, status, amount, packageTitle,
 *     createdAt }] -- lihat services/payment/getTransactionHistory.js
 * - profile.leaderboardOptIn: true | false | null -- null berarti user
 *   belum pernah menjawab consent publikasi identitas sama sekali
 *   (belum attempt paket apa pun, lihat PackageInfoPage.jsx untuk
 *   consent sekali-jalan yang asli). Kartu "Privasi Leaderboard" di
 *   bawah ini reuse service yang sama (updateLeaderboardConsent.js)
 *   supaya user bisa UBAH pilihannya kapan saja setelahnya, bukan
 *   cuma dikunci permanen sejak jawaban pertama.
 * - onLeaderboardConsentChange(optIn): async, return true/false sukses
 *   atau tidak -- dipanggil saat toggle diklik.
 */
export default function DashboardAccountTab({
  profile,
  transactions = [],
  onNavigate,
  onLogout,
  onLeaderboardConsentChange,
}) {
  const [view, setView] = useState("main"); // "main" | "history"
  // Transaksi yang lagi dibuka struknya (klik salah satu baris di
  // riwayat) -- lihat DashboardTransactionDetailModal.jsx. null =
  // modal tertutup.
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // State toggle consent leaderboard -- terpisah dari `view`/
  // `selectedTransaction` karena tidak berhubungan sama sekali.
  const [consentSaving, setConsentSaving] = useState(false);
  const [consentError, setConsentError] = useState(false);

  // null (belum pernah dijawab) diperlakukan sebagai "belum publikasi"
  // di toggle ini -- switch akan tampil OFF, dan begitu user
  // menyalakannya, itu otomatis jadi jawaban PERTAMA mereka juga
  // (mengisi leaderboard_opt_in yang tadinya NULL).
  const leaderboardOptIn = profile?.leaderboardOptIn ?? false;

  const handleToggleConsent = async () => {
    if (!onLeaderboardConsentChange || consentSaving) return;

    setConsentError(false);
    setConsentSaving(true);
    const success = await onLeaderboardConsentChange(!leaderboardOptIn);
    setConsentSaving(false);

    if (!success) setConsentError(true);
  };

  if (view === "history") {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <DashboardFocusBackBar
          title="Riwayat Transaksi"
          onBack={() => setView("main")}
        />
        <DashboardTransactionHistoryCard
          transactions={transactions}
          onSelectTransaction={setSelectedTransaction}
        />
        <DashboardTransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          profile={profile}
        />
      </div>
    );
  }

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

      <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--db-secondary-container)] flex items-center justify-center shrink-0">
            <VisibilityRoundedIcon
              fontSize="small"
              className="text-[var(--db-primary-container)]"
            />
          </div>

          {/* Switch disejajarkan dengan JUDUL saja (baris tunggal) lewat
              items-center di sini -- sebelumnya switch ada di kolom yang
              sama dengan judul+deskripsi 2 baris sekaligus (items-start
              di container luar), jadi switch nempel di baris pertama
              dan keliatan "ngambang" gak center secara keseluruhan.
              Deskripsi sekarang full-width di bawah, di luar row ini. */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-[var(--db-on-surface)]">
              Publikasikan Identitas
            </p>

            <button
              type="button"
              role="switch"
              aria-checked={leaderboardOptIn}
              disabled={consentSaving}
              onClick={handleToggleConsent}
              className={`shrink-0 w-11 h-6 rounded-full relative transition-colors ${
                leaderboardOptIn
                  ? "bg-[var(--db-primary-container)]"
                  : "bg-gray-300"
              } ${consentSaving ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
            >
              <span
                className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  leaderboardOptIn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--db-on-surface-variant)] mt-2 pl-12">
          Kalau aktif, nama & foto profil kamu tampil ke peserta lain di
          leaderboard. Kalau nonaktif, identitas kamu disamarkan jadi "Peserta"
          -- skor & durasi tetap tampil seperti biasa.
        </p>

        {consentError && (
          <p className="text-xs text-[var(--db-error,_#b3261e)] mt-2 pl-12">
            Gagal menyimpan pilihan. Coba lagi sebentar lagi.
          </p>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] overflow-hidden">
        <button
          type="button"
          onClick={() => setView("history")}
          className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--db-surface-container-low)] transition-colors border-b border-[var(--db-outline-variant)]"
        >
          <ReceiptLongRoundedIcon
            fontSize="small"
            className="text-[var(--db-primary-container)]"
          />
          <span className="flex-1 text-sm font-semibold text-[var(--db-on-surface)]">
            Riwayat Transaksi
          </span>
          <ChevronRightRoundedIcon
            fontSize="small"
            className="text-[var(--db-outline)]"
          />
        </button>

        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate?.(item.key)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--db-surface-container-low)] transition-colors border-b border-[var(--db-outline-variant)] last:border-b-0"
            >
              <Icon
                fontSize="small"
                className="text-[var(--db-primary-container)]"
              />
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
