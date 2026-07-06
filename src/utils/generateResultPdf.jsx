import { pdf } from "@react-pdf/renderer";
import ResultPdfDocument from "../components/result/ResultPdfDocument";

/**
 * downloadResultPdf — generate PDF di browser (client-side, tidak lewat
 * server) dari data yang sudah dirender di halaman /hasil, lalu trigger
 * download langsung.
 *
 * @param {object} result - output transformSubmitResultToView()
 * @param {object} meta - { candidateName, packageId, sessionLabel }
 */
export async function downloadResultPdf(result, meta) {
  const blob = await pdf(
    <ResultPdfDocument result={result} meta={meta} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hasil-ujian-${meta.packageId || "paket"}-percobaan-${
    meta.sessionLabel || "1"
  }.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
