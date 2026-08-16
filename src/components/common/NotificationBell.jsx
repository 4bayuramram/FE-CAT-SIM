import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

/**
 * NotificationBell — icon lonceng + badge unread + dropdown notifikasi.
 * Realtime via Supabase Realtime (subscribe INSERT/UPDATE tabel
 * `notifications` khusus userId). Scope awal: exam_result, struktur
 * generik untuk type lain tanpa ubah komponen.
 *
 * @param {string|null} userId - kalau null, komponen tidak render apa-apa.
 */
export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [prevUserId, setPrevUserId] = useState(userId);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Reset list saat userId hilang (logout) — dihitung saat render,
  // bukan di effect, supaya tidak ada extra render/cascading update.
  if (userId !== prevUserId) {
    setPrevUserId(userId);
    if (!userId) setNotifications([]);
  }

  // Ambil notif awal + subscribe realtime insert/update selama
  // komponen mount & userId ada.
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    async function fetchInitial() {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("id, type, title, message, link, is_read, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!isMounted) return;
      if (!error) setNotifications(data ?? []);
      setLoading(false);
    }

    fetchInitial();

    // Topic diberi suffix unik per-mount (bukan cuma userId) supaya tidak
    // bentrok dengan channel lama yang belum selesai di-teardown (async).
    // Tanpa ini, StrictMode dev double-invoke effect bikin .on() throw
    // "cannot add postgres_changes callbacks ... after subscribe()".
    const channel = supabase
      .channel(`notifications:${userId}:${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new : n))
          );
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Tutup dropdown kalau klik di luar.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);
  }

  function handleClickNotif(notif) {
    if (!notif.is_read) markAsRead(notif.id);
    setOpen(false);
    if (notif.link) navigate(notif.link);
  }

  // stopPropagation supaya klik X tidak ikut trigger handleClickNotif.
  async function deleteNotif(e, id) {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notifications").delete().eq("id", id);
  }

  // Butuh RLS policy DELETE (notifications_delete_policy.sql) — tanpa
  // itu request diblokir RLS, tidak menghapus apa pun.
  async function clearAll() {
    if (notifications.length === 0) return;
    const prevNotifications = notifications;
    setNotifications([]);
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId);
    if (error) {
      console.error("Gagal membersihkan notifikasi:", error.message);
      setNotifications(prevNotifications);
    }
  }

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notifikasi"
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-80 max-w-[90vw] rounded-xl bg-white text-[#12345b] shadow-xl border border-gray-100 overflow-hidden font-sans z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Notifikasi</p>
            <div className="flex items-center gap-3 flex-shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Tandai semua dibaca
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-red-500 hover:underline"
                >
                  Bersihkan semua
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">
                Memuat...
              </p>
            )}

            {!loading && notifications.length === 0 && (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">
                Belum ada notifikasi.
              </p>
            )}

            {!loading &&
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => handleClickNotif(notif)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition flex gap-2 ${
                    !notif.is_read ? "bg-blue-50/50" : ""
                  }`}
                >
                  {!notif.is_read && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">
                      {notif.title}
                    </p>
                    {notif.message && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notif.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <span
                    role="button"
                    aria-label="Hapus notifikasi"
                    onClick={(e) => deleteNotif(e, notif.id)}
                    className="flex-shrink-0 text-gray-300 hover:text-red-500 text-lg leading-none px-1"
                  >
                    ×
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
