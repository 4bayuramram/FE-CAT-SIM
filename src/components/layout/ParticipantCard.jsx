import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ParticipantCard() {
  const [user, setUser] = useState(null);

  const peserta = {
    nama: user?.user_metadata?.full_name || user?.email || "Peserta",
  };

  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    };

    syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar ||
    "/default-avatar.png";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-4">
      {/* header */}
      <div className="bg-[#12345b] h-20 relative">
        {/* AVATAR */}
        <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-white shadow-md p-1">
            <img
              src={avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-14 pb-8 px-4">
        {/* USER INFO */}
        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-800">
            {peserta.nama}
          </h2>

          <p className="text-sm text-[#12345b] font-medium mt-1">
            Peserta Ujian CAT
          </p>
        </div>
      </div>
    </div>
  );
}
