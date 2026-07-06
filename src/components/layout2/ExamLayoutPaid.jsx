import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ExamTopbarPaid from "./ExamTopbarPaid";
import TimerPanelPaid from "./TimerPanelPaid";
import SidebarPaid from "./SidebarPaid";
import BottomNavPaid from "./BottomNavPaid";
import ExamGuardPaid from "./ExamGuardPaid";
import QuestionGridPaid from "../layout2/QuestionGridPaid";
import ResultDialogPaid from "../question2/ResultDialogPaid";
import {
  selectSubmitResult,
  resetExamDb,
} from "../../features/exam/examSliceDb";

/**
 * ExamLayoutPaid — SHELL PERMANEN untuk jalur DB (server-driven).
 *
 * Struktur/breakpoint/class Tailwind sengaja dipertahankan SAMA PERSIS
 * dengan ExamLayout.jsx (hardcode) supaya visualnya identik antara dua
 * jalur — yang beda hanya sumber data (komponen di sini semua baca dari
 * state.examDb, bukan state.exam). Dua jalur ini independent: tidak ada
 * import silang antara folder layout (hardcode) dan layout2 (paid).
 *
 * mobileView tetap state LOKAL (bukan Redux) — keputusan ini aman karena
 * ExamGuardPaid (polling timer) tidak butuh tahu mobileView sama sekali;
 * dia tetap mount & jalan terlepas dari view mana yang sedang aktif di
 * mobile. Ini menutup open item soal "mobileView lokal vs Redux" di
 * dokumen perencanaan.
 *
 * PATCH (ResultDialogPaid aktif): open/close popup hasil JUGA state
 * lokal di sini (bukan Redux) — alasannya sama seperti mobileView, ini
 * murni UI transien, bukan data ujian. ExamLayoutPaid jadi satu-satunya
 * tempat yang tahu status popup, dibagikan ke dua pemicu:
 *   1. ExamGuardPaid (via onSubmitted) — buka otomatis begitu status
 *      jadi 'submitted' (flash-confirmation).
 *   2. SidebarPaid (via onOpenResultDialog) — tombol re-open manual di
 *      bawah profil peserta, kapan saja setelah sesi selesai.
 *
 * Layout ini TIDAK memicu startOrResumeExamDb — itu tanggung jawab
 * ExamPagePaid (Outlet) saat mount, sesuai pola "Page = orchestrator
 * lokal, Layout tidak tahu-menahu soal data ujian".
 */
export default function ExamLayoutPaid() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packageId } = useParams();

  const [mobileView, setMobileView] = useState("ujian");
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  const submitResult = useSelector(selectSubmitResult);

  const handleSelectQuestion = () => {
    setMobileView("ujian"); // balik ke exam setelah klik grid
  };

  const handleExitFromDialog = () => {
    setResultDialogOpen(false);
    dispatch(resetExamDb());
    navigate("/home", { replace: true });
  };

  // RE-AKTIVASI /hasil (statistik per kategori/topik sudah siap, breakdown
  // dari backend). Dibuka di TAB BARU (window.open) — halaman ini berdiri
  // sendiri (lihat routes/PaidExam.jsx: sibling dari ExamLayoutPaid) dan
  // sudah hidrasi data sendiri saat mount, jadi aman dibuka terpisah dari
  // tab ujian/mode review yang tetap berjalan di tab asal.
  const handleReviewFromDialog = () => {
    setResultDialogOpen(false);
    window.open(`/try-out/${packageId}/hasil`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <ExamTopbarPaid />
      <TimerPanelPaid /> {/* floating */}
      <div className="flex pt-8">
        <SidebarPaid
          canShowResultDialog={!!submitResult}
          onOpenResultDialog={() => setResultDialogOpen(true)}
        />

        <main className="flex-1 md:ml-72 p-3 mt-[-36px] pb-20 md:pb-4">
          {/* DESKTOP */}
          <div className="hidden md:block">
            <Outlet />
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            {/* EXAM VIEW */}
            <div className={mobileView === "ujian" ? "block" : "hidden"}>
              <Outlet />
            </div>

            {/* NAVIGASI OVERLAY */}
            {mobileView === "navigasi" && (
              <div className="fixed inset-0 bg-slate-100 z-50 p-4 overflow-auto pb-28">
                <QuestionGridPaid onSelect={handleSelectQuestion} />
              </div>
            )}

            {/* BANTUAN */}
            {mobileView === "bantuan" && (
              <div className="fixed inset-0 bg-white z-50 p-4 text-sm">
                Gunakan navigasi untuk pindah soal.
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNavPaid mobileView={mobileView} setMobileView={setMobileView} />
      <ExamGuardPaid onSubmitted={() => setResultDialogOpen(true)} />
      <ResultDialogPaid
        open={resultDialogOpen}
        result={submitResult}
        onExit={handleExitFromDialog}
        onReview={handleReviewFromDialog}
        onClose={() => setResultDialogOpen(false)}
      />
    </div>
  );
}
