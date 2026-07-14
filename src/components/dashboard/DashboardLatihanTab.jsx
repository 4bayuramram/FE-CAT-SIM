import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import { questionService } from "../../services/questionService";

/**
 * DashboardLatihanTab — isi tab "Latihan".
 *
 * Beda dari tab "Paket Saya" (DashboardPackagesTab, sumber data:
 * Supabase `packages` + `user_package_access`), tab ini nampilin paket
 * dari JALUR HARDCODE/NON-DB (src/data/paket1-4.js, dieksekusi lewat
 * src/engine/*, lihat CHANGELOG-FREE-FLOW.md) — semuanya gratis, tidak
 * perlu login/beli, jadi datanya diambil langsung dari
 * questionService.getAll() (client-side, tidak ada fetch).
 *
 * questionCount & durationMinutes DIHITUNG dari data asli
 * (questions.length, duration/60000) — bukan angka hardcode terpisah —
 * supaya tidak ada lagi mismatch antara yang ditampilkan vs yang
 * benar-benar berjalan saat ujian (lihat catatan lama soal paket1: UI
 * pernah bilang "110 Soal / 95 Menit" padahal datanya 80 soal).
 *
 * Props:
 * - onStartPackage(paketId): dipanggil saat tombol "Mulai Latihan"
 *   diklik — pemanggil (DashboardPageContainer) yang navigate ke
 *   `/exam-page/:paketId`.
 */
export default function DashboardLatihanTab({ onStartPackage }) {
  const paketList = questionService.getAll();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[var(--db-primary)]">
          Latihan
        </h2>
        <p className="text-sm text-[var(--db-on-surface-variant)] mt-1">
          Paket latihan gratis, bisa dikerjakan berkali-kali tanpa perlu
          beli. Skor & progres latihan disimpan di perangkat ini saja
          (belum masuk hitungan leaderboard/riwayat akun).
        </p>
      </div>

      {paketList.length === 0 ? (
        <div className="dashboard-card bg-white rounded-2xl border border-[var(--db-outline-variant)] p-8 text-center text-sm text-[var(--db-on-surface-variant)]">
          Belum ada paket latihan tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paketList.map((paket) => {
            const questionCount = paket.questions?.length ?? 0;
            const durationMinutes = paket.duration
              ? Math.round(paket.duration / 60000)
              : null;
            const isEmpty = questionCount === 0;

            return (
              <div
                key={paket.id}
                className="dashboard-card bg-white rounded-2xl border border-[var(--db-outline-variant)] p-4 flex flex-col"
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className="px-2 py-1 bg-[var(--db-surface-container)] text-[var(--db-primary-container)] text-[10px] font-bold rounded uppercase tracking-wide">
                    Gratis
                  </span>
                </div>

                <h5 className="font-bold text-[var(--db-primary)] mb-1 line-clamp-2">
                  {paket.nama}
                </h5>

                <div className="flex flex-wrap gap-3 text-xs text-[var(--db-on-surface-variant)] mt-1">
                  <span className="flex items-center gap-1">
                    <QuizRoundedIcon style={{ fontSize: 14 }} />
                    {questionCount} Soal
                  </span>
                  <span className="flex items-center gap-1">
                    <ScheduleRoundedIcon style={{ fontSize: 14 }} />
                    {durationMinutes ? `${durationMinutes} Menit` : "—"}
                  </span>
                </div>

                {isEmpty && (
                  <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-[var(--db-surface-container-low)] rounded-xl">
                    <InfoRoundedIcon
                      style={{ fontSize: 16 }}
                      className="text-[var(--db-on-surface-variant)]"
                    />
                    <p className="text-xs text-[var(--db-on-surface-variant)]">
                      Soal belum tersedia untuk paket ini.
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-3">
                  <button
                    type="button"
                    disabled={isEmpty}
                    onClick={() => onStartPackage?.(paket.id)}
                    className="flex items-center gap-1.5 text-[var(--db-primary-container)] font-bold text-sm hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:no-underline"
                  >
                    <PlayCircleRoundedIcon style={{ fontSize: 18 }} />
                    Mulai Latihan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
