import { useState } from "react";
import { useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/home" },
  { label: "Materi", href: "/home/materi" },
  { label: "Simulasi", href: "/home/simulasi" },
  { label: "Pembahasan", href: "/home/pembahasan" },
  { label: "Try-Out", href: "/home/try-out" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation(); // hook untuk dapatkan path saat ini

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#12345b] shadow-sm font-serif text-white">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-24 flex items-center justify-between">
        {/* LEFT / LOGO */}
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
            const isActive = location.pathname === item.href; // cek halaman aktif
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
          <a
            href="/login"
            className="text-white text-lg transition hover:text-gray-300"
          >
            Masuk
          </a>

          <a
            href="/register"
            className="px-5 py-2 text-white border border-white bg-transparent hover:bg-white hover:text-[#12345b] rounded-lg text-lg transition"
          >
            Daftar Sekarang
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-white hover:text-gray-300"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-white bg-[#12345b] font-serif text-white">
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

            <div className="flex flex-col gap-2 pt-2 border-t border-white">
              <a
                href="/login"
                className="px-4 py-2 text-center text-white border border-white rounded-lg text-lg hover:bg-white hover:text-[#12345b]"
              >
                Masuk
              </a>

              <a
                href="/register"
                className="px-4 py-2 text-center text-white border border-white rounded-lg text-lg hover:bg-white hover:text-[#12345b]"
              >
                Daftar Sekarang
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
