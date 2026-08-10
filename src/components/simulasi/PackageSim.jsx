import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import ScheduleIcon from "@mui/icons-material/Schedule";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BoltIcon from "@mui/icons-material/Bolt";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { supabase } from "../../lib/supabaseClient";
import PackageCategoryTabs from "./PackageCategoryTabs";
import { resolvePackageCategory } from "../../utils/packageCategory";
import { questionService } from "../../services/questionService";

// Format harga ke Rupiah (pola sama seperti pages/payment/PaymentPage.jsx)
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// Reusable PackageSim
//
// BARU: badge harga sekarang bisa menampilkan harga asli yang dicoret
// (originalPrice) + harga setelah diskon (price), atau kalau paket ini
// sudah dibeli user yang sedang login (owned=true), badge otomatis
// berubah jadi "Aktif" + centang hijau, menggantikan tampilan harga.
// `badge` (string polos) tetap didukung sebagai fallback untuk kasus
// non-harga seperti Paket 1 gratis ("Gratis").
const PackageSim = ({
  title = "Paket SKD",
  description = "Simulasi TWK, TIU, dan TKP.",
  questions = 110,
  duration = "100 Menit",
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFcqYtR6JjJhpDeWJLlW1yogF8y6rEp2yNPIiWUeb7zbs16zBZ1gnLp4qSolOyfW5H896BSDNKDMLnaNfCO8Qnmq4_uoGpNH-Ml7BIXfSsA0NZI4OohGkxn5tegnT5r448DAKXLSjXkc2ZzmvFlEx1X9-5imVR3N7BZBYmI8Px0bR07gGnIe1ZlMN3uDfdT9COjWO-Dw2h52Pxnd9ijsYW-VxzbFNfP26Jovwa5SGh2lSabSdiAKfMOIjmJBaw0chtGh7zifAxnSwr",
  badge = "Langsung",
  price = null,
  originalPrice = null,
  owned = false,
  buttonText = "Mulai Simulasi",
  pembahasan = "",
  peringkat = "",
  hots = "",
  ultrahots = "",
  linkTo = "#",
  peserta = "",
}) => {
  const hasDiscount =
    !owned &&
    typeof price === "number" &&
    typeof originalPrice === "number" &&
    originalPrice > price;

  return (
    <div className="bg-white border border-[#00467f] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-md hover:shadow-lg transition-shadow group w-full">
      {/* Image */}
      <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        {/* Badge */}
        {owned ? (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold pl-1.5 pr-2 py-1 rounded tracking-wider flex items-center gap-1">
            <CheckCircleIcon sx={{ fontSize: 14 }} />
            Aktif
          </div>
        ) : typeof price === "number" ? (
          <div className="absolute top-2 right-2 bg-[#00467f] text-white text-xs font-bold px-2 py-1 rounded tracking-wider flex flex-col items-end leading-tight">
            {hasDiscount && (
              <span className="line-through opacity-60 text-[10px] font-normal">
                {formatRupiah(originalPrice)}
              </span>
            )}
            <span>{formatRupiah(price)}</span>
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-[#00467f] text-white text-xs font-bold px-2 py-1 rounded tracking-wider">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col justify-between flex-grow">
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:underline">
            {title}
          </h3>

          <p className="text-sm md:text-base text-gray-600">{description}</p>

          {/* Info */}
          <div className="flex flex-wrap gap-4 pt-2 text-gray-500 text-sm items-center">
            <div className="flex items-center gap-1">
              <QuizIcon fontSize="small" />
              <span>{questions} Soal</span>
            </div>
            <div className="flex items-center gap-1">
              <ScheduleIcon fontSize="small" />
              <span>{duration}</span>
            </div>
            {hots && (
              <div className="flex items-center gap-1">
                <PsychologyIcon fontSize="small" />
                <span>{hots}</span>
              </div>
            )}
            {ultrahots && (
              <div className="flex items-center gap-1">
                <BoltIcon fontSize="small" />
                <span>{ultrahots}</span>
              </div>
            )}

            {pembahasan && (
              <div className="flex items-center gap-1">
                <QuestionAnswerIcon fontSize="small" />
                <span>{pembahasan}</span>
              </div>
            )}
            {peringkat && (
              <div className="flex items-center gap-1">
                <EmojiEventsIcon fontSize="small" />
                <span>{peringkat}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <PeopleIcon fontSize="small" />
              <span>{peserta}</span>
            </div>
          </div>
        </div>

        {/* Button with Link */}
        <Link
          to={linkTo}
          className="
          mt-4 md:mt-6 
          w-full 
          bg-white 
          border 
          border-[#00467f] 
          text-[#00467f] 
          py-2 md:py-3 
          rounded 
          font-semibold 
          text-sm md:text-base 
          text-center
          transition-all
          hover:bg-[#00467f]
          hover:text-white
          hover:border-white
          "
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

// Main Sematkan Page
//
// PATCH (bugfix): sebelumnya daftar paket 100% hardcode di sini,
// termasuk "Paket 2"/"Paket 3" yang linkTo-nya menunjuk ke
// /exam-page/skd-002 dan /exam-page/skd-003 — yaitu JALUR HARDCODE/
// GRATIS lama (examSlice, data statis paket2.js/paket3.js), BUKAN
// jalur Paid/DB (examSliceDb, tabel `packages`/`questions`) yang
// sebenarnya dipakai untuk paket berbayar.
//
// Akibatnya: user yang sudah beli & mengerjakan paket berbayar lewat
// jalur Paid (/try-out/:packageId), begitu klik kartu paket yang sama
// di halaman ini, malah dilempar ke jalur hardcode yang sama sekali
// tidak tahu-menahu soal sesi yang baru saja diselesaikan (Redux state
// berbeda, `examSlice` vs `examSliceDb`, soal statis vs dari DB) —
// terasa seperti "masuk ujian baru yang lain".
//
// Fix: paket berbayar sekarang diambil LIVE dari tabel `packages`
// (pola query sama seperti pages/payment/PaymentPage.jsx &
// pages/payment/PackageInfoPage.jsx: select("*") lalu pakai `id` asli
// dari row tsb), dan linkTo diarahkan ke "/try-out/:id/info" — gate
// resmi jalur Paid. Guard (ProtectedLayoutDb + ProtectedExamLayoutDb)
// yang otomatis menangani redirect kalau belum login (/cpn-z/login)
// atau belum beli (/cpn-z/payment/:id), persis seperti alur normal
// setelah pembayaran sukses. Kalau paket sudah pernah dikerjakan,
// ExamPagePaid yang sudah menangani tampilan "sudah pernah mengerjakan
// paket ini" + tombol "Coba Lagi"/"Lihat Hasil Terakhir" — tidak perlu
// logic tambahan di sini.
//
// UPDATE: sekarang SEMUA paket hardcode (bukan cuma Paket 1) sengaja
// ditampilkan di sini — src/data/paket1-4.js lewat questionService.getAll(),
// sesuai keputusan arsitektur terbaru ("jalur hardcode/statis dipakai
// untuk semua paket free tier", bukan cuma satu). FREE_PACKAGES di
// ProtectedExamLayout.jsx sudah di-update jadi mencakup id "1"-"4" juga.
//
// questions/duration diambil LANGSUNG dari getPaketMeta() (dihitung dari
// data asli: questions.length, duration/60000) — TIDAK ditulis manual
// lagi, supaya angka yang ditampilkan di kartu selalu sinkron dengan yang
// benar-benar berjalan saat ujian.
//
// ASUMSI yang perlu dikonfirmasi ke dev: (1) tabel `packages` punya
// RLS SELECT yang mengizinkan dibaca publik/anon, karena halaman ini
// (/home/simulasi) tidak ada di balik ProtectedLayoutDb — kalau
// diblokir, daftar paket berbayar tidak akan muncul sama sekali di
// sini (fallback pesan error ditampilkan, bukan silent-blank). (2)
// Kolom `price`/`original_price` dipakai utk badge harga (null/0
// dianggap gratis), disamakan dgn pola PaymentPage.jsx.
export default function Sematkan() {
  // Cuma paket dengan showOnPackagesPage !== false yang tampil di sini
  // (Mini SKD 1-3 sengaja disembunyikan dari halaman publik, cuma
  // muncul di tab "Latihan" dashboard -- lihat DashboardLatihanTab.jsx
  // yang tetap menampilkan SEMUA paket via questionService.getAll()).
  const paketGratisList = questionService
    .getAll()
    .filter(
      (paket) => questionService.getPaketMeta(paket.id).showOnPackagesPage
    )
    .map((paket) => {
      const meta = questionService.getPaketMeta(paket.id);
      return {
        title: paket.nama,
        badge: "Gratis",
        questions: meta.totalQuestions,
        duration: meta.duration
          ? `${Math.round(meta.duration / 60000)} Menit`
          : "—",
        description: "Try-Out SKD (TWK,TIU,TKP)",
        linkTo: `/exam-page/${paket.id}`,
        pembahasan: "koreksi-jawaban",
        peserta: 112,
        category: resolvePackageCategory({
          title: paket.nama,
          category: meta.category,
        }),
      };
    });

  const [paketBerbayar, setPaketBerbayar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("semua");

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setLoading(true);
      setErrorMsg("");

      // Cek sesi login dulu — kalau ada, sekalian ambil paket yang
      // sudah dibeli & aktif (user_package_access), query yang sama
      // persis dipakai guard ProtectedExamLayoutDb.jsx untuk cek akses.
      // Kalau belum login, ownedIds tetap Set kosong (semua paket
      // dianggap belum dimiliki, wajar — nanti begitu diklik, guard
      // yang akan redirect ke /cpn-z/login).
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Urut berdasarkan title (bukan price) -- paket berbayar dinamai
      // "skd-001", "skd-002", "skd-004", dst, dan urutan tampil di
      // halaman ini memang harus ikut urutan title itu (paket lama ke
      // baru), bukan urutan harga.
      const [packagesRes, accessRes] = await Promise.all([
        supabase
          .from("packages")
          .select("*")
          .order("title", { ascending: true }),
        session?.user
          ? supabase
              .from("user_package_access")
              .select("package_id")
              .eq("user_id", session.user.id)
              .eq("status", "active")
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (cancelled) return;

      if (packagesRes.error) {
        console.error(packagesRes.error);
        setErrorMsg("Gagal memuat daftar paket. Coba muat ulang halaman.");
        setLoading(false);
        return;
      }

      if (accessRes.error) {
        // Tidak fatal — cuma berarti badge "Aktif" tidak akan muncul,
        // paket tetap tampil dengan harga normal.
        console.error(accessRes.error);
      }

      const ownedIds = new Set(
        (accessRes.data || []).map((row) => String(row.package_id))
      );

      const data = packagesRes.data;

      // Jumlah soal sekarang diambil langsung dari kolom
      // packages.question_count (di-sync otomatis via trigger DB tiap
      // ada insert/update/delete di tabel questions -- lihat migration
      // add_question_count_to_packages.sql). Tidak perlu lagi query
      // terpisah ke tabel questions per paket (hindari N+1 query +
      // masalah RLS yang bikin count keliru jadi 0 di halaman publik).
      const withCounts = (data || []).map((pkg) => ({
        ...pkg,
        questionCount:
          typeof pkg.question_count === "number" ? pkg.question_count : null,
        owned: ownedIds.has(String(pkg.id)),
        category: resolvePackageCategory(pkg),
      }));

      if (cancelled) return;
      setPaketBerbayar(withCounts);
      setLoading(false);
    }

    loadPackages();
    return () => {
      cancelled = true;
    };
  }, []);

  // Satu daftar gabungan (gratis + berbayar) supaya hitungan tab dan
  // filter tab konsisten dari satu sumber. Kategori tiap paket gratis
  // diambil dari resolvePackageCategory (lihat paketGratisList di atas),
  // bukan di-hardcode "skd" untuk semuanya.
  //
  // URUTAN tab "Semua" (sesuai keputusan produk): Paket 1 (gratis)
  // paling atas -- otomatis, karena paketGratisList selalu ditaruh
  // duluan -- lalu paket BERBAYAR kategori "skd" duluan (urut title:
  // skd-001, skd-002, skd-004, dst -- lihat .order("title") di query
  // Supabase di atas), baru paket berbayar non-skd (twk/tiu/tkp) di
  // paling bawah. Di dalam masing-masing grup kategori, urutan title
  // dari query Supabase tetap dipertahankan -- makanya dipakai .sort()
  // yang stabil (bukan bikin ulang urutan dari nol), cukup kelompokkan
  // skd vs non-skd tanpa mengacak urutan title di dalam grupnya.
  const paketBerbayarUrut = [...paketBerbayar].sort((a, b) => {
    const rankA = a.category === "skd" ? 0 : 1;
    const rankB = b.category === "skd" ? 0 : 1;
    return rankA - rankB;
  });

  const semuaPaket = [
    ...paketGratisList.map((pkg, i) => ({
      ...pkg,
      id: `gratis-${i + 1}`,
      isFree: true,
    })),
    ...paketBerbayarUrut,
  ];

  const tabCounts = semuaPaket.reduce(
    (acc, pkg) => {
      acc.semua += 1;
      acc[pkg.category] = (acc[pkg.category] || 0) + 1;
      return acc;
    },
    { semua: 0, skd: 0, twk: 0, tiu: 0, tkp: 0 }
  );

  const paketTampil =
    activeTab === "semua"
      ? semuaPaket
      : semuaPaket.filter((pkg) => pkg.category === activeTab);

  const tabAktifLabel =
    activeTab === "semua"
      ? "Semua"
      : { skd: "SKD", twk: "TWK", tiu: "TIU", tkp: "TKP" }[activeTab];

  return (
    <section className="bg-white font-merriweather font-extrabold pt-4 mb-8 md:pt-8 pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-left mb-6 md:mb-8 space-y-3">
          <h2
            className="text-2xl md:text-4xl font-extrabold"
            style={{ color: "#00467f" }}
          >
            Daftar Paket Tryout
          </h2>
        </div>

        {errorMsg && <p className="text-sm text-red-600 mb-6">{errorMsg}</p>}

        {/* Tabbed Interface kategori paket */}
        <PackageCategoryTabs
          active={activeTab}
          onChange={setActiveTab}
          counts={tabCounts}
        />

        {/* Grid */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Skeleton loading — tetap tampil di tab manapun saat fetch berjalan */}
          {loading &&
            [1, 2].map((n) => (
              <div
                key={`skeleton-${n}`}
                className="w-full sm:w-auto max-w-full sm:max-w-none mx-auto h-48 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}

          {/* Empty state per kategori — tab tetap ada walau isinya kosong */}
          {!loading && paketTampil.length === 0 && (
            <div className="col-span-1 sm:col-span-2 text-center py-12 px-4 border border-dashed border-gray-300 rounded-xl">
              <p className="font-semibold text-gray-600">
                Belum ada paket {tabAktifLabel} tersedia.
              </p>
              <p className="text-sm text-gray-400 font-normal mt-1">
                Paket untuk kategori ini akan muncul di sini begitu tersedia.
              </p>
            </div>
          )}

          {!loading &&
            paketTampil.map((pkg) =>
              pkg.isFree ? (
                <div
                  key={pkg.id}
                  className="w-full sm:w-auto max-w-full sm:max-w-none mx-auto"
                >
                  <PackageSim
                    title={pkg.title}
                    description={pkg.description}
                    badge={pkg.badge}
                    questions={pkg.questions}
                    duration={pkg.duration}
                    linkTo={pkg.linkTo}
                    pembahasan={pkg.pembahasan}
                    peserta={pkg.peserta}
                  />
                </div>
              ) : (
                <div
                  key={pkg.id}
                  className="w-full sm:w-auto max-w-full sm:max-w-none mx-auto"
                >
                  <PackageSim
                    title={pkg.title}
                    description={pkg.description || "Try-Out SKD (TWK,TIU,TKP)"}
                    price={typeof pkg.price === "number" ? pkg.price : null}
                    originalPrice={
                      typeof pkg.original_price === "number"
                        ? pkg.original_price
                        : null
                    }
                    owned={pkg.owned}
                    buttonText={
                      pkg.owned ? "Lanjutkan Ujian" : "Mulai Simulasi"
                    }
                    questions={pkg.questionCount ?? "—"}
                    duration={
                      pkg.duration_minutes
                        ? `${pkg.duration_minutes} Menit`
                        : "—"
                    }
                    pembahasan="full-pembahasan"
                    peringkat="pemeringkatan Nasional/Provinsi"
                    linkTo={`/try-out/${pkg.id}/info`}
                  />
                </div>
              )
            )}
        </div>
      </div>
    </section>
  );
}
