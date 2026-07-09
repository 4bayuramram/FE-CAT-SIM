import { supabase } from "../../lib/supabaseClient";

/**
 * getPackageLeaderboard — TODO §2 "Leaderboard Sebelum Ujian".
 *
 * Memanggil RPC get_package_leaderboard (lihat
 * migration_leaderboard_rpc.sql), BUKAN query tabel langsung.
 *
 * Kenapa lewat RPC:
 * - exam_results: RLS aktif tanpa policy sama sekali -> 0 baris kebaca
 *   dari client biasa.
 * - user_profile: policy SELECT cuma auth.uid() = id -> tidak bisa baca
 *   profil peserta lain sama sekali dari client biasa.
 * - Masking identitas untuk user yang tidak consent dilakukan DI DALAM
 *   fungsi SQL (security definer), bukan di JS -- supaya nama/avatar
 *   asli user yang tidak consent tidak pernah keluar dari database sama
 *   sekali, bukan cuma "disembunyikan di tampilan".
 * - Fungsi RPC ini juga mengecek user_package_access sendiri (defense
 *   in depth) -- walau ProtectedExamLayoutDb sudah menjaga di level
 *   route, RPC ini tetap aman dipanggil langsung tanpa lolos guard itu.
 *
 * Ranking: score desc, duration asc (attempt perdana saja, sudah
 * otomatis scoped karena exam_results cuma pernah diisi attempt
 * perdana -- lihat submit-exam Edge Function).
 */
export async function getPackageLeaderboard(packageId) {
  const { data, error } = await supabase.rpc("get_package_leaderboard", {
    p_package_id: packageId,
  });

  if (error) {
    return { data: null, error };
  }

  const leaderboard = (data || []).map((row) => ({
    rank: row.rank,
    userId: row.user_id,
    score: row.score,
    duration: row.duration,
    name: row.name || "Peserta",
    avatarUrl: row.avatar_url,
    province: row.province,
    city: row.city,
    isAnonymous: row.is_anonymous,
  }));

  return { data: leaderboard, error: null };
}
