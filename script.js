const supabaseUrl = "DIN_SUPABASE_URL";
const supabaseKey = "DIN_ANON_KEY";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadArticles() {
  let { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(20);

  const container = document.getElementById("articles");
  articles.forEach((a) => {
    const div = document.createElement("div");
    div.className = "article";
    div.innerHTML = `<a href="${a.link}" target="_blank">${a.title}</a><small>${a.source} | ${new Date(a.published_at).toLocaleString()}</small>`;
    container.appendChild(div);
  });
}

loadArticles();
