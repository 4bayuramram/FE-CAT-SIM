-- Menambahkan kolom yang dibutuhkan untuk struk/invoice riwayat
-- transaksi (lihat DashboardTransactionDetailModal.jsx). Sebelumnya
-- tabel `payments` cuma nyimpen ringkasan (order id, status, amount,
-- package_id) -- cukup untuk daftar, tapi tidak cukup untuk struk
-- resmi per transaksi (butuh transaction id Midtrans, metode bayar,
-- dan waktu settle yang sebenarnya).
--
-- Jalankan lewat Supabase SQL editor atau migration tool kamu.
-- Semua kolom nullable karena payment lama (sebelum kolom ini ada)
-- tetap harus bisa tampil di riwayat, hanya saja bagian metode bayar
-- di strukanya kosong.

alter table public.payments
  add column if not exists midtrans_transaction_id text,
  add column if not exists payment_type text,       -- mis. "bank_transfer", "gopay", "qris"
  add column if not exists bank text,                -- mis. "bca", "bni", "permata" (null utk gopay/qris)
  add column if not exists va_number text,           -- nomor VA yang dipakai bayar (null utk gopay/qris)
  add column if not exists paid_at timestamptz;       -- settlement_time dari Midtrans, fallback transaction_time

-- Opsional tapi disarankan: index buat lookup cepat by transaction id
-- Midtrans (berguna kalau nanti butuh reconciliation manual).
create index if not exists payments_midtrans_transaction_id_idx
  on public.payments (midtrans_transaction_id);
