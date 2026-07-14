import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { searchSkdRankingByLocation } from "../../services/leaderboard/searchSkdRankingByLocation";
import LeaderboardLocationSearchCard from "./LeaderboardLocationSearchCard";
import LeaderboardLocationResultCard from "./LeaderboardLocationResultCard";

/**
 * LeaderboardLocationSearchSection — tab "Cari Peringkat Wilayah" di
 * halaman /home/leaderboard (LeaderboardPageDb), sejajar dengan tab
 * "Leaderboard Paket" yang sudah ada.
 *
 * SENGAJA self-contained (ambil session sendiri via
 * supabase.auth.getSession(), pola sama seperti
 * LeaderboardPageContainer.jsx) supaya tidak perlu prop-drilling
 * userId lewat LeaderboardPageDb yang sifatnya presentational murni.
 *
 * Lihat searchSkdRankingByLocation.js untuk detail RPC yang
 * dibutuhkan (belum ada di Supabase per 14 Jul 2026) -- kalau RPC
 * belum ada/gagal, section ini tampil pesan "fitur belum tersedia",
 * BUKAN layar error, jadi aman dipasang dari sekarang.
 *
 * Props:
 * - onStartSkd: opsional, dilempar ke LeaderboardLocationResultCard
 */
export default function LeaderboardLocationSearchSection({ onStartSkd }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async ({ locationType, locationValue }) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setError("Sesi kamu berakhir, silakan login ulang.");
      setLoading(false);
      return;
    }

    const { data, error: searchError } = await searchSkdRankingByLocation({
      userId: session.user.id,
      locationType,
      locationValue,
    });

    if (searchError) {
      console.error(searchError);
      setError(
        "Fitur cari peringkat wilayah belum tersedia saat ini. Coba lagi nanti."
      );
      setResult(null);
      setLoading(false);
      return;
    }

    if (!data || data.region.totalParticipants === 0) {
      setResult(null);
      setError(
        `Belum ada peserta SKD yang tercatat berdomisili di ${locationValue}.`
      );
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
      <LeaderboardLocationSearchCard onSearch={handleSearch} loading={loading} />

      <div>
        {!hasSearched && (
          <div className="bg-white rounded-3xl border border-dashed border-[var(--lb-outline-variant)] p-10 text-center text-[var(--lb-on-surface-variant)]">
            Pilih provinsi (dan opsional kabupaten/kota) di samping, lalu tekan
            &quot;Cari Peringkat&quot; untuk melihat statistik daerah dan posisi
            hipotetis kamu di sana.
          </div>
        )}

        {hasSearched && loading && (
          <div className="bg-white rounded-3xl border border-[var(--lb-outline-variant)] p-10 text-center text-[var(--lb-on-surface-variant)]">
            Memuat statistik daerah...
          </div>
        )}

        {hasSearched && !loading && error && (
          <div className="bg-white rounded-3xl border border-[var(--lb-outline-variant)] p-10 text-center text-[var(--lb-on-surface-variant)]">
            {error}
          </div>
        )}

        {hasSearched && !loading && !error && result && (
          <LeaderboardLocationResultCard
            locationType={result.locationType}
            locationValue={result.locationValue}
            region={result.region}
            yourPosition={result.yourPosition}
            onStartSkd={onStartSkd}
          />
        )}
      </div>
    </div>
  );
}
