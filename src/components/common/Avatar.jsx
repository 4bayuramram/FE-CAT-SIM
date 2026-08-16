import { useState } from "react";

/**
 * Avatar — foto profil dengan fallback ke inisial nama (bukan gambar
 * placeholder statis) kalau src kosong atau gagal dimuat.
 * Warna latar konsisten per nama (deterministic hash).
 */

const COLORS = [
  "#12345b",
  "#0f766e",
  "#7c3aed",
  "#b45309",
  "#be123c",
  "#0369a1",
  "#4d7c0f",
  "#a21caf",
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFromName(name) {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({
  src,
  name,
  size = "w-10 h-10",
  className = "",
}) {
  const [imgError, setImgError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset imgError saat src berubah — dihitung saat render (bukan di
  // useEffect) supaya tidak ada extra render/cascading update.
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgError(false);
  }

  const showImage = !!src && !imgError;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        className={`${size} rounded-full object-cover border border-white ${className}`}
        // no-referrer: CDN Google (lh3.googleusercontent.com) sering
        // menolak request (403) kalau ada header Referer dari domain kita.
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      title={name || undefined}
      className={`${size} rounded-full flex items-center justify-center text-white font-semibold border border-white shrink-0 ${className}`}
      style={{ backgroundColor: colorFromName(name) }}
    >
      <span className="text-sm leading-none">{getInitials(name)}</span>
    </div>
  );
}
