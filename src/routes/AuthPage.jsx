import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login"
import NotFound from "../pages/home/NotFound";
import PrivacyPage from "../pages/auth/PrivacyPage";
import TermsPage from "../pages/auth/TermsPage";
import RegisterPage from "../pages/auth/RegisterPage";

export default function BasePage() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/daftar" element={<RegisterPage />} />
      <Route path="/Privacy" element={<PrivacyPage />} />
      <Route path="/TermsPage" element={<TermsPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
