import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://uputgeqzixncefxjzdkz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdXRnZXF6aXhuY2VmeGp6ZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDQwNTYsImV4cCI6MjA4ODcyMDA1Nn0.d_N3g5r7ZbKkQhXFPf3e3LgCOY1ommZSGdILwgGZy7E";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

function safeUrl(value) {
  if (!value) return null;
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

async function loadArticles() {
  const status = document.getElementById("status");
  const container = document.getElementById("articles");

  try {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(30);

    if (error) throw error;

    if (!data?.length) {
      status.textContent = "Ingen artikler funnet.";
      container.innerHTML = "";
      return;
    }

    status.textContent = "";
    container.innerHTML = "";

    data.forEach((article) => {
      const card = document.createElement("article");
      card.className = "article";

      const imageUrl =
        safeUrl(article.image_url) ||
        safeUrl(article.og_image) ||
        safeUrl(article.image);

      if (imageUrl) {
        const img = document.createElement("img");
        img.className = "article-image";
        img.src = imageUrl;
        img.alt = article.title || "Artikkelbilde";
        img.loading = "lazy";
        card.appendChild(img);
      }

      const title = document.createElement("a");
      title.className = "article-title";
      title.href = safeUrl(article.link) || "#";
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      title.textContent = article.title || "Uten tittel";

      const meta = document.createElement("p");
      meta.className = "article-meta";
      const source = article.source || "Ukjent kilde";
      const date = article.published_at
        ? new Date(article.published_at).toLocaleString("no-NO")
        : "Ingen dato";
      meta.textContent = `${source} • ${date}`;

      card.appendChild(title);
      card.appendChild(meta);
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    status.textContent = `Feil ved henting av artikler: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", loadArticles);
