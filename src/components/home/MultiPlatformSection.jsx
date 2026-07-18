import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";

export default function MultiPlatformSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // EFEK "BERPUTAR BERLAWANAN": teks & gambar datang dari sisi
  // berlawanan sambil sedikit rotate -- beda dari Hero (geser+fade) &
  // FeatureGrid (parallax vertikal). Titik tahan di tengah (0.35-0.65)
  // supaya konten tetap stabil dibaca saat ada di tengah layar.
  const textX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [-80, 0, 0, -80]
  );
  const textRotate = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [-4, 0, 0, -4]
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.3, 1, 1, 0.3]
  );

  const imgX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [80, 0, 0, 80]
  );
  const imgRotate = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [4, 0, 0, 4]
  );
  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.3, 1, 1, 0.3]
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            style={{ x: textX, rotate: textRotate, opacity: textOpacity }}
            className="space-y-6 text-center lg:text-left"
          >
            {/* Label */}
            <div className="inline-block text-[#00467f] font-bold text-sm uppercase tracking-[0.2em]">
              Multi-Platform Access
            </div>

            {/* Title */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00467f] leading-tight "
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Belajar Kapan Saja,
              <br className="hidden sm:block" />
              Di Mana Saja
            </h2>

            {/* Description */}
            <p
              className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
              style={{ fontFamily: '"Handgloves"' }}
            >
              CPNS dapat diakses melalui browser di desktop maupun smartphone
              tanpa harus menginstal aplikasi tambahan. Progresmu
              tersinkronisasi secara otomatis di seluruh perangkat.
            </p>

            {/* Feature boxes */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Desktop */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 p-4 sm:px-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl">
                  <LaptopMacRoundedIcon className="text-[#00467f] !text-2xl" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-gray-800">Desktop Web</p>
                  <p className="text-sm text-gray-500">Akses Browser</p>
                </div>
              </motion.div>

              {/* Mobile */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 p-4 sm:px-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl">
                  <SmartphoneRoundedIcon className="text-[#00467f] !text-2xl" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-gray-800">
                    Mobile Optimized
                  </p>
                  <p className="text-sm text-gray-500">Responsive Mobile</p>
                  <p className="text-sm text-gray-500"></p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            style={{ x: imgX, rotate: imgRotate, opacity: imgOpacity }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>
            </div>

            {/* Image */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-xl">
              <img
                src="m.png"
                alt="Multi Platform Access"
                loading="lazy"
                className="w-full rounded-3xl shadow-2xl object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
