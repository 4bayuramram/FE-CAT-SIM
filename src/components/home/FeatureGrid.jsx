import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  AccessTime,
  Leaderboard,
  MenuBook,
  Psychology,
  Analytics,
  Inventory2,
} from "@mui/icons-material";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FeaturesGrid() {
  const features = [
    {
      icon: <AccessTime />,
      title: "Simulasi Real-time",
      desc: "Pengalaman ujian dengan timer dan sistem navigasi soal yang persis dengan CAT BKN asli.",
    },
    {
      icon: <Leaderboard />,
      title: "Ranking Nasional",
      desc: "Bandingkan skor Anda dengan ribuan peserta lainnya secara real-time di seluruh Indonesia.",
    },
    {
      icon: <MenuBook />,
      title: "Pembahasan Lengkap",
      desc: "Setiap soal dilengkapi pembahasan mendalam, tips cepat, dan konsep dasar yang mudah dipahami.",
    },
    {
      icon: <Psychology />,
      title: "Tryout HOTS",
      desc: "Bank soal dengan tingkat kesulitan HOTS sesuai tren tes terbaru.",
    },
    {
      icon: <Analytics />,
      title: "Analisis Nilai",
      desc: "Grafik performa belajar yang menunjukkan kelemahan dan kekuatan Anda di setiap materi.",
    },
    {
      icon: <Inventory2 />,
      title: "Bank Soal Terbesar",
      desc: "Akses ribuan soal TWK, TIU, dan TKP yang terus diperbarui setiap minggu.",
    },
  ];

  const sectionRef = useRef(null);

  // Lacak posisi section relatif viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // EFEK "BREATHING": grid penuh (scale 1, opacity 1) saat berada di
  // tengah layar, lalu mengecil + memudar begitu discroll menjauh --
  // baik ke atas (belum sampai) maupun ke bawah (sudah lewat). Gaya
  // yang sama dengan TrustStatsSection, tapi dipakai di sini untuk
  // seluruh grid fitur.
  const gridScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.85, 1, 1, 0.85]
  );
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.3, 1, 1, 0.3]
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-[#00467f] font-merriweather font-extrabold"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16 space-y-3"
        >
          <h2 className="text-2xl md:text-4xl text-white font-extrabold">
            Fitur Unggulan Untuk Keberhasilan Anda
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base font-semibold">
            Dirancang khusus untuk mensimulasikan lingkungan tes CPNS yang
            kompetitif dan akurat.
          </p>
        </motion.div>

        {/* Grid - dibungkus wrapper terpisah untuk efek scale+opacity
            kontinu (breathing) mengikuti scroll, sementara
            stagger-reveal per kartu di dalamnya tetap jalan sekali
            saat kartu pertama kali terlihat */}
        <motion.div style={{ scale: gridScale, opacity: gridOpacity }}>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {features.map((feat, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="
                  p-6 md:p-8
                  rounded-2xl
                  border border-white/40
                  bg-transparent
                  text-white
                  hover:border-white
                  transition-colors duration-200
                "
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl border border-white flex items-center justify-center mb-5">
                  <span className="text-white scale-110">{feat.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-extrabold mb-3 text-white">
                  {feat.title}
                </h3>

                {/* Desc */}
                <p className="text-white/80 text-sm md:text-base font-semibold leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
