import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import CenterFocusStrongRoundedIcon from "@mui/icons-material/CenterFocusStrongRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";

export default function AboutUs() {
  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="bg-[#12345b] text-white py-12 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="inline-block text-2xl sm:text-3xl md:text-5xl font-bold font-headline mb-6 border-b-2 border-[#fcd402] pb-2">
            Tentang Kami
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-4xl mx-auto opacity-90">
            Platform tryout CPNS berbasis data dan analisis kompetitif.
            Dirancang untuk membantu peserta mengukur kemampuan, meningkatkan
            kesiapan, serta membangun kepercayaan diri melalui simulasi yang
            menantang dan terukur.
          </p>
        </div>
      </section>

      {/* 2. Visi & Misi Section */}
      <section className="bg-white py-12 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {/* Visi Card */}
          <div
            className="bg-[#eff4ff] p-6 sm:p-8 rounded-xl border border-[#c3c6cf] h-full"
            style={{ boxShadow: "0px 4px 20px rgba(18, 52, 91, 0.08)" }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#12345b] mb-3 flex items-center gap-2">
              <VisibilityRoundedIcon className="text-[#12345b]" /> Visi
            </h2>
            <p className="text-base leading-relaxed text-[#0d1c2f]">
              Platform tryout CPNS yang menghadirkan standar latihan di atas tes
              sesungguhnya. Menyediakan pembahasan mendalam untuk membangun
              pemahaman konsep, mengenali pola soal, dan menguasai strategi
              penyelesaian efektif.
            </p>
          </div>

          {/* Misi Card */}
          <div
            className="bg-white p-6 sm:p-8 rounded-xl border border-[#c3c6cf] h-full"
            style={{ boxShadow: "0px 4px 20px rgba(18, 52, 91, 0.08)" }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#12345b] mb-3 flex items-center gap-2">
              <FlagRoundedIcon className="text-[#12345b]" /> Misi
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="bg-[#fcd402] text-[#221b00] font-bold rounded-lg px-3 py-1 h-fit">
                  1
                </span>
                <div>
                  <strong className="block text-base text-[#001f3f]">
                    Meningkatkan Kesadaran Kemampuan Peserta
                  </strong>
                  <p className="text-[#43474e] text-base">
                    Membantu peserta mengukur kompetensi dan posisi secara
                    objektif melalui hasil tryout, segmentasi persaingan, serta
                    analisis perbandingan berbasis sistem.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-[#fcd402] text-[#221b00] font-bold rounded-lg px-3 py-1 h-fit">
                  2
                </span>
                <div>
                  <strong className="block text-base text-[#001f3f]">
                    Membangun Kesiapan dan Kepercayaan Diri
                  </strong>
                  <p className="text-[#43474e] text-base">
                    Membekali peserta dengan simulasi latihan yang terukur guna
                    meningkatkan kesiapan mental dan rasa percaya diri dalam
                    menghadapi ujian CPNS yang sesungguhnya.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-[#fcd402] text-[#221b00] font-bold rounded-lg px-3 py-1 h-fit">
                  3
                </span>
                <div>
                  <strong className="block text-base text-[#001f3f]">
                    Menciptakan Keunggulan Kompetitif
                  </strong>
                  <p className="text-[#43474e] text-base">
                    Bukan sekadar membantu peserta meraih skor tinggi dalam
                    tryout, melainkan memastikan setiap individu memiliki
                    kompetensi, strategi, dan kesiapan unggul untuk lulus
                    seleksi CPNS.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Fokus Pengembangan Section */}
      <section className="bg-white py-12 px-5 sm:px-6 lg:px-8 border-t border-[#c3c6cf]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12345b] text-center mb-10">
            Fokus Pengembangan Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card Soal */}
            <div className="border-2 border-[#12345b] rounded-xl p-6 sm:p-8 bg-white">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#12345b] mb-6 flex items-center gap-2">
                <AnalyticsRoundedIcon className="text-[#fcd402]" />
                Soal Berbasis Data dan Analisis
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Statistik kemunculan materi yang sering diujikan dari tahun
                    ke tahun.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Analisis pola dan karakteristik soal CPNS.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Pendekatan berbasis konsep, bukan sekadar hafalan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Strategi menjawab yang cepat, tepat, dan efisien.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Pengembangan kemampuan berpikir logis, analitis, kritis, dan
                    pengambilan keputusan.
                  </span>
                </li>
              </ul>
              <p className="text-base text-[#12345b] font-semibold italic border-t border-[#c3c6cf] pt-4">
                Kami secara konsisten meningkatkan kualitas soal agar mampu
                mengukur kemampuan peserta secara lebih mendalam.
              </p>
            </div>

            {/* Card UX */}
            <div className="border-2 border-[#12345b] rounded-xl p-6 sm:p-8 bg-white">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#12345b] mb-6 flex items-center gap-2">
                <CenterFocusStrongRoundedIcon className="text-[#fcd402]" />
                Fokus Pengalaman Pengguna (User Experience)
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Mengetahui tingkat kemampuan aktual berdasarkan hasil
                    tryout.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Memahami posisi dan daya saing dibandingkan peserta lain.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Melihat potensi persaingan berdasarkan tingkat nasional,
                    provinsi, maupun kabupaten/kota.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleRoundedIcon className="text-[#fcd402] mt-1 !text-[10px]" />
                  <span className="text-base text-[#0d1c2f]">
                    Mengidentifikasi kekuatan dan kelemahan yang perlu
                    ditingkatkan sebelum menghadapi seleksi CPNS.
                  </span>
                </li>
              </ul>
              <div className="h-1 bg-[#fcd402] w-24 rounded-full mt-8"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Metode Perangkingan Section */}
      <section className="bg-[#12345b] text-white py-12 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fcd402]">
              Metode Pemeringkatan
            </h2>
            <p className="text-base opacity-80 mt-2">
              Fitur analisis untuk melihat gambaran daya saing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Card 1 */}
            <div className="bg-white/10 p-6 sm:p-8 rounded-xl border border-[#809dca] backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#fcd402]">
                  Peringkat Paket Tryout
                </h3>
                <ListAltRoundedIcon className="text-[#fcd402]" />
              </div>
              <p className="text-base leading-relaxed text-white">
                Berlaku untuk seluruh paket tryout. Peringkat dihitung
                berdasarkan hasil pengerjaan pada paket yang sama, jadi kamu
                hanya dibandingkan dengan peserta di paket tersebut.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 p-6 sm:p-8 rounded-xl border border-[#809dca] backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#fcd402]">
                  Peringkat Akumulasi (Khusus SKD)
                </h3>
                <CalculateRoundedIcon className="text-[#fcd402]" />
              </div>
              <p className="text-base leading-relaxed text-white mb-6">
                Peringkat akumulasi menggunakan metode Bayesian shrinkage, yaitu
                perhitungan yang mempertimbangkan tiga hal: total nilai seluruh
                paket SKD, konsistensi performa kamu, serta jumlah paket yang
                sudah diselesaikan.
              </p>
              <div className="flex flex-wrap gap-2 items-center mt-3">
                <span className="text-base font-semibold text-white mr-3">
                  Cakupan Ranking:
                </span>
                <span className="bg-[#fcd402] text-[#001f3f] font-bold px-3 py-1 rounded-full text-xs tracking-wider">
                  Nasional
                </span>
                <span className="bg-[#fcd402] text-[#001f3f] font-bold px-3 py-1 rounded-full text-xs tracking-wider">
                  Provinsi
                </span>
                <span className="bg-[#fcd402] text-[#001f3f] font-bold px-3 py-1 rounded-full text-xs tracking-wider">
                  Kabupaten/Kota
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#fcd402]/10 border-l-4 border-[#fcd402] p-6 sm:p-8 rounded-r-xl max-w-4xl mx-auto">
            <p className="text-base leading-relaxed italic">
              "Dengan metode ini, hasil dari satu paket tryout tidak akan
              langsung membuat peringkatmu melonjak tinggi atau turun drastis.
              Semakin banyak paket yang kamu kerjakan, semakin akurat sistem
              memetakan kemampuan asli dan posisi kompetitifmu dibanding seluruh
              peserta di CPNZ."
            </p>
          </div>
        </div>
      </section>

      {/* 5. Penutup Section */}
      <section className="bg-white py-12 px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#12345b] text-center mb-8">
            Filosofi Penilaian CPNZ
          </h2>
          <blockquote className="border-l-4 border-[#fcd402] bg-[#eff4ff] p-6 sm:p-8 rounded-r-xl">
            <p className="text-xl sm:text-2xl font-semibold text-[#12345b] italic leading-relaxed">
              "CPNZ tidak cuma mengukur siapa yang meraih nilai tertinggi, tapi
              juga siapa yang paling siap menghadapi seleksi CPNS asli.
              Kami mengutamakan penilaian kemampuan yang konsisten dan objektif,
              demi mencerminkan kompetensi nyatamu dalam persaingan nasional."
            </p>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
