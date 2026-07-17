/**
 * ResultHeroMessage — pesan afirmasi/informasi di bawah bar skor total
 * pada ResultHeroScore. Konten TERGANTUNG status lulus/gagal passing
 * grade PER SUBTES (passingGradeStatus dari checkPassingGrade.js), DAN
 * jumlah subtes yang ada di paket (paket satu-kategori vs paket SKD
 * lengkap 3 subtes):
 *
 * - LULUS (allPassed === true): afirmasi + grid peringkat (paket,
 *   nasional/provinsi/kota SEMENTARA, persentase keunggulan). Peringkat
 *   HANYA ditampilkan di sini -- SKD memang mensyaratkan lulus passing
 *   grade dulu baru "berhak" diranking secara resmi. Kalau paketnya
 *   satu-kategori (mis. TWK-saja), teks afirmasi TIDAK menyebut "SKD
 *   Formasi Umum" -- itu menyiratkan lulus SKD penuh (3 subtes), padahal
 *   cuma lulus 1 subtes. Sebut kategori & ambang batasnya langsung.
 * - GAGAL (allPassed === false): TIDAK ADA grid peringkat sama sekali.
 *   Kalau skor akhir user sebenarnya >= total ambang batas gabungan
 *   DARI SUBTES YANG ADA DI PAKET INI SAJA, ditambah catatan "skor
 *   tinggi tapi tetap gagal" -- supaya user paham SKD dinilai PER
 *   SUBTES, bukan skor total gabungan. Sama seperti cabang lulus, teks
 *   utamanya disesuaikan kalau paketnya satu-kategori.
 * - passingGradeStatus null (rule/breakdown belum ada) -- tidak render
 *   apapun, sama seperti versi lama.
 */

function RankStat({ label, value, sub }) {
  return (
    <div>
      <div className="text-[10px] text-white/50 uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      {sub && <div className="text-[11px] text-white/50 mt-0.5">{sub}</div>}
    </div>
  );
}

function scopeStat(scope) {
  if (!scope?.rank) return { value: "-", sub: "belum tersedia" };
  return {
    value: `#${scope.rank}`,
    sub: `dari ${scope.totalPeserta ?? "?"} peserta${
      scope.name ? ` · ${scope.name}` : ""
    }`,
  };
}

