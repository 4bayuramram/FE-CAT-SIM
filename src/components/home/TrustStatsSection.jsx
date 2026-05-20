export default function TrustStatsSection() {
  return (
    <section className="relative py-12 bg-white border-b border-gray-200 font-merriweather">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {/* ITEM 1 */}
          <div className="p-4">
            <div className="text-2xl md:text-3xl text-[#00467f] font-extrabold">
              +1000 soal
            </div>
            <div className="text-sm text-gray-500 mt-1 font-times">
              Berdasarkan paket ujian tahun lalu dan soal prediksi
            </div>
          </div>

          {/* ITEM 2 */}
          <div className="p-4 md:border-l border-gray-200">
            <div className="text-2xl md:text-3xl text-[#00467f] font-extrabold">
              +Pembahasan
            </div>
            <div className="text-sm text-gray-500 mt-1 font-times">
              Pembahasan yang mudah dipahami
            </div>
          </div>

          {/* ITEM 3 */}
          <div className="p-4 md:border-l border-gray-200">
            <div className="text-2xl md:text-3xl text-[#00467f] font-extrabold">
              Time & Scoring
            </div>
            <div className="text-sm text-gray-500 mt-1 font-times">
              Penyesuain Sistem Scoring dan Durasi Ujian
            </div>
          </div>

          {/* ITEM 4 */}
          <div className="p-4 md:border-l border-gray-200">
            <div className="text-2xl md:text-3xl text-[#00467f] font-extrabold">
              Performance Analysis
            </div>
            <div className="text-sm text-gray-500 mt-1 font-times">
              Analisis Kemampuan Menjawabmu
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
