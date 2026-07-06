import { useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { getColorVariant } from "./resultColors";

/**
 * ResultTopicAnalysis — daftar topik/cluster, accordion (expand satu per
 * satu klik). State expand murni LOKAL (UI transien), bukan Redux — pola
 * sama seperti mobileView/resultDialogOpen di komponen Paid lain.
 *
 * questionBreakdown per topik OPSIONAL — kalau backend belum kirim detail
 * per-soal untuk topik itu (array kosong/undefined), bagian breakdown
 * cukup tidak dirender, bukan ditampilkan kosong/error.
 *
 * @param {{id:string, name:string, groupCode:string, questionCount:number, focusLabel:string, correct:number, total:number, proficiencyLabel:string, colorKey:string, questionBreakdown?:{label:string, points:string}[]}[]} topics
 */
export default function ResultTopicAnalysis({ topics }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!topics?.length) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-semibold text-white">Analisis Topik</h3>
        <span className="text-xs text-white/40 uppercase font-mono">Per Cluster</span>
      </div>

      {topics.map((topic) => {
        const variant = getColorVariant(topic.colorKey);
        const isExpanded = expandedId === topic.id;
        const hasBreakdown = topic.questionBreakdown?.length > 0;

        return (
          <div
            key={topic.id}
            className="rounded-xl overflow-hidden transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/10"
          >
            <button
              onClick={() => hasBreakdown && setExpandedId(isExpanded ? null : topic.id)}
              className={`w-full p-4 flex items-center justify-between text-left hover:bg-white/5 ${
                hasBreakdown ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-8 rounded-full ${variant.dot}`} />
                <div>
                  <h4 className="text-sm font-bold text-white">{topic.name}</h4>
                  <p className="text-[10px] text-white/40">
                    {topic.questionCount} Soal · {topic.focusLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {topic.correct}/{topic.total}
                  </div>
                  <div className={`text-[10px] font-mono ${variant.text}`}>
                    {topic.proficiencyLabel}
                  </div>
                </div>
                {hasBreakdown && (
                  <ExpandMoreRoundedIcon
                    fontSize="small"
                    className={`text-white/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                )}
              </div>
            </button>

            {isExpanded && hasBreakdown && (
              <div className="bg-white/5 p-4 border-t border-white/5 grid grid-cols-5 gap-1">
                {topic.questionBreakdown.map((q) => (
                  <div key={q.label} className="text-center">
                    <div className="text-[10px] text-white/30 font-mono mb-1">{q.label}</div>
                    <div className={`text-xs font-bold ${variant.text}`}>{q.points}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
