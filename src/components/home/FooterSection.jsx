import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";

// CATATAN LEGAL:
// - Semua logo di bawah ini SUDAH pakai file logo asli (background putih
//   sudah dihapus/dibikin transparan), taruh di /public/payment-logos/
//   dengan nama file persis seperti path di array `paymentLogos`.
// - Logo di sini HANYA menandakan "metode pembayaran yang didukung",
//   BUKAN "partner resmi/kerja sama langsung" dengan bank/e-wallet tsb --
//   makanya captionnya eksplisit bilang diproses lewat Midtrans, bukan
//   langsung oleh institusi yang bersangkutan. Tetap ikuti brand
//   guideline masing-masing (jangan diubah warna/bentuk/proporsi lebih
//   jauh dari file yang sudah disediakan).
const paymentLogos = [
  { name: "BCA", file: "/payment-logos/bca.png" },
  { name: "Bank Mandiri", file: "/payment-logos/mandiri.png" },
  { name: "BRI", file: "/payment-logos/bri.png" },
  { name: "BNI", file: "/payment-logos/bni.png" },
  { name: "QRIS", file: "/payment-logos/qris.png" },
  { name: "GoPay", file: "/payment-logos/gopay.png" },
  { name: "ShopeePay", file: "/payment-logos/shopeepay.png" },
  { name: "OVO", file: "/payment-logos/ovo.png" },
  { name: "DANA", file: "/payment-logos/dana.png" },
  { name: "Visa", file: "/payment-logos/visa.png" },
  { name: "CIMB Niaga", file: "/payment-logos/cimbbank.png" },
  { name: "Danamon", file: "/payment-logos/danamon.png" },
  { name: "BSI", file: "/payment-logos/bsi.png" },
  { name: "Kredivo", file: "/payment-logos/kredivo.png" }
];

export default function FooterSection() {
  return (
    <footer
      className="w-full bg-black border-t border-white/10 overflow-hidden text-white"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-16">
          {/* LEFT CONTENT */}
          <div className="w-full lg:max-w-sm text-center lg:text-left mx-auto lg:mx-0">
            {/* LOGO */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              CPNZ
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-400 leading-relaxed text-sm max-w-md mx-auto lg:mx-0">
              Platform yang membantu kamu belajar dan beradaptasi secara optimal
              dengan ujian komputer SKD CPNS.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-4 flex-wrap">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00467f] hover:text-white transition-all duration-300"
              >
                <LanguageRoundedIcon fontSize="small" />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00467f] hover:text-white transition-all duration-300"
              >
                <AlternateEmailRoundedIcon fontSize="small" />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00467f] hover:text-white transition-all duration-300"
              >
                <ForumRoundedIcon fontSize="small" />
              </a>
            </div>
          </div>

          {/* RIGHT LINKS */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 text-center sm:text-left">
              {/* PRODUK */}
              <div>
                <h3 className="font-bold text-white mb-2 text-sm sm:text-base">
                  Produk
                </h3>

                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Tryout Gratis
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Premium Plan
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Bank Soal
                    </a>
                  </li>
                </ul>
              </div>

              {/* BANTUAN */}
              <div>
                <h3 className="font-bold text-white mb-2 text-sm sm:text-base">
                  Bantuan
                </h3>

                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Hubungi Kami
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      FAQ
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Panduan CAT
                    </a>
                  </li>
                </ul>
              </div>

              {/* LEGAL */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-bold text-white mb-2 text-sm sm:text-base">
                  Legal
                </h3>

                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Kebijakan Privasi
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Syarat & Ketentuan
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-center lg:text-left">
            <h3 className="font-bold text-white mb-3 text-sm sm:text-base">
              Metode Pembayaran
            </h3>

            {/* Setiap logo dipaksa ke dalam kotak ukuran tetap (w-14 h-8)
                dengan object-contain, supaya semua logo terlihat SERAGAM
                ukurannya di layar -- terlepas dari proporsi/padding
                bawaan file gambar aslinya (yang beda-beda per sumber).
                Tanpa background/chip apapun -- logo langsung di atas
                footer gelap. Catatan: logo yang warnanya gelap (misal
                QRIS hitam) akan kurang kontras tanpa latar terang. */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3">
              {paymentLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="h-8 w-16 flex items-center justify-center"
                  title={logo.name}
                >
                  <img
                    src={logo.file}
                    alt={logo.name}
                    className="max-h-8 max-w-16 w-auto h-auto object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Caption eksplisit: bukan "partner resmi bank", tapi
                diproses lewat Midtrans -- sesuai guideline supaya tidak
                terkesan ada kerja sama langsung dengan bank ybs */}
            <p className="text-xs text-gray-500 mt-3">
              Payment processed securely via{" "}
              <span className="font-bold text-white">Midtrans</span>.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs text-gray-500 leading-relaxed">
            © 2026 CPNZ. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-xs text-gray-500">
              Platform Securely Hosted by
            </span>

            <div className="px-3 py-1 rounded-md border border-white/10 bg-white/5 text-xs font-bold text-white">
              ... Cloud
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
