import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "./routes/TestPage";
import HomePage from "./routes/HomePage";
import NotFound from "./pages/home/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/*" element={<HomePage />} />
        {/* Route non ujian */}
        <Route path="/*" element={<NotFound />} />

        {/* Route khusus ujian*/}
        <Route path="/exam-page/*" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}
