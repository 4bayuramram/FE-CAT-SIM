import { BrowserRouter, Routes, Route } from "react-router-dom";
import BasePage from "./routes/BasePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<BasePage />} />
      </Routes>
    </BrowserRouter>
  );
}
