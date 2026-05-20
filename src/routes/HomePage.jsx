import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";


export default function HomePage() {
  return (
    <>
      {/*  Navbar */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
      </Routes>
      {/* footer  */}
      <FooterSection />
    </>
  );
}
