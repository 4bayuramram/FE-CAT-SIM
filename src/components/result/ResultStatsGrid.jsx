import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

/**
 * ResultStatsGrid — 3 kartu ringkas: Benar / Salah / Tidak Dijawab.
 *
 * @param {number} correct
 * @param {number} wrong
 * @param {number} unanswered
 */
export default function ResultStatsGrid({ correct, wrong, unanswered }) {
  const items = [
    { label: "BENAR", value: correct, icon: CheckCircleRoundedIcon, iconBg: "bg-[#4de082]/20", iconColor: "text-[#4de082]" },
    { label: "SALAH", value: wrong, icon: CancelRoundedIcon, iconBg: "bg-[#ffb4ab]/20", iconColor: "text-[#ffb4ab]" },
    { label: "TIDAK DIJAWAB", value: unanswered, icon: HelpRoundedIcon, iconBg: "bg-white/10", iconColor: "text-white/40" },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
        <div
          key={label}
          className="rounded-xl p-6 flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/10"
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
            <Icon fontSize="small" />
          </div>
          <div>
            <div className="text-white text-2xl font-bold">{value}</div>
            <div className="text-white/60 text-sm font-mono tracking-wide">{label}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
