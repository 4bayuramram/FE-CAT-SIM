import { Routes, Route } from "react-router-dom";
import ExamPagePaid from "../pages/ExamPagePaid";
import ExamResultPageDb from "../components/question2/ExamResultPageDb";
import ExamLayoutPaid from "../components/layout2/ExamLayoutPaid";
import PackageInfoPage from "../pages/payment/PackageInfoPage";
import ProtectedExamLayoutDb from "./ProtectedExamLayoutDb";

/**
 * PATCH (routing /hasil — versi statis/preview): sebelumnya "hasil" di
 * redirect balik ke index karena datanya belum siap sama sekali. Sekarang
 * UI-nya sudah dibangun (hardcode/mock, lihat ExamResultPageDb.jsx),
 * jadi route diaktifkan lagi TAPI sengaja jadi SIBLING dari
 * ExamLayoutPaid, BUKAN nested seperti sebelumnya — karena desain
 * ExamResultPageDb adalah halaman dark-theme mandiri dengan
 * topbar/bottom-nav sendiri, akan bentrok kalau dipaksa masuk shell
 * ExamLayoutPaid (yang punya ExamTopbarPaid/SidebarPaid/BottomNavPaid
 * versi terang sendiri).
 *
 * Guard akses (ProtectedExamLayoutDb) TETAP membungkus kedua route ini —
 * hanya shell visual yang beda, otorisasi tidak berkurang.
 *
 * INGAT: halaman ini masih HARDCODE/MOCK (belum ambil data asli), dan
 * TIDAK dilink dari mana pun di UI utama (ExamPagePaid/QuestionCardPaid/
 * ResultDialogPaid) sesuai keputusan "mode review = mutlak" — akses ke
 * sini untuk sekarang murni lewat URL langsung, untuk keperluan preview
 * pengembangan UI.
 */
export default function BasePage() {
  return (
    <Routes>
      <Route path=":packageId" element={<ProtectedExamLayoutDb />}>
        <Route element={<ExamLayoutPaid />}>
          <Route index element={<ExamPagePaid />} />
        </Route>
        <Route path="info" element={<PackageInfoPage />} />
        <Route path="hasil" element={<ExamResultPageDb />} />
      </Route>
    </Routes>
  );
}
