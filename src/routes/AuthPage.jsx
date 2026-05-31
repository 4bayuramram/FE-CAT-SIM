import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login"
import NotFound from "../pages/home/NotFound";
import PrivacyPage from "../pages/auth/PrivacyPage";
import TermsPage from "../pages/auth/TermsPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Login2 from "../pages/auth/Login2";

export default function BasePage() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login2" element={<Login2 />} />

      <Route path="/daftar" element={<RegisterPage />} />
      <Route path="/Privacy" element={<PrivacyPage />} />
      <Route path="/TermsPage" element={<TermsPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
