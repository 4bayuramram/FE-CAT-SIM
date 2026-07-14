import { paketData } from "../data";

const idMap = {
  "1": 1,
  "skd-002": 2,
  "skd-003": 3,
  "skd-004": 4,
};

export const questionService = {
  getByPaket(id) {
    const mappedId = idMap[id] ?? id;
    const paket = paketData[mappedId];
    return paket ? paket.questions : [];
  },

  // Ambil metadata paket (termasuk duration), dipakai examEngine buat
  // set durasi ujian sesuai konfigurasi masing-masing paket.
  getPaketMeta(id) {
    const mappedId = idMap[id] ?? id;
    const paket = paketData[mappedId];
    if (!paket) return null;

    return {
      id: paket.id,
      nama: paket.nama,
      category: paket.category ?? null,
      duration: paket.duration ?? null,
      totalQuestions: paket.questions?.length ?? 0,
      // default true kalau field belum diisi -- paket lama sebelum flag
      // ini ada tetap tampil di halaman publik seperti perilaku semula.
      showOnPackagesPage: paket.showOnPackagesPage ?? true,
    };
  },

  getAll() {
    return Object.values(paketData);
  },
};
