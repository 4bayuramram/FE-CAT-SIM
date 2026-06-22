import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session) {
        navigate("/cpn-z/login");
      } else {
        navigate("/cpn-z/login");
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Verifying account...</p>
    </div>
  );
}
