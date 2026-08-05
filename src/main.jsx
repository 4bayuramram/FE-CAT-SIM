import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import App from "./App.jsx";
import { store } from "./app/store";
import { supabase, supabaseUrl } from "./lib/supabaseClient";
import { configureHttpClientDb } from "./engine_2/httpClientDb";

/**
 * PATCH (blocker fix): httpClientDb sebelumnya tidak pernah dikonfigurasi,
 * sehingga baseUrl kosong dan getAccessToken selalu null -> seluruh
 * request ke Edge Function (create-session, get-questions, autosave,
 * submit, dst) gagal / 401. Dipanggil sekali di titik masuk aplikasi.
 */
configureHttpClientDb({
  baseUrl: `${supabaseUrl}/functions/v1`,
  getAccessToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
