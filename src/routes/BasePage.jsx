import { Routes, Route } from "react-router-dom";

import ExamLayout from "../components/layout/ExamLayout";
import ExamPage from "../pages/ExamPage";

export default function BasePage() {
  return (
    <Routes>
      {/* Layout Route */}
      <Route path="/exam-page/:paketId" element={<ExamLayout />}>
        <Route index element={<ExamPage />} />
      </Route>
    </Routes>
  );
}
