import { supabase } from "../../lib/supabaseClient";

/**
 * getActivePassingGrade — ambil rule passing grade SKD yang sedang
 * aktif (twk_min/tiu_min/tkp_min) dari RPC get_active_passing_grade().
 * Backend sudah dieksekusi & terverifikasi (15 Jul 2026, lihat
 * addendum handover "FITUR PASSING GRADE SKD").
 *
 * Dipakai oleh util checkPassingGrade.js untuk hitung status lulus.
 */
export async function getActivePassingGrade() {
  const { data, error } = await supabase.rpc("get_active_passing_grade");

  if (error) {
    return { data: null, error };
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    return { data: null, error: null };
  }

  return {
    data: {
      id: row.id,
      name: row.name,
      twkMin: row.twk_min,
      tiuMin: row.tiu_min,
      tkpMin: row.tkp_min,
    },
    error: null,
  };
}
