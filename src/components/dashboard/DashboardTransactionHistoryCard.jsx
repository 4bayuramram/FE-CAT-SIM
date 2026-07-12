import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { STATUS_STYLE, formatRupiah, formatTanggal } from "../../utils/transactionFormat";

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || {
    label: status || "-",
    className:
      "bg-[var(--db-surface-container)] text-[var(--db-on-surface-variant)]",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${style.className}`}
    >
      {style.label}
    </span>
  );
}

/**
 * DashboardTransactionHistoryCard — daftar riwayat transaksi (pembelian
 * paket) milik user, dipakai di dalam tab "Akun" (lihat
 * DashboardAccountTab.jsx, view "history").
 *
 * Data dari services/payment/getTransactionHistory.js (tabel
 * `payments`). Layout RESPONSIVE dua bentuk (bukan cuma scroll
 * horizontal): tabel penuh di desktop (md ke atas), tumpukan kartu di
 * mobile -- supaya order ID panjang & 5 kolom tetap enak dibaca di
 * layar sempit.
 *
 * Props:
 * - transactions: [{ id, orderId, status, amount, packageTitle,
 *     createdAt }]
 * - onSelectTransaction(trx): opsional -- kalau dikasih, tiap
 *   baris/kartu jadi bisa diklik untuk buka struk detail (lihat
 *   DashboardTransactionDetailModal.jsx, dipanggil dari
 *   DashboardAccountTab.jsx). Kalau tidak dikasih, daftar tetap
 *   tampil statis seperti sebelumnya (tidak breaking).
 */
export default function DashboardTransactionHistoryCard({
  transactions = [],
  onSelectTransaction,
}) {
  const clickable = typeof onSelectTransaction === "function";
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-8 flex flex-col items-center text-center gap-2">
        <ReceiptLongRoundedIcon
          style={{ fontSize: 32 }}
          className="text-[var(--db-outline)]"
        />
        <p className="text-sm font-semibold text-[var(--db-on-surface)]">
          Belum ada transaksi
        </p>
        <p className="text-sm text-[var(--db-on-surface-variant)] max-w-xs">
          Riwayat pembelian paket kamu akan muncul di sini setelah
          pembayaran berhasil.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] overflow-hidden">
      {/* Desktop / tablet: tabel */}
      <div className="hidden md:block overflow-x-auto dashboard-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--db-outline-variant)] text-[var(--db-on-surface-variant)]">
            <tr>
              <th className="py-3 px-5 font-semibold">Tanggal</th>
              <th className="py-3 px-5 font-semibold">Paket</th>
              <th className="py-3 px-5 font-semibold">Order ID</th>
              <th className="py-3 px-5 font-semibold text-right">Jumlah</th>
              <th className="py-3 px-5 font-semibold text-right">Status</th>
              {clickable && <th className="py-3 px-5 w-8" aria-hidden="true" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--db-surface-container)]">
            {transactions.map((trx) => (
              <tr
                key={trx.id}
                onClick={clickable ? () => onSelectTransaction(trx) : undefined}
                className={
                  clickable
                    ? "cursor-pointer hover:bg-[var(--db-surface-container-low)] transition-colors"
                    : undefined
                }
              >
                <td className="py-3.5 px-5 text-[var(--db-on-surface-variant)] whitespace-nowrap">
                  {formatTanggal(trx.createdAt)}
                </td>
                <td className="py-3.5 px-5 font-medium text-[var(--db-on-surface)] max-w-[16rem] truncate">
                  {trx.packageTitle}
                </td>
                <td className="py-3.5 px-5 text-[var(--db-on-surface-variant)] font-mono text-xs">
                  {trx.orderId}
                </td>
                <td className="py-3.5 px-5 text-right font-bold text-[var(--db-primary)] whitespace-nowrap">
                  {formatRupiah(trx.amount)}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <StatusBadge status={trx.status} />
                </td>
                {clickable && (
                  <td className="py-3.5 px-5 text-right">
                    <ChevronRightRoundedIcon
                      fontSize="small"
                      className="text-[var(--db-outline)]"
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: tumpukan kartu */}
      <div className="md:hidden divide-y divide-[var(--db-surface-container)]">
        {transactions.map((trx) => (
          <div
            key={trx.id}
            onClick={clickable ? () => onSelectTransaction(trx) : undefined}
            className={`p-4 flex flex-col gap-2 ${
              clickable
                ? "cursor-pointer hover:bg-[var(--db-surface-container-low)] transition-colors active:bg-[var(--db-surface-container)]"
                : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-[var(--db-on-surface)] leading-snug">
                {trx.packageTitle}
              </p>
              <StatusBadge status={trx.status} />
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--db-on-surface-variant)]">
                {formatTanggal(trx.createdAt)}
              </span>
              <span className="font-bold text-[var(--db-primary)]">
                {formatRupiah(trx.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--db-outline)] font-mono truncate">
                {trx.orderId}
              </p>
              {clickable && (
                <ChevronRightRoundedIcon
                  fontSize="small"
                  className="text-[var(--db-outline)] shrink-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
