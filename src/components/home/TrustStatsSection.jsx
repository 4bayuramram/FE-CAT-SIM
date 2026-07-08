import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    title: "+1000 soal",
    desc: "Berdasarkan paket ujian tahun lalu dan soal prediksi",
    borderLeft: false,
  },
  {
    title: "+Pembahasan",
    desc: "Pembahasan yang mudah dipahami",
    borderLeft: true,
  },
  {
    title: "Time & Scoring",
    desc: "Penyesuain Sistem Scoring dan Durasi Ujian",
    borderLeft: true,
  },
  {
    title: "Performance Analysis",
    desc: "Analisis Kemampuan Menjawabmu",
    borderLeft: true,
  },
];

export default function TrustStatsSection() {
  const ref = useRef(null);

  // Lacak posisi section relatif viewport (masuk dari bawah -> keluar atas)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // EFEK "BREATHING": scale mengecil di tepi (baru masuk / mau keluar),
  // membesar penuh pas di tengah layar. Beda dari efek geser-samping
  // di Hero -- di sini murni scale + opacity, tanpa pergeseran posisi.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.92, 1, 1, 0.92]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.4, 1, 1, 0.4]
  );

  return (
    <section
      ref={ref}
      className="relative py-12 bg-white border-b border-gray-200 font-merriweather"
    >
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          style={{ scale, opacity }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 ${
                stat.borderLeft ? "md:border-l border-gray-200" : ""
              }`}
            >
              <div className="text-2xl md:text-3xl text-[#00467f] font-extrabold">
                {stat.title}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-times">
                {stat.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
