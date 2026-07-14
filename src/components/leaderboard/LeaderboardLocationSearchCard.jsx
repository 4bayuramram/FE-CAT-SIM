import { useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { provinces, citiesByProvince } from "../../pages/auth/constant/locationData";

/**
 * Kartu input untuk fitur "Cari Peringkat SKD per Provinsi/Kota".
 *
 * BEDA dari LeaderboardSearchCard (yang search nama instansi/filter
 * chip lokasi terhadap data yang SUDAH kebaca di client): kartu ini
 * search-nya bebas ke provinsi/kota MANA PUN via dropdown (bukan
 * free-text, supaya nilai yang dikirim ke RPC selalu match persis
 * dengan format `label` yang tersimpan di user_profile.province/city
 * -- lihat locationData.js), lalu men-trigger fetch ke server saat
 * tombol "Cari" ditekan (bukan filter instan di client).
 *
 * User boleh cari level provinsi saja (kosongkan kota) atau
 * provinsi+kota sekaligus.
 *
 * Props:
 * - onSearch({ locationType: 'province'|'city', locationValue: string })
 * - loading: boolean, disable tombol saat request jalan
 */
export default function LeaderboardLocationSearchCard({ onSearch, loading = false }) {
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");

  const cityOptions = useMemo(
    () => (provinceId ? citiesByProvince[provinceId] || [] : []),
    [provinceId]
  );

  const selectedProvince = provinces.find((p) => p.id === provinceId);
  const selectedCity = cityOptions.find((c) => c.id === cityId);

  const canSearch = Boolean(selectedProvince) && !loading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProvince) return;

    if (selectedCity) {
      onSearch?.({ locationType: "city", locationValue: selectedCity.label });
    } else {
      onSearch?.({ locationType: "province", locationValue: selectedProvince.label });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-[var(--lb-primary-container)] shadow-md p-6"
    >
      <h3 className="text-sm font-bold text-[var(--lb-primary-container)] uppercase tracking-wider mb-1">
        Cari Peringkat Daerah
      </h3>
      <p className="text-xs text-[var(--lb-on-surface-variant)] mb-4">
        Cari provinsi atau kabupaten/kota mana pun -- tidak harus domisilimu sendiri.
      </p>

      <div className="flex flex-col gap-3 mb-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[var(--lb-on-surface-variant)]">
            Provinsi
          </span>
          <select
            value={provinceId}
            onChange={(e) => {
              setProvinceId(e.target.value);
              setCityId("");
            }}
            className="w-full px-3 py-3 rounded-xl border border-[var(--lb-outline-variant)] focus:border-2 focus:border-[var(--lb-primary)] focus:ring-0 text-sm transition-all outline-none bg-white"
          >
            <option value="">Pilih provinsi...</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[var(--lb-on-surface-variant)]">
            Kabupaten/Kota <span className="font-normal">(opsional)</span>
          </span>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={!provinceId}
            className="w-full px-3 py-3 rounded-xl border border-[var(--lb-outline-variant)] focus:border-2 focus:border-[var(--lb-primary)] focus:ring-0 text-sm transition-all outline-none bg-white disabled:bg-[var(--lb-surface-container)] disabled:text-[var(--lb-outline)]"
          >
            <option value="">
              {provinceId ? "Semua kabupaten/kota di provinsi ini" : "Pilih provinsi dulu"}
            </option>
            {cityOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSearch}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--lb-primary-container)] text-white font-bold text-sm transition-opacity disabled:opacity-50"
      >
        <SearchRoundedIcon fontSize="small" />
        {loading ? "Mencari..." : "Cari Peringkat"}
      </button>
    </form>
  );
}
