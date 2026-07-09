import { supabase } from "../../lib/supabaseClient";

/**
 * registerUser — registrasi manual (email/password).
 *
 * PATCH: province/city yang dikirim ke sini adalah object { id, label }
 * (hasil langsung dari ProvinceCityField/useRegisterLocation), tapi
 * kolom user_profile.province/city bertipe text dan formatnya harus
 * berupa string label saja (contoh: "Bengkulu"), BUKAN object -- sama
 * seperti yang sudah diterapkan di updateUserDomicile.js untuk jalur
 * Google login.
 *
 * Sebelumnya object mentah ikut disimpan ke user_metadata, lalu
 * createUserProfile.js meng-copy apa adanya ke kolom text -> ter-
 * JSON.stringify otomatis (contoh: {"id":"bengkulu","label":"Bengkulu"}),
 * bocor ke tampilan mana pun yang menampilkan province/city apa adanya
 * (leaderboard, dsb). Diekstrak .label di sini supaya konsisten dari
 * hulu (user_metadata), tidak perlu perbaikan lagi di createUserProfile.js.
 */
export async function registerUser({
  email,
  password,
  firstName,
  lastName,
  province,
  city,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        province: province?.label ?? province,
        city: city?.label ?? city,
      },
    },
  });

  return { data, error };
}
