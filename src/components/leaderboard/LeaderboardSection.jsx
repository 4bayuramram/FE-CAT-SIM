import { useEffect, useState } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import SyncIcon from "@mui/icons-material/Sync";
import "./leaderboard-theme.css";
import LeaderboardRow from "./LeaderboardRow";
import RowReveal from "./RowReveal";
import { getPackageLeaderboard } from "../../services/leaderboard/getPackageLeaderboard";
import { mapToLeaderboardRows } from "../../services/leaderboard/mapToLeaderboardRows";

/**
 * LeaderboardSection — TODO §2 "Leaderboard Sebelum Ujian".
 *
 * Dipasang di PackageInfoPage, sebelum tombol "Mulai Ujian". Akses ke
 * halaman ini (dan karenanya ke leaderboard paket ini) sudah dijamin
 * oleh ProtectedExamLayoutDb yang membungkus route "info" di
 * PaidExam.jsx — jadi komponen ini tidak melakukan pengecekan akses
 * ulang, murni menampilkan data.
 *
 * Ranking bersumber dari exam_results (attempt perdana saja, lihat
 * getPackageLeaderboard.js untuk detail kenapa tidak perlu filter
 * attempt_type). Identitas peserta yang belum/tidak consent
 * (leaderboard_opt_in bukan true) otomatis disamarkan oleh service,
 * komponen ini tidak perlu tahu logic masking-nya.
 *
 * currentUserId dipakai untuk menyorot baris posisi user sendiri di
 * daftar (kalau dia sudah pernah attempt perdana paket ini).
 *
 * FIX: widget ini sebelumnya nge-render SEMUA peserta tanpa slice dan
 * tanpa max-height/scroll (beda "karakter" dari halaman /home/leaderboard
 * yang sudah punya batas tinggi), dan pakai styling hex manual sendiri
 * lewat komponen LeaderboardRow lokal alih-alih komponen shared. Sekarang:
 * - reuse mapToLeaderboardRows.js + LeaderboardRow.jsx shared (styling &
 *   logic masking identik dengan halaman leaderboard utama, satu sumber
 *   kebenaran, bukan implementasi hex terpisah)
 * - default cuma tampilkan top `maxVisible` (10) baris di widget ini,
 *   supaya widget tetap ringkas di atas tombol "Mulai Ujian"
 * - list dibungkus max-height + overflow-y-auto (leaderboard-scrollbar),
 *   jadi tetap aman kalau suatu saat maxVisible dinaikkan / datanya besar
 *
 * Props tambahan:
 * - maxVisible: number, default 10 -- jumlah baris teratas yang tampil
 * - onViewAll: optional handler, kalau diisi & peserta > maxVisible,
 *   tampil link "Lihat leaderboard lengkap" di bawah daftar
 */
export default function LeaderboardSection({
  packageId,
  currentUserId,
  maxVisible = 10,
  onViewAll,
}) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await getPackageLeaderboard(packageId);

      if (cancelled) return;

      if (error) {
        console.error(error);
        setError("Leaderboard belum bisa dimuat.");
        setLoading(false);
        return;
      }

      setEntries(data);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [packageId]);

  return (
    <section className="rounded-3xl bg-white border border-gray-200 shadow-lg p-5 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LeaderboardIcon className="text-[#001f3f]" />
          <h3 className="text-lg font-bold text-[#001f3f]">Leaderboard</h3>
        </div>
        <span className="text-xs text-gray-500">Nilai Perdana</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
          <SyncIcon className="animate-spin" fontSize="small" />
          Memuat leaderboard...
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-gray-500 py-4">{error}</p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-sm text-gray-500 py-4">
          Belum ada peserta yang menyelesaikan paket ini.
        </p>
      )}

      {!loading && !error && entries.length > 0 && (() => {
        const rows = mapToLeaderboardRows(entries, currentUserId);
        const visibleRows = rows.slice(0, maxVisible);
        const hiddenCount = rows.length - visibleRows.length;

        return (
          <>
            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1 leaderboard-scrollbar">
              {visibleRows.map((row, i) => (
                <RowReveal key={row.id ?? row.rank} index={i}>
                  <LeaderboardRow {...row} />
                </RowReveal>
              ))}
            </div>

            {hiddenCount > 0 &&
              (onViewAll ? (
                <button
                  type="button"
                  onClick={onViewAll}
                  className="w-full mt-3 text-sm font-bold text-[var(--lb-primary-container)] hover:underline"
                >
                  +{hiddenCount} peserta lainnya di leaderboard lengkap
                </button>
              ) : (
                // Tanpa onViewAll: cukup teks info, bukan tombol -- di
                // PackageInfoPage sudah ada <LeaderboardEntryButton />
                // terpisah menuju /home/leaderboard, jadi tombol di sini
                // akan dobel CTA untuk tujuan yang sama.
                <p className="text-center text-xs text-gray-400 mt-3">
                  +{hiddenCount} peserta lainnya di leaderboard lengkap
                </p>
              ))}
          </>
        );
      })()}
    </section>
  );
}
