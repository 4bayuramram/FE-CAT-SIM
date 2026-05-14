import { Routes, Route } from "react-router-dom";

import Page1 from "../pages/base/Page1";

import ExamLayout from "../components/layout/ExamLayout";
import ExamPage from "../pages/ExamPage";

export default function BasePage() {
  return (
    <Routes>
      <Route path="/" element={<Page1 />} />

      {/* Layout Route */}
      <Route path="/exam-page/:paketId" element={<ExamLayout />}>
        <Route index element={<ExamPage />} />
      </Route>
    </Routes>
  );
}
