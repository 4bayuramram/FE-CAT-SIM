import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

// CATATAN LEGAL: sengaja pakai ikon GENERIK (bukan logo asli bank/e-wallet
// seperti BCA, GoPay, dst) karena logo-logo itu adalah merek dagang milik
// masing-masing pihak, dan Midtrans sendiri belum tentu berwenang
// mengizinkan pemakaian ulangnya. Ikon generik + penyebutan nama metode
// secara teks tetap menyampaikan info yang sama (apa saja yang didukung)
// tanpa risiko pelanggaran merek dagang. Kalau nanti mau pakai logo resmi
// Midtrans ("Powered by Midtrans"), pakai file resmi dari brand kit
// Midtrans apa adanya (jangan diedit warna/proporsi) dan taruh sebagai
// <img>, bukan direka ulang jadi teks/ikon.
const paymentMethods = [
  {
    icon: <CreditCardRoundedIcon fontSize="small" />,
    label: "Kartu Kredit/Debit",
  },
  {
    icon: <AccountBalanceRoundedIcon fontSize="small" />,
    label: "Transfer Bank",
  },
  {
    icon: <AccountBalanceWalletRoundedIcon fontSize="small" />,
    label: "E-Wallet",
  },
  { icon: <QrCode2RoundedIcon fontSize="small" />, label: "QRIS" },
];

export default function FooterSection() {
  return (
    <footer
      className="w-full bg-black border-t border-white/10 overflow-hidden text-white"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-14 lg:gap-20">
          {/* LEFT CONTENT */}
          <div className="w-full lg:max-w-sm text-center lg:text-left mx-auto lg:mx-0">
            {/* LOGO */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                CPNZ
              </h2>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base max-w-md mx-auto lg:mx-0">
              Platform yang membantu kamu belajar dan beradaptasi secara optimal
              dengan ujian komputer SKD CPNS.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-6 flex-wrap">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00467f] hover:text-white transition-all duration-300"
              >
                <LanguageRoundedIcon fontSize="small" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00467f] hover:text-white transition-all duration-300"
              >
                <AlternateEmailRoundedIcon fontSize="small" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00467f] hover:text-white transition-all duration-300"
              >
                <ForumRoundedIcon fontSize="small" />
              </a>
            </div>
          </div>

          {/* RIGHT LINKS */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 text-center sm:text-left">
              {/* PRODUK */}
              <div>
                <h3 className="font-bold text-white mb-4 text-base sm:text-lg">
                  Produk
                </h3>

                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Tryout Gratis
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Premium Plan
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Bank Soal
                    </a>
                  </li>
                </ul>
              </div>

              {/* BANTUAN */}
              <div>
                <h3 className="font-bold text-white mb-4 text-base sm:text-lg">
                  Bantuan
                </h3>

                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Hubungi Kami
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      FAQ
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Panduan CAT
                    </a>
                  </li>
                </ul>
              </div>

              {/* LEGAL */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-bold text-white mb-4 text-base sm:text-lg">
                  Legal
                </h3>

                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
                    >
                      Kebijakan Privasi
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-[#00467f] transition-colors duration-300"
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
        <div className="mt-14 pt-10 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Metode pembayaran yang didukung */}
            <div className="text-center lg:text-left">
              <h3 className="font-bold text-white mb-4 text-base sm:text-lg">
                Metode Pembayaran yang Didukung
              </h3>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  >
                    {method.icon}
                    <span className="text-xs sm:text-sm">{method.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge kepercayaan / payment gateway */}
            <div className="flex flex-col items-center lg:items-end gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <VerifiedUserRoundedIcon
                  fontSize="small"
                  className="text-[#00d4ff]"
                />
                <span className="text-xs sm:text-sm text-gray-300">
                  Transaksi diamankan &amp; diproses oleh{" "}
                  <span className="font-bold text-white">Midtrans</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-500 max-w-xs text-center lg:text-right">
                Diproses melalui payment gateway Midtrans yang tersertifikasi
                PCI DSS.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <p className="text-sm text-gray-500 leading-relaxed">
            © 2026 CPNZ. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
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
