/**
 * DashboardScoreSummaryTable — ringkasan skor & peringkat per paket
 * yang sudah dikerjakan user.
 *
 * CATATAN: data leaderboard (getPackageLeaderboard/RPC) tidak membawa
 * tanggal pengerjaan, jadi tabel ini sengaja berbentuk "ringkasan per
 * paket" (bukan "riwayat per tanggal"). Kalau backend menambah kolom
 * tanggal di masa depan, tinggal tambahkan kolom "Tanggal" di sini.
 *
 * Props:
 * - rows: [{ id, title, category, score, rank, passed }]
 * - onRowClick(row)
 */
const CATEGORY_LABEL = { skd: "SKD", twk: "TWK", tiu: "TIU", tkp: "TKP" };

export default function DashboardScoreSummaryTable({ rows = [], onRowClick }) {
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
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--db-outline-variant)] text-[var(--db-on-surface-variant)]">
              <tr>
                <th className="py-2 font-semibold">Paket</th>
                <th className="py-2 font-semibold hidden sm:table-cell">
                  Kategori
                </th>
                <th className="py-2 font-semibold text-center">Skor</th>
                <th className="py-2 font-semibold text-right">Peringkat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--db-surface-container)]">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    onRowClick
                      ? "cursor-pointer hover:bg-[var(--db-surface-container-low)]"
                      : undefined
                  }
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="py-3 font-medium text-[var(--db-on-surface)] max-w-[10rem] truncate">
                    {row.title}
                  </td>
                  <td className="py-3 hidden sm:table-cell text-[var(--db-on-surface-variant)]">
                    {CATEGORY_LABEL[row.category] ?? "SKD"}
                  </td>
                  <td className="py-3 text-center font-bold text-[var(--db-primary)]">
                    {row.score}
                  </td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-1 bg-[var(--db-surface-container)] text-[var(--db-primary-container)] rounded-full text-xs font-bold">
                      #{row.rank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
