

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="bg-gradient-to-r from-[#12345b] to-[#0b2a4a] text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
        

          <h1 className="text-4xl font-bold mb-4">Kebijakan Privasi</h1>

          <p className="text-white/80 max-w-2xl leading-7">
            Kami menghargai dan melindungi privasi setiap pengguna platform
            ujian ini.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-[#fcd401]" />
            Last Updated: May 2026
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              1. Informasi yang Dikumpulkan
            </h2>

            <p className="text-gray-600 leading-8">
              Kami dapat mengumpulkan informasi seperti nama, email, data ujian,
              aktivitas sistem, serta informasi teknis perangkat untuk mendukung
              operasional platform.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              2. Penggunaan Informasi
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li>• Verifikasi identitas pengguna</li>
              <li>• Menjalankan sistem ujian</li>
              <li>• Menyimpan hasil dan histori ujian</li>
              <li>• Analisis performa sistem</li>
              <li>• Peningkatan keamanan platform</li>
            </ul>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              3. Keamanan Data
            </h2>

            <p className="text-gray-600 leading-8">
              Kami menerapkan langkah keamanan teknis dan administratif untuk
              melindungi data pengguna dari akses tidak sah, kehilangan, atau
              penyalahgunaan.
            </p>

            <div className="mt-5 bg-[#fcd401]/10 border border-[#fcd401]/20 rounded-2xl p-5">
              <p className="text-sm text-[#12345b] font-medium">
                Namun demikian, tidak ada sistem digital yang dapat dijamin 100%
                aman.
              </p>
            </div>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              4. Penyimpanan Data
            </h2>

            <p className="text-gray-600 leading-8">
              Data pengguna dapat disimpan selama masih diperlukan untuk
              operasional layanan, evaluasi akademik, maupun kewajiban
              administratif.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              5. Persetujuan Pengguna
            </h2>

            <p className="text-gray-600 leading-8">
              Dengan menggunakan platform ini, pengguna dianggap menyetujui
              proses pengumpulan dan penggunaan data sesuai kebijakan privasi
              yang berlaku.
            </p>
          </div>

          {/* FOOTER */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 leading-7">
              Jika terdapat pertanyaan terkait privasi dan data, silakan hubungi
              administrator platform.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
