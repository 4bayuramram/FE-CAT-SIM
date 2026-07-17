import { supabase } from "../../lib/supabaseClient";

/**
 * searchSkdRankingByLocation — fitur "Cari Peringkat SKD per
 * Provinsi/Kota" (BEDA dari getSkdRanking.js, yang cuma widget
 * "peringkat saya" terbatas ke domisili sendiri).
 *
 * Scope pencarian bebas: user boleh cari provinsi/kota MANA PUN,
 * tidak dibatasi domisili sendiri.
 *
 * Mengembalikan 2 kelompok data:
 * 1. Statistik daerah yang dicari (murni dari peserta ASLI yang
 *    berdomisili di sana): total peserta, avg/median/min/max skor.
 * 2. Posisi HIPOTETIS user sendiri: skor rata-rata SKD user (real,
 *    dari attempt dia sendiri, TIDAK PEDULI domisili aslinya)
 *    dibandingkan ke pool peserta asli daerah yang dicari, seolah dia
 *    ikut ranking di situ ("kalau kamu di sini, kamu peringkat
 *    sekian dari sekian peserta").
 *
 * BACKEND YANG DIBUTUHKAN (belum ada, perlu dibuat -- lihat catatan
 * desain lengkap di handover 14 Jul 2026 bagian "Fitur Cari Peringkat
 * per Provinsi/Kota"): RPC SQL security-definer bernama
 * `search_skd_ranking_by_location(p_user_id uuid, p_location_type
 * text, p_location_value text)`.
 *
 * p_location_type: 'province' | 'city'
 * p_location_value: nama daerah PERSIS seperti tersimpan di
 *   user_profile.province/city (format label, mis. "DI Yogyakarta",
 *   bukan slug/id -- lihat src/pages/auth/constant/locationData.js
 *   dan registerUser.js/updateUserDomicile.js yang menyimpan
 *   `province?.label`). Frontend WAJIB pakai dropdown dari
 *   locationData.js, bukan free-text, supaya nilainya selalu match
 *   persis dengan yang tersimpan di DB.
 *
 * Gate akses & scoring HARUS identik dengan get_skd_ranking (attempt
 * pertama/'perdana' saja, category='skd', include_in_ranking=true,
 * normalisasi (score/sum(breakdown.*.maxScore))*100 di-avg lintas
 * paket) -- supaya angka "skor rata-rata SKD user" di fitur ini
 * konsisten dengan widget "peringkat saya" di Dashboard. RPC ini
 * TIDAK menggantikan get_skd_ranking, cuma menambahkan cakupan
 * pencarian bebas di atas logika skor yang sama.
 *
 * Sebelum RPC ini dibuat di Supabase, panggilan akan gagal (function
 * belum ada) dan fungsi ini mengembalikan { data: null, error } --
 * LeaderboardLocationSearchSection sudah menangani ini dengan pesan
 * "fitur belum tersedia", BUKAN layar error, jadi aman dipanggil dari
 * sekarang.
 */
export async function searchSkdRankingByLocation({
  userId,
  locationType,
  locationValue,
}) {
  if (!userId || !locationType || !locationValue) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase.rpc("search_skd_ranking_by_location", {
    p_user_id: userId,
    p_location_type: locationType,
    p_location_value: locationValue,
  });

  if (error) {
    return { data: null, error };
  }

  // RPC mengembalikan 1 baris (bukan array multi-scope seperti
  // get_skd_ranking, karena di sini cuma 1 daerah yang dicari sekaligus).
  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    return { data: null, error: null };
  }

  return {
    data: {
      locationType,
      locationValue,
      region: {
        totalParticipants: row.total_participants ?? 0,
        avgScore: row.avg_score ?? null,
        medianScore: row.median_score ?? null,
        minScore: row.min_score ?? null,
        maxScore: row.max_score ?? null,
      },
      // null kalau user belum pernah kerjain paket SKD sama sekali
      // (gate sama seperti get_skd_ranking) -- frontend tampilkan CTA
      // "kerjakan paket SKD dulu", bukan angka 0 yang menyesatkan.
      yourPosition: row.user_avg_score == null
        ? null
        : {
            avgScore: row.user_avg_score,
            // BARU (revisi Bayesian shrinkage, 16 Jul 2026) — lihat
            // catatan sama di getSkdRanking.js.
            jumlahPaket: row.user_jumlah_paket ?? null,
            hypotheticalRank: row.user_hypothetical_rank,
            hypotheticalTotal: row.user_hypothetical_total,
            percentile:
              row.user_hypothetical_rank != null && row.user_hypothetical_total
                ? Math.max(
                    1,
                    Math.round(
                      (row.user_hypothetical_rank / row.user_hypothetical_total) * 100
                    )
                  )
                : null,
          },
    },
    error: null,
  };
}
