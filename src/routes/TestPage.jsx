import { Routes, Route } from "react-router-dom";
import ExamLayout from "../components/layout/ExamLayout";
import ExamPage from "../pages/ExamPage";
import ProtectedExamLayout from "./ProtectedExamLayout";

export default function BasePage() {
  return (
    <Routes>
      <Route path=":paketId" element={<ProtectedExamLayout />}>
        <Route element={<ExamLayout />}>
          <Route index element={<ExamPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
