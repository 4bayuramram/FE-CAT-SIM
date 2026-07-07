import { useState } from "react";
import ProvinceCityField from "../../pages/auth/components/register/ProvinceCityField";
import useRegisterLocation from "../../pages/auth/hooks/useRegisterLocation";
import { updateUserDomicile } from "../../services/auth/updateUserDomicile";

/**
 * DomicileModal — panel wajib isi Provinsi & Kota/Kabupaten, khusus
 * untuk user yang belum punya data domisili (utamanya login Google,
 * lihat DomicileGuard.jsx). TODO §5 "Data Domisili User Google Login".
 *
 * Behavior (sesuai TODO):
 * - Muncul sebagai overlay absolute menutupi seluruh layar.
 * - TIDAK BISA ditutup sebelum data diisi — sengaja tidak ada tombol
 *   close/X, tidak ada onClick di backdrop, dan Escape key tidak
 *   di-handle sama sekali.
 * - Reuse ProvinceCityField + useRegisterLocation dari alur registrasi
 *   manual supaya konsisten (data source sama: constant/locationData.js).
 */
export default function DomicileModal({ userId, onComplete }) {
  const {
    province,
    city,
    cityOptions,
    handleProvinceChange,
    handleCityChange,
  } = useRegisterLocation();

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = !!province && !!city && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMsg("");

    const { error } = await updateUserDomicile(userId, province, city);

    setSubmitting(false);

    if (error) {
      console.error(error);
      setErrorMsg("Gagal menyimpan data. Coba lagi.");
      return;
    }

    onComplete({ province, city });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      // Sengaja tidak ada onClick di sini — klik di luar tidak menutup modal.
    >
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#001f3f] mb-2">
          Lengkapi Lokasi Formasi yang Ingin Kamu Lamar
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Akun kamu masuk lewat Google dan belum memilih lokasi formasi yang
          dilamar. Data ini dipakai untuk mengelompokkan tingkat persaingan
          kamu, jadi wajib diisi sebelum melanjutkan.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <ProvinceCityField
            province={province}
            city={city}
            cityOptions={cityOptions}
            onProvinceChange={handleProvinceChange}
            onCityChange={handleCityChange}
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              canSubmit
                ? "bg-gradient-to-r from-[#12345b] to-[#fcd401] hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </button>
        </form>
      </div>
    </div>
  );
}
