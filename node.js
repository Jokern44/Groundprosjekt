import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "DIN_SUPABASE_URL";
const supabaseKey = "DIN_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const parser = new Parser();

const feeds = [
  "https://www.nrk.no/toppsaker.rss",
  "https://www.aftenposten.no/rss",
];

function safeUrl(value, base) {
  if (!value) return null;
  try {
    const url = base ? new URL(value, base) : new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function pickImageUrl(item) {
  const candidates = [
    item.image,
    item.imageUrl,
    item.enclosure?.url,
    item["media:content"]?.url,
    item["media:thumbnail"]?.url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  const content = item.content || item["content:encoded"] || "";
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

async function fetchImageFromArticlePage(link) {
  if (!link || typeof fetch !== "function") return null;

  try {
    const response = await fetch(link, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const metaMatch = html.match(
      /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i,
    );

    return safeUrl(metaMatch?.[1], link);
  } catch {
    return null;
  }
}

async function fetchAndStore() {
  for (let feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      console.log(`\nFetching from ${feedUrl}: ${feed.items.length} items`);
      
      for (let item of feed.items) {
        let imageUrl = null;
        
        // Try RSS image first
        imageUrl = pickImageUrl(item);
        if (imageUrl) {
          console.log(`✓ ${item.title.substring(0, 40)}... → RSS image found`);
        } else {
          // Try scraping article page
          console.log(`  ${item.title.substring(0, 40)}... → No RSS image, scraping page...`);
          try {
            imageUrl = await fetchImageFromArticlePage(item.link);
            if (imageUrl) {
              console.log(`  ✓ Scraped og:image from article page`);
            } else {
              console.log(`  ✗ No image found on article page`);
            }
          } catch (scrapeErr) {
            console.log(`  ✗ Scrape error: ${scrapeErr.message}`);
          }
        }

        await supabase.from("articles").upsert({
          title: item.title,
          link: item.link,
          source: feedUrl,
          published_at: item.pubDate,
          summary: item.contentSnippet,
          image_url: imageUrl,
        });
      }
    } catch (err) {
      console.error("Error fetching feed", feedUrl, err);
    }
  }
  console.log("\n✓ RSS fetch done");
}

fetchAndStore();
