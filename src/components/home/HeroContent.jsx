import { motion } from "framer-motion";
import TypewriterText from "./TypewriterText";

// Parent: mengatur jeda (stagger) antar child saat muncul
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Child: tiap elemen fade + slide up sedikit
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HeroContent() {
  return (
    <motion.div
      className="text-white space-y-6 md:space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Badge */}
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm"
      >
        <span className="text-xs md:text-sm font-medium tracking-wide">
          Platform Tryout SKD CPNS
        </span>
      </motion.div>

      {/* HERO TITLE */}
      <motion.h1
        variants={item}
        className="
          relative
          font-merriweather font-extrabold
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          leading-tight md:leading-[1.1]
          tracking-tight
        "
      >
        {/* GHOST: teks final penuh, invisible, cuma dipakai untuk
            "mengunci" tinggi h1 (termasuk saat wrap ke 2/3 baris)
            sesuai lebar layar. Tidak pernah berubah -> tidak ada
            reflow, jadi tombol di bawah tidak ikut bergerak. */}
        <span aria-hidden="true" className="invisible block">
          Selamat bertemu di papan peringkat...
        </span>

        {/* Teks yang benar-benar diketik, ditumpuk di atas ghost
            lewat absolute positioning -> perubahan panjang teks
            selama animasi tidak lagi mempengaruhi layout di luar h1 */}
        <span className="absolute inset-0">
          <TypewriterText
            text="Selamat bertemu di papan peringkat..."
            typingSpeed={45}
            pauseAfterTyping={1500}
          />
        </span>
      </motion.h1>

      {/* DESCRIPTION */}
      <motion.p
        variants={item}
        className="
          font-times
          text-sm sm:text-base md:text-lg
          text-blue-100n
          max-w-xl
          leading-relaxed
        "
      >
       tidak ada bimbel mahal disini, kami hanya menyediakkan tryout dan pembahsan untuk membantu kamu menyiapkan diri menghadapi SKD CPNS. Silakan tryout jika kamu sudah siap.
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
      >
        <motion.button
          whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          whileTap={{ scale: 0.97 }}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl transition-colors duration-300 w-full sm:w-auto"
        >
          Tryout sekarang
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
