import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import QuestionGrid from "../../components/question/QuestionGrid";

export default function Sidebar() {
  const session = useSelector((state) => state.exam.session);
  const { paketId } = useParams();

  // Sidebar navigasi soal cuma relevan saat ujian sedang berlangsung
  // (ada sesi aktif untuk paket yang sama). Sebelum user menekan mulai
  // (masih di FreeExamIntroPanel), sidebar ini tidak boleh muncul.
  if (!session || session.paketId !== paketId) return null;

  return (
    <aside
      className="hidden lg:block fixed left-0 top-16 w-72 h-[calc(100vh-4rem)]
        bg-white
        border-r
        overflow-y-auto
      "
    >
      {/* HEADER */}
      <div className="p-4 border-b">
        <p className="text-sm text-slate-500">Panel Informasi Peserta dan Navigasi Soal</p>
      </div>

      {/* GRID */}
      <div className="p-4">
        <QuestionGrid />
      </div>
    </aside>
  );
}