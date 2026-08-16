import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import DashboardSkdRankingCard from "./DashboardSkdRankingCard";

/**
 * DashboardSkdRankingSection — pengganti "Top Peserta" lama di tab
 * Ringkasan. Bukan cuplikan peserta lain, tapi posisi relatif user, 3
 * cakupan sekaligus, berbasis skor SKD saja: Nasional, Provinsi
 * (domisili), Kabupaten/Kota (domisili).
 *
 * Props:
 * - skdRanking: { national, province, city } | null — tiap cakupan:
 *   { rank, totalPeserta, avgScore, percentile, name? } | null.
 *   null ditangani graceful — tetap render 3 kartu kosong, biar
 *   layout 2 kolom tidak kolaps.
 * - onSeeFullLeaderboard: opsional, CTA bawah section
 */
export default function DashboardSkdRankingSection({ skdRanking, onSeeFullLeaderboard }) {
  const { national, province, city } = skdRanking || {};

  return (
    <div className="flex flex-col gap-4">
      <DashboardSkdRankingCard
        label="Peringkat Nasional"
        icon={PublicRoundedIcon}
        rank={national?.rank ?? null}
        totalPeserta={national?.totalPeserta ?? null}
        avgScore={national?.avgScore ?? null}
        jumlahPaket={national?.jumlahPaket ?? null}
        percentile={national?.percentile ?? null}
      />

      <DashboardSkdRankingCard
        label="Peringkat Provinsi"
        scopeName={province?.name}
        icon={MapRoundedIcon}
        rank={province?.rank ?? null}
        totalPeserta={province?.totalPeserta ?? null}
        avgScore={province?.avgScore ?? null}
        jumlahPaket={province?.jumlahPaket ?? null}
        percentile={province?.percentile ?? null}
        emptyMessage={
          province?.name
            ? "Kerjakan paket SKD untuk mulai bersaing di provinsimu."
            : "Lengkapi domisili (provinsi) di halaman Akun untuk melihat peringkat ini."
        }
      />

      <DashboardSkdRankingCard
        label="Peringkat Kabupaten/Kota"
        scopeName={city?.name}
        icon={LocationCityRoundedIcon}
        rank={city?.rank ?? null}
        totalPeserta={city?.totalPeserta ?? null}
        avgScore={city?.avgScore ?? null}
        jumlahPaket={city?.jumlahPaket ?? null}
        percentile={city?.percentile ?? null}
        emptyMessage={
          city?.name
            ? "Kerjakan paket SKD untuk mulai bersaing di kota/kabupatenmu."
            : "Lengkapi domisili (kabupaten/kota) di halaman Akun untuk melihat peringkat ini."
        }
      />

      {onSeeFullLeaderboard && (
        <button
          type="button"
          onClick={onSeeFullLeaderboard}
          className="text-sm font-bold text-[var(--db-primary-container)] hover:underline text-left px-1"
        >
          Lihat Leaderboard Lengkap
        </button>
      )}
    </div>
  );
}
