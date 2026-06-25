import { useState } from "react";

function Komponen() {
  const [jumlah, setJumlah] = useState(0);

  return (
    <div
      style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        boxSizing: "border-box",
      }}
    >
      <h1>day 1 belajar react</h1>
      <p>dengan bantuan ai tapi sebagai guide</p>
      <p>cek lagi apakah vite responsive? </p>
      <h2>Soal Dikerjakan: {jumlah}</h2>

      <button onClick={() => setJumlah(jumlah + 1)}>tambah soal</button>
    </div>
  );
}

export default Komponen;
