import { useState, useEffect } from "react";

/**
 * Avatar — TODO §6 "Avatar Default".
 *
 * Menampilkan foto profil kalau ada (avatar_url dari Google, dsb).
 * Kalau tidak ada foto (user daftar manual) atau foto gagal dimuat,
 * fallback otomatis ke lingkaran berisi INISIAL NAMA — bukan gambar
 * placeholder statis (/default-avatar.png) seperti sebelumnya.
 *
 * Contoh: "Budi Santoso" -> "BS".
 *
 * Warna latar dibuat konsisten per nama (deterministic hash), supaya
 * user yang sama selalu dapat warna yang sama tiap kali avatar-nya
 * dirender ulang.
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
  const showImage = !!src && !imgError;

  // Reset status error setiap kali src berubah — mencegah avatar
  // "nyangkut" jadi inisial selamanya kalau src sebelumnya sempat gagal
  // (mis. render pertama null lalu berubah jadi URL asli begitu sesi
  // auth selesai dimuat).
  useEffect(() => {
    setImgError(false);
  }, [src]);

  if (showImage) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        className={`${size} rounded-full object-cover border border-white ${className}`}
        // PENTING: CDN foto profil Google (lh3.googleusercontent.com)
        // sering menolak request (403) kalau browser mengirim header
        // Referer standar dari domain kita — beberapa browser/adblocker
        // juga menganggapnya request tracking dan memblokirnya duluan.
        // Tanpa referrerPolicy="no-referrer", <img> ini diam-diam gagal
        // load, onError langsung terpicu, dan fallback ke inisial —
        // padahal src-nya valid. Ini penyebab avatar Google selalu jadi
        // inisial meskipun avatar_url sudah benar diambil dari
        // user_metadata.
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
