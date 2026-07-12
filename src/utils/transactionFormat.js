/**
 * transactionFormat — helper format & label untuk tampilan riwayat
 * transaksi / struk pembayaran. Dipisah dari
 * DashboardTransactionHistoryCard.jsx supaya bisa dipakai bareng oleh
 * DashboardTransactionDetailModal.jsx dan TransactionInvoicePdfDocument.jsx
 * tanpa duplikasi (biar label status & format Rupiah konsisten di
 * semua tempat).
 */

export const STATUS_LABEL = {
  success: "Berhasil",
  pending: "Menunggu",
  failed: "Gagal",
  expire: "Kedaluwarsa",
  cancel: "Dibatalkan",
};

// Dipakai StatusBadge di kartu (styling web, Tailwind + CSS var tema
// dashboard) -- PDF punya styling sendiri karena react-pdf tidak
// dukung CSS var.
export const STATUS_STYLE = {
  success: {
    label: STATUS_LABEL.success,
    className: "bg-[var(--db-success-container)] text-[var(--db-success)]",
  },
  pending: {
    label: STATUS_LABEL.pending,
    className:
      "bg-[var(--db-secondary-container)]/40 text-[var(--db-on-secondary-container)]",
  },
  failed: {
    label: STATUS_LABEL.failed,
    className: "bg-[var(--db-error-container)] text-[var(--db-error)]",
  },
  expire: {
    label: STATUS_LABEL.expire,
    className: "bg-[var(--db-error-container)] text-[var(--db-error)]",
  },
  cancel: {
    label: STATUS_LABEL.cancel,
    className: "bg-[var(--db-error-container)] text-[var(--db-error)]",
  },
};

// Label metode bayar yang human-readable dari payment_type Midtrans.
// bank/vaNumber (kalau ada) ditambahkan terpisah oleh pemanggil --
// fungsi ini cuma urus payment_type-nya.
const PAYMENT_TYPE_LABEL = {
  bank_transfer: "Transfer Bank (Virtual Account)",
  echannel: "Mandiri Bill Payment",
  permata: "Permata Virtual Account",
  gopay: "GoPay",
  qris: "QRIS",
  shopeepay: "ShopeePay",
  credit_card: "Kartu Kredit/Debit",
  cstore: "Gerai Retail (Alfamart/Indomaret)",
  akulaku: "Akulaku PayLater",
};

const BANK_LABEL = {
  bca: "BCA",
  bni: "BNI",
  bri: "BRI",
  mandiri: "Mandiri",
  permata: "Permata",
  cimb: "CIMB Niaga",
};

/**
 * formatPaymentMethod — gabungkan payment_type + bank jadi satu label
 * enak dibaca, mis. "Transfer Bank (Virtual Account) - BCA".
 * Mengembalikan null kalau paymentType tidak ada (payment lama
 * sebelum kolom ini ditambahkan) supaya pemanggil bisa tampilkan
 * fallback ("-" atau sembunyikan baris sama sekali).
 */
export function formatPaymentMethod({ paymentType, bank } = {}) {
  if (!paymentType) return null;
  const base = PAYMENT_TYPE_LABEL[paymentType] || paymentType;
  const bankLabel = bank ? BANK_LABEL[bank] || bank.toUpperCase() : null;
  return bankLabel ? `${base} - ${bankLabel}` : base;
}

export const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

export const formatTanggal = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Tanggal + jam, dipakai di struk (lebih detail daripada daftar
// riwayat yang cukup tanggal saja).
export const formatTanggalWaktu = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};
