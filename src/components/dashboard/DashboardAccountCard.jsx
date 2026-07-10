import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Avatar from "../common/Avatar";

/**
 * DashboardAccountCard — ringkasan identitas user (reuse Avatar yang
 * sudah ada, fallback ke inisial kalau tidak ada foto).
 *
 * Props:
 * - name, email, avatarUrl
 * - domicile: string sudah jadi (mis. "Kota Bengkulu, Bengkulu") atau
 *   null kalau belum diisi
 */
export default function DashboardAccountCard({
  name,
  email,
  avatarUrl,
  domicile,
}) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--db-outline-variant)] p-5 flex flex-col items-center text-center">
      <Avatar src={avatarUrl} name={name} size="w-16 h-16" />
      <h4 className="font-bold text-[var(--db-on-surface)] mt-3 truncate max-w-full">
        {name || "Peserta"}
      </h4>
      {email && (
        <p className="text-xs text-[var(--db-on-surface-variant)] truncate max-w-full">
          {email}
        </p>
      )}

      <div className="w-full border-t border-[var(--db-outline-variant)] mt-4 pt-3 flex items-center gap-2 justify-center text-sm text-[var(--db-on-surface-variant)]">
        <PlaceRoundedIcon style={{ fontSize: 18 }} />
        <span>{domicile || "Domisili belum diisi"}</span>
      </div>
    </div>
  );
}
