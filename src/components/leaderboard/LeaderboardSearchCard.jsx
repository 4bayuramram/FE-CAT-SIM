import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

/**
 * Kartu "Cari Lokasi": input search + chip filter lokasi.
 *
 * Props:
 * - searchValue, onSearchChange(value)
 * - locations: [{ key, label }]  (item pertama biasanya "Semua Lokasi")
 * - activeLocation: key yang sedang aktif
 * - onLocationChange(key)
 */
export default function LeaderboardSearchCard({
  searchValue = "",
  onSearchChange,
  locations = [
    { key: "semua", label: "Semua Lokasi" },
    { key: "dki-jakarta", label: "DKI Jakarta" },
    { key: "jawa-barat", label: "Jawa Barat" },
    { key: "jawa-tengah", label: "Jawa Tengah" },
    { key: "jawa-timur", label: "Jawa Timur" },
    { key: "sumatera-utara", label: "Sumatera Utara" },
  ],
  activeLocation = "semua",
  onLocationChange,
}) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--lb-primary-container)] shadow-md p-6">
      <h3 className="text-sm font-bold text-[var(--lb-primary-container)] uppercase tracking-wider mb-4">
        Cari Lokasi
      </h3>

      <div className="relative mb-6">
        <SearchRoundedIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lb-outline)]"
          fontSize="small"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Ketik nama instansi..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--lb-outline-variant)] focus:border-2 focus:border-[var(--lb-primary)] focus:ring-0 text-sm transition-all outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {locations.map((loc) => {
          const isActive = loc.key === activeLocation;
          return (
            <button
              key={loc.key}
              type="button"
              onClick={() => onLocationChange?.(loc.key)}
              className={
                isActive
                  ? "px-3 py-1.5 rounded-lg bg-[var(--lb-secondary-container)] text-[var(--lb-primary)] font-bold text-xs"
                  : "px-3 py-1.5 rounded-lg border border-[var(--lb-outline-variant)] text-[var(--lb-on-surface-variant)] hover:bg-[var(--lb-surface-container-high)] transition-colors text-xs font-medium"
              }
            >
              {loc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
