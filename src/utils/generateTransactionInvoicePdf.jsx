import { pdf } from "@react-pdf/renderer";
import TransactionInvoicePdfDocument from "../components/dashboard/TransactionInvoicePdfDocument";

/**
 * downloadTransactionInvoicePdf — generate struk PDF di browser
 * (client-side, tidak lewat server) dari satu item transaksi, lalu
 * trigger download langsung. Pola sama persis dengan
 * utils/generateResultPdf.jsx (downloadResultPdf).
 *
 * @param {object} transaction - output getTransactionHistory.js
 * @param {object} profile - { name } -- dipakai sebagai "Atas Nama" di struk
 */
export async function downloadTransactionInvoicePdf(transaction, profile) {
  const blob = await pdf(
    <TransactionInvoicePdfDocument
      transaction={transaction}
      meta={{ buyerName: profile?.name }}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `struk-${transaction.orderId || transaction.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
