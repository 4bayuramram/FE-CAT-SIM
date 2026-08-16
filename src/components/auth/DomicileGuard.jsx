import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { initUserProfile } from "../../services/auth/initUserProfile";
import { syncAvatarUrl } from "../../services/auth/syncAvatarUrl";
import DomicileModal from "./DomicileModal";

/**
 * DomicileGuard — modal wajib isi domisili/nama untuk user Google login.
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
    await initUserProfile();

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
