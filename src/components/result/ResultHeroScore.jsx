import { useState } from "react";
import CountUp from "../common/CountUp";
import ResultHeroBar from "./ResultHeroBar";
import ResultHeroMessage from "./ResultHeroMessage";

/**
 * ResultHeroScore — kartu besar skor total, glass-morphism, jadi hero
 * halaman /hasil.
 *
 * Reveal pesan/badge kelulusan DITUNDA sampai animasi CountUp skor total
 * selesai (onEnd) -- sebelumnya PassingGradeBadge & pesan afirmasi di
 * bawah ini langsung muncul bareng skeleton/angka awal, kelihatan
 * "kedip" sebelum angka selesai naik. Sekarang keduanya baru muncul
 * pas angka sudah berhenti animasi, lewat callback onCountEnd ke parent
 * (ExamResultPageDb) yang menahan render PassingGradeBadge juga.
 *
 * Pesan di bawah bar SEKARANG berbasis status passing grade PER SUBTES
 * (passingGradeStatus dari checkPassingGrade.js) -- bukan lagi
 * passingGrade/percentile lama (yang di kontrak backend saat ini SELALU
 * null, jadi pesan versi lama itu sebenarnya tidak pernah muncul untuk
 * data asli). Dua kondisi:
 * - LULUS semua subtes: tampilkan afirmasi + grid peringkat (paket,
 *   nasional/provinsi/kota SEMENTARA dari getSkdRanking, + persentase
 *   keunggulan dari peserta lain di paket ini).
 * - GAGAL salah satu subtes: TIDAK ada peringkat ditampilkan sama
 *   sekali (belum berhak diranking), pesan disesuaikan -- kalau skor
 *   akhir user sebenarnya >= total ambang batas (twkMin+tiuMin+tkpMin),
 *   dikasih catatan khusus "skor tinggi tapi tetap gagal" supaya user
 *   paham SKD menilai PER SUBTES, bukan skor total.
 *
 * @param {number} totalScore
 * @param {number} maxScore
 * @param {object|null} passingGradeStatus - checkPassingGrade(breakdown, rule)
 * @param {{twkMin:number,tiuMin:number,tkpMin:number}|null} passingGradeRule
 * @param {{rank:number, totalPeserta:number}|null} packageRanking - posisi
 *   user di leaderboard PAKET INI (dari getPackageLeaderboard)
 * @param {{national, province, city}|null} skdRanking - dari getSkdRanking,
 *   masing-masing {name?, rank, totalPeserta, percentile} | null
 * @param {function} [onCountEnd] - dipanggil sekali begitu animasi angka
 *   selesai, supaya parent bisa menahan elemen lain (mis. PassingGradeBadge)
 */
export default function ResultHeroScore({
  totalScore,
  maxScore,
  passingGradeStatus,
  passingGradeRule,
  packageRanking,
  skdRanking,
  onCountEnd,
}) {
  const pct = maxScore ? Math.min(100, Math.round((totalScore / maxScore) * 100)) : 0;

  const [revealed, setRevealed] = useState(false);

  const handleCountEnd = () => {
    setRevealed(true);
    onCountEnd?.();
  };

  return (
    <section className="relative">
      <div className="rounded-xl p-8 md:p-12 text-center flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-white/10 backdrop-blur-xl border border-white/10">
        <span className="text-xs text-[#a3c9ff] uppercase tracking-[0.2em] mb-2 font-mono">
          Total Skor
        </span>

        <div
          className="text-[64px] md:text-[100px] leading-none text-white font-extrabold mb-4"
          style={{ textShadow: "0 0 20px rgba(163, 201, 255, 0.4)" }}
        >
          <CountUp to={totalScore} duration={1.5} onEnd={handleCountEnd} />
        </div>

        <ResultHeroBar pct={pct} />

        {revealed && (
          <ResultHeroMessage
            totalScore={totalScore}
            passingGradeStatus={passingGradeStatus}
            passingGradeRule={passingGradeRule}
            packageRanking={packageRanking}
            skdRanking={skdRanking}
          />
        )}
      </div>
    </section>
  );
}
