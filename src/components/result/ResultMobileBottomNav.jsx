import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

/**
 * ResultMobileBottomNav — bottom nav khusus mobile untuk halaman /hasil.
 *
 * PATCH (jujur soal status placeholder): 3 dari 4 tab ("Breakdown",
 * "Analysis", "Profile") BELUM punya tujuan/halaman nyata — sengaja
 * dibuat non-interaktif (bukan <button>, tidak ada onClick) daripada
 * pura-pura berfungsi. "Overview" aktif secara default karena itu
 * representasi dari halaman ini sendiri. Jangan tambah onClick di sini
 * sampai ada halaman tujuannya masing-masing.
 */
export default function ResultMobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white/5 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.2)] md:hidden">
      <div className="flex flex-col items-center justify-center bg-[#00b55d]/20 text-[#4de082] rounded-xl px-4 py-1">
        <DashboardRoundedIcon fontSize="small" />
        <span className="text-[10px] font-mono">Overview</span>
      </div>
      <div className="flex flex-col items-center justify-center text-white/40">
        <BarChartRoundedIcon fontSize="small" />
        <span className="text-[10px] font-mono">Breakdown</span>
      </div>
      <div className="flex flex-col items-center justify-center text-white/40">
        <QueryStatsRoundedIcon fontSize="small" />
        <span className="text-[10px] font-mono">Analysis</span>
      </div>
      <div className="flex flex-col items-center justify-center text-white/40">
        <PersonRoundedIcon fontSize="small" />
        <span className="text-[10px] font-mono">Profile</span>
      </div>
    </nav>
  );
}
