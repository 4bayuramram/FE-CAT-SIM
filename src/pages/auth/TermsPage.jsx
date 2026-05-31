

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="bg-gradient-to-r from-[#12345b] to-[#0b2a4a] text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Syarat & Ketentuan</h1>

          <p className="text-white/80 max-w-2xl leading-7">
            Harap membaca syarat dan ketentuan penggunaan platform ujian ini
            sebelum menggunakan layanan kami.
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
              1. Penggunaan Platform
            </h2>

            <p className="text-gray-600 leading-8">
              Platform ini digunakan untuk pelaksanaan ujian, simulasi,
              pelatihan, serta evaluasi akademik maupun non-akademik. Pengguna
              wajib menggunakan sistem secara sah dan tidak melakukan tindakan
              yang dapat merusak sistem.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              2. Akun Pengguna
            </h2>

            <p className="text-gray-600 leading-8">
              Pengguna bertanggung jawab penuh atas keamanan akun, email, dan
              password yang digunakan untuk mengakses platform.
            </p>

            <ul className="mt-4 space-y-3 text-gray-600">
              <li>• Tidak membagikan akun kepada pihak lain</li>
              <li>• Menjaga kerahasiaan password</li>
              <li>• Menggunakan data yang valid dan benar</li>
            </ul>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              3. Pelaksanaan Ujian
            </h2>

            <p className="text-gray-600 leading-8">
              Sistem dapat merekam aktivitas peserta selama ujian berlangsung
              termasuk waktu pengerjaan, jawaban, dan aktivitas navigasi soal
              untuk kepentingan evaluasi.
            </p>

            <div className="mt-5 bg-[#12345b]/5 border border-[#12345b]/10 rounded-2xl p-5">
              <p className="text-sm text-[#12345b] font-medium">
                Peserta dilarang melakukan kecurangan, manipulasi, eksploitasi
                sistem, atau aktivitas yang merugikan integritas ujian.
              </p>
            </div>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              4. Hak dan Batasan
            </h2>

            <p className="text-gray-600 leading-8">
              Kami berhak melakukan perubahan sistem, fitur, maupun aturan
              penggunaan sewaktu-waktu demi peningkatan kualitas layanan.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-[#12345b] mb-4">
              5. Penutupan Akun
            </h2>

            <p className="text-gray-600 leading-8">
              Kami berhak menangguhkan atau menonaktifkan akun pengguna apabila
              ditemukan pelanggaran terhadap syarat dan ketentuan platform.
            </p>
          </div>

          {/* FOOTER */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 leading-7">
              Dengan menggunakan platform ini, Anda dianggap telah membaca,
              memahami, dan menyetujui seluruh syarat dan ketentuan yang
              berlaku.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
