import { Link } from "react-router-dom";
import ProvinceCityField from "./ProvinceCityField";
import SocialRegister from "./SocialRegister";

export default function RegisterForm({
province,
city,
cityOptions,
onProvinceChange,
onCityChange,
}) {
return (
  <div className="w-full max-w-md">
    {" "}
    <div className="lg:hidden mb-10">
      {" "}
      <h1 className="text-3xl font-extrabold text-[#12345b]">CPN-Z </h1>{" "}
    </div>
    <div className="mb-8">
      <h2 className="text-4xl font-bold text-[#12345b] mb-2">Daftar Akun</h2>

      <p className="text-gray-500">Silahkan lengkapi data untuk membuat akun</p>
    </div>
    <form className="space-y-5">
      {/* Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Nama Depan</label>

          <input
            type="text"
            placeholder="John"
            className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fcd401] transition"
          />
        </div>

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

      <ProvinceCityField
        province={province}
        city={city}
        cityOptions={cityOptions}
        onProvinceChange={onProvinceChange}
        onCityChange={onCityChange}
      />

      {/* Terms */}
      <label className="flex items-start gap-3 text-sm text-gray-500">
        <input type="checkbox" className="mt-1 accent-[#fcd401]" />

        <span>
          Saya menyetujui{" "}
          <a
            href="/cpn-z/TermsPag"
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

      <button
        type="submit"
        className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#12345b] to-[#fcd401] hover:opacity-90 transition shadow-lg"
      >
        Buat Akun Sekarang
      </button>
    </form>
    <SocialRegister />
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
