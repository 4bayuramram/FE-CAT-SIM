import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";

import {
  startOrResumeExamDb,
  startNewAttemptDb,
  resetExamDb,
  selectStatus,
  selectFirstAttemptResult,
  selectProgressResult,
  selectAttemptCount,
  selectSession,
} from "../features/exam/examSliceDb";

import QuestionCardPaid from "../components/question2/QuestionCardPaid";

/**
 * ExamPagePaid — index route di dalam ExamLayoutPaid.
 *
 * (lihat header versi sebelumnya untuk detail logic/thunk — tidak
 * diulang di sini, tidak ada yang berubah dari sisi behavior.)
 *
 * STYLING v3: mengikuti referensi visual "exampaid.html" 1:1 dari sisi
 * struktur, proporsi, dan ukuran. Palet warna & fontSize di
 * tailwind.config referensi (headline-md 24/32/600, body-md 16/24/400,
 * label-md 14/20/0.05em/500, dst) ternyata setara dengan skala Tailwind
 * default (text-2xl font-semibold, text-base, text-sm tracking-wider
 * font-medium) — begitu juga borderRadius & spacing (rounded-2xl=1rem,
 * space-y-6=1.5rem) — sehingga dipetakan langsung ke utility Tailwind
 * standar, warna dipetakan ke hex arbitrary persis dari referensi.
 *
 * Struktur mengikuti referensi apa adanya: state completed BUKAN satu
 * kartu besar, melainkan section terpisah persis seperti aslinya (hero
 * tanpa card → grid statistik 2 card → tombol aksi → card "Analisis
 * Kemajuan" → timeline "Riwayat Percobaan"). Konten "Riwayat Percobaan"
 * & "Analisis Kemajuan" HANYA memakai data yang benar-benar tersedia di
 * Redux (firstAttemptResult, progressResult, attemptCount) — tidak ada
 * data dummy (mis. tanggal per attempt / akurasi topik) seperti di
 * mock HTML, karena data itu tidak ada di state asli.
 *
 * STYLING v4: di layar besar (lg+) state completed dipecah jadi 2 kolom
 * (grid-cols-3: konten utama col-span-2, sidebar col-span-1 sticky)
 * supaya tidak terlalu center/kosong di sisi kanan, tanpa memaksa
 * stretch penuh (dibatasi max-w-5xl mx-auto). Sidebar berisi kartu
 * "Aturan & Ketentuan" — ringkasan kebijakan attempt pertama = nilai
 * resmi, attempt berikutnya ("Coba Lagi") murni progres, TIDAK
 * menimpa nilai resmi. Fitur ranking/badge sendiri belum ada endpoint/
 * selector-nya di examSliceDb (lihat DOKUMEN_ACUAN §8 — "Integrasi
 * ranking/badge/dashboard" masih berstatus belum dikerjakan), jadi
 * sidebar ini TIDAK menampilkan angka peringkat palsu — hanya
 * penjelasan aturan + label "Segera Hadir". Di mobile, grid otomatis
 * jadi 1 kolom (sidebar tampil di bawah konten utama, urutan wajar).
 *
 * CATATAN KONFLIK (belum diperbaiki, menunggu konfirmasi — lihat chat):
 * blok STATE 3 di bawah ini me-return kartu ringkasan SEBELUM sempat
 * cek `session`, sehingga kalau backend sudah menghidrasi
 * session+questions+submitResult dari attempt terakhir (completedSession,
 * §6.15 dokumen acuan), kartu ini tetap yang tampil, BUKAN QuestionCardPaid
 * mode review. Ini membatalkan keputusan sebelumnya bahwa mode review
 * (soal + panel pembahasan) harus tetap bisa diakses lagi saat user
 * revisit halaman ujian setelah selesai. Dibiarkan apa adanya sesuai
 * permintaan — tinggal digabung (kartu ini jadi banner di atas
 * QuestionCardPaid) kalau memang itu yang dimaksud.
 */
