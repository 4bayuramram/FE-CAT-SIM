import { Outlet } from "react-router-dom";
import { useState } from "react";

import ExamTopbar from "./ExamTopbar";
import TimerPanel from "./TimerPanel";

import Sidebar from "./Sidebar";
import BottomNav from "./Bottomnav";

import QuestionGrid from "../../components/question/QuestionGrid";
import ExamGuard from "../../components/layout/ExamGuard"// ← import di sini

export default function ExamLayout() {
  const [mobileView, setMobileView] = useState("ujian");

  const handleSelectQuestion = () => {
    setMobileView("ujian"); // balik ke exam setelah klik grid
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <ExamTopbar />
      <TimerPanel /> {/* floating */}
      <div className="flex pt-8">
        <Sidebar />

        <main className="flex-1 md:ml-72 p-3 mt-[-36px] pb-20 md:pb-4">
          {/* DESKTOP */}
          <div className="hidden md:block">
            <Outlet />
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            {/* EXAM VIEW */}
            <div className={mobileView === "ujian" ? "block" : "hidden"}>
              <Outlet />
            </div>

            {/* NAVIGASI OVERLAY */}
            {mobileView === "navigasi" && (
              <div className="fixed inset-0 bg-slate-100 z-50 p-4 overflow-auto pb-28">
                <QuestionGrid onSelect={handleSelectQuestion} />
              </div>
            )}

            {/* BANTUAN */}
            {mobileView === "bantuan" && (
              <div className="fixed inset-0 bg-white z-50 p-4 text-sm">
                Gunakan navigasi untuk pindah soal.
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNav mobileView={mobileView} setMobileView={setMobileView} />
      {/* PASANG EXAM GUARD DI SINI */}
      <ExamGuard />
    </div>
  );
}
