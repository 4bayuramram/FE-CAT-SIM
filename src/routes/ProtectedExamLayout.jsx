import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedExamLayout() {
  const { paketId } = useParams();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [paketId]);

  async function checkAccess() {
    setLoading(true);

    const FREE_PACKAGES = ["1"];

    if (FREE_PACKAGES.includes(String(paketId))) {
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

  if (!isLoggedIn && String(paketId) !== "1") {
    return <Navigate to="/cpn-z/login" replace />;
  }

  if (!allowed) {
    return <Navigate to={`/cpn-z/payment/${paketId}`} replace />; 
  }

  return <Outlet />;
}
