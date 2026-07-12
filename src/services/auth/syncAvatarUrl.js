import { supabase } from "../../lib/supabaseClient";

/**
 * syncAvatarUrl — backfill avatar Google ke user_profile.avatar_url
 * untuk akun yang PROFILNYA SUDAH ADA (dibuat sebelum fix
 * createUserProfile.js menyimpan avatar_url, atau akun lama secara
 * umum).
 *
 * Kenapa dibutuhkan: createUserProfile.js cuma jalan SEKALI, saat row
 * user_profile pertama kali dibuat (lihat initUserProfile.js — kalau
 * profile sudah ada, createUserProfile tidak pernah dipanggil lagi).
 * Jadi fix avatar_url di createUserProfile.js HANYA otomatis berlaku
 * untuk akun benar-benar baru. Akun yang sudah pernah login sebelum
 * fix itu ada akan permanen punya avatar_url NULL di user_profile
 * kalau tidak ada mekanisme sync terpisah -- ini fungsi itu.
 *
 * Dipanggil dari DomicileGuard (yang sudah jalan global tiap kali ada
 * sesi aktif, lihat DomicileGuard.jsx), sama seperti initUserProfile().
 * Query super murah (1 SELECT + kadang 1 UPDATE), aman dipanggil tiap
 * login -- begitu avatar_url sudah keisi, cabang UPDATE tidak akan
 * jalan lagi untuk user itu.
 *
 * Tidak menyentuh first_name/last_name -- itu domain DomicileGuard
 * (requiresName) yang sudah ada, dipisah supaya masing-masing fungsi
 * tetap fokus satu tanggung jawab.
 */
export async function syncAvatarUrl(user) {
  if (!user) return;

  const metadataAvatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  // Tidak ada apa pun di akunnya untuk disinkron -- tidak perlu query.
  if (!metadataAvatarUrl) return;

  const { data: profile, error: fetchError } = await supabase
    .from("user_profile")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error(fetchError);
    return;
  }

  // Sudah ada avatar tersimpan -- jangan timpa (mis. kalau nanti ada
  // fitur upload foto custom, jangan sampai balik lagi ke foto Google).
  if (!profile || profile.avatar_url) return;

  const { error: updateError } = await supabase
    .from("user_profile")
    .update({ avatar_url: metadataAvatarUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error(updateError);
  }
}
