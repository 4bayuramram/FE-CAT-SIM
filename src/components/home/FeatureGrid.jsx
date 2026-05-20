import {
  AccessTime,
  Leaderboard,
  MenuBook,
  Psychology,
  Analytics,
  Inventory2,
} from "@mui/icons-material";

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

  return (
    <section className="py-16 md:py-24 bg-[#00467f] font-merriweather font-extrabold">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <h2 className="text-2xl md:text-4xl text-white font-extrabold">
            Fitur Unggulan Untuk Keberhasilan Anda
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base font-semibold">
            Dirancang khusus untuk mensimulasikan lingkungan tes CPNS yang
            kompetitif dan akurat.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                p-6 md:p-8
                rounded-2xl
                border border-white/40
                bg-transparent
                text-white
                hover:border-white
                transition-all duration-200
              "
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl border border-white flex items-center justify-center mb-5">
                <span className="text-white scale-110">{item.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-extrabold mb-3 text-white">
                {item.title}
              </h3>

              {/* Desc */}
              <p className="text-white/80 text-sm md:text-base font-semibold leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
