/** Baris header kolom (Rank / Peserta / Lokasi / Skor / Durasi), desktop only. */
export default function LeaderboardTableHeader() {
  return (
    <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-[var(--lb-outline)] font-bold uppercase text-[10px] tracking-wider">
      <div className="col-span-1">Rank</div>
      <div className="col-span-4">Peserta</div>
      <div className="col-span-4 text-right">Lokasi Formasi</div>
      <div className="col-span-1 text-right">Skor</div>
      <div className="col-span-2 text-right">Durasi</div>
    </div>
  );
}
