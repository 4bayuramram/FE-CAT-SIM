import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/home/Home";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";
import Simulasi from "../pages/simulasi/Simulasi";
import NotFound from "../pages/home/NotFound";
import ProtectedLayout from "./ProtectedLayout";


export default function HomePage() {
  const location = useLocation();

  // valid path non-exam
  const validPaths = 
  [
    "/home", 
    "/home/simulasi",
  ];

  const isValid = validPaths.includes(location.pathname);

  return (
    <>
      {isValid && <Navbar />}

      <Routes>
        <Route index element={<Home />} />
        {/* halaman simulasi */}
        <Route element={<ProtectedLayout />}>
          <Route path="simulasi" element={<Simulasi />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {isValid && <FooterSection />}
    </>
  );
}
