import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { examEngine } from "../engine/examEngine";
import { questionService } from "../services/questionService";
import { storageService } from "../services/storageService";
import { setSession, syncSession, resetExam } from "../features/exam/examSlice";

import FreeExamIntroPanel from "../components/exam/FreeExamIntroPanel";
import QuestionCard from "../components/question/QuestionCard";
import useTimer from "../hooks/useTimer";

export default function ExamPage() {
  const dispatch = useDispatch();

  const reduxSession = useSelector((state) => state.exam.session);
  const { paketId } = useParams();

  // BUGFIX: hook ini sebelumnya cuma di-import tapi tidak pernah
  // dipanggil, jadi interval yang men-dispatch setRemainingTime tiap
  // detik tidak pernah terpasang -> UI timer diam/stuck di durasi awal.
  useTimer();

  const paketMeta = useMemo(
    () => questionService.getPaketMeta(paketId),
    [paketId]
  );

  // Sesi yang ada di local storage, dibaca sekali saat halaman ini dibuka,
  // TIDAK langsung dipush ke redux. Keputusan lanjut/mulai baru diserahkan
  // ke user lewat FreeExamIntroPanel supaya jelas dan tidak "diam-diam"
  // melanjutkan sesi lama.
  const [storedSession, setStoredSession] = useState(undefined);

  useEffect(() => {
    setStoredSession(examEngine.restoreSession());
  }, []);

  /**
   * SINKRON KE LOCAL STORAGE
   * Setiap perubahan session aktif di redux (jawab soal, flag, pindah soal,
   * ganti status, dst) otomatis dipersist ke local storage. Sebelumnya
   * cuma di-save saat create/start/submit sehingga jawaban user bisa
   * hilang kalau halaman di-refresh di tengah ujian.
   */
  useEffect(() => {
    if (!reduxSession) return;
    if (reduxSession.status === "finished") return; // hasil final ditangani submitSession
    storageService.saveSession(reduxSession);
  }, [reduxSession]);

  // Ada sesi aktif untuk paket ini yang sedang berjalan di halaman sekarang
  // (baik dari redux session yang sudah dipilih user, atau dari storage
  // yang belum diputuskan).
  const isActiveInThisTab =
    !!reduxSession &&
    reduxSession.paketId === paketId;

  const hasResumableSession =
    !!storedSession &&
    storedSession.paketId === paketId &&
    storedSession.status !== "finished" &&
    // Sesi valid buat dilanjutkan hanya kalau memang sudah pernah benar-benar
    // di-`startSession()` (punya startTime & duration, status "running").
    // Ini jaga-jaga dari sesi lama/corrupt yang nyangkut di localStorage
    // (mis. sisa testing sebelum status/duration dibenerin) — kalau
    // ditawarkan "lanjutkan" begitu saja, timer bakal stuck statis "0:00"
    // selamanya karena useTimer cuma jalan saat status === "running".
    storedSession.status === "running" &&
    !!storedSession.startTime &&
    !!storedSession.duration;

  // Sesi tersimpan tapi ternyata corrupt/gak valid -> jangan ditawarkan
  // sama sekali, langsung dianggap "tidak ada sesi lama" (fallback ke
  // Mulai Ujian biasa) supaya tidak macet di state rusak.
  const isStaleOrCorruptSession =
    !!storedSession &&
    storedSession.paketId === paketId &&
    storedSession.status !== "finished" &&
    !hasResumableSession;

  useEffect(() => {
    if (isStaleOrCorruptSession) {
      examEngine.resetSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStaleOrCorruptSession]);

  /**
   * START EXAM (sesi baru)
   */
  const startExam = () => {
    const created = examEngine.createSession(paketId);
    const running = examEngine.startSession(created);

    dispatch(setSession(running));
  };

  /**
   * LANJUTKAN SESI YANG ADA DI LOCAL STORAGE
   */
  const continueExam = () => {
    dispatch(syncSession(storedSession));
  };

  /**
   * MULAI ULANG (buang sesi lama, bikin baru)
   */
  const restartExam = () => {
    examEngine.resetSession();
    dispatch(resetExam());
    setStoredSession(null);
    startExam();
  };

  /**
   * PAKET TIDAK PUNYA SOAL (mis. id salah / data belum lengkap)
   */
  if (paketMeta && paketMeta.totalQuestions === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white shadow rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-xl font-bold mb-3">Soal Belum Tersedia</h1>
          <p className="text-slate-500">
            Paket simulasi ini belum memiliki soal. Silakan coba paket lain
            atau kembali lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  /**
   * BELUM ADA SESI AKTIF DI TAB INI -> tampilkan panel intro
   * (baik user belum pernah mulai, maupun baru refresh halaman dan
   * sesi lama masih menunggu keputusan lanjut/mulai baru)
   */
  if (!isActiveInThisTab) {
    return (
      <div className="w-full py-6">
        <FreeExamIntroPanel
          paketNama={paketMeta?.nama}
          hasActiveSession={hasResumableSession}
          onStart={startExam}
          onContinue={continueExam}
          onRestart={restartExam}
        />
      </div>
    );
  }

  /**
   * MAIN EXAM (termasuk mode review setelah selesai, ditangani QuestionCard)
   */
  return (
    <div className="w-full space-y-4">
      <QuestionCard />
    </div>
  );
}
