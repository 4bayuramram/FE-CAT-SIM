import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function ExamGuard() {
  const status = useSelector((state) => state.exam.status);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status !== "running") return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      setOpen(true);

      // cegah keluar halaman
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [status]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Ujian Sedang Berlangsung</DialogTitle>

      <DialogContent>
        Silakan submit ujian terlebih dahulu sebelum keluar.
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={() => setOpen(false)}>
          Mengerti
        </Button>
      </DialogActions>
    </Dialog>
  );
}
