import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "./routes/TestPage";
import HomePage from "./routes/HomePage";
import NotFound from "./pages/home/NotFound";
import AuthPage from "./routes/AuthPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route non ujian */}
        <Route path="/home/*" element={<HomePage />} />
        <Route path="/*" element={<NotFound />} />

        {/* Route khusus ujian*/}
        <Route path="/exam-page/*" element={<TestPage />} />

        {/* routes khusus akses dan kebijakan  */}
        <Route path="/cpn-z/*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}
