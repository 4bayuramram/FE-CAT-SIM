-- RPC get_my_exam_breakdown() -- dibutuhkan DashboardScoreSummaryTable
-- (kolom TWK/TIU/TKP + status Lulus/Gagal di dashboard > Hasil).
-- Lihat getMyExamBreakdown.js untuk sisi client.
--
-- exam_results RLS aktif TANPA policy sama sekali (sengaja, lihat
-- getPackageLeaderboard.js), jadi client tidak bisa baca tabel ini
-- langsung sama sekali -- termasuk baris milik diri sendiri. RPC ini
-- security definer, jadi bisa baca exam_results dari dalam, tapi
-- SELALU di-scope ke auth.uid() milik caller sendiri (bukan terima
-- p_user_id dari client) -- tidak boleh dipakai untuk intip breakdown
-- user lain.
--
-- Asumsi skema (sesuaikan nama kolom kalau beda di project ini):
--   exam_results(user_id uuid, package_id uuid, breakdown jsonb,
--                 attempt_type text, created_at timestamptz)
-- CATATAN: exam_results.package_id ternyata bertipe text (bukan uuid)
-- di project ini -- makanya ada ::uuid cast di SELECT-nya, biar cocok
-- sama return type function (uuid, dipakai buat di-Map() sisi client
-- pakai package_id yang juga uuid dari tabel packages). Kalau
-- package_id.text di exam_results kamu TERNYATA bukan representasi
-- uuid valid (mis. beda format id), hapus ::uuid dan ganti tipe kolom
-- returns table jadi `package_id text` -- getMyExamBreakdown.js tidak
-- perlu berubah karena cuma pakai package_id sebagai key Map, tidak
-- peduli tipe aslinya text/uuid.
-- breakdown jsonb shape: { "TWK": {"score": ..}, "TIU": {"score": ..},
--                          "TKP": {"score": ..} } -- hanya key kategori
-- yang memang ada soalnya di paket itu.
--
-- Jalankan lewat Supabase SQL editor atau migration tool kamu.

create or replace function public.get_my_exam_breakdown()
returns table (
  package_id uuid,
  breakdown jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    er.package_id::uuid,
    er.breakdown
  from exam_results er
  where er.user_id = auth.uid()
    and er.attempt_type = 'perdana' -- attempt pertama saja, sama seperti
                                     -- get_package_leaderboard/get_skd_ranking
    and er.breakdown is not null;
$$;

-- Cuma boleh dipanggil user yang sudah login (auth.uid() butuh sesi
-- aktif) -- role anon tidak perlu akses ini sama sekali.
revoke all on function public.get_my_exam_breakdown() from public;
grant execute on function public.get_my_exam_breakdown() to authenticated;
