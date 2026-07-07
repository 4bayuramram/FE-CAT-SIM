import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { initUserProfile } from "../../services/auth/initUserProfile";
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
 * 3. Cek province & city di user_profile. Kalau salah satu kosong,
 *    tampilkan DomicileModal (wajib diisi, tidak bisa ditutup).
 * 4. User manual sudah wajib isi domisili saat daftar (RegisterForm),
 *    jadi secara praktis modal ini hanya akan muncul untuk user Google
 *    (atau provider lain di masa depan) yang belum pernah mengisi.
 *
 * Tidak menghalangi routing/guard lain (ProtectedLayout dll) — murni
 * overlay tambahan di atas halaman yang sedang dibuka.
 */
export default function DomicileGuard() {
  const [userId, setUserId] = useState(null);
  const [needsDomicile, setNeedsDomicile] = useState(false);

  const checkDomicile = useCallback(async (uid) => {
    if (!uid) {
      setNeedsDomicile(false);
      return;
    }

    // Pastikan row user_profile sudah ada (penting untuk user Google
    // yang baru pertama kali login, lihat catatan §6.17).
    await initUserProfile();

    const { data: profile, error } = await supabase
      .from("user_profile")
      .select("province, city")
      .eq("id", uid)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    const missing = !profile?.province || !profile?.city;
    setNeedsDomicile(missing);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id || null;
      if (!mounted) return;
      setUserId(uid);
      checkDomicile(uid);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const uid = session?.user?.id || null;
        setUserId(uid);
        checkDomicile(uid);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userId || !needsDomicile) return null;

  return (
    <DomicileModal
      userId={userId}
      onComplete={() => setNeedsDomicile(false)}
    />
  );
}
