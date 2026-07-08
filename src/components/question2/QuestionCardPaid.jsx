import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectSession,
  selectQuestions,
  selectCurrentIndex,
  selectAnswers,
  selectPembahasan,
  answerQuestionDb,
  submitExamDb,
  setAnswerOptimistic,
  loadPembahasanDb,
} from "../../features/exam/examSliceDb";

import QuestionRendererPaid from "./QuestionRendererPaid";
import QuestionOptionsPaid from "./QuestionOptionsPaid";
import QuestionNavPaid from "./QuestionNavPaid";
import ConfirmSubmitModal from "../question/ConfirmSubmitModal"; // reuse — presentational murni

/**
 * QuestionCardPaid
 *
 * Beda paling mendasar dari QuestionCard hardcode:
 * - Tidak pernah memanggil engine langsung/sinkron. Jawaban & submit
 *   SELALU lewat dispatch thunk (answerQuestionDb/submitExamDb) ->
 *   examEngineDb -> rulesEngineDb (validasi) -> backend.
 * - Tidak melakukan navigate() sendiri setelah submit — bukan tanggung
 *   jawab komponen ini (lihat PATCH di bawah untuk siapa yang menangani).
 *
 * PATCH (mode review inline): sebelumnya begitu sesi selesai,
 * ExamGuardPaid langsung auto-navigate ke /hasil sebelum halaman ini
 * sempat menampilkan mode read-only. Sekarang ExamGuardPaid TIDAK lagi
 * auto-navigate (diganti trigger popup ResultDialogPaid) — soal terakhir
 * yang sedang dibuka tetap tampil di sini, hanya berubah mode: opsi
 * jawaban jadi read-only (ditangani QuestionOptionsPaid via isFinished),
 * dan di bawahnya muncul panel jawaban+pembahasan per soal (pola sama
 * seperti QuestionCard hardcode). Data pembahasan tetap diambil sekali
 * lewat loadPembahasanDb() (endpoint get-pembahasan, gated backend status
 * finished/expired) — bukan nempel di objek soal sejak awal.
 * Halaman ini SEKARANG jadi MUTLAK satu-satunya tempat lihat hasil ujian
 * per-soal — /hasil (ExamResultPageDb) dinonaktifkan sementara (route-nya
 * redirect balik ke sini, lihat routes/PaidExam.jsx), sampai halaman
 * statistik-per-topik itu benar-benar dirancang & datanya siap.
 */
