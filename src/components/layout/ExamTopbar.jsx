import { useSelector } from "react-redux";

export default function ExamTopbar() {
  const session = useSelector((state) => state.exam.session);
  const answers = useSelector((state) => state.exam.answers);

  if (!session) return null;

  // ambil inisial kategori
  const getInitial = (text = "") => {
    return text
      .trim()
      .split(" ")
      .slice(0, 3) // ambil maksimal 3 kata saja
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // grouping per kategori
  const kategoriMap = session.questions.reduce((acc, q) => {
    if (!acc[q.kategori]) acc[q.kategori] = { answered: 0, total: 0 };
    acc[q.kategori].total += 1;

    if (answers[q.nomor]) acc[q.kategori].answered += 1;

    return acc;
  }, {});

  return (
    <div className="flex justify-between p-4 bg-white border-b shadow-md sticky top-0 z-20 font-sans">
      {/* TITLE */}
      <div className="font-bold text-lg">Simulasi CAT {session.paketId}</div>

      {/* CATEGORY PROGRESS */}
      <div className="flex gap-4">
        {Object.entries(kategoriMap).map(([kategori, data]) => (
          <div key={kategori} className="text-sm font-medium">
            {getInitial(kategori)}: {data.answered}/{data.total}
          </div>
        ))}
      </div>
    </div>
  );
}
