import { supabase } from "../../lib/supabaseClient";

/**
 * updateUserDomicile — menyimpan provinsi & kota/kabupaten user ke
 * user_profile, dipakai oleh modal wajib domisili untuk user login
 * Google (TODO §5 "Data Domisili User Google Login").
 *
 * Kenapa dibutuhkan: registrasi manual (RegisterPage) sudah mewajibkan
 * provinsi/kota lewat ProvinceCityField, dan disimpan lewat
 * registerUser -> user_metadata -> createUserProfile saat sign up.
 * Login Google tidak melalui form itu sama sekali, jadi user_profile
 * hasil createUserProfile untuk user Google akan punya province/city
 * NULL (lihat createUserProfile.js: fallback ke null kalau
 * user_metadata tidak ada). Modal ini yang mengisi celah tersebut
 * setelah login, sebelum user lanjut pakai aplikasi.
 *
 * PENTING — bentuk data: kolom province/city di user_profile tersimpan
 * sebagai STRING biasa (contoh: "DI Yogyakarta", "Gunungkidul"), BUKAN
 * object { id, label }, dikonfirmasi dari data production. Fungsi ini
 * menerima object { id, label } (hasil langsung dari ProvinceCityField/
 * useRegisterLocation) lalu mengambil `.label`-nya saja sebelum
 * disimpan, supaya formatnya konsisten dengan data yang sudah ada.
 */
export async function updateUserDomicile(userId, province, city) {
  const { error } = await supabase
    .from("user_profile")
    .update({
      province: province?.label ?? province,
      city: city?.label ?? city,
    })
    .eq("id", userId);

  return { error };
}
