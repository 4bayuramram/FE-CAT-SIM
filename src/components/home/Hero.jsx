import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);

  // PENTING: sebelumnya pakai useScroll({ target: ref, offset: [...] })
  // yang menghitung progres RELATIF terhadap posisi section di layar.
  // Di beberapa kombinasi tinggi section/viewport (terutama mobile),
  // nilai progres di scrollY=0 (belum discroll sama sekali) bisa sudah
  // > 0, sehingga `x` ikut mulai dari nilai positif -> Hero kegeser ke
  // kanan sejak awal load dan kepotong oleh overflow-hidden section
  // induk. Fix: lacak scroll HALAMAN absolut, dijamin 0 saat belum
  // discroll sama sekali, jadi x pasti 0 di awal.
  const { scrollY } = useScroll();

  // Sesuaikan angka 500 ini kalau efek parallax terasa kurang/berlebih.
  const x = useTransform(scrollY, [0, 500], [0, 220]);
  const scrollOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <motion.section
      ref={ref}
      // Efek MASUK: sekali jalan saat komponen pertama kali render
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      // Efek SCROLL: dipetakan langsung dari posisi scroll, terus aktif
      style={{
        backgroundImage: "url('/hero.png')",
        x,
        opacity: scrollOpacity,
        willChange: "transform, opacity",
      }}
      className="
        w-full
        min-h-[40vh] md:min-h-[70vh]
        rounded-2xl md:rounded-[10%]
        flex items-center justify-center
        p-4 md:p-8
        bg-cover bg-center
        relative
        text-white
        shadow-[0_0_40px_15px_rgba(255,255,255,0.5)]
      "
    />
  );
}
