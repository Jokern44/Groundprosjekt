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

async function fetchAndStore() {
  for (let feedUrl of feeds) {
    const feed = await parser.parseURL(feedUrl);
    for (let item of feed.items) {
      await supabase.from("articles").upsert({
        title: item.title,
        link: item.link,
        source: feedUrl,
        published_at: item.pubDate,
        summary: item.contentSnippet,
      });
    }
  }
  console.log("RSS fetch done");
}

fetchAndStore();
