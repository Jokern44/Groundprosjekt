import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://uputgeqzixncefxjzdkz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdXRnZXF6aXhuY2VmeGp6ZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDQwNTYsImV4cCI6MjA4ODcyMDA1Nn0.d_N3g5r7ZbKkQhXFPf3e3LgCOY1ommZSGdILwgGZy7E";

const supabaseClient = createClient(supabaseUrl, supabaseKey);

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadArticles() {
  const status = document.getElementById("status");
  const container = document.getElementById("articles");

  try {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    if (!data || data.length === 0) {
      status.textContent = "Ingen artikler funnet.";
      container.innerHTML = "";
      return;
    }

    status.textContent = "";
    container.innerHTML = "";

    data.forEach((article) => {
      const item = document.createElement("article");
      item.className = "article";

      const title = escapeHtml(article.title || "Uten tittel");
      const link = article.link || "#";
      const source = escapeHtml(article.source || "Ukjent kilde");
      const date = article.published_at
        ? new Date(article.published_at).toLocaleString("no-NO")
        : "Ingen dato";

      item.innerHTML = `
        <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
        <br />
        <small>${source} | ${date}</small>
      `;

      container.appendChild(item);
    });
  } catch (err) {
    console.error(err);
    status.textContent = "Feil ved henting av artikler: " + err.message;
  }
}

document.addEventListener("DOMContentLoaded", loadArticles);
