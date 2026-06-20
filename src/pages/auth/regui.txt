import React from "react";
import { Link } from "react-router-dom";


import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

export default function RegisterPage() {

    const [province, setProvince] = useState(null);
    const [city, setCity] = useState(null);

  const provinces = [
    { id: "jabar", label: "Jawa Barat" },
    { id: "jateng", label: "Jawa Tengah" },
    { id: "jatim", label: "Jawa Timur" },
  ];

  const citiesByProvince = {
    jabar: [
      { id: "bdg", label: "Bandung" },
      { id: "bgr", label: "Bogor" },
      { id: "dpk", label: "Depok" },
    ],
    jateng: [
      { id: "smg", label: "Semarang" },
      { id: "solo", label: "Surakarta" },
    ],
    jatim: [
      { id: "sby", label: "Surabaya" },
      { id: "mlg", label: "Malang" },
    ],
  };

return (
  <main className="min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
    {/* LEFT SIDE */}{" "}
    <section className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#12345b] via-[#0b2a4a] to-[#fcd401] text-white p-14 flex-col justify-between">
      {/* Background Image */}
      <img
        src="/hero.png"
        alt="Education Background"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />

      {/* Top Branding */}
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold tracking-tight">CPN-Z</h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-xl">
        <h2 className="text-4xl font-bold mb-6 leading-tight">
          Start Your <br /> Exam Journey
        </h2>

        <p className="text-white/80 text-lg leading-8">
          Join thousands of high-achieving candidates across the globe. Our
          adaptive CBT platform provides secure, scalable, and modern assessment
          experiences for institutions and learners.
        </p>

        {/* Glass Card */}
        <div className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[#fcd401] flex items-center justify-center text-[#12345b] text-2xl font-bold">
            ✓
          </div>

          <div>
            <p className="text-[#fcd401] text-sm font-medium">
              Certified Institution
            </p>

            <h3 className="text-xl font-semibold">ISO 27001 Accredited</h3>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="relative z-10 flex gap-12">
        <div>
          <h3 className="text-4xl font-bold">1.2M+</h3>
          <p className="text-white/70 text-sm mt-1">Tests Taken</p>
        </div>

        <div>
          <h3 className="text-4xl font-bold">99.9%</h3>
          <p className="text-white/70 text-sm mt-1">Uptime Rate</p>
        </div>
      </div>
    </section>
    {/* RIGHT SIDE */}
    <section className="w-full lg:w-1/2 min-h-screen bg-white flex items-center justify-center px-6 py-12 overflow-y-auto">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10">
          <h1 className="text-3xl font-extrabold text-[#12345b]">CBT Global</h1>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#12345b] mb-2">
            Daftar Akun
          </h2>

          <p className="text-gray-500">
            Silahkan lengkapi data untuk membuat akun
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="text-sm text-gray-600">Nama Depan</label>

              <input
                type="text"
                placeholder="John"
                className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401] transition"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm text-gray-600">Nama Belakang</label>

              <input
                type="text"
                placeholder="Doe"
                className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401] transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>

            <input
              type="email"
              placeholder="johndoe@gmail.com"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401] transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600">Konfirmasi Password</label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401] transition"
            />
          </div>

          {/* Province */}
          <div>
            <label className="text-sm text-gray-600">Provinsi</label>

            <Autocomplete
              options={provinces}
              value={province}
              onChange={(event, newValue) => {
                setProvince(newValue);
                setCity(null); // reset city
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Cari Provinsi"
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </div>

          {/* City */}
          {/* City */}
          <div>
            <label className="text-sm text-gray-600">Kota / Kabupaten</label>

            <Autocomplete
              options={province ? citiesByProvince[province.id] || [] : []}
              value={city}
              onChange={(event, newValue) => setCity(newValue)}
              getOptionLabel={(option) => option.label}
              disabled={!province}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    province
                      ? "Cari Kota atau Kabupaten"
                      : "Pilih Provinsi dulu"
                  }
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 text-sm text-gray-500">
            <input type="checkbox" className="mt-1 accent-[#fcd401]" />

            <span>
              Saya menyetujui{" "}
              <a
                href="/cpn-z/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#12345b] font-semibold hover:underline"
              >
                Syarat & Ketentuan
              </a>{" "}
              dan{" "}
              <a
                href="/cpn-z/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#12345b] font-semibold hover:underline"
              >
                Kebijakan Privasi
              </a>
            </span>
          </label>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#12345b] to-[#fcd401] hover:opacity-90 transition shadow-lg"
          >
            Buat Akun Sekarang
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="px-3 text-sm text-gray-400">atau</span>

          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Button */}
        <button className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />

          <span className="font-medium text-gray-700">
            Daftar Dengan Google
          </span>
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-[#12345b] font-semibold hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </section>
  </main>
);
}
