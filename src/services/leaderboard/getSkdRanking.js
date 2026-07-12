import { supabase } from "../../lib/supabaseClient";

/**
 * getSkdRanking — peringkat user berdasarkan RATA-RATA SKOR PAKET SKD
 * saja (bukan TWK/TIU/TKP satuan), dalam 3 cakupan sekaligus:
 * nasional, provinsi (domisili user), dan kabupaten/kota (domisili
 * user). Dipakai oleh DashboardSkdRankingSection di tab Ringkasan.
 *
 * BACKEND YANG DIBUTUHKAN (belum ada di project ini, perlu dibuat --
 * pola sama seperti get_package_leaderboard di
 * migration_leaderboard_rpc.sql): RPC SQL security-definer bernama
 * `get_skd_ranking(p_user_id uuid)` yang, di sisi database:
 * 1. Ambil rata-rata skor SEMUA paket berkategori 'skd' per user dari
 *    exam_results (attempt pertama saja, sama seperti leaderboard
 *    per-paket) di-JOIN packages.category = 'skd'.
 * 2. Hitung RANK() dari rata-rata itu, 3 kali: tanpa filter
 *    (nasional), filter user_profile.province = provinsi user, filter
 *    user_profile.city = kota/kabupaten user.
 * 3. Kembalikan satu baris per cakupan: { scope, scope_name, rank,
 *    total_participants, avg_score }, HANYA untuk p_user_id yang
 *    diminta (tidak perlu expose data user lain sama sekali --beda
 *    dengan get_package_leaderboard yang memang perlu daftar peserta
 *    lain untuk ditampilkan).
 * 4. scope_name diisi null untuk 'national', dan nama provinsi/kota
 *    user untuk 'province'/'city'. Kalau user belum isi provinsi/kota
 *    di user_profile, baris itu tidak usah dikembalikan (frontend
 *    otomatis menampilkan pesan "lengkapi domisili").
 *
 * Sebelum RPC itu dibuat di Supabase, panggilan ini akan gagal
 * (function belum ada) dan fungsi ini mengembalikan { data: null,
 * error } -- DashboardSkdRankingSection/DashboardPageContainer sudah
 * menangani ini dengan fallback null yang tampil sebagai "belum
 * tersedia" per cakupan, BUKAN layar error, jadi aman dipanggil dari
 * sekarang.
 */
export async function getSkdRanking(userId) {
  if (!userId) return { data: null, error: null };

  const { data, error } = await supabase.rpc("get_skd_ranking", {
    p_user_id: userId,
  });

  if (error) {
    return { data: null, error };
  }

  const rows = data || [];
  const byScope = Object.fromEntries(rows.map((row) => [row.scope, row]));

  const toScopeData = (row) =>
    row
      ? {
          name: row.scope_name ?? null,
          rank: row.rank,
          totalPeserta: row.total_participants,
          avgScore: row.avg_score,
          percentile:
            row.rank != null && row.total_participants
              ? Math.max(1, Math.round((row.rank / row.total_participants) * 100))
              : null,
        }
      : null;

  return {
    data: {
      national: toScopeData(byScope.national),
      province: toScopeData(byScope.province),
      city: toScopeData(byScope.city),
    },
    error: null,
  };
}
