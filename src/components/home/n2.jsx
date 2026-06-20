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
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#12345b] shadow-sm font-serif text-white">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-24 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center">
          <img src="/sim-cat.png" alt="SIM-CAT" className="h-12 w-auto" />
        </div>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
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
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* USER */}
        <div className="hidden md:flex items-center gap-4 ml-8">
          {user ? (
            <>
              <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />

              <span className="text-sm max-w-[120px] truncate">
                {user.email}
              </span>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/cpn-z/login">Masuk</a>
              <a href="/cpn-z/daftar">Daftar</a>
            </>
          )}
        </div>

        {/* MOBILE BTN */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-[#12345b] border-t border-white p-4">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <img
                src={avatar}
                className="w-10 h-10 rounded-full border"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
              <span className="text-sm">{user.email}</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
