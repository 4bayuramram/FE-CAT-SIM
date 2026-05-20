export default function HeroContent() {
  return (
    <div className="text-white space-y-6 md:space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
        <span className="text-xs md:text-sm font-medium tracking-wide">
          Platform Persiapan CPNS
        </span>
      </div>

      {/* HERO TITLE */}
      <h1
        className="
          font-merriweather font-extrabold
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          leading-tight md:leading-[1.1]
          tracking-tight
        "
      >
        Belajar Kapan saja dan Dimana saja...
      </h1>

      {/* DESCRIPTION */}
      <p
        className="
          font-times
          text-sm sm:text-base md:text-lg
          text-blue-100
          max-w-xl
          leading-relaxed
        "
      >
        SIM-CAT Menyediakan Ribuan Soal untuk Kamu Bisa Melatih kemampuan Menjawab Soal SKD CPNS dengan Simulasi Berbasis Computer.
      </p>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto">
          Simulasi Sekarang
        </button>

        <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
          Pengantar Tes CPNS
        </button>
      </div>
    </div>
  );
}
