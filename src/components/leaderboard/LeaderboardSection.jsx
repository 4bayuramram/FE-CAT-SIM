import { useEffect, useState } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import SyncIcon from "@mui/icons-material/Sync";
import Avatar from "../common/Avatar";
import { getPackageLeaderboard } from "../../services/leaderboard/getPackageLeaderboard";

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
 */
export default function LeaderboardSection({ packageId, currentUserId }) {
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

      {!loading && !error && entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              isCurrentUser={entry.userId === currentUserId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LeaderboardRow({ entry, isCurrentUser }) {
  const location = entry.isAnonymous
    ? "Lokasi formasi disembunyikan"
    : [entry.province, entry.city].filter(Boolean).join(" - ") ||
      "Lokasi formasi tidak diisi";

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3 ${
        isCurrentUser ? "border-[#001f3f] bg-[#eff3ff]" : "border-gray-200"
      }`}
    >
      <div className="w-6 text-center text-sm font-bold text-[#001f3f] shrink-0">
        {entry.rank}
      </div>

      <Avatar src={entry.avatarUrl} name={entry.name} size="w-9 h-9" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#001f3f] truncate">
          {entry.name}
        </p>
        <p
          className={`text-xs truncate ${
            entry.isAnonymous ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {location}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-[#001f3f]">{entry.score}</p>
        <p className="text-[11px] text-gray-400">{entry.duration} menit</p>
      </div>
    </div>
  );
}
