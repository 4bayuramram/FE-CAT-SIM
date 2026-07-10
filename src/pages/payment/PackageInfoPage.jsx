import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { initUserProfile } from "../../services/auth/initUserProfile";
import { updateLeaderboardConsent } from "../../services/auth/updateLeaderboardConsent";
import LeaderboardSection from "../../components/leaderboard/LeaderboardSection";
import LeaderboardEntryButton from "../../components/leaderboard/LeaderboardEntryButton";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimerIcon from "@mui/icons-material/Timer";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";
import BlockIcon from "@mui/icons-material/Block";
import SyncIcon from "@mui/icons-material/Sync";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/**
 * PackageInfoPage — TODO §3 "Flow Setelah Payment".
 *
 * Gate baru di antara pembayaran sukses dan halaman ujian aslinya
 * (ExamLayoutPaid/ExamPagePaid di route ":packageId" index). Route ini
 * adalah SIBLING dari ExamLayoutPaid (pola sama seperti "hasil" di
 * PaidExam.jsx) — bukan nested — supaya punya shell halaman sendiri
 * yang tenang (tanpa topbar/timer ujian) sebelum user benar-benar
 * masuk sesi.
 *
 * Sekaligus menggabungkan TODO §4 "Persetujuan Publikasi Identitas":
 * consent HANYA ditampilkan kalau `user_profile.leaderboard_opt_in`
 * masih NULL (belum pernah dijawab). Kalau sudah pernah dijawab
 * (true/false), blok consent disembunyikan dan tombol langsung aktif.
 *
 * CATATAN ASUMSI (belum ada kolom di tabel `packages` untuk jumlah
 * soal / aturan / larangan ujian):
 * - Jumlah soal diambil via COUNT ke tabel `questions` (best-effort,
 *   fallback disembunyikan kalau query gagal/di-block RLS).
 * - Aturan & larangan ujian masih teks generik (sama untuk semua
 *   paket) — silakan sesuaikan array RULES/PROHIBITIONS di bawah, atau
 *   nanti diganti jadi kolom di DB kalau perlu berbeda per paket.
 *
 * Juga memanggil initUserProfile() di awal — ditemukan bahwa fungsi ini
 * sebelumnya SUDAH ADA tapi tidak pernah dipanggil di mana pun, jadi
 * row user_profile bisa jadi belum ter-create untuk sebagian user
 * (terutama login Google). Dipanggil di sini supaya profile+consent
 * check selalu punya row untuk dibaca/ditulis.
 */

const RULES = [
  "Ujian memiliki durasi tetap sesuai paket dan akan otomatis berakhir saat waktu habis.",
  "Hasil Percobaan pertama digunakan sebagai nilai resmi untuk pemeringkatan.",
  "Hasil Percobaan berikutnya ('Coba Lagi') murni untuk melihat progres belajar, tidak menimpa nilai resmi.",
  "Pastikan koneksi internet stabil selama mengerjakan ujian.",
  "Ujian ini dirancang untuk mengukur kemampuan kamu. Hindari segala bentuk kecurangan dan kerjakan setiap soal dengan jujur.",
];

const PROHIBITIONS = [
  "Meninggalkan halaman ujian dalam waktu lama tanpa menyelesaikan sesi.",
  "Me-refresh halaman secara berulang-ulang di luar kebutuhan (dapat memengaruhi sesi).",
];

