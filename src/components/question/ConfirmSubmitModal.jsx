// src/components/question/ConfirmSubmitModal.jsx
export default function ConfirmSubmitModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
        <h2 className="text-lg font-bold mb-2">Konfirmasi Akhir Ujian</h2>

        <p className="text-slate-600 mb-6">
          Apakah kamu yakin ingin mengakhiri ujian ini? Setelah submit, jawaban
          tidak dapat diubah.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg">
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Ya, Submit
          </button>
        </div>
      </div>
    </div>
  );
}
