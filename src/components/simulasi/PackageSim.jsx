import React from "react";
import { Link } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import ScheduleIcon from "@mui/icons-material/Schedule";

// Reusable PackageSim
const PackageSim = ({
  title = "Paket SKD",
  description = "Simulasi TWK, TIU, dan TKP.",
  questions = 110,
  duration = "100 Menit",
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFcqYtR6JjJhpDeWJLlW1yogF8y6rEp2yNPIiWUeb7zbs16zBZ1gnLp4qSolOyfW5H896BSDNKDMLnaNfCO8Qnmq4_uoGpNH-Ml7BIXfSsA0NZI4OohGkxn5tegnT5r448DAKXLSjXkc2ZzmvFlEx1X9-5imVR3N7BZBYmI8Px0bR07gGnIe1ZlMN3uDfdT9COjWO-Dw2h52Pxnd9ijsYW-VxzbFNfP26Jovwa5SGh2lSabSdiAKfMOIjmJBaw0chtGh7zifAxnSwr",
  badge = "Langsung",
  buttonText = "Mulai Simulasi",
  linkTo = "#",
}) => {
  return (
    <div className="bg-white border border-[#00467f] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-md hover:shadow-lg transition-shadow group w-full">
      {/* Image */}
      <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        {/* Badge */}
        <div className="absolute top-2 right-2 bg-[#00467f] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
          {badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col justify-between flex-grow">
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:underline">
            {title}
          </h3>

          <p className="text-sm md:text-base text-gray-600">{description}</p>

          {/* Info */}
          <div className="flex flex-wrap gap-4 pt-2 text-gray-500 text-sm items-center">
            <div className="flex items-center gap-1">
              <QuizIcon fontSize="small" />
              <span>{questions} Soal</span>
            </div>

            <div className="flex items-center gap-1">
              <ScheduleIcon fontSize="small" />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        {/* Button with Link */}
        <Link
          to={linkTo}
          className="
          mt-4 md:mt-6 
          w-full 
          bg-white 
          border 
          border-[#00467f] 
          text-[#00467f] 
          py-2 md:py-3 
          rounded 
          font-semibold 
          text-sm md:text-base 
          text-center
          transition-all
          hover:bg-[#00467f]
          hover:text-white
          hover:border-white
          "
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

// Main Sematkan Page
export default function Sematkan() {
  const paketSimulasi = [
    {
      title: "Paket 1",
      badge: "Free",
      questions: 6,
      duration: "60 Menit",
      linkTo: "/exam-page/1",
    },
    {
      title: "Paket 2",
      badge: "Free",
      questions: 6,
      duration: "60 Menit",
      linkTo: "/exam-page/2",
    },
    {
      title: "Paket 3",
      badge: "Free",
      questions: 30,
      duration: "60 Menit",
      linkTo: "/exam-page/3",
    },
    {
      title: "Paket 4",
      badge: "Free",
      questions: 6,
      duration: "60",
      linkTo: "/exam-page/4",
    },
    {
      title: "Paket 5",
      badge: "Free",
      questions: 6,
      duration: "60",
      linkTo: "/exam-page/5",
    },
  ];

  return (
    <section className="bg-white font-merriweather font-extrabold pt-4 mb-8 md:pt-8 pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-left mb-8 md:mb-12 space-y-3">
          <h2
            className="text-2xl md:text-4xl font-extrabold"
            style={{ color: "#00467f" }}
          >
            Daftar Paket
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {paketSimulasi.map((paket, idx) => (
            <div
              key={idx}
              className="w-full sm:w-auto max-w-full sm:max-w-none mx-auto"
            >
              <PackageSim
                title={paket.title}
                description={paket.description}
                badge={paket.badge}
                questions={paket.questions}
                duration={paket.duration}
                linkTo={paket.linkTo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
