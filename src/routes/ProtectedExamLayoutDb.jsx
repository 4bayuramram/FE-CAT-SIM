import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

/**
 * ProtectedExamLayoutDb — guard AKSES PAKET untuk jalur Paid, dipasang
 * di dalam PaidExam.jsx (level :packageId), setelah ProtectedLayoutDb
 * (auth) lolos di level lebih luar.
 *
 * Disamakan strukturnya dengan ProtectedExamLayout asli (loading/allowed/
 * isLoggedIn sebagai 3 state terpisah, bukan 1 status gabungan seperti
 * versi saya sebelumnya) — TAPI TANPA 2 bagian yang dikonfirmasi murni
 * konsep jalur hardcode (khusus paket gratis):
 *   - FREE_PACKAGES (tidak relevan — jalur Paid ini khusus paket berbayar)
 *   - access_type === "premium" sebagai bypass ke semua paket (tidak ada
 *     dasarnya di kontrak backend create-session/get-questions yang sudah
 *     ditest — endpoint itu selalu cek access per package_id, tidak ada
 *     konsep "premium blanket access")
 *
 * Field query disamakan dengan kontrak create-session: user_id,
 * package_id, status = 'active' — TANPA select access_type karena tidak
 * dipakai untuk keputusan apa pun di sini.
 *
 * Redirect path disamakan dengan versi asli: belum login -> /cpn-z/login,
 * login tapi tidak punya akses -> /cpn-z/payment/:packageId.
 *
 * Tetap OPTIMISTIC/UX di sisi client — otoritas akses sebenarnya di
 * backend (create-session/get-questions/resume-session cek ulang live).
 */
export default function ProtectedExamLayoutDb() {
  const { packageId } = useParams();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [packageId]);

  async function checkAccess() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setIsLoggedIn(false);
      setAllowed(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const { data, error } = await supabase
      .from("user_package_access")
      .select("package_id")
      .eq("user_id", session.user.id)
      .eq("package_id", packageId)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error(error);
      setAllowed(false);
      setLoading(false);
      return;
    }

    setAllowed(!!data);
    setLoading(false);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/cpn-z/login" replace />;
  }

  if (!allowed) {
    return <Navigate to={`/cpn-z/payment/${packageId}`} replace />;
  }

  return <Outlet />;
}
