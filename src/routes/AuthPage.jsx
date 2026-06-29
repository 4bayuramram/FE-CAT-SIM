import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login"
import NotFound from "../pages/home/NotFound";
import PrivacyPage from "../pages/auth/PrivacyPage";
import TermsPage from "../pages/auth/TermsPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AuthCallback from "../pages/auth/AuthCallback";

import PaymentPage from "../pages/payment/PaymentPage"

export default function BasePage() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/authCallback" element={<AuthCallback />} />

      <Route path="/daftar" element={<RegisterPage />} />
      <Route path="/Privacy" element={<PrivacyPage />} />
      <Route path="/TermsPage" element={<TermsPage />} />

      <Route path="payment/:paketId" element={<PaymentPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
