const paket4 = {
  id: 4,
  nama: "Paket 4 CAT Simulation (TWK + TIU + TKP Dynamic)",

  questions: [
    // ===================== TWK =====================
    {
      paket: 4,
      kategori: "Tes Wawasan Kebangsaan (TWK)",
      topic: "pilar negara",
      nomor: 1,
      soal: "Pancasila sebagai dasar negara memiliki fungsi utama sebagai ...",
      pilihan: {
        a: "Sumber segala hukum",
        b: "Ideologi kelompok tertentu",
        c: "Simbol negara",
        d: "Alat politik",
        e: "Aturan daerah",
      },
      jawabanBenar: "a",
      poin: 5,
    },

    // ===================== TIU =====================
    {
      paket: 4,
      kategori: "Tes Intelegensia Umum (TIU)",
      topic: "numerik",
      nomor: 2,
      soal: "2, 4, 8, 16, ...",
      pilihan: {
        a: "18",
        b: "20",
        c: "24",
        d: "32",
        e: "30",
      },
      jawabanBenar: "d",
      poin: 5,
    },

    // ===================== TKP =====================

    {
      paket: 4,
      mode: "TKP",
      kategori: "Tes Karakteristik Pribadi (TKP)",
      topic: "integritas",
      nomor: 3,
      soal: "Rekan kerja melakukan kesalahan kecil yang tidak diketahui atasan. Anda ...",
      pilihan: {
        a: "Diam saja",
        b: "Mengabaikan",
        c: "Mengingatkan secara pribadi",
        d: "Melapor atasan",
        e: "Membicarakan ke orang lain",
      },
      scoringMap: {
        a: 1,
        b: 2,
        c: 5,
        d: 3,
        e: 1,
      },
    },

    {
      paket: 4,
      mode: "TKP",
      kategori: "Tes Karakteristik Pribadi (TKP)",
      topic: "kerja tim",
      nomor: 4,
      soal: "Anda bekerja dengan tim yang sangat berbeda karakter ...",
      pilihan: {
        a: "Memimpin otoriter",
        b: "Menghindar",
        c: "Kolaborasi aktif",
        d: "Kerja sendiri",
        e: "Menunggu arahan",
      },
      scoringMap: {
        a: 2,
        b: 1,
        c: 5,
        d: 3,
        e: 2,
      },
    },

    {
      paket: 4,
      mode: "TKP",
      kategori: "Tes Karakteristik Pribadi (TKP)",
      topic: "pelayanan publik",
      nomor: 5,
      soal: "Warga marah saat pelayanan ramai. Anda ...",
      pilihan: {
        a: "Ikut emosi",
        b: "Mengabaikan",
        c: "Menjelaskan dengan sabar",
        d: "Menunda layanan",
        e: "Mengusir",
      },
      scoringMap: {
        a: 1,
        b: 2,
        c: 5,
        d: 3,
        e: 1,
      },
    },

    {
      paket: 4,
      mode: "TKP",
      kategori: "Tes Karakteristik Pribadi (TKP)",
      topic: "tanggung jawab",
      nomor: 6,
      soal: "Anda menemukan kesalahan pada laporan sendiri setelah dikirim ...",
      pilihan: {
        a: "Diam saja",
        b: "Sembunyikan",
        c: "Perbaiki dan lapor",
        d: "Menunggu diminta",
        e: "Hapus data",
      },
      scoringMap: {
        a: 1,
        b: 1,
        c: 5,
        d: 2,
        e: 1,
      },
    },
  ],
};

export default paket4;
