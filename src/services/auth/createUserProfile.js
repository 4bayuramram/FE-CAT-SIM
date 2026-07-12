import { supabase } from "../../lib/supabaseClient";

/**
 * Turunkan first_name/last_name dari user_metadata, dengan fallback
 * untuk login Google.
 *
 * Kenapa dibutuhkan: sign up manual (registerUser.js) eksplisit kirim
 * `first_name` & `last_name` ke user_metadata. Login Google TIDAK
 * pernah lewat form itu -- Supabase Auth isi user_metadata Google
 * dengan bentuk berbeda (given_name/family_name, atau cuma full_name/
 * name gabungan), field `first_name`/`last_name` custom itu memang
 * tidak pernah ada di akun Google. Sebelumnya createUserProfile cuma
 * baca `first_name`/`last_name` -> selalu "" untuk semua user Google
 * -> user_profile.first_name/last_name kosong permanen -> nama di
 * leaderboard (baik versi masking "P****" maupun versi nama asli
 * setelah publikasi) tidak punya bahan sama sekali karena sumbernya
 * sudah kosong dari sini.
 *
 * Urutan fallback:
 * 1. first_name/last_name (custom, hasil sign up manual)
 * 2. given_name/family_name (field standar Google OAuth)
 * 3. full_name/name (Google, kadang cuma kirim ini) -> dipecah jadi
 *    kata pertama = firstName, sisanya = lastName
 * 4. tidak ada sama sekali -> kembalikan string kosong; DomicileGuard/
 *    DomicileModal yang akan menangkap & memaksa user mengisi manual
 *    (lihat requiresName di DomicileGuard.jsx).
 *
 * PATCH (avatar user yang publikasi identitas tidak muncul, cuma
 * inisial): akar masalahnya sama polanya dengan nama -- avatar Google
 * ada di user.user_metadata.avatar_url / .picture (di auth.users),
 * TAPI sebelumnya tidak pernah disalin ke user_profile.avatar_url
 * sama sekali. Leaderboard (get_package_leaderboard) baca avatar dari
 * user_profile (bukan auth.users, sama alasannya dengan nama), jadi
 * kolomnya selalu kosong utk SEMUA user, bukan cuma yang tidak
 * publikasi. resolveAvatarUrl() di bawah ini isi itu saat profil
 * dibuat pertama kali.
 *
 * CATATAN: fix ini baru menutup sisi "penulisan" data. Kolom
 * avatar_url harus sudah ada di tabel user_profile (ALTER TABLE kalau
 * belum), dan fungsi SQL get_package_leaderboard harus SELECT kolom
 * ini juga -- dua hal itu di luar jangkauan file JS ini, perlu
 * dicek/diubah langsung di Supabase.
 */
function resolveName(metadata = {}) {
  if (metadata.first_name || metadata.last_name) {
    return {
      firstName: metadata.first_name || "",
      lastName: metadata.last_name || "",
    };
  }

  if (metadata.given_name || metadata.family_name) {
    return {
      firstName: metadata.given_name || "",
      lastName: metadata.family_name || "",
    };
  }

  const fullName = (metadata.full_name || metadata.name || "").trim();
  if (fullName) {
    const [firstName, ...rest] = fullName.split(/\s+/);
    return { firstName, lastName: rest.join(" ") };
  }

  return { firstName: "", lastName: "" };
}

/**
 * Google (dan sebagian besar provider OAuth Supabase) kirim foto
 * profil sebagai `avatar_url` ATAU `picture` tergantung versi/provider
 * -- ambil yang tersedia duluan. Sign up manual tidak pernah punya
 * foto, jadi wajar kembalikan null untuk provider "email".
 */
function resolveAvatarUrl(metadata = {}) {
  return metadata.avatar_url || metadata.picture || null;
}

export async function createUserProfile(user) {
  const { firstName, lastName } = resolveName(user.user_metadata);
  const avatarUrl = resolveAvatarUrl(user.user_metadata);

  const { error } = await supabase.from("user_profile").insert([
    {
      id: user.id,
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatarUrl,
      province: user.user_metadata?.province || null,
      city: user.user_metadata?.city || null,
      auth_provider: user.app_metadata?.provider || "email",
    },
  ]);

  return { error };
}