export default function QuestionCardPaid() {
  const dispatch = useDispatch();

  const session = useSelector(selectSession);
  const questions = useSelector(selectQuestions);
  const currentIndex = useSelector(selectCurrentIndex);
  const answers = useSelector(selectAnswers);
  const pembahasan = useSelector(selectPembahasan);

  const [openConfirmSubmit, setOpenConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPembahasan, setShowPembahasan] = useState(false);

  const isFinished = session?.status !== "running";
  const question = questions?.[currentIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  // Muat pembahasan sekali begitu sesi selesai — guard sisi client, backend
  // tetap validator utama (403 kalau dipaksa sebelum status finished/expired).
  useEffect(() => {
    if (!isFinished || !session || pembahasan) return;
    dispatch(loadPembahasanDb());
  }, [isFinished, session, pembahasan, dispatch]);

  // Balik ke tidak-expanded tiap ganti soal, supaya tidak "nyangkut" expand
  // dari soal sebelumnya.
  useEffect(() => {
    setShowPembahasan(false);
  }, [currentIndex]);

  if (!session) {
    return (
      <div className="bg-white p-6 rounded-xl border">Memuat soal...</div>
    );
  }

  // BARU: bedakan "masih loading" vs "paket ini memang belum ada
  // soalnya sama sekali di DB" — sebelumnya dua kasus ini sama-sama
  // nampilkan "Memuat soal..." selamanya (session running + timer
  // jalan, tapi tidak pernah ada soal muncul), padahal akar masalahnya
  // get-questions.txt TIDAK error kalau query ke tabel `questions`
  // kosong untuk package_id tsb — backend tetap balikin 200 dengan
  // questions: [] apa adanya. Jadi user cuma diam menunggu tanpa tahu
  // kalau paketnya memang belum ada isinya (lihat Dokumen Acuan §5,
  // "Exam Questions — soal final belum dibuat").
  if (Array.isArray(questions) && questions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-red-200">
        <p className="text-red-600 font-semibold mb-1">
          Paket ini belum memiliki soal.
        </p>
        <p className="text-sm text-gray-600">
          Kemungkinan soal untuk paket ini belum diinput oleh admin.
          Silakan hubungi admin, atau coba paket lain sementara waktu.
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="bg-white p-6 rounded-xl border">Memuat soal...</div>
    );
  }

  const pembahasanDetail = pembahasan?.pembahasan?.find(
    (item) => item.nomor_soal === question.nomor_soal
  );

  const handleAnswer = (choiceKey) => {
    if (isFinished) return;
    // BARU (fix delay klik jawaban): tampilan pilihan langsung ganti,
    // autosave ke backend tetap jalan di background lewat answerQuestionDb.
    dispatch(
      setAnswerOptimistic({ nomorSoal: question.nomor_soal, jawaban: choiceKey })
    );
    dispatch(
      answerQuestionDb({ nomorSoal: question.nomor_soal, jawaban: choiceKey })
    );
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirmSubmit(false);
    setSubmitting(true);
    setSubmitError(null);
    try {
      await dispatch(submitExamDb()).unwrap();
      // Tidak navigate manual di sini — lihat catatan header (ExamGuardPaid).
    } catch (err) {
      setSubmitError(err?.message ?? "Gagal submit ujian. Coba lagi.");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
      <div className="mb-6 border-b pb-4">
        <div className="text-[18px] font-bold">
          Soal {question.nomor_soal} dari {questions.length}
        </div>
        <div className="text-lg font-bold text-[#00467f]">
          {question.kategori}
        </div>
        <div className="text-sm text-slate-600 mt-1 capitalize">
          Topik: {question.topic || "-"}
        </div>
      </div>

      <div className="text-lg md:text-xl font-times leading-7 text-slate-800">
        <QuestionRendererPaid question={question} />
        <QuestionOptionsPaid
          question={question}
          answers={answers}
          isFinished={isFinished}
          onSelect={handleAnswer}
        />
      </div>

      <QuestionNavPaid />

      {submitError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {submitError}
        </div>
      )}

      {!isFinished && (
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => setOpenConfirmSubmit(true)}
            disabled={submitting}
            className="px-6 py-3 bg-red-600 text-white rounded-lg disabled:opacity-50"
          >
            {submitting ? "Mengirim..." : "Submit Ujian"}
          </button>
        </div>
      )}

      {/* PANEL PEMBAHASAN — hanya muncul mode review (selesai). Sengaja
          murni tombol toggle di luar (tidak bocorkan jawaban kamu/benar
          sebelum diklik) — semua detail (jawaban kamu, jawaban benar,
          penjelasan) digabung SATU tempat di dalam panel yang di-expand,
          bukan terpisah seperti revisi sebelumnya. */}
      {isFinished && (
        <div className="mt-4 pt-4 border-t">
          {!pembahasan && (
            <p className="text-sm text-slate-400 mb-3">Memuat pembahasan...</p>
          )}

          {pembahasanDetail && (
            <button
              onClick={() => setShowPembahasan((v) => !v)}
              className="px-4 py-2 bg-[#12345b] text-white rounded-lg text-sm"
            >
              {showPembahasan ? "Tutup Pembahasan" : "Lihat Pembahasan"}
            </button>
          )}

          {showPembahasan && pembahasanDetail && (
            <div className="mt-3 p-4 border bg-green-50 rounded-xl text-sm space-y-2">
              <div className="text-slate-600">
                Jawaban kamu:{" "}
                <span className="font-semibold">
                  {answers?.[question.nomor_soal]
                    ? answers[question.nomor_soal].toUpperCase()
                    : "-"}
                </span>
                {!pembahasanDetail.scoring_map &&
                  pembahasanDetail.jawaban_benar && (
                    <>
                      {" · "}Jawaban benar:{" "}
                      <span className="font-semibold">
                        {pembahasanDetail.jawaban_benar.toUpperCase()}
                      </span>
                    </>
                  )}
              </div>
              <p className="whitespace-pre-line">
                {pembahasanDetail.pembahasan ||
                  "Pembahasan belum tersedia untuk soal ini."}
              </p>
            </div>
          )}
          {/* PATCH: link "Lihat Halaman Hasil Lengkap" ke /hasil DIHAPUS —
              route itu dinonaktifkan sementara (lihat routes/PaidExam.jsx).
              Halaman ini (mode review) sekarang MUTLAK satu-satunya tempat
              lihat hasil ujian per-soal, tidak ada tujuan lain untuk
              dituju dari sini. */}
        </div>
      )}

      <ConfirmSubmitModal
        open={openConfirmSubmit}
        onCancel={() => setOpenConfirmSubmit(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