export default function PackageInfoPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [paket, setPaket] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [needsConsent, setNeedsConsent] = useState(false);
  const [consentChoice, setConsentChoice] = useState(null); // true | false | null
  const [userId, setUserId] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      // Pastikan row user_profile ada (lihat catatan di header file ini)
      await initUserProfile();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/cpn-z/login", { replace: true });
        return;
      }

      if (cancelled) return;
      setUserId(session.user.id);

      const [paketRes, profileRes, countRes] = await Promise.all([
        supabase.from("packages").select("*").eq("id", packageId).single(),
        supabase
          .from("user_profile")
          .select("leaderboard_opt_in")
          .eq("id", session.user.id)
          .maybeSingle(),
        supabase
          .from("questions")
          .select("id", { count: "exact", head: true })
          .eq("package_id", packageId),
      ]);

      if (cancelled) return;

      if (paketRes.error || !paketRes.data) {
        setError("Paket tidak ditemukan.");
        setLoading(false);
        return;
      }

      setPaket(paketRes.data);

      if (!countRes.error && typeof countRes.count === "number") {
        setQuestionCount(countRes.count);
      }

      const optIn = profileRes.data?.leaderboard_opt_in;
      setNeedsConsent(optIn === null || optIn === undefined);

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId]);

  const canStart = !needsConsent || consentChoice !== null;

  const handleStart = async () => {
    if (!canStart || submitting) return;
    setSubmitting(true);

    if (needsConsent && consentChoice !== null && userId) {
      const { error: consentError } = await updateLeaderboardConsent(
        userId,
        consentChoice
      );
      if (consentError) {
        console.error(consentError);
        // Tidak memblokir user masuk ujian hanya karena gagal simpan
        // consent — dicoba lagi secara implisit next visit (opt_in
        // masih NULL kalau ini gagal).
      }
    }

    navigate(`/try-out/${packageId}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="flex items-center gap-3 text-[#001f3f]">
          <SyncIcon className="animate-spin" />
          <span className="font-semibold">Memuat informasi paket...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="text-center space-y-3">
          <ErrorOutlineIcon className="text-red-500 text-5xl" />
          <p className="font-bold text-[#001f3f]">{error}</p>
          <a href="/home" className="text-sm underline text-gray-500">
            Kembali ke beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-3xl mx-auto h-16 flex items-center px-4 sm:px-5">
          <h1 className="text-lg sm:text-2xl font-bold text-[#001f3f]">
            Sebelum Memulai Ujian
          </h1>
        </div> 
      </header>

      <main className="max-w-3xl mx-auto w-full px-4 sm:px-5 py-6 sm:py-10 space-y-6">
        {/* INFO PAKET */}
        <section className="rounded-3xl bg-white border border-gray-200 shadow-lg p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#001f3f] mb-2">
            {paket.title}
          </h2>
          <p className="text-gray-600 mb-6">{paket.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <MenuBookIcon className="text-[#001f3f]" />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Jumlah Soal</p>
                <p className="font-bold text-[#001f3f]">
                  {questionCount !== null ? `${questionCount} Soal` : "—"}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-300 flex items-center justify-center shrink-0">
                <TimerIcon className="text-[#191c1e]" />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Durasi</p>
                <p className="font-bold text-[#001f3f]">
                  {paket.duration_minutes} Menit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ATURAN */}
        <section className="rounded-3xl bg-white border border-gray-200 shadow-lg p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <RuleRoundedIcon className="text-[#001f3f]" />
            <h3 className="text-lg font-bold text-[#001f3f]">Aturan Ujian</h3>
          </div>
          <ul className="space-y-3">
            {RULES.map((rule) => (
              <li
                key={rule}
                className="flex gap-3 items-start text-sm text-gray-700"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#001f3f] shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </section>

        {/* LARANGAN */}
        <section className="rounded-3xl bg-white border border-gray-200 shadow-lg p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BlockIcon className="text-red-500" />
            <h3 className="text-lg font-bold text-[#001f3f]">
              Larangan Selama Ujian
            </h3>
          </div>
          <ul className="space-y-3">
            {PROHIBITIONS.map((item) => (
              <li
                key={item}
                className="flex gap-3 items-start text-sm text-gray-700"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* LEADERBOARD */}
        <LeaderboardSection packageId={packageId} currentUserId={userId} />
        <div className="flex justify-end -mt-3">
          <LeaderboardEntryButton />
        </div>

        {/* CONSENT — hanya muncul kalau belum pernah dijawab */}
        {needsConsent && (
          <section className="rounded-3xl bg-white border-2 border-[#fcd402] shadow-lg p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <LeaderboardIcon className="text-[#001f3f]" />
              <h3 className="text-lg font-bold text-[#001f3f]">
                Persetujuan Publikasi Identitas
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Apakah identitas kamu (nama, avatar, lokasi formasi yang ingin di
              lamar) boleh ditampilkan pada leaderboard? Pilihan ini hanya
              ditanyakan sekali dan berlaku untuk Percobaan pertama kamu.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer transition ${
                  consentChoice === true
                    ? "border-[#001f3f] bg-[#eff3ff]"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="consent"
                  checked={consentChoice === true}
                  onChange={() => setConsentChoice(true)}
                  className="w-5 h-5 accent-[#001f3f]"
                />
                <span className="font-semibold text-[#001f3f]">Ya, boleh</span>
              </label>

              <label
                className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer transition ${
                  consentChoice === false
                    ? "border-[#001f3f] bg-[#eff3ff]"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="consent"
                  checked={consentChoice === false}
                  onChange={() => setConsentChoice(false)}
                  className="w-5 h-5 accent-[#001f3f]"
                />
                <span className="font-semibold text-[#001f3f]">Tidak</span>
              </label>
            </div>
          </section>
        )}

        {/* TOMBOL MULAI */}
        <button
          onClick={handleStart}
          disabled={!canStart || submitting}
          className="w-full h-14 rounded-2xl bg-yellow-400 hover:bg-yellow-300 transition font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <SyncIcon className="animate-spin" fontSize="small" />
              Memulai...
            </>
          ) : (
            <>
              Mulai Ujian
              <ArrowForwardIcon fontSize="small" />
            </>
          )}
        </button>
        {needsConsent && consentChoice === null && (
          <p className="text-center text-xs text-gray-500 -mt-3">
            Pilih salah satu persetujuan di atas untuk melanjutkan.
          </p>
        )}
      </main>
    </div>
  );
}
