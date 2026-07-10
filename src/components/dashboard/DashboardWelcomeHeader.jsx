/**
 * DashboardWelcomeHeader — sapaan personal di atas dashboard.
 *
 * Props:
 * - name: nama depan/lengkap user (fallback "Peserta")
 * - subtitle: teks motivasi, boleh dioverride, ada default statis
 */
export default function DashboardWelcomeHeader({ name, subtitle }) {
  const displayName = name?.trim() || "Peserta";

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--db-primary)]">
          Selamat Datang, {displayName}! 👋
        </h2>
        <p className="text-sm md:text-base text-[var(--db-on-surface-variant)] max-w-2xl mt-2">
          {subtitle ??
            "Konsistensi adalah kunci keberhasilan. Satu langkah kecil hari ini membawa Anda lebih dekat ke NIP impian."}
        </p>
      </div>
    </section>
  );
}
