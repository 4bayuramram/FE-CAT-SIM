import { useNavigate } from "react-router-dom";
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";

/**
 * Tombol kecil untuk ditaruh di PackageInfoPage / ExamPagePaid, menuju
 * halaman leaderboard lengkap.
 *
 * UPDATE: halaman leaderboard sekarang INDEPENDEN ("/home/leaderboard",
 * lihat pages/leaderboard/LeaderboardPageContainer.jsx) -- menampilkan
 * semua paket yang sudah dibeli user, bukan lagi 1 paket sesuai
 * :packageId di URL. Jadi tombol ini tidak perlu packageId lagi, cukup
 * arahkan ke hub-nya.
 *
 * Contoh pakai di PackageInfoPage.jsx (dekat LeaderboardSection widget):
 *   <LeaderboardEntryButton />
 */
export default function LeaderboardEntryButton({ className }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/home/leaderboard")}
      className={
        className ??
        "flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#00467f] text-[#00467f] font-bold text-sm hover:bg-[#00467f] hover:text-white transition-colors"
      }
    >
      <MilitaryTechRoundedIcon fontSize="small" />
      Lihat Leaderboard Lengkap
    </button>
  );
}
