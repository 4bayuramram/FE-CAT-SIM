import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  resetExamDb,
  startOrResumeExamDb,
  selectSubmitResult,
  selectStatus,
  selectAttemptCount,
} from "../../features/exam/examSliceDb";
import { supabase } from "../../lib/supabaseClient";

import { transformSubmitResultToView } from "../../utils/resultTransform";
import { downloadResultPdf } from "../../utils/generateResultPdf";
import { checkPassingGrade } from "../../utils/checkPassingGrade";
import { resolvePackageCategory } from "../../utils/packageCategory";
import { getActivePassingGrade } from "../../services/leaderboard/getActivePassingGrade";
import { getSkdRanking } from "../../services/leaderboard/getSkdRanking";
import { getPackageLeaderboard } from "../../services/leaderboard/getPackageLeaderboard";
import ResultTopbar from "../result/ResultTopbar";
import ResultPageHeader from "../result/ResultPageHeader";
import ResultHeroScore from "../result/ResultHeroScore";
import PassingGradeBadge from "../result/PassingGradeBadge";
import ResultStatsGrid from "../result/ResultStatsGrid";
import ResultTkpSection from "../result/ResultTkpSection";
import ResultCategoryGrid from "../result/ResultCategoryGrid";
import ResultTopicAnalysis from "../result/ResultTopicAnalysis";
import ResultChartsSection from "../result/ResultChartsSection";
import ResultStickyActions from "../result/ResultStickyActions";
import ResultMobileBottomNav from "../result/ResultMobileBottomNav";

/**
 * ExamResultPageDb — route "/try-out/:packageId/hasil".
 *
 * (lihat header versi sebelumnya untuk latar belakang breakdown/hidrasi —
 * tidak diulang di sini)
 *
 * PATCH (nama peserta & nomor percobaan disinkronkan):
 * - candidateName: diambil LANGSUNG dari tabel user_profile via
 *   supabase-js client (bukan lewat edge function baru) — auth.getUser()
 *   untuk id, lalu select first_name/last_name milik sendiri (aman lewat
 *   RLS row-level).
 * - sessionLabel (nomor percobaan): pakai selectAttemptCount — sumber
 *   yang SAMA dipakai SidebarPaid ("Sudah dikerjakan Xx"), supaya
 *   angkanya konsisten di semua tempat.
 *
 * PATCH (unduh PDF): handleDownloadPdf memanggil helper
 * downloadResultPdf() (di utils/generateResultPdf.jsx) yang membungkus
 * @react-pdf/renderer + ResultPdfDocument — generate & trigger download
 * dalam satu fungsi, supaya komponen halaman ini tidak perlu tahu detail
 * pdf()/Blob/URL.createObjectURL sama sekali.
 */
