import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "./routes/TestPage";
import HomePage from "./routes/HomePage";
import NotFound from "./pages/home/NotFound";
import AuthPage from "./routes/AuthPage"

import ProtectedLayout from "./routes/ProtectedLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route non ujian */}
        <Route path="/home/*" element={<HomePage />} />

        <Route path="/*" element={<NotFound />} />

        <Route element={<ProtectedLayout />}>
          {/* Route khusus ujian*/}
          <Route path="/exam-page/*" element={<TestPage />} />
        </Route>

        {/* routes khusus akses dan kebijakan  */}
        <Route path="/cpn-z/*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}
