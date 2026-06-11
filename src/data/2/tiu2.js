const tiu2 = [
  {
    paket: 2,
    kategori: "Tes Intelegensia Umum (TIU)",
    topic: "kemampuan numerik",
    nomor: 7,
    soal: "-1, 1, 3, 8, 13, 15, ...",
    pilihan: {
      a: "13",
      b: "16",
      c: "15",
      d: "17",
      e: "14",
    },
    jawabanBenar: "d",
    poin: 5,
  },
  {
    paket: 2,
    kategori: "Tes Intelegensia Umum (TIU)",
    topic: "kemampuan numerik",
    nomor: 8,
    soal: "2, 5, 9, 12, 16, 19, ...",
    pilihan: {
      a: "20",
      b: "21",
      c: "22",
      d: "23",
      e: "24",
    },
    jawabanBenar: "",
    poin: 5,
  },
  {
    paket: 2,
    kategori: "Tes Intelegensia Umum (TIU)",
    topic: "kemampuan numerik",
    nomor: 10,
    type: "table",
    soal: `dengan jumlah penghasilan sebesar 5,6 juta/bulan toko pak basri membayar zakat sebesar 140.000  `,
    table: {
      headers: ["A", "B"],
      rows: [
        [
          "besar zakat yang harus dikeluarkan jika penghasilan toko pak basri rp.3,2 jt / bulan",
          "Rp60.000",
        ],
      ],
    },
    pertanyaan: "Manakah hubungan yang benar berdasarkan informasi di atas?",
    pilihan: {
      a: "2A > 3B",
      b: "3A < 2B",
      c: "A - B = 20.000",
      d: "B - 1/2 A = 10.000",
      e: "1/2 B - 1/4 A = 20.000",
    },
    jawabanBenar: "",
    poin: 5,
  },
  {
    paket: 2,
    kategori: "TIU",
    topic: "figural",
    nomor: 7,
    soal: "Perhatikan gambar berikut dan tentukan pola yang benar:",
    image: "../assets/figural.png",

    pilihan: {
      a: "Pola A",
      b: "Pola B",
      c: "Pola C",
      d: "Pola D",
      e: "Pola E",
    },

    jawabanBenar: "a",
    poin: 5,
  },
  // Tambahkan TIU nomor 9-11 sesuai data
];

export default tiu2;
