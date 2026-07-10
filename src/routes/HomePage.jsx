import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/home/Home";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";
import Simulasi from "../pages/simulasi/Simulasi";
import LeaderboardPageContainer from "../pages/leaderboard/LeaderboardPageContainer";
import DashboardPageContainer from "../pages/dashboard/DashboardPageContainer";
import NotFound from "../pages/home/NotFound";
import BantuanPage from "../pages/bantuan/BantuanPage";
import ProtectedLayout from "./ProtectedLayout";


export default function HomePage() {
  const location = useLocation();

  // valid path non-exam
  const validPaths = 
  [
    "/home", 
    "/home/simulasi",
    "/home/leaderboard",
    "/home/bantuan",
  ];
  // Catatan: "/home/dashboard" SENGAJA tidak dimasukkan ke validPaths.
  // DashboardPageDb adalah app-shell sendiri (sidebar fixed penuh
  // tinggi layar dari top-0 + bottom-nav mobile sendiri), jadi Navbar
  // & FooterSection situs (yang lain) tidak boleh ikut tampil di atas/
  // bawahnya -- kalau tidak, akan ada 2 lapis navigasi bertumpuk.

  const isValid = validPaths.includes(location.pathname);

  return (
    <>
      {isValid && <Navbar />}

      <Routes>
        <Route index element={<Home />} />
        {/* halaman simulasi */}
        <Route element={<ProtectedLayout />}>
          <Route path="simulasi" element={<Simulasi />} />
          {/* Halaman leaderboard independen -- semua paket yang sudah
              dibeli user, satu card per paket. Lihat
              pages/leaderboard/LeaderboardPageContainer.jsx. */}
          <Route path="leaderboard" element={<LeaderboardPageContainer />} />

          {/* Halaman Dashboard -- ringkasan paket dimiliki, skor,
              peringkat, dan mini leaderboard. Sebelumnya link ini di
              Navbar sengaja diarahkan ke route yang belum terdaftar
              (lihat komentar lama di components/home/Navbar.jsx) --
              sekarang halamannya sudah ada, lihat
              pages/dashboard/DashboardPageContainer.jsx. */}
          <Route path="dashboard" element={<DashboardPageContainer />} />
        </Route>

        {/* Halaman Bantuan / FAQ -- publik, tidak perlu login, supaya
            pengguna yang belum daftar pun bisa cek FAQ pembayaran &
            cara ikut try-out. Lihat src/pages/bantuan/BantuanPage.jsx. */}
        <Route path="bantuan" element={<BantuanPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {isValid && <FooterSection />}
    </>
  );
}
