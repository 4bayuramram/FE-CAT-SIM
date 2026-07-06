import { useEffect, useState } from "react";
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
import { MOCK_RESULT } from "../result/mockResultData";
import ResultTopbar from "../result/ResultTopbar";
import ResultPageHeader from "../result/ResultPageHeader";
import ResultHeroScore from "../result/ResultHeroScore";
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

  useEffect(() => {
    if (!submitResult) {
      dispatch(startOrResumeExamDb(packageId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId]);

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

  const transformed = transformSubmitResultToView(submitResult);
  const result = transformed ?? MOCK_RESULT; // fallback: belum ada breakdown (loading / data lama)

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
          passingGrade={result.passingGrade}
          percentile={result.percentile}
        />

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
              />
            )}
            <ResultCategoryGrid categories={result.categories} />

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
