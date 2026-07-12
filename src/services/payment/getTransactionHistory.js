import { supabase } from "../../lib/supabaseClient";

/**
 * getTransactionHistory — riwayat transaksi (pembelian paket) milik
 * satu user, dipakai tab "Riwayat Transaksi" di halaman Akun
 * (DashboardAccountTab.jsx).
 *
 * Sumber data: tabel `payments`, diisi oleh Cloudflare Worker
 * (handleMidtransWebhook, lihat src/lib/worker2.js) saat pembayaran
 * Midtrans berstatus "settlement". Kolom yang dipakai di sini:
 * id, midtrans_order_id, midtrans_transaction_id, status, amount,
 * package_id, payment_type, bank, va_number, paid_at, created_at.
 *
 * Kolom midtrans_transaction_id/payment_type/bank/va_number/paid_at
 * baru ada sejak migrations/2026xxxx_add_payment_invoice_fields.sql
 * -- dipakai untuk struk/invoice per transaksi (lihat
 * DashboardTransactionDetailModal.jsx), boleh NULL untuk payment lama
 * sebelum kolom ini ditambahkan (struknya cukup tampilkan yang ada).
 *
 * package_id bisa NULL untuk transaksi akses premium (lihat
 * resolveAccessType di worker2.js) -- di-resolve ke label "Akses
 * Premium" alih-alih judul paket.
 *
 * Query langsung ke tabel `payments` (bukan RPC), karena baris hanya
 * milik user itu sendiri (butuh policy RLS: select where auth.uid() =
 * user_id, pola sama seperti user_profile). Kalau RLS belum
 * dikonfigurasi / query gagal, dikembalikan sebagai error supaya
 * pemanggil (DashboardPageContainer) bisa fallback dengan aman
 * (mis. tampilkan state kosong) tanpa membuat dashboard error.
 */
export async function getTransactionHistory(userId) {
  const { data: payments, error } = await supabase
    .from("payments")
    .select(
      "id, midtrans_order_id, midtrans_transaction_id, status, amount, package_id, payment_type, bank, va_number, paid_at, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const packageIds = [
    ...new Set((payments || []).map((row) => row.package_id).filter(Boolean)),
  ];

  let packagesById = new Map();
  if (packageIds.length > 0) {
    const { data: packages } = await supabase
      .from("packages")
      .select("id, title")
      .in("id", packageIds);
    packagesById = new Map((packages || []).map((p) => [p.id, p.title]));
  }

  const transactions = (payments || []).map((row) => ({
    id: row.id,
    orderId: row.midtrans_order_id,
    transactionId: row.midtrans_transaction_id,
    status: row.status,
    amount: row.amount,
    packageId: row.package_id,
    packageTitle: row.package_id
      ? packagesById.get(row.package_id) ?? "Paket"
      : "Akses Premium",
    paymentType: row.payment_type,
    bank: row.bank,
    vaNumber: row.va_number,
    // paidAt = waktu settle sebenarnya (bisa null utk payment lama),
    // createdAt = kapan baris masuk ke tabel kita -- struk pakai
    // paidAt kalau ada, fallback ke createdAt.
    paidAt: row.paid_at,
    createdAt: row.created_at,
  }));

  return { data: transactions, error: null };
}
