import { supabase } from "../../lib/supabaseClient";

/**
 * getMyExamBreakdown — breakdown skor per-subtes (TWK/TIU/TKP) dari
 * attempt PERTAMA user sendiri, untuk SEMUA paket yang pernah dia
 * kerjakan sekaligus. Dipakai DashboardScoreSummaryTable (kolom
 * TWK/TIU/TKP + status Lulus/Gagal lewat checkPassingGrade.js).
 *
 * KENAPA BUTUH RPC BARU (belum ada di project ini, perlu dibuat --
 * pola sama seperti get_skd_ranking / get_package_leaderboard di
 * migration_leaderboard_rpc.sql): exam_results RLS aktif TANPA policy
 * sama sekali, jadi 0 baris kebaca dari client biasa -- termasuk baris
 * milik user sendiri. get_package_leaderboard (RPC yang sudah ada)
 * cuma balikin skor TOTAL per paket (buat leaderboard), bukan
 * breakdown per-subtes, jadi tidak bisa dipakai ulang untuk ini.
 *
 * RPC SQL security-definer yang perlu dibuat: `get_my_exam_breakdown()`
 * (tanpa parameter -- ambil dari auth.uid() di dalam fungsi, BUKAN
 * terima p_user_id dari client, supaya user tidak bisa iseng minta
 * breakdown user lain):
 * 1. Ambil exam_results.breakdown (jsonb, shape sama seperti dipakai
 *    checkPassingGrade.js: { TWK?: {score}, TIU?: {score}, TKP?: {score} })
 *    + package_id, HANYA baris milik auth.uid(), HANYA attempt pertama
 *    per paket (attempt_type = 'perdana' atau setara, sama seperti
 *    get_package_leaderboard).
 * 2. Kembalikan satu baris per paket: { package_id, breakdown }.
 *
 * Sebelum RPC ini dibuat di Supabase, panggilan akan gagal (function
 * belum ada) dan fungsi ini mengembalikan { data: null, error } --
 * DashboardPageContainer sudah menangani ini dengan fallback graceful
 * (breakdown tetap kosong, TIDAK memicu fallback data contoh untuk
 * seluruh dashboard), jadi aman dipanggil dari sekarang.
 */
export async function getMyExamBreakdown() {
  const { data, error } = await supabase.rpc("get_my_exam_breakdown");

  if (error) {
    return { data: null, error };
  }

  const byPackageId = new Map(
    (data || []).map((row) => [row.package_id, row.breakdown])
  );

  return { data: byPackageId, error: null };
}
