import React from "react";
import { Link } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import ScheduleIcon from "@mui/icons-material/Schedule";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BoltIcon from "@mui/icons-material/Bolt";
import PeopleIcon from "@mui/icons-material/People";

// Reusable PackageSim
const PackageSim = ({
  title = "Paket SKD",
  description = "Simulasi TWK, TIU, dan TKP.",
  questions = 110,
  duration = "100 Menit",
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFcqYtR6JjJhpDeWJLlW1yogF8y6rEp2yNPIiWUeb7zbs16zBZ1gnLp4qSolOyfW5H896BSDNKDMLnaNfCO8Qnmq4_uoGpNH-Ml7BIXfSsA0NZI4OohGkxn5tegnT5r448DAKXLSjXkc2ZzmvFlEx1X9-5imVR3N7BZBYmI8Px0bR07gGnIe1ZlMN3uDfdT9COjWO-Dw2h52Pxnd9ijsYW-VxzbFNfP26Jovwa5SGh2lSabSdiAKfMOIjmJBaw0chtGh7zifAxnSwr",
  badge = "Langsung",
  buttonText = "Mulai Simulasi",
  pembahasan = "",
  peringkat = "",
  hots = "",
  ultrahots = "",
  linkTo = "#",
  peserta = "",
}) => {
  return (
    <div className="bg-white border border-[#00467f] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-md hover:shadow-lg transition-shadow group w-full">
      {/* Image */}
      <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        {/* Badge */}
        <div className="absolute top-2 right-2 bg-[#00467f] text-white text-xs font-bold px-2 py-1 rounded tracking-wider">
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
            {hots && (
              <div className="flex items-center gap-1">
                <PsychologyIcon fontSize="small" />
                <span>{hots}</span>
              </div>
            )}
            {ultrahots && (
              <div className="flex items-center gap-1">
                <BoltIcon fontSize="small" />
                <span>{ultrahots}</span>
              </div>
            )}

            {pembahasan && (
              <div className="flex items-center gap-1">
                <QuestionAnswerIcon fontSize="small" />
                <span>{pembahasan}</span>
              </div>
            )}
            {peringkat && (
              <div className="flex items-center gap-1">
                <EmojiEventsIcon fontSize="small" />
                <span>{peringkat}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <PeopleIcon fontSize="small" />
              <span>{peserta}</span>
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
      badge: "Gratis",
      questions: 110,
      duration: "95 Menit",
      description: "Try-Out SKD (TWK,TIU,TKP)",
      linkTo: "/exam-page/1",
      pembahasan: "koreksi-jawaban",
      peserta: 112,
    },
    {
      title: "Paket 2 (sedang disusun)",
      badge: "rp.11.999.",
      questions: 0,
      duration: "60 Menit",
      description: "Try-Out SKD (TWK,TIU,TKP)",
      hots: "HOTS",
      linkTo: "/exam-page/skd-002",
      pembahasan: "full-pembahasan",
      peringkat: "pemeringkatan Nasional/Provinsi",
    },
    {
      title: "Paket 3 (sedang disusun)",
      badge: "rp.15.000.",
      questions: 30,
      duration: "60 Menit",
      description: "Try-Out SKD (TWK,TIU,TKP)",
      ultrahots: "ultra-hots",
      linkTo: "/exam-page/skd-003",
      pembahasan: "full-pembahasan",
      peringkat: "pemeringkatan Nasional/Provinsi",
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
            Daftar Paket Try-Out Full-SKD
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
                hots={paket.hots}
                ultrahots={paket.ultrahots}
                linkTo={paket.linkTo}
                pembahasan={paket.pembahasan}
                peringkat={paket.peringkat}
                peserta={paket.peserta}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
