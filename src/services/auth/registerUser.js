import { supabase } from "../../lib/supabaseClient";

export async function registerUser({
  email,
  password,
  firstName,
  lastName,
  province,
  city,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        province,
        city,
      },
    },
  });

  return { data, error };
}