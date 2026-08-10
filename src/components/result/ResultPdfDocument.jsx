import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * ResultPdfDocument — layout DOKUMEN (bukan screenshot tampilan web).
 * Sengaja didesain terpisah dari komponen result/* di web (beda rendering
 * engine — @react-pdf/renderer cuma dukung subset CSS via StyleSheet.create),
 * gaya "laporan resmi": putih, hitam, rapi berhalaman, teks asli (bisa
 * di-select/search), BUKAN tema gelap seperti di halaman /hasil.
 *
 * Urutan section sesuai permintaan:
 * 1. Header (nama, tanggal, paket, percobaan ke-)
 * 2. Skor total
 * 3. Skor per kategori (TWK/TIU/TKP)
 * 4. Skor per topik (tabel)
 * 5. Kekuatan & kelemahan (SEMUA topik, dikelompokkan per level
 *    kemampuan — Tinggi/Cukup/Perlu Ditingkatkan — berdasarkan
 *    proficiencyLabel/proficiencyPct hasil ujian asli. Tidak lagi
 *    dipotong top-3.)
 */

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#555555",
    marginBottom: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  scoreHeroBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#f5f7fa",
    borderRadius: 6,
    padding: 16,
  },
  scoreHeroValue: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
  },
  scoreHeroMax: {
    fontSize: 11,
    color: "#555555",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  statLabel: {
    fontSize: 8,
    color: "#666666",
    marginTop: 2,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 4,
    padding: 10,
    marginBottom: 6,
    alignItems: "center",
  },
  categoryLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  categoryScore: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  table: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  tableCell: {
    fontSize: 8.5,
  },
  cellGreen: { color: "#1a7a3d" },
  cellNeutral: { color: "#555555" },
  cellRed: { color: "#c0392b" },
  colTopic: { width: "34%" },
  colCategory: { width: "14%" },
  colTotal: { width: "12%", textAlign: "center" },
  colScore: { width: "14%", textAlign: "center" },
  colStatus: { width: "26%", textAlign: "right" },
  strengthWeaknessWrap: {
    marginTop: 4,
  },
  swBox: {
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  swBoxStrength: {
    backgroundColor: "#eafaf0",
    borderWidth: 1,
    borderColor: "#bfe8cf",
  },
  swBoxNeutral: {
    backgroundColor: "#f5f7fa",
    borderWidth: 1,
    borderColor: "#dde3ea",
  },
  swBoxWeakness: {
    backgroundColor: "#fdecea",
    borderWidth: 1,
    borderColor: "#f3c1bb",
  },
  swTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  swItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  swItemName: {
    fontSize: 9,
  },
  swItemPct: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    fontSize: 7.5,
    color: "#999999",
    textAlign: "center",
  },
});

/**
 * @param {object} result - output transformSubmitResultToView()
 * @param {object} meta - { candidateName, packageId, sessionLabel }
 */
