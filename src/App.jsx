import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

import TestPage from "./routes/TestPage";
import HomePage from "./routes/HomePage";
import NotFound from "./pages/home/NotFound";
import AuthPage from "./routes/AuthPage";
import ProtectedLayout from "./routes/ProtectedLayout";

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
        <Route path="/*" element={<NotFound />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/exam-page/*" element={<TestPage />} />
        </Route>

        <Route path="/cpn-z/*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}
