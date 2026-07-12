import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  STATUS_LABEL,
  formatRupiah,
  formatTanggalWaktu,
  formatPaymentMethod,
} from "../../utils/transactionFormat";

/**
 * TransactionInvoicePdfDocument — layout DOKUMEN struk pembayaran,
 * dipakai via utils/generateTransactionInvoicePdf.js (tombol "Unduh
 * Struk (PDF)" di DashboardTransactionDetailModal.jsx).
 *
 * Sengaja komponen terpisah dari modal web (beda rendering engine --
 * @react-pdf/renderer cuma dukung subset CSS via StyleSheet.create),
 * pola sama persis dengan result/Resultpdfdocument.jsx: putih, hitam,
 * rapi, teks asli (bisa di-select/search).
 */

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#555555",
  },
  statusBadge: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    marginBottom: 16,
  },
  packageBox: {
    backgroundColor: "#f5f7fa",
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  packageTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  packageDate: {
    fontSize: 9,
    color: "#555555",
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#333333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  detailLabel: {
    color: "#555555",
  },
  detailValue: {
    fontFamily: "Helvetica-Bold",
    maxWidth: 260,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    borderTopStyle: "dashed",
  },
  totalLabel: {
    fontSize: 11,
    color: "#555555",
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  footerNote: {
    marginTop: 28,
    fontSize: 8,
    color: "#888888",
    lineHeight: 1.5,
  },
});

/**
 * @param {object} transaction - output getTransactionHistory.js
 *   ({ orderId, transactionId, status, amount, packageTitle,
 *      paymentType, bank, vaNumber, paidAt, createdAt })
 * @param {object} meta - { buyerName }
 */
export default function TransactionInvoicePdfDocument({ transaction, meta = {} }) {
  const paymentMethodLabel = formatPaymentMethod(transaction);
  const paidAtDisplay = transaction.paidAt || transaction.createdAt;
  const statusLabel = STATUS_LABEL[transaction.status] || transaction.status || "-";

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Struk Pembayaran</Text>
            <Text style={styles.headerSubtitle}>
              Konfirmasi transaksi dari sistem kami
            </Text>
          </View>
          <Text style={styles.statusBadge}>{statusLabel}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.packageBox}>
          <Text style={styles.packageTitle}>{transaction.packageTitle}</Text>
          <Text style={styles.packageDate}>{formatTanggalWaktu(paidAtDisplay)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Detail Transaksi</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID</Text>
          <Text style={styles.detailValue}>{transaction.orderId}</Text>
        </View>

        {transaction.transactionId && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ID Transaksi Midtrans</Text>
            <Text style={styles.detailValue}>{transaction.transactionId}</Text>
          </View>
        )}

        {paymentMethodLabel && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <Text style={styles.detailValue}>{paymentMethodLabel}</Text>
          </View>
        )}

        {transaction.vaNumber && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nomor VA</Text>
            <Text style={styles.detailValue}>{transaction.vaNumber}</Text>
          </View>
        )}

        {meta.buyerName && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Atas Nama</Text>
            <Text style={styles.detailValue}>{meta.buyerName}</Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Dibayar</Text>
          <Text style={styles.totalValue}>{formatRupiah(transaction.amount)}</Text>
        </View>

        <Text style={styles.footerNote}>
          Struk ini adalah bukti pembayaran yang tercatat di sistem kami,
          dihasilkan otomatis dan sah tanpa tanda tangan basah. Bila kamu
          butuh bukti pembayaran resmi dari bank/e-wallet, silakan cek
          riwayat transaksi di aplikasi pembayaran yang kamu pakai.
        </Text>
      </Page>
    </Document>
  );
}
