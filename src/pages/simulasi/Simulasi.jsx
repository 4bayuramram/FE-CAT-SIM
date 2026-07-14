import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SimulationIntro from "../../components/simulasi/SimulationIntro";
import PackageSim from "../../components/simulasi/PackageSim";
import DashboardLockedDialog from "../../components/simulasi/DashboardLockedDialog";

const Simulasi = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dialog cuma muncul kalau kita baru saja di-redirect ke sini oleh
  // DashboardPageContainer (lihat komentar "LOCK UNTUK USER TANPA PAKET"
  // di sana) -- state ini SEKALI PAKAI, dibaca ke local state lalu
  // history entry-nya langsung dibersihkan (replace tanpa state) supaya
  // dialog tidak muncul lagi kalau user reload halaman ini nanti.
  const [showLockedDialog, setShowLockedDialog] = useState(
    location.state?.reason === "dashboard-locked-no-package"
  );

  const handleCloseDialog = () => {
    setShowLockedDialog(false);
    navigate(location.pathname, { replace: true, state: null });
  };

  return (
    <main className="pt-20 md:pt-36 p-lg md:p-2xl">
      <DashboardLockedDialog open={showLockedDialog} onClose={handleCloseDialog} />
      <SimulationIntro />
      <PackageSim />
    </main>
  );
};

export default Simulasi;