export default function ExamResultPageDb() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packageId } = useParams();

  const submitResult = useSelector(selectSubmitResult);
  const status = useSelector(selectStatus);
  const attemptCount = useSelector(selectAttemptCount);

  const [candidateName, setCandidateName] = useState(null);
  const [passingGradeRule, setPassingGradeRule] = useState(null);
  // BARU — data buat pesan afirmasi/peringkat di ResultHeroScore, cuma
  // dipakai kalau user lulus semua subtes (lihat ResultHeroMessage.jsx).
  // Keduanya graceful null kalau RPC belum ada/gagal (pola sama seperti
  // passingGradeRule & candidateName di atas) -- tidak bikin halaman
  // gagal render, cuma grid peringkat tampil "-"/"belum tersedia".
  const [skdRanking, setSkdRanking] = useState(null);
  const [packageRanking, setPackageRanking] = useState(null);
  const [userId, setUserId] = useState(null);
  // BARU — kategori paket YANG SEDANG DIBUKA (skd/twk/tiu/tkp). Dipakai
  // buat gate fetch skdRanking di bawah: skdRanking itu peringkat SKD
  // GLOBAL milik user (rata-rata dari SEMUA paket berkategori "skd" yang
  // pernah dia kerjakan, lihat getSkdRanking.js), BUKAN spesifik ke paket
  // yang lagi dibuka. Tanpa gate ini, buka halaman /hasil paket TWK-saja
  // tetap menampilkan angka ranking nasional/provinsi/kota -- angkanya
  // valid tapi berasal dari attempt paket SKD lengkap LAIN milik user,
  // sehingga menyesatkan (seolah skor TWK barusan yang menentukan
  // ranking itu).
  const [packageCategory, setPackageCategory] = useState(null);
  // BARU — badge & pesan kelulusan (PassingGradeBadge + pesan di bawah
  // bar ResultHeroScore) ditahan sampai animasi CountUp skor total
  // selesai, supaya tidak "kedip" duluan sebelum angka selesai naik.
  const [scoreRevealed, setScoreRevealed] = useState(false);

  // Ambil rule passing grade aktif sekali saat mount. Backend:
  // RPC get_active_passing_grade() (lihat addendum handover
  // "FITUR PASSING GRADE SKD", 15 Jul 2026).
  useEffect(() => {
    getActivePassingGrade().then(({ data }) => {
      if (data) setPassingGradeRule(data);
    });
  }, []);

  // BARU — resolve kategori paket yang sedang dibuka, dipakai buat gate
  // fetch skdRanking di bawah (lihat komentar di deklarasi state
  // packageCategory). resolvePackageCategory() sudah baca kolom
  // packages.category duluan (fallback tebak dari title/description
  // kalau kolomnya kosong), jadi aman dipakai langsung.
  useEffect(() => {
    if (!packageId) return;
    let isMounted = true;

    supabase
      .from("packages")
      .select("category, title, description")
      .eq("id", packageId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data || !isMounted) return;
        setPackageCategory(resolvePackageCategory(data));
      });

    return () => {
      isMounted = false;
    };
  }, [packageId]);

  // FIX: sebelumnya guard "if (!submitResult)" -- gara-gara itu, pindah
  // /hasil dari satu paket ke paket lain TANPA lewat /info dulu (mis. klik
  // baris lain di tabel Ringkasan Skor dashboard) tidak fetch ulang, karena
  // submitResult masih keisi hasil paket sebelumnya (truthy) -> yang
  // ditampilkan hasil paket LAMA walau URL sudah packageId baru.
  // Sekarang selalu dispatch ulang tiap packageId berubah; lastFetchedPackageId
  // cuma untuk cegah double-dispatch kalau effect ini re-run tanpa packageId
  // berubah (mis. gara-gara dependency lain berubah referensinya).
  const lastFetchedPackageId = useRef(null);
  useEffect(() => {
    if (lastFetchedPackageId.current !== packageId) {
      lastFetchedPackageId.current = packageId;
      dispatch(startOrResumeExamDb(packageId));
    }
  }, [packageId, dispatch]);

  useEffect(() => {
    if (status === "ready") {
      // Sesi masih berjalan — /hasil bukan tempatnya, balik ke ujian.
      navigate(`/try-out/${packageId}`, { replace: true });
    }
  }, [status, packageId, navigate]);

  // Ambil nama peserta dari user_profile sekali saat mount. Gagal diam-diam
  // (fallback "Peserta" di render) — nama bukan data krusial, tidak boleh
  // bikin seluruh halaman gagal render kalau query ini error/lambat.
  useEffect(() => {
    let isMounted = true;

    async function fetchCandidateName() {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) return;
      if (isMounted) setUserId(userData.user.id);

      const { data: profile, error: profileError } = await supabase
        .from("user_profile")
        .select("first_name, last_name")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profileError || !profile || !isMounted) return;

      const fullName = [profile.first_name, profile.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

      if (fullName) setCandidateName(fullName);
    }

    fetchCandidateName();
    return () => {
      isMounted = false;
    };
  }, []);

  // Peringkat SKD nasional/provinsi/kota (sementara) -- HANYA relevan
  // untuk paket berkategori "skd" (paket lengkap TWK+TIU+TKP), karena
  // skdRanking dihitung dari rata-rata paket "skd" milik user (lihat
  // komentar di deklarasi state packageCategory di atas). Sengaja
  // dipisah dari effect fetchCandidateName supaya bisa di-gate oleh
  // packageCategory tanpa menunggu/mencampur logic nama peserta.
  // Pola graceful sama seperti getActivePassingGrade: kalau RPC belum
  // ada/gagal, data cuma diam-diam null, tidak error ke user.
  useEffect(() => {
    if (!userId || packageCategory !== "skd") return;
    let isMounted = true;

    getSkdRanking(userId).then(({ data: rankingData }) => {
      if (rankingData && isMounted) setSkdRanking(rankingData);
    });

    return () => {
      isMounted = false;
    };
  }, [userId, packageCategory]);

  // Peringkat user di leaderboard PAKET INI (khusus buat grid peringkat
  // di ResultHeroMessage kalau lulus semua subtes) -- dijalankan begitu
  // packageId & userId sama-sama siap. Graceful null kalau RPC gagal/
  // belum ada (get_package_leaderboard sudah dipakai fitur lain, jadi
  // biasanya sudah tersedia; tetap dijaga defensif).
  useEffect(() => {
    if (!packageId || !userId) return;
    let isMounted = true;

    getPackageLeaderboard(packageId).then(({ data }) => {
      if (!data || !isMounted) return;
      const ownRow = data.find((row) => row.userId === userId);
      if (ownRow) {
        setPackageRanking({ rank: ownRow.rank, totalPeserta: data.length });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [packageId, userId]);

  const transformed = transformSubmitResultToView(submitResult);

  // FIX (data hardcode/MOCK sempat kelihatan sekilas sebelum data asli
  // masuk): sebelumnya "result = transformed ?? MOCK_RESULT" bikin
  // seluruh halaman langsung render dengan angka contoh (MOCK_RESULT)
  // selagi submitResult masih di-fetch -- terlihat seperti "data asli
  // muncul sesaat lalu berubah", padahal itu MOCK yang tertukar sebentar
  // sebelum transformed siap. Sekarang: selama transformed belum ada DAN
  // belum error, tampilkan loading state (bukan data contoh). Kalau
  // fetch gagal, tampilkan pesan error singkat + tombol coba lagi.
  if (!transformed) {
    if (status === "error") {
      return (
        <div className="min-h-screen bg-[#00467f] text-white flex flex-col items-center justify-center gap-4 px-5 text-center">
          <p className="text-lg font-semibold">Gagal memuat hasil ujian.</p>
          <p className="text-sm text-white/60">Coba muat ulang halaman ini.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full bg-white text-[#00467f] text-sm font-bold"
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#00467f] text-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-sm text-white/60">Memuat hasil ujian…</p>
      </div>
    );
  }

  const result = transformed;

  // Status lulus/belum passing grade — dihitung dari breakdown ASLI
  // (submitResult.breakdown), bukan dari `result` (yang bisa MOCK_RESULT
  // saat fallback), supaya badge tidak pernah tampil untuk data contoh.
  const passingGradeStatus = checkPassingGrade(
    submitResult?.breakdown,
    passingGradeRule
  );

  // Nomor percobaan: SELALU dari selectAttemptCount (sumber tunggal, sama
  // dengan yang dipakai SidebarPaid), bukan dari result.sessionLabel
  // bawaan transform/mock.
  const sessionLabel = attemptCount
    ? `KE-${attemptCount}`
    : result.sessionLabel ?? "-";

  const handleExit = () => {
    dispatch(resetExamDb());
    navigate("/home", { replace: true });
  };

  const handleReview = () => {
    navigate(`/try-out/${packageId}`);
  };

  // Unduh PDF laporan hasil ujian (dokumen asli, bukan screenshot).
  // Disabled kalau breakdown belum ada (masih fallback MOCK_RESULT) supaya
  // tidak ada yang tanpa sadar mengunduh PDF berisi data contoh.
  const handleDownloadPdf = () => {
    if (!transformed) return;
    downloadResultPdf(transformed, {
      candidateName: candidateName ?? "Peserta",
      packageId,
      sessionLabel,
    });
  };

  return (
    <div className="min-h-screen bg-[#00467f] text-white pb-24 relative">
      {/* Glow dekoratif — statis, tidak animasi (hindari kesan "AI-generated ambient") */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00467f]/20 blur-[150px] -z-10 rounded-full" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4de082]/10 blur-[120px] -z-10 rounded-full" />

      <ResultTopbar
        title={`PAKET ${packageId?.toUpperCase() ?? ""}`}
        sessionLabel={sessionLabel}
        onBack={handleReview}
      />

      <main className="pt-24 px-5 max-w-[1280px] mx-auto flex flex-col gap-8">
        <ResultPageHeader
          candidateName={candidateName ?? "Peserta"}
          examDate={result.examDate ?? "-"}
        />

        <ResultHeroScore
          totalScore={result.totalScore}
          maxScore={result.maxScore}
          passingGradeStatus={passingGradeStatus}
          passingGradeRule={passingGradeRule}
          packageRanking={packageRanking}
          skdRanking={skdRanking}
          onCountEnd={() => setScoreRevealed(true)}
        />

        {scoreRevealed && <PassingGradeBadge status={passingGradeStatus} />}

        <ResultStatsGrid
          correct={result.correct}
          wrong={result.wrong}
          unanswered={result.unanswered}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-6">
            {result.tkp && (
              <ResultTkpSection
                score={result.tkp.score}
                maxScore={result.tkp.maxScore}
                pointDistribution={result.tkp.pointDistribution}
                passed={passingGradeStatus?.subtests?.TKP?.passed}
              />
            )}
            <ResultCategoryGrid
              categories={result.categories}
              passingSubtests={passingGradeStatus?.subtests}
            />

            <ResultChartsSection
              correct={result.correct}
              wrong={result.wrong}
              unanswered={result.unanswered}
              categories={result.categories}
              tkp={result.tkp}
              topics={result.topics}
            />
          </div>

          <div className="lg:col-span-5">
            <ResultTopicAnalysis topics={result.topics} />
          </div>
        </div>
      </main>

      <ResultStickyActions
        onExit={handleExit}
        onReview={handleReview}
        onDownloadPdf={transformed ? handleDownloadPdf : undefined}
      />
      <ResultMobileBottomNav />
    </div>
  );
}
