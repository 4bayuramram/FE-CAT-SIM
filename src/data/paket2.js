import twk2 from "./2/twk2";
import tiu2 from "./2/tiu2";
import tkp2 from "./2/tkp2";

const paket2 = {
  id: 2,
  nama: "Mini SKD 1",
  // HANYA tampil di tab "Latihan" dashboard, TIDAK di halaman publik
  // /home/simulasi (lihat filter di components/simulasi/PackageSim.jsx).
  // Rencana desain: paket "Mini SKD" ini nantinya 45 soal (bukan 110
  // seperti paket try-out penuh) — soal masih perlu dilengkapi, lihat
  // catatan draft di bawah.
  showOnPackagesPage: false,
  // Paket gabungan (TWK+TIU+TKP) -> "skd", lihat catatan di paket1.js.
  category: "skd",
  // 12 soal (masih draft/belum lengkap, lihat catatan README-FREE-FLOW.md), ~15 menit.
  duration: 15 * 60 * 1000,
  questions: [...twk2, ...tiu2, ...tkp2],
};

export default paket2;