export default function ResultPdfDocument({ result, meta }) {
  const { candidateName, packageId, sessionLabel } = meta;

  const sortedByPctDesc = [...result.topics].sort(
    (a, b) => (b.proficiencyPct ?? 0) - (a.proficiencyPct ?? 0)
  );
  // Semua topik ditampilkan (tidak dipotong top-N lagi), dikelompokkan
  // sesuai proficiencyLabel yang sudah dihitung dari data ujian asli
  // (lihat proficiencyLabel() di resultTransform.js — ambang batasnya
  // sinkron dengan tabel "Skor per Topik" di atas).
  const tinggi = sortedByPctDesc.filter(
    (t) => t.proficiencyLabel === "Kemampuan Tinggi"
  );
  const cukup = sortedByPctDesc.filter(
    (t) => t.proficiencyLabel === "Kemampuan Cukup"
  );
  const perluDitingkatkan = sortedByPctDesc.filter(
    (t) => t.proficiencyLabel === "Perlu Ditingkatkan"
  );

  // Warna teks predikat di tabel "Skor per Topik" — konsisten dengan warna
  // box di section Kekuatan & Kelemahan (hijau/netral/merah).
  const predikatStyle = (label) => {
    if (label === "Kemampuan Tinggi") return styles.cellGreen;
    if (label === "Perlu Ditingkatkan") return styles.cellRed;
    return styles.cellNeutral;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 1. Header */}
        <Text style={styles.headerTitle}>Laporan Hasil Ujian</Text>
        <Text style={styles.headerSubtitle}>
          {candidateName || "Peserta"} · Paket {packageId?.toUpperCase() || "-"}{" "}
          ·{"  "}
          Percobaan {sessionLabel || "-"} · {result.examDate || "-"}
        </Text>
        <View style={styles.divider} />

        {/* 2. Skor total */}
        <View style={styles.scoreHeroBox}>
          <View>
            <Text style={styles.scoreHeroValue}>{result.totalScore}</Text>
            <Text style={styles.scoreHeroMax}>
              dari maksimal {result.maxScore}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{result.correct}</Text>
            <Text style={styles.statLabel}>BENAR</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{result.wrong}</Text>
            <Text style={styles.statLabel}>SALAH</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{result.unanswered}</Text>
            <Text style={styles.statLabel}>TIDAK DIJAWAB</Text>
          </View>
        </View>

        {/* 3. Skor per kategori (TKP dimasukkan di sini juga, sejajar TWK/TIU) */}
        <Text style={styles.sectionTitle}>Skor per Kategori</Text>
        {result.categories.map((cat) => (
          <View style={styles.categoryRow} key={cat.code}>
            <Text style={styles.categoryLabel}>
              {cat.label} ({cat.code})
            </Text>
            <Text style={styles.categoryScore}>
              {cat.score} / {cat.maxScore}
            </Text>
          </View>
        ))}
        {result.tkp && (
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>
              Tes Karakteristik Pribadi (TKP)
            </Text>
            <Text style={styles.categoryScore}>
              {result.tkp.score} / {result.tkp.maxScore}
            </Text>
          </View>
        )}

        {/* 4. Skor per topik */}
        <Text style={styles.sectionTitle}>Skor per Topik</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colTopic]}>Topik</Text>
            <Text style={[styles.tableHeaderCell, styles.colCategory]}>
              Kategori
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>
              Total Soal
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colScore]}>
              Total Benar
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colStatus]}>
              Predikat
            </Text>
          </View>
          {sortedByPctDesc.map((t) => (
            <View style={styles.tableRow} key={t.id} wrap={false}>
              <Text style={[styles.tableCell, styles.colTopic]}>{t.name}</Text>
              <Text style={[styles.tableCell, styles.colCategory]}>
                {t.groupCode}
              </Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {t.questionCount}
              </Text>
              <Text style={[styles.tableCell, styles.colScore]}>
                {t.scoreObtained}/{t.scoreMax}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colStatus,
                  predikatStyle(t.proficiencyLabel),
                ]}
              >
                {t.proficiencyLabel}
              </Text>
            </View>
          ))}
        </View>

        {/* 5. Kekuatan & kelemahan — SEMUA topik ditampilkan, dikelompokkan
            per level kemampuan (tidak dipotong top-3 lagi). */}
        <Text style={styles.sectionTitle} minPresenceAhead={80}>
          Analisis Kekuatan &amp; Kelemahan
        </Text>
        <View style={styles.strengthWeaknessWrap}>
          {tinggi.length > 0 && (
            <View style={[styles.swBox, styles.swBoxStrength]}>
              <Text style={styles.swTitle}>
                Kekuatan — Kemampuan Tinggi ({tinggi.length} topik)
              </Text>
              {tinggi.map((t) => (
                <View style={styles.swItemRow} key={t.id} wrap={false}>
                  <Text style={styles.swItemName}>
                    {t.name} ({t.groupCode})
                  </Text>
                  <Text style={styles.swItemPct}>
                    {t.scoreObtained}/{t.scoreMax} · {t.proficiencyPct}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          {cukup.length > 0 && (
            <View style={[styles.swBox, styles.swBoxNeutral]}>
              <Text style={styles.swTitle}>
                Kemampuan Cukup ({cukup.length} topik)
              </Text>
              {cukup.map((t) => (
                <View style={styles.swItemRow} key={t.id} wrap={false}>
                  <Text style={styles.swItemName}>
                    {t.name} ({t.groupCode})
                  </Text>
                  <Text style={styles.swItemPct}>
                    {t.scoreObtained}/{t.scoreMax} · {t.proficiencyPct}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          {perluDitingkatkan.length > 0 && (
            <View style={[styles.swBox, styles.swBoxWeakness]}>
              <Text style={styles.swTitle}>
                Kelemahan — Perlu Ditingkatkan ({perluDitingkatkan.length}{" "}
                topik)
              </Text>
              {perluDitingkatkan.map((t) => (
                <View style={styles.swItemRow} key={t.id} wrap={false}>
                  <Text style={styles.swItemName}>
                    {t.name} ({t.groupCode})
                  </Text>
                  <Text style={styles.swItemPct}>
                    {t.scoreObtained}/{t.scoreMax} · {t.proficiencyPct}%
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}