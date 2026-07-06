import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://tamhksushncmctidjlnd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbWhrc3VzaG5jbWN0aWRqbG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NDc1MjksImV4cCI6MjA5NzQyMzUyOX0.NEqL5fHrJPEUUPgKBsf6LVfVoclz_gG1ORmILL5vF8c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
