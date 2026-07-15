import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Avatar from "../common/Avatar";
import NotificationBell from "../common/NotificationBell";

const NAV_LINKS = [
  { label: "Home", href: "/home" },
  { label: "Try-Out", href: "/home/simulasi" },
  { label: "Leaderboard", href: "/home/leaderboard" },
  { label: "Bantuan", href: "/home/bantuan" },
];

/**
 * UPDATE Navbar:
 * - NAV_LINKS dikembalikan ke 3 item yang beneran ada halamannya (Materi
 *   & Premium dihapus, belum ada page-nya -- daripada 404).
 * - State LOGGED IN disederhanakan: sebelumnya menampilkan
 *   avatar + email + tombol Logout sekaligus di navbar (makan tempat).
 *   Sekarang cukup AVATAR SAJA, diklik untuk buka dropdown berisi nama
 *   user, "Dashboard" (mengarah ke "/home/dashboard" -- sekarang
 *   halaman sungguhan, lihat pages/dashboard/DashboardPageContainer.jsx,
 *   sebelumnya route ini sengaja belum terdaftar sebagai placeholder),
 *   dan "Logout".
 * - Dropdown ditutup otomatis kalau klik di luar area avatar/dropdown.
 * - Mobile menu disamakan pola-nya: kalau logged in, tombol mobile jadi
 *   avatar (bukan hamburger), tap membuka drawer berisi NAV_LINKS +
 *   Dashboard + Logout (bukan lagi email statis tanpa dropdown).
 * - UPDATE: navbar bar atas TETAP solid bg-[#12345b] di semua ukuran
 *   layar (mobile & desktop). Yang transparan (bg-transparent + blur)
 *   cuma panel drawer menu mobile di bawahnya, elemen terpisah dari
 *   bar atas — supaya dua-duanya bisa punya warna beda.
 * - Tombol toggle mobile SELALU burger (☰), tidak lagi berubah jadi
 *   avatar saat user login — avatar & info user tetap tampil di
 *   dalam drawer yang terbuka, bukan di tombol pemicunya.
 * - Dihapus: `alert(JSON.stringify(session?.user, null, 2))` yang
 *   kebawa dari debug -- munculin popup alert tiap kali auth state
 *   sync, jelas bukan disengaja untuk production.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [dropdownOpen, setDropdownOpen] = useState(false); // desktop dropdown
  const [user, setUser] = useState(null);
  const location = useLocation();

  const dropdownRef = useRef(null);

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

  // Tutup dropdown desktop kalau klik di luar area avatar/dropdown.
  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Ganti halaman -> tutup dropdown/drawer yang lagi terbuka.
  useEffect(() => {
    setDropdownOpen(false);
    setOpen(false);
  }, [location.pathname]);

  const avatarSrc =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    null;

  const fullName =
    user?.user_metadata?.full_name ||
    `${user?.user_metadata?.first_name || ""} ${
      user?.user_metadata?.last_name || ""
    }`.trim() ||
    user?.email ||
    "";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-sm font-serif text-white">
      {/* HEADER BAR — full-width solid, terpisah dari drawer di bawahnya */}
      <div className="bg-[#12345b] w-full">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 h-24 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center">
            <img
              src="/cpnz.png"
              alt="CPNZ"
              className="h-20 w-auto object-contain flex-shrink-0"
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
          <div className="hidden md:flex items-center gap-3 ml-8">
            {user && <NotificationBell userId={user.id} />}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  className="flex items-center rounded-full ring-offset-2 ring-offset-[#12345b] focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <Avatar src={avatarSrc} name={fullName} size="w-11 h-11" />
                </button>

                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-56 rounded-xl bg-white text-[#12345b] shadow-xl border border-gray-100 overflow-hidden font-sans"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold truncate">
                        {fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <a
                      href="/home/dashboard"
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition"
                    >
                      Dashboard
                    </a>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <a href="/cpn-z/login" className="text-lg hover:text-gray-300">
                  Masuk
                </a>

                <a
                  href="/cpn-z/daftar"
                  className="px-5 py-2 border border-white rounded-lg hover:bg-white hover:text-[#12345b] transition"
                >
                  Daftar Sekarang
                </a>
              </div>
            )}
          </div>

          {/* MOBILE: bell notif + tombol burger */}
          <div className="md:hidden flex items-center gap-1">
            {user && <NotificationBell userId={user.id} />}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Buka menu"
              className="p-2 text-2xl text-white"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-[#12345b]/30 bg-transparent backdrop-blur-md text-[#12345b] rounded-b-2xl overflow-hidden">
          <div className="px-4 py-3 flex flex-col gap-3">
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b border-[#12345b]/30">
                <Avatar src={avatarSrc} name={fullName} size="w-10 h-10" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{fullName}</p>
                  <p className="text-xs text-gray-300 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {NAV_LINKS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-lg self-start inline-block [text-shadow:0_0_8px_#fcd401] ${
                    isActive
                      ? "border-b-2 border-[#12345b] pb-1"
                      : "hover:text-[#12345b]/70"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}

            <div className="flex flex-col gap-3 pt-3 mt-3 border-t border-[#12345b]/30 bg-[#12345b] text-white -mx-4 px-4 pb-4 rounded-b-2xl">
              {user ? (
                <>
                  <a
                    href="/home/dashboard"
                    className="px-4 py-2 text-center border border-white rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
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
