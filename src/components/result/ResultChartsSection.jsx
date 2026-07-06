import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { RESULT_PALETTE } from "./resultColors";

/**
 * ResultChartsSection — visualisasi hasil ujian dalam bentuk grafik.
 * Murni presentational, semua data diterima lewat props dari `result`
 * (output transformSubmitResultToView()) — tidak fetch apa pun sendiri.
 *
 * Ditaruh SEBAGAI TAMBAHAN, bukan pengganti ResultCategoryGrid /
 * ResultTopicAnalysis (yang formatnya angka presisi) — grafik ini untuk
 * gambaran cepat/visual, angka detailnya tetap di komponen yang sudah ada.
 *
 * Warna dipetakan dari resultColors.js (RESULT_PALETTE) supaya konsisten
 * dengan skema warna komponen lain di halaman ini.
 *
 * @param {number} correct
 * @param {number} wrong
 * @param {number} unanswered
 * @param {Array<{code:string,label:string,score:number,maxScore:number,colorKey:string}>} categories
 * @param {{score:number,maxScore:number}=} tkp - dimasukkan ke bar kategori kalau ada
 * @param {Array<{id:string,name:string,groupCode:string,proficiencyPct:number,colorKey:string}>} topics
 */
export default function ResultChartsSection({
  correct,
  wrong,
  unanswered,
  categories,
  tkp,
  topics,
}) {
  const pieData = [
    { name: "Benar", value: correct, color: RESULT_PALETTE.secondary },
    { name: "Salah", value: wrong, color: RESULT_PALETTE.error },
    { name: "Tidak Dijawab", value: unanswered, color: "#ffffff33" },
  ];

  const categoryColorHex = {
    tertiary: RESULT_PALETTE.tertiary,
    primary: RESULT_PALETTE.primary,
    secondary: RESULT_PALETTE.secondary,
    neutral: "#ffffff66",
  };

  const categoryBarData = [
    ...categories.map((c) => ({
      name: c.code,
      score: c.score,
      maxScore: c.maxScore,
      fill: categoryColorHex[c.colorKey] || categoryColorHex.neutral,
    })),
    ...(tkp
      ? [
          {
            name: "TKP",
            score: tkp.score,
            maxScore: tkp.maxScore,
            fill: categoryColorHex.secondary,
          },
        ]
      : []),
  ];

  const topicBarData = [...topics]
    .sort((a, b) => (b.proficiencyPct ?? 0) - (a.proficiencyPct ?? 0))
    .map((t) => ({
      name: t.name,
      pct: t.proficiencyPct ?? 0,
      fill: categoryColorHex[t.colorKey] || categoryColorHex.neutral,
    }));

  const tooltipStyle = {
    backgroundColor: RESULT_PALETTE.backgroundSoft,
    border: `1px solid ${RESULT_PALETTE.outlineVariant}`,
    borderRadius: 8,
    color: RESULT_PALETTE.onSurface,
    fontSize: 12,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Donut: Benar / Salah / Tidak Dijawab */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white/70 text-xs font-semibold mb-2 tracking-wide">
            KOMPOSISI JAWABAN
          </h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={2}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
            {pieData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center gap-1 text-[10px] text-white/60"
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        {/* Bar: skor per kategori vs maksimal */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-white/70 text-xs font-semibold mb-2 tracking-wide">
            SKOR PER KATEGORI
          </h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ left: -24, top: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff14"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#ffffff99", fontSize: 10 }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#ffffff66", fontSize: 10 }}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#ffffff0d" }}
                />
                <Bar
                  dataKey="maxScore"
                  fill="#ffffff14"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={20}>
                  {categoryBarData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar horizontal: persentase per topik — tinggi dibatasi, scroll kalau topik banyak */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-white/70 text-xs font-semibold mb-2 tracking-wide">
          PERFORMA PER TOPIK
        </h3>
        <div
          className="overflow-y-auto pr-1"
          style={{
            height: Math.min(Math.max(topicBarData.length * 26, 120), 260),
          }}
        >
          <ResponsiveContainer
            width="100%"
            height={Math.max(topicBarData.length * 26, 120)}
          >
            <BarChart
              layout="vertical"
              data={topicBarData}
              margin={{ left: 4, right: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff14"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#ffffff66", fontSize: 10 }}
                axisLine={false}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: "#ffffff99", fontSize: 10 }}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "#ffffff0d" }}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={12}>
                {topicBarData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
 