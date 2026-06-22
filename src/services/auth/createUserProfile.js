import { supabase } from "../../lib/supabaseClient";

export async function createUserProfile(user) {
  const { error } = await supabase.from("user_profile").insert([
    {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || "",
      last_name: user.user_metadata?.last_name || "",
      province: user.user_metadata?.province || null,
      city: user.user_metadata?.city || null,
      auth_provider: user.app_metadata?.provider || "email",
    },
  ]);

  return { error };
}
