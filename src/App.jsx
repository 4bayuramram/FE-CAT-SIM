import { BrowserRouter, Routes, Route } from "react-router-dom";
import BasePage from "./routes/BasePage";
import Home from "./routes/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Home */}
        <Route path="/*" element={<Home />} />

        {/* Route lainnya */}
        <Route path="/*" element={<BasePage />} />
      </Routes>
    </BrowserRouter>
  );
}
