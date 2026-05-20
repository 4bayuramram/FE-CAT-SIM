
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/home-cat", active: true },
  { label: "paket", href: "/paket" },
  { label: "pembahasan", href: "/pembahasan" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-16 flex items-center justify-between">
        {/* LEFT / LOGO */}
        <div className="font-bold text-blue-600 text-xl">SIM-CAT</div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition ${
                item.active
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 text-blue-600 hover:bg-gray-100 rounded-lg text-sm"
          >
            Masuk
          </a>

          <a
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Daftar
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 text-sm"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <div className="flex flex-col gap-2 pt-2 border-t">
              <a
                href="/login"
                className="px-4 py-2 text-center text-blue-600 border rounded-lg"
              >
                Masuk
              </a>

              <a
                href="/register"
                className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg"
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
