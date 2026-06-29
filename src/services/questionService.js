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

  getAll() {
    return Object.values(paketData);
  },
};
