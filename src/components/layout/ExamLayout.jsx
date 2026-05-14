import { Outlet } from "react-router-dom";
import { useState } from "react";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import BottomNav from "./Bottomnav";

import QuestionGrid from "../../components/question/QuestionGrid";

export default function ExamLayout() {
  const [mobileView, setMobileView] = useState("ujian");

  const handleSelectQuestion = () => {
    setMobileView("ujian"); // balik ke exam setelah klik grid
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Topbar />

      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 md:ml-72 p-3 pb-20 md:pb-4">
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
              <div className="fixed inset-0 bg-slate-100 z-50 p-4 overflow-auto">
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
    </div>
  );
}
