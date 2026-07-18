import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, cloneElement } from "react";
import GlareHover from "./GlareHover";
import {
  CardGiftcardRounded,
  SellRounded,
  LocalFireDepartmentRounded,
  PhoneIphoneRounded,
  VisibilityOffRounded,
  PictureAsPdfRounded,
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

const GLARE_CYCLE = 4; // detik, lama 1 putaran sapuan glare per kartu
const WAVE_STEP = 0.3; // jeda fase antar kartu (detik) — kecil = banyak overlap = terasa gelombang

export default function FeaturesGrid() {
  const features = [
    {
      icon: <CardGiftcardRounded />,
      title: "1 Paket Gratis",
      desc: "paket gratis tanpa bayar sepeserpun, khusus buat kamu yang ingin coba versi gratis.",
    },
    {
      icon: <SellRounded />,
      title: "Harga lebih terjangkau",
      desc: ` "In this economy, kami akan memberikan kamu diskon untuk semua paket tryout di CPNZ. Buruan cek paketnya!" `,
    },
    {
      icon: <LocalFireDepartmentRounded />,
      title: "Desain Soal HOTS – Ultra HOTS",
      desc: ` "Jujur, kalau tryout-nya saja sudah susah, kamu bakal lebih pede pas ujian beneran" `,
    },
    {
      icon: <PhoneIphoneRounded />,
      title: "Bisa Tryout Lewat HP",
      desc: ` "Buat kamu yang mager buka laptop, kami tahu banget pasti tetap pengen bisa ngerjain tryout atau latihan soal-soal dari HP." `,
    },
    {
      icon: <VisibilityOffRounded />,
      title: "Identitasmu Aman di Papan Peringkat",
      desc: ` "Sembunyikan identitasmu di papan peringkat kapan saja kamu mau." `,
    },
    {
      icon: <PictureAsPdfRounded />,
      title: "Ada Bukti PDF Kamu Udah Serius Latihan",
      desc: `"Unduh PDF laporan ujian untuk lihat statistik serta analisis kekuatan dan kelemahan materimu."`,
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

  const glareDelayFor = (index) => index * WAVE_STEP;

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-[#00467f] font-merriweather font-extrabold"
    >
      <style>{`
        @keyframes cardWaveLift {
          0% {
            transform: translateY(0px);
            filter: brightness(1);
          }
          50% {
            transform: translateY(-5px);
            filter: brightness(1.06);
          }
          100% {
            transform: translateY(0px);
            filter: brightness(1);
          }
        }
        .wave-card {
          animation-name: cardWaveLift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
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
            Apa yang kami persiapkan di sini buat kamu?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base font-semibold">
            Aman banget! Kami selalu siap mendukung semua kebutuhan kamu di masa
            persiapan ini.
          </p>
        </motion.div>

        {/* Grid - dibungkus wrapper terpisah untuk efek scale+opacity
            kontinu (breathing) mengikuti scroll, sementara
            stagger-reveal per kartu di dalamnya tetap jalan sekali
            saat kartu pertama kali terlihat */}
        <motion.div style={{ scale: gridScale, opacity: gridOpacity }}>
          <motion.div
            className="grid grid-cols-3 gap-[clamp(0.5rem,2vw,2rem)]"
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
                className="relative h-full"
              >
                <div
                  style={{
                    animationDuration: `${GLARE_CYCLE}s`,
                    animationDelay: `${glareDelayFor(index)}s`,
                  }}
                  className="
                    wave-card
                    relative
                    flex flex-col
                    h-full
                    aspect-[4/5] lg:aspect-[10/9]
                    overflow-hidden
                    p-[clamp(0.4rem,3vw,2rem)]
                    rounded-[clamp(0.5rem,2vw,1rem)]
                    border border-white/40
                    bg-transparent
                    text-white
                    hover:border-white
                    transition-colors duration-200
                  "
                >
                  <GlareHover
                    width="100%"
                    height="100%"
                    background="transparent"
                    borderRadius="1rem"
                    borderColor="transparent"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    autoPlay
                    autoPlayDuration={GLARE_CYCLE * 1000}
                    autoPlayDelay={glareDelayFor(index) * 1000}
                    className="absolute inset-0"
                  />

                  {/* Icon */}
                  <div className="flex-shrink-0 w-[clamp(1.1rem,5vw,3rem)] h-[clamp(1.1rem,5vw,3rem)] rounded-[clamp(0.25rem,1.5vw,0.75rem)] border border-white flex items-center justify-center mb-[clamp(0.25rem,1.5vw,1.25rem)]">
                    <span className="text-white flex items-center justify-center">
                      {cloneElement(feat.icon, {
                        style: { fontSize: "clamp(0.5rem,2.6vw,1.5rem)" },
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="flex-shrink-0 font-extrabold text-white"
                    style={{
                      fontSize: "clamp(0.42rem,2vw,1.25rem)",
                      marginBottom: "clamp(0.2rem,1vw,0.75rem)",
                      lineHeight: 1.2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {feat.title}
                  </h3>

                  {/* Desc */}
                  <p
                    className="text-white/80 font-semibold flex-1 min-h-0"
                    style={{
                      fontSize: "clamp(0.34rem,1.3vw,1rem)",
                      lineHeight: 1.35,
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
