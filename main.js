import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uputgeqzixncefxjzdkz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdXRnZXF6aXhuY2VmeGp6ZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDQwNTYsImV4cCI6MjA4ODcyMDA1Nn0.d_N3g5r7ZbKkQhXFPf3e3LgCOY1ommZSGdILwgGZy7E";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function loadArticles() {
  const { data: articles, error } = await supabaseClient
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(20);

  console.log("Articles:", articles, "Error:", error);
}

loadArticles();
