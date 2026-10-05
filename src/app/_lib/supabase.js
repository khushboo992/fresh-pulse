import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://aiqlfhilmvyorsxforab.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcWxmaGlsbXZ5b3JzeGZvcmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMjE1NDEsImV4cCI6MjEwNjY5NzU0MX0.EaDc88vGgXVeIIbPamGNLy3ZpxLUEH-ckuOqIkAX7Eg";

// Export as named export for import { supabase }
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export as default export for import supabase
export default supabase;
