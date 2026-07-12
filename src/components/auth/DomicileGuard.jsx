import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { initUserProfile } from "../../services/auth/initUserProfile";
import { syncAvatarUrl } from "../../services/auth/syncAvatarUrl";
import DomicileModal from "./DomicileModal";

/**
 * DomicileGuard — TODO §5 "Data Domisili User Google Login".
 *
 * Dipasang SEKALI di App.jsx (sibling dari <Routes>, di dalam
 * BrowserRouter), aktif untuk seluruh aplikasi — bukan cuma satu route
 * tertentu — karena user Google bisa mendarat di mana saja (paling
 * sering /home/simulasi, lihat redirectTo di Login.jsx/RegisterForm),
 * dan celah data domisili ini berlaku lintas halaman.
 *
 * Alur:
 * 1. Pantau sesi auth (pola sama seperti ProtectedLayout/ProtectedLayoutDb).
 * 2. Begitu ada user login, pastikan row user_profile ada
 *    (initUserProfile — fungsi ini sudah dipakai juga di
 *    PackageInfoPage, lihat §6.17 Dokumen Acuan).
 * 3. Cek province, city, DAN nama di user_profile. Kalau ada yang
 *    kosong, tampilkan DomicileModal (wajib diisi, tidak bisa
 *    ditutup) — field mana yang diminta menyesuaikan (lihat
 *    requiresName/requiresDomicile).
 * 4. User manual sudah wajib isi domisili & nama saat daftar
 *    (RegisterForm), jadi secara praktis modal ini hanya akan muncul
 *    untuk user Google (atau provider lain di masa depan).
 *
 * PATCH (nama kosong untuk user Google — "leaderboard nama Peserta
 * P**** bermasalah"): createUserProfile.js sebelumnya cuma baca
 * user_metadata.first_name/last_name, field yang MEMANG TIDAK PERNAH
 * ADA di akun Google (Google isi given_name/family_name atau
 * full_name). Sudah diperbaiki di sumbernya (createUserProfile.js
 * resolveName()) supaya kebanyakan user Google otomatis dapat nama
 * benar sejak awal — guard ini jadi jaring pengaman untuk 2 kasus
 * sisa: (a) akun Google LAMA yang sudah terlanjur tersimpan kosong
 * sebelum fix itu ada, (b) akun Google yang memang tidak mengirim
 * data nama apa pun ke Supabase.
 *
 * Tidak menghalangi routing/guard lain (ProtectedLayout dll) — murni
 * overlay tambahan di atas halaman yang sedang dibuka.
 */
export default function DomicileGuard() {
  const [userId, setUserId] = useState(null);
  const [missingFields, setMissingFields] = useState({
    domicile: false,
    name: false,
  });

  const checkProfile = useCallback(async (uid) => {
    if (!uid) {
      setMissingFields({ domicile: false, name: false });
      return;
    }

    // Pastikan row user_profile sudah ada (penting untuk user Google
    // yang baru pertama kali login, lihat catatan §6.17).
    await initUserProfile();

    // PATCH (avatar publikasi tidak muncul): createUserProfile.js cuma
    // isi avatar_url sekali, waktu profile DIBUAT. Akun yang profilnya
    // sudah ada sebelum fix itu (praktis semua akun lama) tidak pernah
    // ke-backfill dari situ -- syncAvatarUrl jalan tiap login untuk
    // nutup celah itu, lihat komentar di syncAvatarUrl.js.
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      await syncAvatarUrl(authData.user);
    }

    const { data: profile, error } = await supabase
      .from("user_profile")
      .select("province, city, first_name, last_name")
      .eq("id", uid)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    setMissingFields({
      domicile: !profile?.province || !profile?.city,
      name: !profile?.first_name?.trim() && !profile?.last_name?.trim(),
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id || null;
      if (!mounted) return;
      setUserId(uid);
      checkProfile(uid);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const uid = session?.user?.id || null;
        setUserId(uid);
        checkProfile(uid);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needsSomething = missingFields.domicile || missingFields.name;

  if (!userId || !needsSomething) return null;

  return (
    <DomicileModal
      userId={userId}
      requireName={missingFields.name}
      requireDomicile={missingFields.domicile}
      onComplete={() => setMissingFields({ domicile: false, name: false })}
    />
  );
}
