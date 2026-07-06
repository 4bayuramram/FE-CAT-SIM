import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

/**
 * ResultTopbar — header tetap di atas, khusus halaman /hasil (dark theme
 * mandiri, TIDAK memakai ExamTopbarPaid dari shell ujian — lihat catatan
 * routing di ExamResultPageDb.jsx).
 *
 * @param {string} title
 * @param {string} sessionLabel
 * @param {() => void} onBack
 */
export default function ResultTopbar({ title, sessionLabel, onBack }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-5 h-16 w-full max-w-[1280px] mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            aria-label="Kembali"
            className="text-[#a3c9ff] p-2 hover:bg-white/5 transition-colors active:scale-95 duration-150 rounded-full"
          >
            <ArrowBackRoundedIcon fontSize="small" />
          </button>
          <h1 className="font-semibold text-lg text-[#a3c9ff] tracking-tight uppercase">
            {title}
          </h1>
        </div>

        <div className="flex items-center">
          <span className="font-mono text-xs tracking-widest text-[#d4e4fa] uppercase hidden md:block">
            PERCOBAAN {sessionLabel}
          </span>
          <button
            aria-label="Menu lainnya"
            className="text-[#a3c9ff] p-2 hover:bg-white/5 transition-colors active:scale-95 duration-150 rounded-full ml-4"
          >
            <MoreVertRoundedIcon fontSize="small" />
          </button>
        </div>
      </div>
    </header>
  );
}
