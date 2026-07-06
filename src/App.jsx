import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

import TestPage from "./routes/TestPage";
import HomePage from "./routes/HomePage";
import AuthPage from "./routes/AuthPage";
import PaidExam from "./routes/PaidExam";
import ProtectedLayout from "./routes/ProtectedLayout";
import ProtectedLayoutDb from "./routes/ProtectedLayoutDb";

export default function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("INIT SESSION:", session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH CHANGE:", event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/*" element={<HomePage />} />

        <Route element={<ProtectedLayoutDb />}>
          <Route path="/try-out/*" element={<PaidExam />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/exam-page/*" element={<TestPage />} />
        </Route>

        <Route path="/cpn-z/*" element={<AuthPage />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
