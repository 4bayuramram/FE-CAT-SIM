import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./LeaderboardCategoryTabs.css";

/**
 * Baris tab kategori (Semua / SKD / TWK / TIU / TKP), scroll horizontal
 * di layar sempit. Sama seperti versi sebelumnya secara PROPS (tidak ada
 * breaking change di pemanggilnya), tapi sekarang pakai animasi
 * "hover-circle" ala PillNav (lihat src/components/common/PillNav):
 * lingkaran membesar dari bawah pill saat di-hover/aktif, teks lama
 * naik sambil teks putih baru masuk dari bawah.
 *
 * Bedanya dari PillNav: ini TOMBOL untuk switch state lokal (bukan link
 * navigasi/route), dan tab yang sedang aktif tetap terisi permanen
 * (tidak cuma nyala saat kursor hover).
 *
 * Props:
 * - categories: [{ key, label }]
 * - activeKey
 * - onChange(key)
 */
export default function LeaderboardCategoryTabs({
  categories = [
    { key: "semua", label: "Semua" },
    { key: "skd", label: "SKD" },
    { key: "twk", label: "TWK" },
    { key: "tiu", label: "TIU" },
    { key: "tkp", label: "TKP" },
  ],
  activeKey = "semua",
  onChange,
  ease = "power3.easeOut",
}) {
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);

  // Bangun ulang timeline GSAP tiap kali daftar kategori berubah
  // (ukuran pill bisa beda-beda tergantung panjang label).
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

        const label = pill.querySelector(".lb-pill-label");
        const white = pill.querySelector(".lb-pill-label-hover");

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

        // Kalau pill ini yang lagi aktif, langsung set penuh (tanpa
        // animasi) supaya tidak "kedip" saat pertama kali render/resize.
        if (categories[index]?.key === activeKey) {
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
  }, [categories, ease]);

  // Saat activeKey berubah (klik tab lain): animasikan tab lama surut,
  // tab baru penuh -- ini yang bikin transisinya terasa "hidup".
  useEffect(() => {
    categories.forEach((cat, index) => {
      const tl = tlRefs.current[index];
      if (!tl) return;
      activeTweenRefs.current[index]?.kill();
      const target = cat.key === activeKey ? tl.duration() : 0;
      activeTweenRefs.current[index] = tl.tweenTo(target, {
        duration: 0.35,
        ease,
        overwrite: "auto",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, categories.length]);

  const handleEnter = (i) => {
    if (categories[i]?.key === activeKey) return; // sudah penuh, biarkan
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
    if (categories[i]?.key === activeKey) return; // tab aktif tetap penuh
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
    <div role="tablist" className="lb-pill-tabs leaderboard-scrollbar">
      {categories.map((cat, i) => {
        const isActive = cat.key === activeKey;
        return (
          <button
            key={cat.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(cat.key)}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            className={`lb-pill${isActive ? " lb-is-active" : ""}`}
          >
            <span
              className="lb-hover-circle"
              aria-hidden="true"
              ref={(el) => {
                circleRefs.current[i] = el;
              }}
            />
            <span className="lb-label-stack">
              <span className="lb-pill-label">{cat.label}</span>
              <span className="lb-pill-label-hover" aria-hidden="true">
                {cat.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
