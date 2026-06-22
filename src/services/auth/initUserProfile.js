import { supabase } from "../../lib/supabaseClient";
import { createUserProfile } from "./createUserProfile";

export async function initUserProfile() {
  const { data } = await supabase.auth.getUser();

  const user = data?.user;
  if (!user) return;

  // cek apakah profile sudah ada
  const { data: profile } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // kalau belum ada → buat
  if (!profile) {
    await createUserProfile(user);
  }
}
