Sidebar.jsx;
import QuestionGrid from "../../components/question/QuestionGrid";

export default function Sidebar() {
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
        <h2 className="font-bold text-lg">Navigasi Ujian</h2>

        <p className="text-sm text-slate-500">Pilih nomor soal</p>
      </div>

      {/* GRID */}
      <div className="p-4">
        <QuestionGrid />
      </div>
    </aside>
  );
}