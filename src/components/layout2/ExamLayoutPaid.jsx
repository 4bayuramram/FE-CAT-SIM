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
import ParticipantCard from "../layout/ParticipantCard"; // reused — sama seperti di SidebarPaid, presentational murni
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
 * PATCH (perbaikan mobile nav — todo "Rapikan navigasi mobile", v3):
 * Tab "Navigasi" di mobile sekarang DRAWER DARI SAMPING (kanan), lebar
 * 78%, bukan overlay/sheet yang menutup seluruh layar. Sisi kiri yang
 * tersisa tetap menampilkan halaman soal (Outlet TETAP dirender, tidak
 * di-hidden) tapi diberi filter blur + pointer-events-none supaya tidak
 * kepencet tanpa sengaja. Tap area blur (backdrop) buat nutup drawer.
 * ExamTopbarPaid (z-50) dan BottomNavPaid (z-50) tidak disentuh — drawer
 * dibatasi top-16/bottom-16 supaya keduanya tetap kelihatan & bisa dipakai.
 *
 * SidebarPaid pakai `hidden lg:block`, jadi di mobile ParticipantCard +
 * tombol "Lihat Ringkasan Hasil" sebelumnya SAMA SEKALI tidak punya jalan
 * masuk — sekarang ada di dalam drawer ini. Tab "Bantuan" dihapus (isinya
 * cuma placeholder teks statis) — mobileView tersisa cuma "ujian" &
 * "navigasi".
 *
 * PATCH (timer ikut masuk ke drawer navigasi, hanya grid soal yang scroll):
 * <TimerPanelPaid /> sekarang punya dua wujud tergantung mobileView:
 *   - mobileView === "ujian"  -> render variant="floating" (fixed top-20
 *     right-4 z-30), PERSIS seperti semula.
 *   - mobileView === "navigasi" -> floating instance di-UNMOUNT (supaya
 *     tidak dobel), diganti variant="inline" yang dirender menempel di
 *     bawah ParticipantCard, di dalam bagian STICKY drawer (bukan ikut
 *     scroll). Drawer sekarang dipecah flex-col: header sticky
 *     (ParticipantCard + Timer + tombol "Lihat Ringkasan Hasil") tidak
 *     overflow, dan cuma <QuestionGridPaid /> yang punya overflow-y-auto
 *     sendiri — jadi saat soal banyak, yang scroll cuma nomor soalnya.
 *   Interval timer aman saat unmount/mount ganti variant karena
 *   TimerPanelPaid selalu hitung ulang dari session.started_at (Redux),
 *   bukan dari state lokal — jadi angka tetap akurat, tidak reset.
 *
 * PATCH (ResultDialogPaid aktif): open/close popup hasil JUGA state
 * lokal di sini (bukan Redux) — alasannya sama seperti mobileView, ini
 * murni UI transien, bukan data ujian. ExamLayoutPaid jadi satu-satunya
 * tempat yang tahu status popup, dibagikan ke tiga pemicu:
 *   1. ExamGuardPaid (via onSubmitted) — buka otomatis begitu status
 *      jadi 'submitted' (flash-confirmation).
 *   2. SidebarPaid (via onOpenResultDialog) — tombol re-open manual di
 *      bawah profil peserta, kapan saja setelah sesi selesai.
 *   3. QuestionCardPaid (via Outlet context `openResultDialog`) — tombol
 *      "Keluar" di sebelah "Lihat Pembahasan" saat mode review. BUKAN
 *      keluar beneran (tidak reset sesi/navigate) — cuma alias yang lebih
 *      gampang ditemukan user awam buat buka popup ringkasan hasil yang
 *      sama persis dengan "Lihat Ringkasan Hasil" di SidebarPaid, supaya
 *      dari situ user baru pilih mau keluar sungguhan (tombol "Keluar" di
 *      dalam ResultDialogPaid) atau tutup lagi. QuestionCardPaid dirender
 *      lewat Outlet (di dalam ExamPagePaid) — bukan children langsung
 *      ExamLayoutPaid — makanya dioper lewat Outlet context, bukan props
 *      biasa.
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

  // Dioper ke Outlet context supaya QuestionCardPaid (tombol "Keluar" di
  // sebelah "Lihat Pembahasan") bisa buka popup yang sama tanpa prop
  // drilling lewat ExamPagePaid — lihat catatan PATCH di header file ini.
  const openResultDialog = () => setResultDialogOpen(true);

  return (
    <div className="min-h-screen bg-slate-100">
      <ExamTopbarPaid />
      {/* floating — cuma tampil saat drawer navigasi TIDAK dibuka;
          saat navigasi dibuka, versi inline yang muncul di dalam drawer */}
      {mobileView !== "navigasi" && <TimerPanelPaid />}
      <div className="flex pt-8">
        <SidebarPaid
          canShowResultDialog={!!submitResult}
          onOpenResultDialog={() => setResultDialogOpen(true)}
        />

        <main className="flex-1 md:ml-72 p-3 mt-[-36px] pb-20 md:pb-4">
          {/* DESKTOP */}
          <div className="hidden md:block">
            <Outlet context={{ openResultDialog }} />
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            {/* EXAM VIEW — SELALU dirender (bukan cuma saat mobileView
                'ujian'), supaya tetap kelihatan (blur) di belakang drawer
                Navigasi. */}
            <div
              className={
                mobileView === "navigasi"
                  ? "blur-sm pointer-events-none select-none transition-[filter] duration-200"
                  : "transition-[filter] duration-200"
              }
            >
              <Outlet context={{ openResultDialog }} />
            </div>

            {/* NAVIGASI — DRAWER DARI SAMPING (kanan), 78% lebar. Sisi
                kiri tetap menampilkan halaman soal (blur, lihat atas).
                z-20: di BAWAH timer (z-30) & topbar/bottomnav (z-50)
                supaya ketiganya tidak pernah ketutup drawer. */}
            {mobileView === "navigasi" && (
              <>
                <div
                  className="fixed top-16 left-0 right-0 bottom-16 z-20
                    bg-black/10 animate-[fadeIn_0.2s_ease-out]"
                  onClick={() => setMobileView("ujian")}
                  aria-hidden="true"
                />

                <div
                  className="fixed top-16 right-0 bottom-16 z-20 w-[78%] max-w-xs
                    bg-slate-100 border-l shadow-2xl
                    flex flex-col
                    animate-[slideInRight_0.25s_ease-out]"
                >
                  {/* STICKY — tidak ikut scroll */}
                  <div className="flex-shrink-0 p-4 pb-0">
                    <ParticipantCard />
                    <TimerPanelPaid variant="inline" />

                    {!!submitResult && (
                      <button
                        onClick={() => setResultDialogOpen(true)}
                        className="mt-3 mb-4 w-full text-sm px-3 py-2 rounded-lg border border-[#00467f] text-[#00467f] font-semibold bg-white hover:bg-blue-50"
                      >
                        Lihat Ringkasan Hasil
                      </button>
                    )}
                  </div>

                  {/* CUMA BAGIAN INI YANG SCROLL — nomor soal */}
                  <div className="flex-1 overflow-y-auto p-4 pt-2">
                    <QuestionGridPaid onSelect={handleSelectQuestion} />
                  </div>
                </div>
              </>
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
