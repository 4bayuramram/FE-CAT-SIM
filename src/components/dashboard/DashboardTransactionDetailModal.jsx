import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import {
  STATUS_STYLE,
  formatRupiah,
  formatTanggalWaktu,
  formatPaymentMethod,
} from "../../utils/transactionFormat";
import { downloadTransactionInvoicePdf } from "../../utils/generateTransactionInvoicePdf";

/**
 * DashboardTransactionDetailModal — struk/invoice satu transaksi,
 * dibuka dari klik baris di DashboardTransactionHistoryCard (lewat
 * DashboardAccountTab.jsx). BUKAN pengganti bukti bayar dari bank/
 * e-wallet user -- ini konfirmasi dari sisi platform bahwa transaksi
 * tsb tercatat lunas untuk paket/akses tertentu (lihat diskusi
 * tanggung jawab struk di catatan getTransactionHistory.js).
 *
 * Props:
 * - transaction: satu item dari services/payment/getTransactionHistory.js
 *   ({ id, orderId, transactionId, status, amount, packageTitle,
 *      paymentType, bank, vaNumber, paidAt, createdAt }) | null
 * - onClose: tutup modal (backdrop click, tombol X, atau tombol Tutup)
 * - profile: { name, email } -- ditampilkan di struk sebagai pembeli
 */
export default function DashboardTransactionDetailModal({
  transaction,
  onClose,
  profile,
}) {
  const [downloading, setDownloading] = useState(false);

  if (!transaction) return null;

  const statusStyle = STATUS_STYLE[transaction.status] || {
    label: transaction.status || "-",
    className:
      "bg-[var(--db-surface-container)] text-[var(--db-on-surface-variant)]",
  };
  const paymentMethodLabel = formatPaymentMethod(transaction);
  // Struk pakai paidAt (waktu settle asli dari Midtrans) kalau ada,
  // fallback ke createdAt untuk payment lama sebelum kolom paid_at
  // ditambahkan (lihat migrations/2026xxxx_add_payment_invoice_fields.sql).
  const paidAtDisplay = transaction.paidAt || transaction.createdAt;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadTransactionInvoicePdf(transaction, profile);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-[var(--db-outline-variant)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--db-primary-container)]/30 flex items-center justify-center shrink-0">
              <ReceiptLongRoundedIcon
                fontSize="small"
                className="text-[var(--db-primary)]"
              />
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--db-on-surface)]">
                Struk Pembayaran
              </h2>
              <p className="text-xs text-[var(--db-on-surface-variant)]">
                Bukti transaksi dari sistem kami
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-full hover:bg-[var(--db-surface-container-low)] transition-colors shrink-0"
          >
            <CloseRoundedIcon fontSize="small" className="text-[var(--db-outline)]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto dashboard-scrollbar flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[var(--db-on-surface)] leading-snug">
                {transaction.packageTitle}
              </p>
              <p className="text-xs text-[var(--db-on-surface-variant)] mt-0.5">
                {formatTanggalWaktu(paidAtDisplay)}
              </p>
            </div>
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${statusStyle.className}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <div className="rounded-2xl bg-[var(--db-surface-container-low)] p-4 flex flex-col gap-3 text-sm">
            <DetailRow label="Order ID" value={transaction.orderId} mono />
            {transaction.transactionId && (
              <DetailRow
                label="ID Transaksi Midtrans"
                value={transaction.transactionId}
                mono
              />
            )}
            {paymentMethodLabel && (
              <DetailRow label="Metode Pembayaran" value={paymentMethodLabel} />
            )}
            {transaction.vaNumber && (
              <DetailRow label="Nomor VA" value={transaction.vaNumber} mono />
            )}
            {profile?.name && <DetailRow label="Atas Nama" value={profile.name} />}
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-[var(--db-outline-variant)] pt-4">
            <span className="text-sm font-semibold text-[var(--db-on-surface-variant)]">
              Total Dibayar
            </span>
            <span className="text-xl font-black text-[var(--db-primary)]">
              {formatRupiah(transaction.amount)}
            </span>
          </div>

          <p className="text-xs text-[var(--db-outline)] leading-relaxed">
            Struk ini adalah konfirmasi dari sistem kami bahwa transaksi
            tercatat lunas. Kalau kamu butuh bukti pembayaran resmi dari
            bank/e-wallet, cek riwayat transaksi di aplikasi pembayaran
            yang kamu pakai saat itu.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[var(--db-primary)] text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <FileDownloadRoundedIcon fontSize="small" />
            {downloading ? "Menyiapkan..." : "Unduh Struk (PDF)"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-2xl border-2 border-[var(--db-outline-variant)] text-[var(--db-on-surface-variant)] font-bold text-sm hover:bg-[var(--db-surface-container-low)] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--db-on-surface-variant)]">{label}</span>
      <span
        className={`font-semibold text-[var(--db-on-surface)] text-right break-all ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
