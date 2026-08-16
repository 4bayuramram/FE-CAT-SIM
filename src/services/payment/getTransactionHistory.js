import { supabase } from "../../lib/supabaseClient";

/**
 * getTransactionHistory — riwayat transaksi user, dipakai tab
 * "Riwayat Transaksi" di Akun (DashboardAccountTab.jsx).
 *
 * Sumber data: tabel `payments`, diisi Cloudflare Worker
 * (handleMidtransWebhook) saat pembayaran Midtrans "settlement".
 *
 * Kolom transactionId/paymentType/bank/vaNumber/paidAt bisa NULL
 * untuk payment lama (sebelum kolom ini ditambahkan) — struk cukup
 * tampilkan yang ada.
 *
 * packageId bisa NULL untuk transaksi akses premium — di-resolve ke
 * label "Akses Premium".
 *
 * Query langsung ke `payments` (bukan RPC), butuh RLS: select where
 * auth.uid() = user_id. Kalau query gagal, return error supaya
 * pemanggil bisa fallback aman (state kosong).
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
    // paidAt = waktu settle asli (null utk payment lama), createdAt =
    // kapan baris masuk tabel -- struk pakai paidAt, fallback createdAt.
    paidAt: row.paid_at,
    createdAt: row.created_at,
  }));

  return { data: transactions, error: null };
}
