
import { useSelector } from "react-redux";

export default function ExamTopbarEngine() {
  const session = useSelector((state) => state.exam.session);
  const answers = useSelector((state) => state.exam.answers);

  if (!session) return null;

  const isRunning = session.status === "running";
  const isFinished = session.status === "finished";

  const getInitial = (text = "") =>
    text
      .trim()
      .split(" ")
      .slice(0, 3)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const kategoriMap = session.questions.reduce((acc, q) => {
    if (!acc[q.kategori]) acc[q.kategori] = { answered: 0, total: 0 };

    acc[q.kategori].total += 1;
    if (answers[q.nomor]) acc[q.kategori].answered += 1;

    return acc;
  }, {});

  return (
    <>
      <div className="h-[96px] sm:h-[72px]" />

      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-white px-4 py-3 bg-[#12345b] border-b font-extrabold min-h-[72px]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="font-bold text-base sm:text-lg">
            {/* Nama asli paket (mis. "Mini SKD 1"), bukan "Paket {id}"
                yang dibangun manual -- dulu top bar ini selalu nampilin
                "Paket 2"/"Paket 3"/dst walau paketnya sudah diganti nama
                jadi "Mini SKD" di tempat lain. Fallback ke "Paket {id}"
                cuma buat sesi lama di localStorage yang disimpan sebelum
                field paketNama ada. */}
            {session.paketNama || `Paket ${session.paketId}`}
          </div>

          {isRunning && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-white text-xs uppercase font-bold animate-pulse hover:scale-105 transition-transform">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
              </span>
              sedang berlangsung
            </div>
          )}

          {isFinished && (
            <div className="px-3 py-1 rounded-full bg-gray-500 text-xs uppercase font-bold">
              Selesai
            </div>
          )}
        </div>

        {isRunning && (
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-medium">
            {Object.entries(kategoriMap).map(([kategori, data]) => (
              <div key={kategori} className="bg-white/10 px-2 py-1 rounded-md">
                {getInitial(kategori)}: {data.answered}/{data.total}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
