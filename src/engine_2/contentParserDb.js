/**
 * contentParserDb.js  (EXTENDED v2)
 *
 * Tanggung jawab (tidak berubah dari versi sebelumnya):
 * - Menerjemahkan field `content` (JSONB) dari get-questions/resume-session
 *   menjadi struktur siap-render, ditandai `parsed`.
 * - Type tak dikenal -> `unsupported` eksplisit, tidak pernah gagal diam-diam.
 *
 * PATCH v2 (fix tampil semua soal skd-002):
 * - Ditemukan dari data asli tabel `questions`: field isi soal SELALU
 *   `content.text`, bukan `content.soal`. Semua helper baca text di bawah
 *   pakai fallback `content.text ?? content.soal ?? ""` supaya kompatibel
 *   dua-duanya (jaga-jaga kalau ada data lama/masa depan yang masih pakai
 *   `soal`).
 * - Ditambah type `single_choice`: dipakai utk 2 bentuk soal berbeda di
 *   database -> soal biasa `{text}` ATAU soal bacaan `{text, ditanya,
 *   textref}` (mis. nomor 5 TWK Bahasa Indonesia). Dibedakan otomatis dari
 *   ada/tidaknya field `ditanya`/`textref` di content, BUKAN dari nama type,
 *   karena type-nya sama-sama "single_choice" di database.
 * - Ditambah type `scoring` (soal TKP, nomor 11-15): bentuk content sama
 *   seperti single_choice biasa (`{text}`), tapi TIDAK terkait scoring
 *   engine sama sekali -> scoring TKP tetap 100% dikendalikan
 *   `scoring_map` di tabel `package_answer_keys` (independen dari type ini).
 * - 5 type lama (standar/bacaan/bacaan2/sequence/table) TIDAK diubah
 *   perilakunya untuk data yang memang sudah pakai `soal`, jadi non-breaking.
 *
 * Kalau di masa depan ada type baru lagi: cukup tambah entri di sini +
 * komponen render-nya di QuestionRendererPaid (aturan "satu paket
 * pekerjaan" yang sudah disepakati di dokumen arsitektur).
 */

// Helper kecil: baca teks soal dari content.text (skema asli DB) dengan
// fallback ke content.soal (skema lama/dokumentasi awal).
function readSoalText(content) {
  return content.text ?? content.soal ?? "";
}

const KNOWN_TYPES = {
  standar: {
    requiredFields: [], // fleksibel: terima "soal" ATAU "text"
    shape: (content) => ({
      variant: "standar",
      soal: readSoalText(content),
    }),
  },
  bacaan: {
    requiredFields: ["textref", "ditanya"], // teks soal dicek terpisah (soal/text)
    shape: (content) => ({
      variant: "bacaan",
      textref: content.textref ?? "",
      soal: readSoalText(content),
      ditanya: content.ditanya ?? "",
    }),
  },
  bacaan2: {
    requiredFields: ["textref", "p1", "p2", "ditanya"],
    shape: (content) => ({
      variant: "bacaan2",
      textref: content.textref ?? "",
      p1: content.p1 ?? "",
      p2: content.p2 ?? "",
      ditanya: content.ditanya ?? "",
    }),
  },

  sequence: {
    requiredFields: [], // soal = array item urutan/pola
    shape: (content) => ({
      variant: "sequence",
      soal: Array.isArray(content.soal) ? content.soal : [],
      pertanyaan: content.pertanyaan ?? "",
    }),
  },
  table: {
    requiredFields: ["table"], // table = { headers: [], rows: [][] }
    shape: (content) => ({
      variant: "table",
      soal: readSoalText(content),
      table: content.table ?? null,
      pertanyaan: content.pertanyaan ?? "",
    }),
  },

  // --- BARU (v2) ---
  single_choice: {
    requiredFields: ["text"],
    // Satu type di DB, dua bentuk render: soal biasa vs soal bacaan.
    // Dibedakan dari ada/tidaknya ditanya/textref di content, bukan dari type.
    shape: (content) => {
      const isBacaan = "ditanya" in content || "textref" in content;
      if (isBacaan) {
        return {
          variant: "bacaan",
          textref: content.textref ?? "",
          soal: readSoalText(content),
          ditanya: content.ditanya ?? "",
        };
      }
      return {
        variant: "standar",
        soal: readSoalText(content),
      };
    },
  },
  scoring: {
    // Soal TKP. Field "type" ini TIDAK terkait scoring engine sama sekali —
    // penilaian TKP sepenuhnya dari scoring_map di package_answer_keys.
    requiredFields: ["text"],
    shape: (content) => ({
      variant: "standar",
      soal: readSoalText(content),
    }),
  },
};

function parseQuestion(rawQuestion) {
  const { type, content } = rawQuestion;
  const typeDef = KNOWN_TYPES[type];

  if (!typeDef) {
    return {
      ...rawQuestion,
      parsed: {
        variant: "unsupported",
        reason: `type "${type}" belum didukung parser`,
        rawContent: content,
      },
    };
  }

  if (typeof content !== "object" || content === null) {
    return {
      ...rawQuestion,
      parsed: {
        variant: "unsupported",
        reason: `content untuk type "${type}" bukan objek`,
        rawContent: content,
      },
    };
  }

  const missingFields = typeDef.requiredFields.filter(
    (field) => !(field in content)
  );

  if (missingFields.length > 0) {
    return {
      ...rawQuestion,
      parsed: {
        ...typeDef.shape(content),
        incomplete: true,
        missingFields,
      },
    };
  }

  return {
    ...rawQuestion,
    parsed: typeDef.shape(content),
  };
}

function parseQuestions(rawQuestions) {
  if (!Array.isArray(rawQuestions)) {
    throw new Error("contentParserDb.parseQuestions: rawQuestions harus array");
  }
  return rawQuestions.map(parseQuestion);
}

function isTypeSupported(type) {
  return Object.prototype.hasOwnProperty.call(KNOWN_TYPES, type);
}

export { parseQuestion, parseQuestions, isTypeSupported, KNOWN_TYPES };