import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PACKAGE_CATEGORIES } from "../../utils/packageCategory";
import "./PackageCategoryTabs.css";

// PackageCategoryTabs — Tabbed Interface untuk halaman /home/simulasi.
//
// Sama seperti tab kategori di halaman Leaderboard: pakai animasi
// "hover-circle" ala PillNav (lihat src/components/common/PillNav) --
// lingkaran biru membesar dari bawah pill saat aktif/di-hover, teks
// lama naik sambil teks putih baru masuk dari bawah. Tab yang sedang
// dipilih tetap terisi permanen + diberi GLOW KUNING (#fcd401) di
// sekelilingnya supaya jelas kategori mana yang aktif.
//
// Tab SELALU tampil lengkap (Semua/SKD/TWK/TIU/TKP) apa pun isinya,
// termasuk kategori yang belum punya paket sama sekali -- "wadah"
// harus ada duluan sebelum datanya ada, sesuai keputusan produk. Badge
// angka di tiap pill menunjukkan jumlah paket per kategori.
//
// Responsive: di layar sempit daftar tab jadi scroll horizontal (bukan
// wrap/menumpuk) supaya tetap satu baris rapi di mobile.
export default function PackageCategoryTabs({
  active,
  onChange,
  counts = {},
  ease = "power3.easeOut",
}) {
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!w || !h) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pkg-pill-label");
        const white = pill.querySelector(".pkg-pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
          0
        );
        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: "auto" },
            0
          );
        }
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
            0
          );
        }

        tlRefs.current[index] = tl;

        if (PACKAGE_CATEGORIES[index]?.key === active) {
          tl.progress(1);
        }
      });
    };

    layout();
    window.addEventListener("resize", layout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }
    return () => window.removeEventListener("resize", layout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease]);

  // Animasikan transisi saat tab aktif berpindah
  useEffect(() => {
    PACKAGE_CATEGORIES.forEach((cat, index) => {
      const tl = tlRefs.current[index];
      if (!tl) return;
      activeTweenRefs.current[index]?.kill();
      const target = cat.key === active ? tl.duration() : 0;
      activeTweenRefs.current[index] = tl.tweenTo(target, {
        duration: 0.35,
        ease,
        overwrite: "auto",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleEnter = (i) => {
    if (PACKAGE_CATEGORIES[i]?.key === active) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i) => {
    if (PACKAGE_CATEGORIES[i]?.key === active) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  return (
    <div
      role="tablist"
      aria-label="Kategori paket try-out"
      className="pkg-pill-tabs"
    >
      {PACKAGE_CATEGORIES.map((cat, i) => {
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
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            className={`pkg-pill${isActive ? " pkg-is-active" : ""}`}
          >
            <span
              className="pkg-hover-circle"
              aria-hidden="true"
              ref={(el) => {
                circleRefs.current[i] = el;
              }}
            />
            <span className="pkg-label-stack">
              <span className="pkg-pill-label">{cat.label}</span>
              <span className="pkg-pill-label-hover" aria-hidden="true">
                {cat.label}
              </span>
            </span>
            <span className="pkg-count-badge">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
