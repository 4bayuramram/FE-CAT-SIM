import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import {
  setAnswer,
  setCurrentIndex,
  setSession,
  resetExam,
  toggleFlag,
} from "../../features/exam/examSlice";

import { navigationEngine } from "../../engine/navigationEngine";
import { examEngine } from "../../engine/examEngine";
import { rulesEngine } from "../../engine/rulesEngine";

import QuestionRenderer from "./QuestionRenderer";
import QuestionOptions from "./QuestionOptions";
import ResultDialog from "./ResultDialog";
import ConfirmSubmitModal from "./ConfirmSubmitModal";
import MathText from "../common/MathText"; // render teks + notasi matematika ($...$/$$...$$), sama seperti jalur paid

export default function QuestionCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const session = useSelector((state) => state.exam.session);
  const currentIndex = useSelector((state) => state.exam.currentIndex);
  const answers = useSelector((state) => state.exam.answers);
  const flagged = useSelector((state) => state.exam.flagged);
  const remainingTime = useSelector((state) => state.exam.remainingTime);

  const status = session?.status;
  const isFinished = status === "finished";

  const [showPembahasan, setShowPembahasan] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [result, setResult] = useState(null);

  // NEW STATE (CONFIRM SUBMIT)
  const [openConfirmSubmit, setOpenConfirmSubmit] = useState(false);

  // Dihitung dengan optional chaining supaya aman dipakai di hook di bawah
  // SEBELUM ada pengecekan !session / !question — lihat catatan di bawah.
  const question = session?.questions?.[currentIndex];
  const pembahasan = question?.pembahasan;

  // submitExam dipindah ke sini (tidak butuh `question`, cuma `session`)
  // supaya SELALU terdefinisi di setiap render sebelum dipakai di useEffect
  // auto-submit di bawah — sebelumnya didefinisikan setelah early return
  // `if (!question) return ...`, jadi ada skenario tepi (session ada,
  // question kosong) di mana useEffect bisa memanggil submitExam sebelum
  // ia sempat terinisialisasi di render tsb.
  const submitExam = () => {
    const result = examEngine.submitSession(session);

    dispatch(setSession({ ...session, status: "finished" }));

    setResult(result);
    setOpenResultDialog(true);
  };

  /**
   * FIX (rules-of-hooks): sebelumnya ada `if (!session) return null;` dan
   * `if (!question) return (...)` DI ANTARA dua useEffect, sehingga jumlah
   * hook yang terpanggil bisa beda-beda tiap render (kadang cuma hook
   * pertama, kadang dua-duanya) — itu pelanggaran Rules of Hooks yang
   * bikin eslint(react-hooks/rules-of-hooks) error. Semua hook sekarang
   * SELALU dipanggil di urutan yang sama tiap render; guard "data belum
   * siap" dipindah ke DALAM body effect (session?.status dll), dan early
   * return untuk render (`!session` / `!question`) dipindah ke BAWAH,
   * setelah semua hook selesai dideklarasikan.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  /**
   * AUTO-SUBMIT SAAT WAKTU HABIS
   * `remainingTime` di-update tiap detik oleh useTimer(). Begitu waktu
   * habis dan sesi masih "running", ujian otomatis di-submit (memakai
   * rulesEngine.shouldAutoSubmit yang sudah dibenarkan, sebelumnya salah
   * referensi ke sessionEngine sehingga tidak pernah bekerja).
   *
   * Dipindah ke atas (sebelum early return) + pakai session?.status di
   * deps supaya hook ini tetap konsisten terpanggil walau session masih
   * null di render pertama.
   */
  useEffect(() => {
    if (!session) return;
    if (session.status !== "running") return;
    if (remainingTime === null || remainingTime === undefined) return;

    if (rulesEngine.shouldAutoSubmit(session)) {
      // FIX (eslint react-hooks/set-state-in-effect): submitExam() di atas
      // memanggil beberapa setState (dispatch(setSession), setResult,
      // setOpenResultDialog) SECARA SINKRON di body effect ini, yang
      // ditandai rule baru react-hooks karena berpotensi cascading render.
      // Kasusnya sendiri sah (subscribe ke timer eksternal `remainingTime`,
      // baru setState begitu ambang waktu tercapai — persis pola yang
      // disebut "diperbolehkan" di dokumentasi rule ini), cuma perlu
      // di-defer satu microtask supaya tidak setState sinkron di dalam
      // commit effect yang sama.
      queueMicrotask(() => submitExam());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTime, session?.status]);

  if (!session) return null;

  if (!question) {
    return (
      <div className="bg-white p-6 rounded-xl border">Soal tidak ditemukan</div>
    );
  }

  const handleAnswer = (choiceKey) => {
    if (isFinished) return;

    dispatch(
      setAnswer({
        questionNumber: question.nomor,
        answer: choiceKey,
      })
    );
  };

  const next = () => {
    const nextIndex = navigationEngine.nextIndex({
      currentIndex,
      total: session.questions.length,
    });
    dispatch(setCurrentIndex(nextIndex));
  };

  const prev = () => {
    const prevIndex = navigationEngine.prevIndex({ currentIndex });
    dispatch(setCurrentIndex(prevIndex));
  };

  const isFlagged = !!flagged?.[question.nomor];

  const handleToggleFlag = () => {
    if (isFinished) return;
    dispatch(toggleFlag(question.nomor));
  };

  /**
   * KELUAR UJIAN (setelah selesai)
   * Dulu cuma bisa lewat tombol "Keluar & Hapus Sesi" DI DALAM
   * ResultDialog -- begitu dialog ditutup lewat "Bahas Soal" (buat lihat
   * pembahasan per soal), pengguna kejebak: tidak ada tombol keluar lagi
   * sama sekali, dan dialog hasil juga tidak bisa dibuka ulang. Fungsi
   * ini sekarang dipakai bersama oleh tombol mandiri di bawah halaman
   * (selalu terlihat begitu ujian selesai) DAN tombol yang sama di
   * ResultDialog, supaya perilakunya konsisten satu sumber.
   */
  const exitExam = () => {
    dispatch(resetExam());
    setOpenResultDialog(false);
    navigate("/home/simulasi", { replace: true });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <div className="text-[18px] font-bold">
          Soal {question.nomor} dari {session.questions.length}
        </div>

        <div className="text-lg font-bold text-[#00467f]">
          {question.kategori}
        </div>

        <div className="text-sm text-slate-600 mt-1 capitalize">
          Topik: {question.topic || "-"}
        </div>
      </div>

      {/* FONT WRAPPER (SOAL + OPSI SINKRON) */}
      <div className="text-lg md:text-xl font-times leading-7 text-slate-800">
        {/* SOAL */}
        <QuestionRenderer question={question} />

        {/* PILIHAN */}
        <QuestionOptions
          question={question}
          answers={answers}
          isFinished={isFinished}
          onSelect={handleAnswer}
        />
      </div>
      {/* NAV */}
      <div className="flex justify-between items-center gap-2 mt-8 pt-4 border-t">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Sebelumnya
        </button>

        {!isFinished && (
          <button
            onClick={handleToggleFlag}
            className="px-4 py-2 text-white rounded-lg bg-[#ba1a1a] hover:opacity-90 transition"
          >
            {isFlagged ? "Batalkan Ragu" : "Ragu-ragu"}
          </button>
        )}

        <button
          onClick={next}
          disabled={currentIndex === session.questions.length - 1}
          className="px-4 py-2 bg-[#00467f] text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Selanjutnya
        </button>
      </div>

      {/* SUBMIT */}
      {!isFinished && (
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => setOpenConfirmSubmit(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg"
          >
            Submit Ujian
          </button>
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmSubmitModal
        open={openConfirmSubmit}
        onCancel={() => setOpenConfirmSubmit(false)}
        onConfirm={() => {
          setOpenConfirmSubmit(false);
          submitExam();
        }}
      />

      {/* PEMBAHASAN */}
      {isFinished && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPembahasan(!showPembahasan)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {showPembahasan ? "Tutup Pembahasan" : "Lihat Pembahasan"}
            </button>

            {/* Buka lagi ResultDialog -- sebelumnya cuma muncul sekali
                otomatis pas submit/waktu habis, sesudah ditutup gak ada
                cara lain buat lihat rekap skor lagi selain lewat sini. */}
            {result && (
              <button
                onClick={() => setOpenResultDialog(true)}
                className="px-4 py-2 border border-[#00467f] text-[#00467f] rounded-lg hover:bg-blue-50"
              >
                Lihat Hasil Ujian
              </button>
            )}

            {/* Tombol keluar mandiri -- sebelumnya SATU-SATUNYA jalan
                keluar dari halaman ujian yang sudah selesai adalah lewat
                ResultDialog, jadi begitu dialog itu ditutup (mis. lewat
                "Bahas Soal"), pengguna kejebak di sini tanpa tombol keluar. */}
            <button
              onClick={exitExam}
              className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
            >
              Keluar Ujian
            </button>
          </div>

          {showPembahasan && pembahasan && (
            <div className="mt-4 p-5 border bg-green-50 rounded-xl">
              <MathText text={pembahasan} />
            </div>
          )}
        </div>
      )}

      {/* RESULT */}
      <ResultDialog
        open={openResultDialog}
        result={result}
        onExit={exitExam}
        onReview={() => {
          dispatch(setSession({ ...session, status: "finished" }));
          setOpenResultDialog(false);
        }}
      />
    </div>
  );
}
