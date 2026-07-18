import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    title: "latihan soal gratis",
    desc: "Akses semua latihan soal di dasbor kamu dengan minimal pembelian 1 paket tryout.",
    borderLeft: false,
  },
  {
    title: "+Pembahasan",
    desc: "Pembahasan mendalam tiap topik materi yang diujikan.",
    borderLeft: true,
  },
  {
    title: "Cari dan Bandingkan",
    desc: "Cari dan bandingkan posisimu dengan peserta lain di tingkat nasional, provinsi, dan kabupaten/kota.",
    borderLeft: true,
  },
  {
    title: "Analisis Kemampuan Menjawab",
    desc: "Laporan ini menyajikan evaluasi hasil ujian yang mencakup statistik serta kekuatan dan kelemahan pada tiap materi.",
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
          style={{ scale, opacity }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-2 sm:p-4 ${
                stat.borderLeft ? "md:border-l border-gray-200" : ""
              }`}
            >
              <div className="text-base sm:text-2xl md:text-3xl text-[#00467f] font-extrabold leading-snug">
                {stat.title}
              </div>
              <div className="text-[11px] sm:text-sm text-gray-500 mt-1 leading-snug font-times">
                {stat.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