export default function ExamPagePaid() {
  const dispatch = useDispatch();
  const { packageId } = useParams();

  const status = useSelector(selectStatus);
  const firstAttemptResult = useSelector(selectFirstAttemptResult);
  const progressResult = useSelector(selectProgressResult);
  const attemptCount = useSelector(selectAttemptCount);
  const session = useSelector(selectSession);

  const [startingNewAttempt, setStartingNewAttempt] = useState(false);
  // PATCH — tombol "Lihat Hasil Terakhir": /hasil dinonaktifkan sementara
  // (lihat routes/PaidExam.jsx), jadi tombol ini SEKARANG menampilkan
  // mode review (QuestionCardPaid, soal + panel pembahasan per soal)
  // langsung di halaman ini, bukan navigate ke /hasil. Mode review sudah
  // otomatis terhidrasi (session/questions/submitResult dari
  // completedSession, lihat resume-session §6.15) begitu status
  // 'completed'/'expired', jadi cukup toggle tampilan lokal — tidak perlu
  // fetch tambahan.
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (packageId) {
      // FIX: reset status ujian ke "idle" dulu sebelum fetch baru — tanpa
      // ini, status lama (mis. "error" dari percobaan/paket sebelumnya)
      // sempat kerender sekilas (<1s) sebelum startOrResumeExamDb selesai
      // dan menggantinya dengan status yang benar.
      dispatch(resetExamDb());
      dispatch(startOrResumeExamDb(packageId));
      setShowReview(false); // reset kalau pindah paket
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId, dispatch]);

  const handleStartNewAttempt = () => {
    setStartingNewAttempt(true);
    dispatch(startNewAttemptDb(packageId)).finally(() =>
      setStartingNewAttempt(false)
    );
  };

  // ------------------------------------------------------------------
  // STATE 1: LOADING
  // Overlay FULLSCREEN (menutupi sidebar/topbar dari ExamLayoutPaid di
  // sekelilingnya) -- sebelumnya cuma skeleton di area konten, jadi
  // sidebar "Panel Informasi Peserta" & "Memuat soal..." tetap kelihatan
  // duluan. Sekarang seluruh halaman ini disembunyikan di balik spinner
  // senada (bg-[#00467f] + logo) sampai soal benar-benar siap, jadi
  // transisi dari "Mulai Ujian" terasa satu tarikan napas, bukan dua
  // layar loading berturutan.
  // ------------------------------------------------------------------
  if (status === "idle" || status === "loading") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#00467f] text-white flex flex-col items-center justify-center gap-3 px-5">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <img
            src="/cpnz.png"
            alt="Logo"
            className="w-14 h-14 object-contain"
          />
        </div>
        <p className="text-sm text-white/60">Menyiapkan soal ujianmu…</p>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // STATE 2: ERROR
  // ------------------------------------------------------------------
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[530px]">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#c3c6cf] text-center space-y-6 w-full max-w-sm">
          <div className="w-16 h-16 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center mx-auto">
            <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#121c2a]">
              Gagal memuat ujian
            </h2>
            <p className="text-[#43474e] mt-2 text-base">
              Terjadi kesalahan saat mengambil informasi. Silakan coba lagi.
            </p>
          </div>

          <button
            onClick={() => dispatch(startOrResumeExamDb(packageId))}
            className="w-full bg-[#001f3f] text-white text-base font-semibold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // STATE 3: COMPLETED / EXPIRED
  // ------------------------------------------------------------------
  if (status === "completed" || status === "expired") {
    // Tombol "Lihat Hasil Terakhir" sudah diklik — tampilkan mode review
    // penuh (MUTLAK, tidak boleh digantikan apa pun), bukan kartu
    // ringkasan lagi.
    if (showReview && session) {
      return <QuestionCardPaid />;
    }

    const first = firstAttemptResult?.score;
    const last = progressResult?.score;
    const hasBoth = typeof first === "number" && typeof last === "number";
    const delta = hasBoth ? last - first : null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:max-w-5xl lg:mx-auto">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero */}
          <div className="text-center space-y-4 pt-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#fcd402]/20 blur-3xl rounded-full" />
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#001f3f] via-[#12345b] to-[#fcd401] flex items-center justify-center shadow-lg">
                <EmojiEventsRoundedIcon
                  sx={{ fontSize: 64, color: "#ffe16e" }}
                />
              </div>
            </div>

            {attemptCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 bg-[#fcd402] text-[#6f5c00] rounded-full text-sm tracking-wider font-medium border border-[#705d00]/20">
                Sudah dikerjakan {attemptCount} Kali
              </span>
            )}

            <h2 className="text-2xl font-semibold text-[#001f3f] px-4">
              {status === "expired"
                ? "Waktu ujian sebelumnya sudah habis"
                : "Kamu sudah pernah mengerjakan paket ini"}
            </h2>
            <p className="text-[#43474e] text-base px-4">
              Silakan tinjau hasil ujian atau mulai percobaan baru.
            </p>
          </div>

          {/* Statistics Grid */}
          {(firstAttemptResult || progressResult) && (
            <div className="grid grid-cols-2 gap-4">
              {firstAttemptResult && (
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-[#c3c6cf] flex flex-col justify-between">
                  <span className="text-[#43474e] text-sm tracking-wider font-medium leading-tight">
                    Nilai Attempt Pertama
                  </span>
                  <span className="text-[#001f3f] text-3xl font-extrabold mt-2">
                    {first}
                  </span>
                </div>
              )}
              {progressResult && (
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-[#c3c6cf] flex flex-col justify-between">
                  <span className="text-[#43474e] text-sm tracking-wider font-medium leading-tight">
                    Nilai Attempt Terakhir
                  </span>
                  <span className="text-[#705d00] text-3xl font-extrabold mt-2">
                    {last}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleStartNewAttempt}
              disabled={startingNewAttempt}
              className="w-full text-white text-base font-semibold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 bg-gradient-to-br from-[#001f3f] via-[#12345b] to-[#fcd401]"
            >
              {startingNewAttempt ? "Memulai..." : "Coba Lagi"}
            </button>

            <button
              onClick={() => setShowReview(true)}
              className="block w-full text-center bg-white border-2 border-[#001f3f] text-[#001f3f] text-base font-semibold py-4 rounded-xl active:scale-95 transition-all"
            >
              Lihat Hasil Terakhir
            </button>
          </div>

          {/* Analisis Kemajuan — hanya tampil kalau ada 2 titik data untuk dibandingkan */}
          {delta !== null && (
            <div className="bg-[#eff3ff] p-6 rounded-2xl border border-[#c3c6cf]">
              <h4 className="text-lg font-semibold text-[#001f3f] mb-4">
                Analisis Kemajuan
              </h4>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <CheckCircleRoundedIcon
                    className="text-[#001f3f] mt-0.5"
                    fontSize="small"
                  />
                  <p className="text-base text-[#121c2a]">
                    {delta > 0 && (
                      <>
                        Nilai kamu meningkat sebesar{" "}
                        <span className="font-bold">{delta} poin</span> dari
                        percobaan pertama.
                      </>
                    )}
                    {delta === 0 && "Nilai kamu sama dengan percobaan pertama."}
                    {delta < 0 && (
                      <>
                        Nilai kamu turun{" "}
                        <span className="font-bold">
                          {Math.abs(delta)} poin
                        </span>{" "}
                        dari percobaan pertama.
                      </>
                    )}
                  </p>
                </li>
              </ul>
            </div>
          )}

          {/* Riwayat Percobaan */}
          {(firstAttemptResult || progressResult) && (
            <div className="py-4">
              <h4 className="text-lg font-semibold text-[#001f3f] mb-6">
                Riwayat Percobaan
              </h4>
              <div className="relative pl-8 space-y-8">
                <div
                  className="absolute left-3 top-2 bottom-2 w-0.5"
                  style={{
                    background:
                      "repeating-linear-gradient(to bottom, #d4e3ff, #d4e3ff 4px, transparent 4px, transparent 8px)",
                  }}
                />

                {firstAttemptResult && (
                  <div className="relative">
                    <div className="absolute -left-[26px] top-1 w-4 h-4 bg-[#001f3f] rounded-full ring-4 ring-[#d4e3ff]" />
                    <div className="bg-white p-4 rounded-xl border border-[#c3c6cf] shadow-sm">
                      <p className="text-sm tracking-wider font-medium text-[#43474e]">
                        Percobaan Pertama
                      </p>
                      <p className="text-lg font-semibold text-[#001f3f]">
                        Nilai: {first}
                      </p>
                    </div>
                  </div>
                )}

                {progressResult && (
                  <div className="relative">
                    <div className="absolute -left-[26px] top-1 w-4 h-4 bg-[#fcd402] rounded-full ring-4 ring-[#ffe16e]" />
                    <div className="bg-white p-4 rounded-xl border border-[#c3c6cf] shadow-sm">
                      <p className="text-sm tracking-wider font-medium text-[#43474e]">
                        Percobaan Terakhir
                        {attemptCount ? ` (ke-${attemptCount})` : ""}
                      </p>
                      <p className="text-lg font-semibold text-[#001f3f]">
                        Nilai: {last}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Aturan & Ketentuan Ujian */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 bg-white p-6 rounded-2xl border border-[#c3c6cf] shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <RuleRoundedIcon className="text-[#001f3f]" fontSize="small" />
              <h4 className="text-lg font-semibold text-[#001f3f]">
                Aturan &amp; Ketentuan Paket
              </h4>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <CheckCircleRoundedIcon
                  className="text-[#001f3f] mt-0.5 shrink-0"
                  fontSize="small"
                />
                <p className="text-sm text-[#43474e] leading-relaxed">
                  Nilai{" "}
                  <span className="font-semibold text-[#121c2a]">
                    attempt pertama
                  </span>{" "}
                  dipakai sebagai nilai resmi perangkingan dari paket ini.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircleRoundedIcon
                  className="text-[#001f3f] mt-0.5 shrink-0"
                  fontSize="small"
                />
                <p className="text-sm text-[#43474e] leading-relaxed">
                  Tombol{" "}
                  <span className="font-semibold text-[#121c2a]">
                    &quot;Coba Lagi&quot;
                  </span>{" "}
                  murni untuk melihat progres belajar — tidak menimpa nilai
                  resmi attempt pertama.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircleRoundedIcon
                  className="text-[#001f3f] mt-0.5 shrink-0"
                  fontSize="small"
                />
                <p className="text-sm text-[#43474e] leading-relaxed">
                  Semua percobaan tetap tersimpan dan bisa ditinjau lewat{" "}
                  <span className="font-semibold text-[#121c2a]">
                    &quot;Lihat Hasil Terakhir&quot;
                  </span>
                  .
                </p>
              </li>
            </ul>

            <div className="pt-3 border-t border-[#c3c6cf]">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block px-2 py-0.5 bg-[#fcd402] text-[#6f5c00] rounded-full text-xs font-semibold">
                  Segera Hadir
                </span>
              </div>
              <p className="text-sm text-[#43474e] leading-relaxed">
                Fitur perangkingan &amp; badge sedang disiapkan, berbasis nilai
                attempt pertama.
              </p>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // STATE 4: READY (sesi berjalan) / SUBMITTED (baru saja selesai)
  // — TIDAK auto-navigate ke /hasil, QuestionCardPaid sendiri yang
  // berubah ke mode read-only + panel pembahasan begitu
  // session.status !== 'running'. /hasil murni tujuan navigasi sadar
  // lewat tombol/link (lihat QuestionCardPaid & ResultDialogPaid).
  // ------------------------------------------------------------------
  if (session) {
    return <QuestionCardPaid />;
  }

  return null;
}
