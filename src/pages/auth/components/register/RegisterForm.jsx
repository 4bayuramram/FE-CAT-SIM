import { Link } from "react-router-dom";
import ProvinceCityField from "./ProvinceCityField";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

export default function RegisterForm({
  province,
  city,
  cityOptions,
  onProvinceChange,
  onCityChange,
  onSubmit,
  form,
  onChange,
  loading,
  checkedTerms,
  onCheckedTermsChange,
  onGoogleLogin,
}) {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <div className="w-full max-w-md">
      <div className="lg:hidden mb-10">
        <h1 className="text-3xl font-extrabold text-[#12345b]">CPN-Z</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-[#12345b] mb-2">
          Daftar Akun CPN-Z
        </h2>
        <p className="text-gray-500">
          Silahkan lengkapi data untuk membuat akun
        </p>
      </div>

      {/* FORM */}
      <form className="space-y-5" onSubmit={onSubmit}>
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Nama Depan</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="Sri"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Nama Belakang</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              placeholder="Wahyuni"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="sriwahyuni123@gmail.com"
            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
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

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-600">Konfirmasi Password</label>

          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401]"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showConfirmPassword ? (
                <Visibility fontSize="small" />
              ) : (
                <VisibilityOff fontSize="small" />
              )}
            </button>
          </div>
        </div>

        {/* Province City */}
        <ProvinceCityField
          province={province}
          city={city}
          cityOptions={cityOptions}
          onProvinceChange={onProvinceChange}
          onCityChange={onCityChange}
        />

        {/* Terms */}
        <label className="flex items-start gap-3 text-sm text-gray-500">
          <input
            type="checkbox"
            className="mt-1 accent-[#fcd401]"
            checked={checkedTerms}
            onChange={(e) => onCheckedTermsChange(e.target.checked)}
          />
          <span>
            Saya menyetujui{" "}
            <a
              href="/cpn-z/TermsPage"
              target="_blank"
              className="text-[#12345b] font-semibold"
            >
              Syarat & Ketentuan
            </a>{" "}
            dan{" "}
            <a
              href="/cpn-z/privacy"
              target="_blank"
              className="text-[#12345b] font-semibold"
            >
              Kebijakan Privasi
            </a>
          </span>
        </label>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading || !checkedTerms}
          className={`w-full py-4 rounded-xl font-semibold text-white transition shadow-lg ${
            loading || !checkedTerms
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#12345b] to-[#fcd401] hover:opacity-90"
          }`}
        >
          {loading ? "Loading..." : "Buat Akun Sekarang"}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-3 text-sm text-gray-400">atau</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-50 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
          alt="Google"
        />
        Masuk Dengan Google
      </button>

      <p className="text-center text-sm text-gray-500 mt-8">
        Sudah punya akun?{" "}
        <Link
          to="/cpn-z/login"
          className="text-[#12345b] font-semibold hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
