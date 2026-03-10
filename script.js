import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uputgeqzixncefxjzdkz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdXRnZXF6aXhuY2VmeGp6ZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDQwNTYsImV4cCI6MjA4ODcyMDA1Nn0.d_N3g5r7ZbKkQhXFPf3e3LgCOY1ommZSGdILwgGZy7E"; // kun lese-tilgang

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadArticles() {
  console.log("Henter artikler...");
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(20);

  console.log("Articles:", articles, "Error:", error);

  const container = document.getElementById("articles");
  if (error) {
    container.innerText = "Error fetching articles: " + error.message;
    return;
  }

  container.innerHTML = "";
  articles.forEach((a) => {
    const div = document.createElement("div");
    div.className = "article";
    div.innerHTML = `
            <a href="${a.link}" target="_blank">${a.title}</a>
            <small>${a.source} | ${new Date(a.published_at).toLocaleString()}</small>
        `;
    container.appendChild(div);
  });
}

loadArticles();
