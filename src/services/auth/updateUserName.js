import { supabase } from "../../lib/supabaseClient";

/**
 * updateUserName — menyimpan nama depan & belakang ke user_profile,
 * dipakai oleh modal wajib lengkapi profil untuk user login Google
 * yang nama-nya tidak bisa diturunkan otomatis dari user_metadata
 * (lihat createUserProfile.js: resolveName()) -- juga menjadi jalan
 * keluar untuk akun Google LAMA yang sudah terlanjur tersimpan dengan
 * first_name/last_name kosong sebelum fallback itu ditambahkan.
 *
 * Sengaja terpisah dari updateUserDomicile.js (bukan digabung jadi
 * satu fungsi "updateProfile") supaya masing-masing tetap simpel &
 * bisa dipanggil independen dari DomicileGuard sesuai field mana yang
 * kosong.
 */
export async function updateUserName(userId, firstName, lastName) {
  const { error } = await supabase
    .from("user_profile")
    .update({
      first_name: firstName?.trim() || "",
      last_name: lastName?.trim() || "",
    })
    .eq("id", userId);

  return { error };
}
