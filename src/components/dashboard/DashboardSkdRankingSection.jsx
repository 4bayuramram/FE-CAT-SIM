import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import DashboardSkdRankingCard from "./DashboardSkdRankingCard";

/**
 * DashboardSkdRankingSection — PENGGANTI "Top Peserta"
 * (DashboardMiniLeaderboardCard) di tab Ringkasan.
 *
 * Beda filosofi dengan Top Peserta lama: dulu menampilkan cuplikan
 * top-3 peserta lain utk 1 paket "unggulan". Sekarang murni
 * menunjukan POSISI RELATIF user, 3 cakupan sekaligus, KHUSUS skor
 * paket SKD (bukan TWK/TIU/TKP satuan -- lihat catatan di
 * DashboardCategoryScoreGrid):
 * 1. Peringkat Nasional — di antara semua peserta
 * 2. Peringkat Provinsi — di antara peserta di provinsi domisili user
 * 3. Peringkat Kabupaten/Kota — di antara peserta di kab/kota domisili user
 *
 * Props:
 * - skdRanking: {
 *     national: { rank, totalPeserta, avgScore, percentile } | null,
 *     province: { name, rank, totalPeserta, avgScore, percentile } | null,
 *     city: { name, rank, totalPeserta, avgScore, percentile } | null,
 *   } | null — null (RPC belum ada/gagal) DITANGANI SECARA GRACEFUL:
 *   section ini TETAP tampil dengan 3 kartu kosong ("belum tersedia"),
 *   BUKAN hilang total -- supaya layout 2 kolom di tab Ringkasan tidak
 *   kolaps jadi 1 kolom cuma karena RPC belum siap di backend.
 * - onSeeFullLeaderboard: opsional, CTA di bagian bawah section
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
        percentile={national?.percentile ?? null}
      />

      <DashboardSkdRankingCard
        label="Peringkat Provinsi"
        scopeName={province?.name}
        icon={MapRoundedIcon}
        rank={province?.rank ?? null}
        totalPeserta={province?.totalPeserta ?? null}
        avgScore={province?.avgScore ?? null}
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
