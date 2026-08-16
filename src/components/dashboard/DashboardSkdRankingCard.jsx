import { useState } from "react";

/**
 * DashboardSkdRankingCard — satu kartu posisi relatif user (bukan
 * daftar peserta lain), berbasis skor SKD, per cakupan
 * (nasional/provinsi/kabupaten-kota). Tidak tampilkan nama/skor
 * peserta lain — beda dari DashboardMiniLeaderboardCard.
 *
 * avgScore sejak v3 (16 Jul 2026) pakai Bayesian shrinkage (ditarik
 * ke rata-rata nasional kalau jumlahPaket masih sedikit) — bukan
 * rata-rata murni. jumlahPaket wajib tampil berdampingan biar jelas.
 *
 * Props:
 * - label, scopeName (null = nasional), icon
 * - rank, totalPeserta, percentile: number | null
 * - avgScore: number | null — sudah shrinkage, lihat catatan di atas
 * - jumlahPaket: number | null
 * - emptyMessage: default disediakan
 */
export default function DashboardSkdRankingCard({
  label,
  scopeName = null,
  icon: Icon,
  rank = null,
  totalPeserta = null,
  avgScore = null,
  jumlahPaket = null,
  percentile = null,
  emptyMessage = "Kerjakan paket SKD untuk mulai bersaing di peringkat ini.",
}) {
  const hasData = rank != null;
  // BARU — modal penjelasan detail, dipicu dari link "Pelajari
  // selengkapnya". Satu state dipakai buat 2 modal (skor & posisi)
  // supaya JSX modal-nya gak perlu diduplikasi.
  const [infoModal, setInfoModal] = useState(null); // null | "score" | "position"

  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-4 md:p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--db-on-surface)]">
            {label}
          </p>
          {scopeName && (
            <p className="text-xs text-[var(--db-on-surface-variant)] truncate">
              {scopeName}
            </p>
          )}
        </div>
        {Icon && (
          <Icon
            className="text-[var(--db-secondary-container)] shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        )}
      </div>

      {hasData ? (
        <>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-[var(--db-primary)]">
              #{rank}
            </h3>
            {totalPeserta != null && (
              <span className="text-xs text-[var(--db-on-surface-variant)] mb-1">
                dari {totalPeserta} peserta
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            {avgScore != null && (
              <div className="bg-[var(--db-surface-container-low)] rounded-xl px-3 py-1.5">
                <p className="text-[10px] uppercase tracking-wide text-[var(--db-on-surface-variant)]">
                  Skor SKD
                </p>
                <p className="text-sm font-black text-[var(--db-primary)]">
                  {Math.round(avgScore)}
                </p>
                {jumlahPaket != null && (
                  <p className="text-[10px] text-[var(--db-on-surface-variant)] mt-0.5">
                    dari {jumlahPaket} paket
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setInfoModal("score")}
                  className="text-[10px] text-[var(--db-primary)] underline underline-offset-2 mt-1"
                >
                  Pelajari selengkapnya
                </button>
              </div>
            )}
            {percentile != null &&
              (() => {
                // unggulPercent = persentase peserta yang kamu ungguli.
                // >= 50 berarti kamu di atas rata-rata (hijau, "Unggul"),
                // < 50 berarti di bawah rata-rata (merah, "Di bawah") --
                // satu angka yang sama dipakai di kedua label, cuma beda
                // teks & warna supaya jujur (nggak selalu dibungkus kata
                // "unggul" walau sebenarnya di bawah rata-rata).
                const unggulPercent = 100 - percentile;
                const isAboveAverage = unggulPercent >= 50;
                return (
                  <div
                    className="rounded-xl px-3 py-1.5"
                    style={{
                      background: isAboveAverage
                        ? "var(--db-success-container)"
                        : "var(--db-error-container)",
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-wide text-[var(--db-on-surface-variant)]">
                      Posisi Kamu
                    </p>
                    <p
                      className="text-sm font-black"
                      style={{
                        color: isAboveAverage
                          ? "var(--db-success)"
                          : "var(--db-error)",
                      }}
                    >
                      {isAboveAverage
                        ? `Unggul ${unggulPercent}%`
                        : `Di bawah ${unggulPercent}%`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setInfoModal("position")}
                      className="text-[10px] underline underline-offset-2 mt-1"
                      style={{
                        color: isAboveAverage
                          ? "var(--db-success)"
                          : "var(--db-error)",
                      }}
                    >
                      Pelajari selengkapnya
                    </button>
                  </div>
                );
              })()}
          </div>
        </>
      ) : (
        <p className="text-xs text-[var(--db-on-surface-variant)] py-2">
          {emptyMessage}
        </p>
      )}

      {infoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setInfoModal(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h4 className="text-base font-bold text-[var(--db-on-surface)]">
                {infoModal === "score"
                  ? "Kenapa Skor SKD Saya Segini?"
                  : "Apa Arti Posisi Kamu?"}
              </h4>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                aria-label="Tutup"
                className="shrink-0 w-7 h-7 rounded-full bg-[var(--db-surface-container-low)] text-[var(--db-on-surface-variant)] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {infoModal === "score" ? (
              <div className="space-y-3 text-sm text-[var(--db-on-surface-variant)] leading-relaxed text-left">
                <p>
                  Berdasarkan jumlah paket dan hasil Tryout SKD yang sudah kamu
                  kerjakan, saat ini sistem menempatkan kamu pada kelompok
                  peserta dengan rentang nilai ini.
                </p>
                <p>
                  Tujuannya agar peringkatmu tidak langsung melonjak atau turun
                  drastis hanya karena baru mengerjakan 1-2 paket SKD. Sistem
                  menggunakan data hasil tryout semua paket SKD dari seluruh
                  peserta sebagai acuan, sehingga peringkat yang ditampilkan
                  dapat lebih merepresentasikan kemampuanmu secara keseluruhan.
                </p>
                <p>
                  Semakin banyak paket yang kamu kerjakan, semakin akurat
                  peringkat tersebut dalam menggambarkan kemampuanmu.
                </p>
              </div>
            ) : (
              // CATATAN: draft wording -- belum final, tolong direvisi
              // sama seperti wording "Skor SKD" sebelumnya kalau perlu
              // disesuaikan gaya bahasanya.
              <div className="space-y-3 text-sm text-[var(--db-on-surface-variant)] leading-relaxed text-left">
                <p>
                  Angka ini menunjukkan daya saingmu dibandingkan peserta lain
                  berdasarkan skor dan jumlah paket SKD yang sudah kamu
                  kerjakan, pada cakupan yang dipilih (nasional, provinsi, atau
                  kota/kabupaten).
                </p>
                <p>
                  Unggul X% berarti kamu berada di atas X% peserta lain.
                  Di bawah X% berarti kamu berada di bawah X% peserta
                  lain.
                </p>
                <p>
                  Semakin mendekati 100%, semakin tinggi posisimu. Semakin
                  mendekati 0%, semakin rendah posisimu.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
