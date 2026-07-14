import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Semua paket hardcode (src/data/paket1-4.js, jalur non-DB) gratis.
// Dipindah ke luar komponen (bukan cuma di dalam checkAccess) supaya bisa
// dipakai juga di render-time check di bawah — sebelumnya render-time
// check masih hardcode `paketId !== "1"` sendirian, jadi begitu paket
// 2-4 ikut dibebasin di checkAccess(), render-time check ini KETINGGALAN
// dan malah mental ke /cpn-z/login (isLoggedIn belum sempat di-set true
// karena checkAccess() return lebih awal untuk paket gratis).
const FREE_PACKAGES = ["1", "2", "3", "4"];

export default function ProtectedExamLayout() {
  const { paketId } = useParams();
  const isFreePackage = FREE_PACKAGES.includes(String(paketId));

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [paketId]);

  async function checkAccess() {
    setLoading(true);

    if (isFreePackage) {
      setAllowed(true);
      setLoading(false);
      return;
    }

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
      .select("package_id, access_type")
      .eq("user_id", session.user.id)
      .eq("status", "active");

    if (error) {
      console.error(error);
      setAllowed(false);
      setLoading(false);
      return;
    }

    const hasAccess = data?.some(
      (row) =>
        row.access_type === "premium" ||
        String(row.package_id) === String(paketId)
    );

    setAllowed(!!hasAccess);
    setLoading(false);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn && !isFreePackage) {
    return <Navigate to="/cpn-z/login" replace />;
  }

  if (!allowed) {
    return <Navigate to={`/cpn-z/payment/${paketId}`} replace />; 
  }

  return <Outlet />;
}
