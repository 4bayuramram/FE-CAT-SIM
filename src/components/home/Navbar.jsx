import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const NAV_LINKS = [
  { label: "Home", href: "/home" },
  { label: "Materi", href: "/home/materi" },
  { label: "Simulasi", href: "/home/simulasi" },
  { label: "Pembahasan", href: "/home/pembahasan" },
  { label: "Try-Out", href: "/home/try-out" },
];

export default function Navbar() {
  
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
   const syncUser = async () => {
     const {
       data: { session },
     } = await supabase.auth.getSession();

     alert(JSON.stringify(session?.user, null, 2));

     setUser(session?.user ?? null);
     
   };

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
    user?.identities?.[0]?.identity_data?.avatar_url ||
    "/default-avatar.png";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#12345b] shadow-sm font-serif text-white">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-24 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center">
          <img
            src="/sim-cat.png"
            alt="SIM-CAT"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          {NAV_LINKS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`text-lg transition ${
                  isActive
                    ? "border-b-2 border-white pb-1"
                    : "hover:text-gray-300"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-4 ml-8">
          {user ? (
            <>
              <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-white"
              />

              <span className="text-sm max-w-[120px] truncate">
                {user.email}
              </span>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-[#12345b] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/cpn-z/login" className="text-lg hover:text-gray-300">
                Masuk
              </a>

              <a
                href="/cpn-z/daftar"
                className="px-5 py-2 border border-white rounded-lg hover:bg-white hover:text-[#12345b] transition"
              >
                Daftar Sekarang
              </a>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-white"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-white bg-[#12345b] text-white">
          <div className="px-4 py-3 flex flex-col gap-3">
            {NAV_LINKS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-lg ${
                    isActive
                      ? "border-b-2 border-white pb-1"
                      : "hover:text-gray-300"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}

            <div className="flex flex-col gap-3 pt-3 border-t border-white">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      className="w-10 h-10 rounded-full border"
                      alt="avatar"
                    />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>

                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                      setOpen(false);
                    }}
                    className="px-4 py-2 border border-white rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/cpn-z/login"
                    className="px-4 py-2 text-center border border-white rounded-lg"
                  >
                    Masuk
                  </a>

                  <a
                    href="/cpn-z/daftar"
                    className="px-4 py-2 text-center border border-white rounded-lg"
                  >
                    Daftar Sekarang
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
