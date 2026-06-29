import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SyncIcon from "@mui/icons-material/Sync";
import LockIcon from "@mui/icons-material/Lock";
import HelpIcon from "@mui/icons-material/Help";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

const WORKER_URL = "https://polished-bird-6e8f.bayuramadhan0401.workers.dev";

// Format harga ke Rupiah
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function PaymentPage() {
  const { paketId } = useParams();

  const [paket, setPaket] = useState(null);
  const [loadingPaket, setLoadingPaket] = useState(true);
  const [errorPaket, setErrorPaket] = useState(null);

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Ambil data paket dari Supabase berdasarkan paketId dari URL
  useEffect(() => {
    async function fetchPaket() {
      setLoadingPaket(true);
      setErrorPaket(null);

      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("id", paketId)
        .single();

      if (error || !data) {
        setErrorPaket("Paket tidak ditemukan.");
      } else {
        setPaket(data);
      }

      setLoadingPaket(false);
    }

    fetchPaket();
  }, [paketId]);

  const handlePayment = async () => {
    if (!agree) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        alert("Anda harus login terlebih dahulu.");
        setLoading(false);
        return;
      }

      const user = session.user;

      const res = await fetch(`${WORKER_URL}/create-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: `ORDER-${user.id.slice(0, 8)}-${Date.now()}`,
          customer_name: user.user_metadata?.full_name || user.email,
          email: user.email,
          user_id: user.id,
          package_id: paketId,
        }),
      });

      const data = await res.json();

      if (!data.token) {
        alert("Gagal membuat transaksi: " + (data.error || "Unknown error"));
        setLoading(false);
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: () => {
          window.location.href = `/exam-page/${paketId}`;
        },
        onPending: () => {
          alert("Pembayaran pending, akses akan aktif setelah konfirmasi.");
          setLoading(false);
        },
        onError: () => {
          alert("Pembayaran gagal.");
          setLoading(false);
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  // LOADING STATE
  if (loadingPaket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="flex items-center gap-3 text-[#001f3f]">
          <SyncIcon className="animate-spin" />
          <span className="font-semibold">Memuat data paket...</span>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (errorPaket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="text-center space-y-3">
          <ErrorOutlineIcon className="text-red-500 text-5xl" />
          <p className="font-bold text-[#001f3f]">{errorPaket}</p>
          <a href="/home/simulasi" className="text-sm underline text-gray-500">
            Kembali ke daftar paket
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-5">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <ArrowBackIcon className="text-[#001f3f]" fontSize="medium" />
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-[#001f3f]">
              Pembayaran Paket
            </h1>
          </div>
          <span className="hidden md:block text-gray-500 text-sm">
            Pembayaran aman via Midtrans
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-5 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* CARD PAKET */}
          <section className="order-1 lg:order-none lg:col-span-7 lg:row-start-1 relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg p-5 sm:p-8">
            <div className="absolute right-0 top-0 p-4 sm:p-6 opacity-10">
              <WorkspacePremiumIcon style={{ fontSize: 120 }} />
            </div>

            <div className="relative z-10">
              <div className="inline-flex px-3 py-1 rounded-full bg-yellow-400 text-xs font-bold uppercase mb-4">
                Single Access
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#001f3f] mb-3">
                {paket.title}
              </h2>

              <p className="text-gray-600 max-w-lg mb-6 sm:mb-8">
                {paket.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                <div className="border rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <MenuBookIcon className="text-[#001f3f]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Soal</p>
                    <p className="font-bold text-[#001f3f]">110 Soal</p>
                  </div>
                </div>

                <div className="border rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-300 flex items-center justify-center shrink-0">
                    <TimerIcon className="text-[#191c1e]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Durasi</p>
                    <p className="font-bold text-[#001f3f]">95 Menit</p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold uppercase tracking-widest text-[#001f3f] mb-4 text-sm">
                Keuntungan Paket
              </h3>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  "Akses Penuh ke Soal dan pembahasan",
                  "aktif s/d pelaksanaan cpns terdekat",
                  "bonus trik cepat",
                  "analisis kelemahan topik",
                  "pemeringkatan N/P/K (khusus Tryout perdana)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircleIcon
                      className="text-yellow-500"
                      fontSize="small"
                    />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ASIDE RINGKASAN */}
          <aside className="order-2 lg:order-none lg:col-span-5 lg:row-start-1 lg:row-span-2">
            <div className="lg:sticky lg:top-24 rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-xl p-5 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#001f3f] mb-6">
                Ringkasan Pembayaran
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>{paket.title}</span>
                  <div className="flex flex-col items-end gap-1">
                    {paket.original_price &&
                      paket.original_price > paket.price && (
                        <span className="line-through text-gray-400 text-sm">
                          {formatRupiah(paket.original_price)}
                        </span>
                      )}
                    <span className="font-semibold text-[#001f3f]">
                      {formatRupiah(paket.price)}
                    </span>
                    {paket.original_price &&
                      paket.original_price > paket.price && (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                          HEMAT{" "}
                          {Math.round(
                            (1 - paket.price / paket.original_price) * 100
                          )}
                          %
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Biaya Layanan</span>
                  <span className="font-semibold text-[#001f3f]">Rp 0</span>
                </div>

                <div className="border-t pt-5 flex justify-between items-end flex-wrap gap-2">
                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Total Pembayaran
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#001f3f]">
                      {formatRupiah(paket.price)}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-xs font-bold">
                    IDR
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {/* CHECKBOX */}
                <label
                  className={`flex gap-3 cursor-pointer ${
                    shake ? "animate-bounce" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#001f3f] shrink-0"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Saya menyetujui{" "}
                    <a
                      href="#"
                      className="text-[#001f3f] underline font-semibold"
                    >
                      syarat dan ketentuan
                    </a>{" "}
                    serta kebijakan privasi.
                  </span>
                </label>

                {/* TOMBOL BAYAR */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-yellow-400 hover:bg-yellow-300 transition font-bold flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <SyncIcon className="animate-spin" fontSize="small" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Bayar Sekarang
                      <ArrowForwardIcon fontSize="small" />
                    </>
                  )}
                </button>

                <div className="pt-4 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <LockIcon fontSize="small" />
                    Pembayaran Aman melalui Midtrans
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs font-bold text-gray-500">
                    <span>VISA</span>
                    <span>Mastercard</span>
                    <span>GOPAY</span>
                    <span>DANA</span>
                    <span>OVO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BANTUAN */}
            <div className="mt-6 rounded-3xl border bg-white p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <HelpIcon className="text-[#001f3f]" fontSize="small" />
              </div>
              <div>
                <p className="font-bold text-[#001f3f]">Butuh bantuan?</p>
                <p className="text-sm text-gray-500">
                  Hubungi tim support kami via WhatsApp.
                </p>
              </div>
            </div>
          </aside>

          {/* BANNER BAWAH */}
          <div className="order-3 lg:order-none lg:col-span-7 lg:row-start-2 relative overflow-hidden rounded-3xl h-48 sm:h-56 bg-[#12345b]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrtx10wm1UYM2JM4cTz9oohz8hb1186xAJwU5O7KkOWhoGoerd6LiBr-xSQxSHHH9TAGQS8hOqh0T1EbWGBAJvYVx1JvEawc3aMwl76qCpLb52pGV3M8-W1L7csEi-LHqWjKKObInagKeQcKqFKh4PXeoUMRYw9c911XC2obdqlFTELmfVRYZmYA2rC9vHr-pkreZ2MUgEWoZJ3bXqL55azo-rDST9FwBmrp8gytM8tq2LYdzvuKeTAFrKdM31Lva4Bv9sWBQ-x3D-"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Ingin Hasil Maksimal?
              </h3>
              <p className="max-w-md opacity-90 text-sm sm:text-base">
                98% pengguna kami berhasil meningkatkan skor tryout mereka
                secara signifikan dalam 30 hari.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center space-y-3 px-4">
        <h3 className="font-bold text-[#001f3f]">Midtrans</h3>
        <p className="text-gray-500 text-sm">Powered by Midtrans</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
          <a href="#" className="hover:text-[#001f3f]">
            Security Policy
          </a>
          <a href="#" className="hover:text-[#001f3f]">
            Terms of Service
          </a>
        </div>
        <p className="text-xs text-gray-400">
          © 2026 CPNZ-TRYOUT. Seluruh hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}
