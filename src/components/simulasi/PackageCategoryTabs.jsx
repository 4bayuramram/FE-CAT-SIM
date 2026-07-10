import React from "react";
import { PACKAGE_CATEGORIES } from "../../utils/packageCategory";

// PackageCategoryTabs — Tabbed Interface untuk halaman /home/simulasi.
//
// Tab SELALU tampil lengkap (Semua/SKD/TWK/TIU/TKP) apa pun isinya,
// termasuk kategori yang belum punya paket sama sekali (mis. TIU/TKP
// saat ini) -- "wadah" harus ada duluan sebelum datanya ada, sesuai
// keputusan produk. Badge angka di tiap tab menunjukkan jumlah paket
// per kategori supaya user tahu tab mana yang masih kosong tanpa
// harus klik dulu.
//
// Responsive: di layar sempit, daftar tab jadi scroll horizontal
// (bukan wrap/menumpuk) supaya tetap satu baris rapi di mobile; scrollbar
// disembunyikan lewat class .no-scrollbar (lihat src/index.css).
export default function PackageCategoryTabs({ active, onChange, counts = {} }) {
  return (
    <div
      role="tablist"
      aria-label="Kategori paket try-out"
      className="flex gap-1 overflow-x-auto no-scrollbar border-b border-gray-200 mb-6 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0"
    >
      {PACKAGE_CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        const count = counts[cat.key] ?? 0;

        return (
          <button
            key={cat.key}
            type="button"
            role="tab"
            id={`tab-${cat.key}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${cat.key}`}
            onClick={() => onChange(cat.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 md:px-4 py-3 text-sm md:text-base font-semibold whitespace-nowrap border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00467f] focus-visible:ring-offset-2 rounded-t-md ${
              isActive
                ? "border-[#00467f] text-[#00467f]"
                : "border-transparent text-gray-500 hover:text-[#00467f] hover:border-gray-300"
            }`}
          >
            {cat.label}
            <span
              className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center leading-tight ${
                isActive
                  ? "bg-[#00467f] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
