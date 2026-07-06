import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

/**
 * ProtectedLayoutDb — guard AUTH untuk /try-out/* (jalur Paid).
 *
 * Pola & redirect path disamakan dengan ProtectedLayout asli (hardcode,
 * khusus paket gratis) setelah file aslinya dikonfirmasi — bedanya cuma
 * nama komponen. Tidak ada logic FREE_PACKAGES/premium di sini karena
 * itu murni konsep jalur hardcode (paket gratis); jalur Paid ini khusus
 * paket berbayar, akses selalu dicek per-package_id (lihat
 * ProtectedExamLayoutDb).
 */
export default function ProtectedLayoutDb() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user || null);
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/cpn-z/login" replace />;

  return <Outlet />;
}
