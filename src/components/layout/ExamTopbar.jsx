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
      .slice(0, 3)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // grouping per kategori
  const kategoriMap = session.questions.reduce((acc, q) => {
    if (!acc[q.kategori]) {
      acc[q.kategori] = {
        answered: 0,
        total: 0,
      };
    }

    acc[q.kategori].total += 1;

    if (answers[q.nomor]) {
      acc[q.kategori].answered += 1;
    }

    return acc;
  }, {});

  return (
    <>
      {/* spacer */}
      <div className="h-[72px]" />

      {/* FIXED TOPBAR */}
      <div
        className="
          fixed
          top-0
          left-0
          right-0
          z-50
          flex
          justify-between
          items-center
          text-white
          p-4
          bg-[#12345b]
          border-b
          shadow-none3
          font-extrabold
        "
      >
        {/* TITLE */}
        <div className="font-bold text-lg">Paket {session.paketId}</div>

        {/* CATEGORY PROGRESS */}
        <div className="flex gap-4">
          {Object.entries(kategoriMap).map(([kategori, data]) => (
            <div key={kategori} className="text-sm font-medium">
              {getInitial(kategori)}: {data.answered}/{data.total}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
