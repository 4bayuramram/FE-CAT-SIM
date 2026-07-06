import { supabase } from "../../lib/supabaseClient";

/**
 * updateLeaderboardConsent — menyimpan pilihan user apakah identitasnya
 * boleh ditampilkan di leaderboard atau tidak.
 *
 * Kolom `leaderboard_opt_in` (boolean, nullable, default NULL) harus ada
 * di tabel `user_profile`. NULL = belum pernah ditanya, true/false =
 * sudah pernah dijawab. Dipanggil TEPAT SATU KALI (sebelum attempt
 * pertama), sesuai TODO §4 "Persetujuan Publikasi Identitas".
 *
 * Migration yang perlu dijalankan sekali di Supabase (kalau kolom belum ada):
 *   ALTER TABLE user_profile
 *     ADD COLUMN leaderboard_opt_in boolean DEFAULT NULL;
 */
export async function updateLeaderboardConsent(userId, optIn) {
  const { error } = await supabase
    .from("user_profile")
    .update({ leaderboard_opt_in: optIn })
    .eq("id", userId);

  return { error };
}
