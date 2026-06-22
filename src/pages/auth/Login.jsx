import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      return "Email dan password wajib diisi";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Format email tidak valid";
    }

    if (password.length < 6) {
      return "Password minimal 6 karakter";
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    console.log("SESSION:", data?.session);
    console.log("ERROR:", error);

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setErrorMsg("Email atau password salah");
        return;
      }

      if (error.message.toLowerCase().includes("email not confirmed")) {
        setErrorMsg("Email belum dikonfirmasi. Cek inbox kamu");
        return;
      }

      if (error.message.toLowerCase().includes("user not found")) {
        setErrorMsg("User tidak ditemukan");
        return;
      }

      setErrorMsg(error.message);
      return;
    }

    if (data?.session) {
      //  sync session ke supabase runtime
      await supabase.auth.setSession(data.session);
      navigate("/home/simulasi");
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home/simulasi`,
      },
    });
  };

  return (
    <main className="min-h-screen flex bg-gray-50">
      {/* LEFT SIDE - Branding (desktop only) */}
      <section className="hidden lg:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-[#12345b] via-[#0b2a4a] to-[#fcd401] text-white overflow-hidden">
        <img
          src="/hero.png"
          alt="Exam Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />

        <div className="relative z-10 text-center px-10">
          <h1 className="text-4xl font-bold mb-4">Smart Exam Platform</h1>
          <p className="text-white/80">
            Secure, scalable, and modern exam experience for institutions.
          </p>

          <img
            src="/hero.png"
            alt="Hero"
            className="mt-10 rounded-2xl shadow-2xl opacity-90"
          />
        </div>
      </section>

      {/* RIGHT SIDE - Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#12345b] mb-2">
            Selamat Datang Pejuang!
          </h2>
          <p className="text-gray-500 mb-8">Silahkan masuk untuk melanjutkan</p>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="emailsaya123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm relative">
              {/* LEFT SIDE (checkbox + info icon) */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#fcd401]"
                />

                <span>Biarkan Saya Tetap Masuk</span>

                {/* INFO ICON (sebelah checkbox) */}
                <button
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className="w-5 h-4 flex items-center justify-center rounded-full bg-[#12345b] text-white text-xs font-bold"
                >
                  ?
                </button>
              </div>

              {/* RIGHT SIDE (forgot password) */}
              <a
                href="#"
                className="text-[#12345b] hover:underline whitespace-nowrap"
              >
                Lupa Password?
              </a>

              {/* DROPDOWN */}
              {showInfo && (
                <div className="absolute top-8 left-0 z-50 bg-white border shadow-md rounded-md p-2 text-xs text-gray-600 w-60 sm:w-72">
                  Jika dicentang, akun akan tetap login meskipun browser
                  ditutup.
                </div>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#12345b] to-[#fcd401] hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Belum punya akun?{" "}
            <a
              href="/cpn-z/daftar"
              className="text-[#12345b] font-semibold hover:underline"
            >
              Daftar sekarang
            </a>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* GOOGLE LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Masuk Dengan Google
          </button>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Dengan melanjutkan, anda menyetujui{" "}
            <a
              href="/cpn-z/TermsPage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#12345b] underline"
            >
              Syarat & Ketentuan
            </a>{" "}
            serta{" "}
            <a
              href="/cpn-z/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#12345b] underline"
            >
              Kebijakan Privasi
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