export default function ResultHeroMessage({
  totalScore,
  passingGradeStatus,
  // eslint-disable-next-line no-unused-vars -- sengaja tidak dipakai lagi:
  // dulu dipakai buat hitung impliedMinTotal, sekarang itu dihitung dari
  // passingGradeStatus.subtests (lihat komentar di bawah). Tetap diterima
  // di signature supaya call site di ResultHeroScore.jsx tidak perlu diubah.
  passingGradeRule,
  packageRanking,
  skdRanking,
}) {
  if (!passingGradeStatus) return null;

  const { allPassed, ruleName } = passingGradeStatus;

  // Dipakai di KEDUA cabang (lulus & gagal): daftar subtes yang benar-benar
  // ada di paket ini (sudah difilter checkPassingGrade.js), lengkap dengan
  // kode kategori + min-nya masing-masing.
  const subtestEntries = Object.entries(passingGradeStatus.subtests ?? {});
  const isSingleSubtest = subtestEntries.length === 1;

  if (allPassed) {
    // BARU — beatPct disembunyikan kalau totalPeserta masih terlalu
    // sedikit (< MIN_PESERTA_UNTUK_PERSENTASE): dengan peserta cuma 1-2
    // orang, rank #1 otomatis jadi "unggul 100%" walau bukan berarti
    // benar-benar unggul dari banyak orang -- matematis benar tapi
    // menyesatkan. Begitu ditampilkan, sertakan jumlah peserta di
    // kalimatnya juga biar konteksnya jelas (bukan angka telanjang).
    const MIN_PESERTA_UNTUK_PERSENTASE = 10;
    const beatPct =
      packageRanking?.rank &&
      packageRanking?.totalPeserta >= MIN_PESERTA_UNTUK_PERSENTASE
        ? Math.max(
            0,
            Math.round(
              ((packageRanking.totalPeserta - packageRanking.rank) /
                (packageRanking.totalPeserta - 1)) *
                100
            )
          )
        : null;

    const packageStat = packageRanking?.rank
      ? {
          value: `#${packageRanking.rank}`,
          sub: `dari ${packageRanking.totalPeserta} peserta`,
        }
      : { value: "-", sub: "belum tersedia" };
    const nationalStat = scopeStat(skdRanking?.national);
    const provinceStat = scopeStat(skdRanking?.province);
    const cityStat = scopeStat(skdRanking?.city);

    return (
      <div className="max-w-lg">
        <p className="text-white/80">
          {isSingleSubtest ? (
            // Paket satu-kategori (mis. TWK-saja) -- JANGAN pakai kalimat
            // "melampaui SELURUH ambang batas passing grade (SKD Formasi
            // Umum)": itu menyiratkan user lulus SKD penuh (3 subtes),
            // padahal cuma lulus 1 subtes yang memang satu-satunya ada di
            // paket ini. Sebut kategori & ambang batasnya secara eksplisit.
            <>
              Selamat! Skor {subtestEntries[0][0]} Anda (
              {subtestEntries[0][1].score}) melampaui ambang batas minimal (
              {subtestEntries[0][1].min}).
            </>
          ) : (
            <>
              Selamat! Anda melampaui seluruh ambang batas passing grade
              {ruleName ? (
                <>
                  {" "}
                  <span className="font-bold">({ruleName})</span>
                </>
              ) : null}
              .
            </>
          )}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/10">
          <RankStat
            label="Peringkat Paket"
            value={packageStat.value}
            sub={packageStat.sub}
          />
          <RankStat
            label="Nasional (Sementara)"
            value={nationalStat.value}
            sub={nationalStat.sub}
          />
          <RankStat
            label="Provinsi (Sementara)"
            value={provinceStat.value}
            sub={provinceStat.sub}
          />
          <RankStat
            label="Kota (Sementara)"
            value={cityStat.value}
            sub={cityStat.sub}
          />
        </div>

        {beatPct != null && (
          <p className="text-[#4de082] font-semibold mt-4">
            Anda unggul {beatPct}% dari {packageRanking.totalPeserta} peserta
            lain di paket ini.
          </p>
        )}
      </div>
    );
  }

  // Gagal salah satu subtes -- hitung apakah skor akhir sebenarnya tinggi
  // (>= total ambang batas GABUNGAN DARI SUBTES YANG ADA DI PAKET INI SAJA),
  // murni buat penjelasan, TIDAK mempengaruhi status lulus/gagal itu sendiri.
  //
  // PENTING: jangan jumlahkan twkMin+tiuMin+tkpMin dari passingGradeRule
  // mentah-mentah -- itu hardcode ke paket SKD lengkap (3 subtes). Untuk
  // paket satu-kategori (mis. TIU-saja), totalScore user MAKSIMAL cuma
  // sebesar maxScore kategori itu sendiri, sehingga tidak akan pernah
  // mencapai jumlah 3 kategori -- "skor tinggi tapi tetap gagal" jadi
  // tidak pernah muncul walau seharusnya relevan. Pakai passingGradeStatus
  // .subtests yang sudah difilter hanya berisi kategori yang benar-benar
  // ada di paket (lihat checkPassingGrade.js).
  const impliedMinTotal =
    subtestEntries.length > 0
      ? subtestEntries.reduce((sum, [, s]) => sum + s.min, 0)
      : null;
  const highScoreButFailed =
    impliedMinTotal != null && totalScore >= impliedMinTotal;

  return (
    <div className="max-w-lg">
      <p className="text-white/80">
        {isSingleSubtest ? (
          // Sama seperti cabang lulus -- jangan sebut "passing grade
          // (SKD Formasi Umum)" seolah ini penilaian SKD penuh. Sebut
          // kategori satu-satunya yang ada di paket ini.
          <>
            Belum lulus ambang batas minimal {subtestEntries[0][0]} (
            {subtestEntries[0][1].min}).
          </>
        ) : (
          <>
            Belum lulus passing grade{ruleName ? ` (${ruleName})` : ""} — masih
            ada subtes yang di bawah ambang batas minimal.
          </>
        )}
      </p>

      {highScoreButFailed && (
        <p className="text-[#ffb4ab] font-semibold mt-2">
          Meski skor akhir Anda ({totalScore}) tergolong tinggi, SKD tetap
          mensyaratkan SEMUA subtes lolos ambang batas masing-masing — bukan
          skor total gabungan.
        </p>
      )}

      <p className="text-white/50 text-sm mt-3">
        {isSingleSubtest
          ? "Peringkat belum ditampilkan sampai Anda lulus ambang batas minimal."
          : "Peringkat belum ditampilkan sampai Anda lulus passing grade di semua subtes."}
      </p>
    </div>
  );
}
