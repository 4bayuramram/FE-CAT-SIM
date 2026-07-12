import { useState } from "react";
import ProvinceCityField from "../../pages/auth/components/register/ProvinceCityField";
import useRegisterLocation from "../../pages/auth/hooks/useRegisterLocation";
import { updateUserDomicile } from "../../services/auth/updateUserDomicile";
import { updateUserName } from "../../services/auth/updateUserName";

/**
 * DomicileModal — panel wajib lengkapi profil untuk user yang belum
 * punya data domisili dan/atau nama (utamanya login Google, lihat
 * DomicileGuard.jsx). TODO §5 "Data Domisili User Google Login".
 *
 * PATCH (nama kosong untuk user Google): sebelumnya modal ini cuma
 * urus domisili. Sekarang bisa juga minta nama depan/belakang lewat
 * prop requireName — dipakai saat first_name & last_name user_profile
 * KEDUANYA kosong (akun Google lama sebelum fix createUserProfile.js,
 * atau akun Google yang memang tidak kirim data nama). Nama ini yang
 * jadi sumber tampilan "Peserta" (masking) maupun nama asli
 * (publikasi) di leaderboard — kalau kosong, keduanya tidak bisa
 * ditampilkan dengan benar.
 *
 * Props:
 * - requireDomicile: boolean — tampilkan & wajibkan field provinsi/kota
 * - requireName: boolean — tampilkan & wajibkan field nama depan/belakang
 *
 * Behavior (sesuai TODO):
 * - Muncul sebagai overlay absolute menutupi seluruh layar.
 * - TIDAK BISA ditutup sebelum data diisi — sengaja tidak ada tombol
 *   close/X, tidak ada onClick di backdrop, dan Escape key tidak
 *   di-handle sama sekali.
 * - Reuse ProvinceCityField + useRegisterLocation dari alur registrasi
 *   manual supaya konsisten (data source sama: constant/locationData.js).
 */
export default function DomicileModal({
  userId,
  requireDomicile = true,
  requireName = false,
  onComplete,
}) {
  const {
    province,
    city,
    cityOptions,
    handleProvinceChange,
    handleCityChange,
  } = useRegisterLocation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const domicileFilled = !requireDomicile || (!!province && !!city);
  const nameFilled = !requireName || !!firstName.trim();
  const canSubmit = domicileFilled && nameFilled && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMsg("");

    if (requireDomicile) {
      const { error } = await updateUserDomicile(userId, province, city);
      if (error) {
        console.error(error);
        setErrorMsg("Gagal menyimpan data. Coba lagi.");
        setSubmitting(false);
        return;
      }
    }

    if (requireName) {
      const { error } = await updateUserName(
        userId,
        firstName,
        lastName
      );
      if (error) {
        console.error(error);
        setErrorMsg("Gagal menyimpan data. Coba lagi.");
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    onComplete({ province, city, firstName, lastName });
  };

  const title =
    requireName && requireDomicile
      ? "Lengkapi Data Diri Kamu"
      : requireName
      ? "Lengkapi Nama Kamu"
      : "Lengkapi Lokasi Formasi yang Ingin Kamu Lamar";

  const description =
    requireName && requireDomicile
      ? "Akun kamu masuk lewat Google dan belum punya nama & lokasi formasi yang dilamar. Data ini dipakai untuk menampilkan identitas kamu di leaderboard dan mengelompokkan tingkat persaingan, jadi wajib diisi sebelum melanjutkan."
      : requireName
      ? "Akun kamu masuk lewat Google dan belum punya nama tersimpan. Nama ini dipakai untuk menampilkan identitas kamu di leaderboard (baik disamarkan maupun dipublikasikan), jadi wajib diisi sebelum melanjutkan."
      : "Akun kamu masuk lewat Google dan belum memilih lokasi formasi yang dilamar. Data ini dipakai untuk mengelompokkan tingkat persaingan kamu, jadi wajib diisi sebelum melanjutkan.";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      // Sengaja tidak ada onClick di sini — klik di luar tidak menutup modal.
    >
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#001f3f] mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        {errorMsg && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {requireName && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Depan
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#12345b]"
                  placeholder="Budi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Belakang
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#12345b]"
                  placeholder="Santoso (opsional)"
                />
              </div>
            </div>
          )}

          {requireDomicile && (
            <ProvinceCityField
              province={province}
              city={city}
              cityOptions={cityOptions}
              onProvinceChange={handleProvinceChange}
              onCityChange={handleCityChange}
            />
          )}

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
