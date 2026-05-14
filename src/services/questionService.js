import { paketData } from "../data";

export const questionService = {
  getByPaket(id) {
    const paket = paketData[id];
    return paket ? paket.questions : [];
  },

  getAll() {
    return Object.values(paketData);
  },
};
