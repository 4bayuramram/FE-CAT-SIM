import { checkPassingGrade } from "../../utils/checkPassingGrade";

/**
 * DashboardScoreSummaryTable — ringkasan skor & peringkat per paket.
 *
 * "Hasil" (LULUS/GAGAL) dan "Peringkat" sengaja dipisah — dua metrik
 * independen. Hasil: semua subtes harus >= ambang batas
 * (checkPassingGrade.js), skor akhir tinggi tetap "Gagal" kalau satu
 * subtes kurang. Peringkat: murni urutan skor akhir, tidak terpengaruh
 * status lulus/gagal.
 *
 * Props:
 * - rows: [{ id, title, score, rank, breakdown?: { TWK?, TIU?, TKP? } }]
 *   — breakdown kosong = kolom subtes & Hasil tampil "-"
 * - passingRule: { twkMin, tiuMin, tkpMin } | null — null = kolom Hasil "-"
 * - onRowClick(row)
 */
const SUBTEST_COLUMNS = ["TWK", "TIU", "TKP"];
const MIN_KEY_BY_CODE = { TWK: "twkMin", TIU: "tiuMin", TKP: "tkpMin" };

function formatSubScore(breakdown, code) {
  const value = breakdown?.[code]?.score;
  return typeof value === "number" ? value : "-";
}

// true kalau skor subtes ada & rule ada & skor < ambang batas kategori itu.
function isSubScoreBelowPg(breakdown, code, passingRule) {
  const value = breakdown?.[code]?.score;
  const min = passingRule?.[MIN_KEY_BY_CODE[code]];
  if (typeof value !== "number" || min === undefined || min === null) return false;
  return value < min;
}

export default function DashboardScoreSummaryTable({
  rows = [],
  passingRule,
  onRowClick,
}) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-4 md:p-6 overflow-hidden">
      <h4 className="text-lg font-bold text-[var(--db-on-surface)] mb-4">
        Ringkasan Skor
      </h4>

      {rows.length === 0 ? (
        <p className="text-sm text-[var(--db-on-surface-variant)] py-6 text-center">
          Belum ada paket yang dikerjakan. Skor akan tampil di sini setelah
          kamu menyelesaikan simulasi pertama.
        </p>
      ) : (
        <div className="overflow-x-auto dashboard-scrollbar">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="border-b border-[var(--db-outline-variant)] text-[var(--db-on-surface-variant)]">
              <tr>
                <th className="py-2 px-1 md:px-0 font-semibold">Paket</th>
                {SUBTEST_COLUMNS.map((code) => (
                  <th
                    key={code}
                    className="py-2 px-1 md:px-0 font-semibold text-center min-w-[2.25rem] md:min-w-[3rem]"
                  >
                    {code}
                  </th>
                ))}
                <th className="py-2 px-1 md:px-0 font-semibold text-center">
                  Skor
                </th>
                <th className="py-2 px-1 md:px-0 font-semibold text-center">Hasil</th>
                <th className="py-2 px-1 md:px-0 font-semibold text-right">Peringkat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--db-surface-container)]">
              {rows.map((row) => {
                const status = checkPassingGrade(row.breakdown, passingRule);

                return (
                  <tr
                    key={row.id}
                    className={
                      onRowClick
                        ? "cursor-pointer hover:bg-[var(--db-surface-container-low)]"
                        : undefined
                    }
                    onClick={() => onRowClick?.(row)}
                  >
                    <td className="py-2 md:py-3 px-1 md:px-0 font-medium text-[var(--db-on-surface)] max-w-[6rem] md:max-w-[10rem] truncate">
                      {row.title}
                    </td>

                    {SUBTEST_COLUMNS.map((code) => (
                      <td
                        key={code}
                        className={`py-2 md:py-3 px-1 md:px-0 text-center min-w-[2.25rem] md:min-w-[3rem] ${
                          isSubScoreBelowPg(row.breakdown, code, passingRule)
                            ? "text-[var(--db-error)] font-semibold"
                            : "text-[var(--db-on-surface-variant)]"
                        }`}
                      >
                        {formatSubScore(row.breakdown, code)}
                      </td>
                    ))}

                    <td className="py-2 md:py-3 px-1 md:px-0 text-center font-bold text-[var(--db-primary)]">
                      {row.score}
                    </td>

                    <td className="py-2 md:py-3 px-1 md:px-0 text-center">
                      {status ? (
                        <span
                          className={`px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase whitespace-nowrap ${
                            status.allPassed
                              ? "bg-[var(--db-success-container)] text-[var(--db-success)]"
                              : "bg-[var(--db-error-container)] text-[var(--db-error)]"
                          }`}
                        >
                          {status.allPassed ? "Lulus" : "Gagal"}
                        </span>
                      ) : (
                        <span className="text-[var(--db-outline)]">-</span>
                      )}
                    </td>

                    <td className="py-2 md:py-3 px-1 md:px-0 text-right">
                      <span className="px-1.5 md:px-2 py-1 bg-[var(--db-surface-container)] text-[var(--db-primary-container)] rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap">
                        #{row.rank}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
