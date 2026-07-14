import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col gap-1 bg-[var(--lb-surface-container-low)] rounded-2xl px-4 py-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--lb-on-surface-variant)]">
        {label}
      </span>
      <span className="text-lg font-extrabold text-[var(--lb-on-surface)]">
        {value ?? "-"}
      </span>
    </div>
  );
}

/**
 * LeaderboardLocationResultCard — hasil dari fitur "Cari Peringkat SKD
 * per Provinsi/Kota".
 *
 * Props:
 * - locationType: 'province' | 'city'
 * - locationValue: string, nama daerah yang dicari
 * - region: { totalParticipants, avgScore, medianScore, minScore, maxScore }
 * - yourPosition: { avgScore, hypotheticalRank, hypotheticalTotal, percentile } | null
 *   -- null berarti user belum pernah kerjain paket SKD sama sekali
 *   (gate sama seperti widget "peringkat saya" di Dashboard).
 * - onStartSkd: opsional, CTA kalau yourPosition null
 */
export default function LeaderboardLocationResultCard({
  locationType,
  locationValue,
  region,
  yourPosition,
  onStartSkd,
}) {
  const Icon = locationType === "city" ? LocationOnRoundedIcon : PublicRoundedIcon;

  const fmtScore = (n) => (n == null ? "-" : n.toFixed(1));

  return (
    <div className="bg-white rounded-3xl border border-[var(--lb-outline-variant)] shadow-md p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--lb-secondary-container)] flex items-center justify-center shrink-0">
          <Icon fontSize="small" className="text-[var(--lb-on-secondary-container)]" />
        </div>
        <div>
          <h3 className="font-extrabold text-[var(--lb-on-surface)] leading-tight">
            {locationValue}
          </h3>
          <p className="text-xs text-[var(--lb-on-surface-variant)]">
            {locationType === "city" ? "Kabupaten/Kota" : "Provinsi"} &middot;{" "}
            {region.totalParticipants} peserta SKD
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--lb-on-surface-variant)] mb-3">
          Standar Nilai di Daerah Ini
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Rata-rata" value={fmtScore(region.avgScore)} />
          <StatBlock label="Median" value={fmtScore(region.medianScore)} />
          <StatBlock label="Tertinggi" value={fmtScore(region.maxScore)} />
          <StatBlock label="Terendah" value={fmtScore(region.minScore)} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--lb-on-surface-variant)] mb-3">
          Posisi Kamu (Hipotetis)
        </h4>

        {yourPosition ? (
          <div className="rounded-2xl bg-[var(--lb-primary-container)] text-white px-5 py-4">
            <p className="text-2xl font-extrabold">
              Peringkat {yourPosition.hypotheticalRank}
              <span className="text-sm font-medium opacity-80">
                {" "}
                / {yourPosition.hypotheticalTotal} peserta
              </span>
            </p>
            <p className="text-sm opacity-90 mt-1">
              Skor rata-rata kamu: {fmtScore(yourPosition.avgScore)}
              {yourPosition.percentile != null && (
                <> &middot; top {yourPosition.percentile}%</>
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--lb-outline-variant)] px-5 py-4 text-center">
            <p className="text-sm text-[var(--lb-on-surface-variant)] mb-3">
              Kerjakan minimal satu paket SKD dulu untuk melihat posisi hipotetis kamu di daerah ini.
            </p>
            {onStartSkd && (
              <button
                type="button"
                onClick={onStartSkd}
                className="text-sm font-bold text-[var(--lb-primary-container)] hover:underline"
              >
                Mulai Paket SKD
              </button>
            )}
          </div>
        )}

        <p className="flex items-start gap-1.5 text-[11px] text-[var(--lb-outline)] mt-3">
          <InfoOutlinedIcon style={{ fontSize: 14 }} className="shrink-0 mt-0.5" />
          Peringkat ini hipotetis: skor rata-rata SKD kamu (dari paket yang sudah kamu
          kerjakan, di mana pun domisilimu) dibandingkan ke peserta asli yang berdomisili di{" "}
          {locationValue}, bukan berarti kamu terdaftar di daerah ini.
        </p>
      </div>
    </div>
  );
}
