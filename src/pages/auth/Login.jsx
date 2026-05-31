import React from "react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-gray-50">
      {/* LEFT SIDE - Branding (desktop only) */}
      <section className="hidden lg:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-[#12345b] via-[#0b2a4a] to-[#fcd401] text-white overflow-hidden">
        {/* Background image (Unsplash) */}
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

          {/* Decorative image */}
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
          {/* Title */}
          <h2 className="text-3xl font-bold text-[#12345b] mb-2">
            Selamat Datang
          </h2>
          <p className="text-gray-500 mb-8">Silahkan masuk untuk melanjutkan</p>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="emailsaya123@gmail.com"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#fcd401]" />
                Biarkan Saya Tetap Masuk
              </label>

              <a href="#" className="text-[#12345b] hover:underline">
                Lupa Password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#12345b] to-[#fcd401] hover:opacity-90 transition"
            >
              Masuk
            </button>
          </form>

          {/* Register CTA */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Belum punya akun?{" "}
            <a
              href="/cpn-z/daftar"
              className="text-[#12345b] font-semibold hover:underline"
            >
              Daftar sekarang
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">atau</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Masuk Dengan Google
          </button>

          {/* Terms */}
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
