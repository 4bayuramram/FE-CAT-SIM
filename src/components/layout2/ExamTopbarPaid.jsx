import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectSession,
  selectQuestions,
  selectAnswers,
  selectAttemptCount,
} from "../../features/exam/examSliceDb";
import { getKategoriShort } from "../../utils/kategoriLabel";

/**
 * ExamTopbarPaid
 *
 * Beda dari ExamTopbar lama: `answers` di sini dibaca lewat
 * selectAnswers (state.examDb.session.answers), BUKAN field top-level
 * terpisah — versi lama punya answers sebagai selector sendiri
 * (state.exam.answers) di luar session, yang berpotensi desync dari
 * session.answers (ini bug duplikasi state yang sudah diperbaiki
 * di desain examSliceDb: satu-satunya sumber kebenaran ada di dalam
 * session).
 *
 * Field soal pakai `nomor_soal`/`kategori` (kontrak API get-questions),
 * bukan `nomor` seperti di data statis lama.
 *
 * PATCH (badge "Pengerjaan ke-X"): attemptCount sudah resmi dari backend
 * (selectAttemptCount, lihat examSliceDb — diisi lewat
 * startOrResumeExamDb/startNewAttemptDb, BUKAN dihitung sendiri di
 * komponen ini). Badge sengaja hanya muncul kalau attemptCount >= 1 —
 * 0/undefined berarti data belum sempat terhidrasi (mis. sesi baru saja
 * dimulai sebelum response backend sampai), lebih baik badge tidak
 * tampil sebentar daripada sempat kelihatan "Pengerjaan ke-0".
 */
export default function ExamTopbarPaid() {
  const session = useSelector(selectSession);
  const questions = useSelector(selectQuestions);
  const answers = useSelector(selectAnswers);
  const attemptCount = useSelector(selectAttemptCount);

  const kategoriMap = useMemo(() => {
    if (!questions?.length) return {};

    return questions.reduce((acc, q) => {
      const kategori = q.kategori ?? "Lainnya";
      if (!acc[kategori]) acc[kategori] = { answered: 0, total: 0 };

      acc[kategori].total += 1;
      if (answers[q.nomor_soal] !== undefined) acc[kategori].answered += 1;

      return acc;
    }, {});
  }, [questions, answers]);

  if (!session) return null;

  const isRunning = session.status === "running";
  const isFinished =
    session.status === "finished" || session.status === "expired";

  return (
    <>
      <div className="h-[96px] sm:h-[72px]" />

      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-white px-4 py-3 bg-[#12345b] border-b font-extrabold min-h-[72px]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="font-bold text-base sm:text-lg">
            Paket {session.package_id}
          </div>

          {attemptCount >= 1 && (
            <div className="px-3 py-1 rounded-full bg-white/10 text-white text-xs uppercase font-bold">
              Pengerjaan ke-{attemptCount}
            </div>
          )}

          {isRunning && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-white text-xs uppercase font-bold animate-pulse hover:scale-105 transition-transform">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
              </span>
              sedang berlangsung
            </div>
          )}

          {isFinished && (
            <div className="px-3 py-1 rounded-full bg-gray-500 text-xs uppercase font-bold">
              Selesai
            </div>
          )}
        </div>

        {isRunning && (
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-medium">
            {Object.entries(kategoriMap).map(([kategori, data]) => (
              <div key={kategori} className="bg-white/10 px-2 py-1 rounded-md">
                {getKategoriShort(kategori)}: {data.answered}/{data.total}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
