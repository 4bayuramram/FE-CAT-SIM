import { Link } from "react-router-dom";
import {
  examComparisonFeatures,
  paidOnlyFeatures,
  freeExamDisclaimer,
} from "../../data/examComparisonFeatures";

function FeatureValue({ value }) {
  if (value === true) {
    return <span className="text-emerald-600 font-semibold">✓</span>;
  }
  if (value === false) {
    return <span className="text-slate-300 font-semibold">—</span>;
  }
  return <span>{value}</span>;
}

/**
 * Panel edukasi yang tampil sebelum user memulai ujian pada jalur
 * gratis/simulasi (non-DB). Tujuannya:
 *  - Menjelaskan bahwa jalur ini beda dari try-out berbayar (fitur, level
 *    soal, tujuan penggunaan).
 *  - Memberi opsi lanjutkan sesi lama (kalau ada) atau mulai baru.
 */
export default function FreeExamIntroPanel({
  paketNama,
  hasActiveSession,
  onStart,
  onContinue,
  onRestart,
}) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-3">
          Mode Simulasi Gratis
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-[#00467f]">
          {paketNama || "Simulasi Ujian"}
        </h1>
        <p className="text-slate-500 mt-2">
          Sebelum mulai, kenali dulu bedanya simulasi gratis ini dengan try
          out berbayar.
        </p>
      </div>

      {/* DUA CARD PERBANDINGAN */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* CARD GRATIS */}
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-5">
          <div className="text-sm font-bold text-amber-700 mb-4">
            Ujian Gratis (Simulasi)
          </div>
          <ul className="space-y-3">
            {examComparisonFeatures
              .filter((f) => f.showInFree !== false)
              .map((f) => (
                <li key={f.label} className="text-sm">
                  <div className="font-semibold text-slate-700">
                    {f.label}
                  </div>
                  <div className="text-slate-600">
                    <FeatureValue value={f.free} />
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* CARD BERBAYAR */}
        <div className="rounded-2xl border-2 border-[#00467f]/30 bg-[#00467f]/5 p-5">
          <div className="text-sm font-bold text-[#00467f] mb-4">
            Ujian Berbayar (Try Out)
          </div>
          <ul className="space-y-3">
            {examComparisonFeatures.map((f) => (
              <li key={f.label} className="text-sm">
                <div className="font-semibold text-slate-700">{f.label}</div>
                <div className="text-slate-600">
                  <FeatureValue value={f.paid} />
                </div>
              </li>
            ))}
          </ul>

          {/* FITUR TAMBAHAN — cuma ada di berbayar, sengaja tanpa padanan
              di card gratis supaya list ini terasa lebih lengkap/panjang. */}
          <div className="mt-4 pt-4 border-t border-[#00467f]/20">
            <div className="text-xs font-bold uppercase tracking-wide text-[#00467f]/70 mb-2">
              Plus fitur lainnya
            </div>
            <ul className="space-y-2">
              {paidOnlyFeatures.map((feature) => (
                <li
                  key={feature}
                  className="text-sm text-slate-600 flex items-start gap-2"
                >
                  <span className="text-emerald-600 font-semibold mt-0.5">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 leading-relaxed">
        {freeExamDisclaimer}
      </div>

      {/* ACTIONS */}
      <div className="bg-white shadow rounded-2xl p-6 text-center space-y-3">
        {hasActiveSession ? (
          <>
            <p className="text-slate-600 mb-2">
              Kamu punya sesi simulasi yang belum selesai.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onContinue}
                className="px-6 py-3 bg-[#00467f] hover:bg-[#00355f] text-white rounded-xl font-semibold transition"
              >
                Lanjutkan Sesi
              </button>
              <button
                onClick={onRestart}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition"
              >
                Mulai Ulang
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onStart}
            className="w-full sm:w-auto sm:px-10 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition"
          >
            Coba Simulasi Dasar Gratis
          </button>
        )}

        <div>
          <Link
            to="/try-out"
            className="inline-block mt-2 text-sm text-[#00467f] underline underline-offset-2 hover:text-[#00355f]"
          >
            Lihat paket try out HOTS berbayar
          </Link>
        </div>
      </div>
    </div>
  );
}
