import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function PaymentPage() {
  const { paketId } = useParams();

  const handlePayment = async () => {
    try {
      // Ambil session user dari Supabase Auth
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        alert("Anda harus login terlebih dahulu");
        return;
      }

      const user = session.user;

      const res = await fetch(
        "https://polished-bird-6e8f.bayuramadhan0401.workers.dev/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: `ORDER-${user.id.slice(0, 8)}-${Date.now()}`,
            customer_name: user.user_metadata?.full_name || user.email,
            email: user.email,
            user_id: user.id,
            package_id: paketId,
          }),
        }
      );

      const data = await res.json();

      if (!data.token) {
        alert("Gagal membuat transaksi: " + (data.error || "Unknown error"));
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: () => {
         window.location.href = `/exam-page/${paketId}`;
        },
        onPending: () => {
          alert("Pembayaran pending, akses akan aktif setelah konfirmasi");
        },
        onError: () => {
          alert("Pembayaran gagal");
        },
        onClose: () => {
          console.log("Popup ditutup");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Pembayaran Paket {paketId}</h1>
      <p>Anda belum memiliki akses ke paket ini.</p>
      <button onClick={handlePayment}>Bayar Sekarang</button>
    </div>
  );
}
