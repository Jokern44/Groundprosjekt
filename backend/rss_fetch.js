import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const parser = new Parser();

const feeds = [
  "https://www.nrk.no/toppsaker.rss",
  "https://www.aftenposten.no/rss",
];

async function fetchAndStore() {
  for (let feedUrl of feeds) {
    try {
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
    } catch (err) {
      console.error("Error fetching feed", feedUrl, err);
    }
  }
  console.log("RSS fetch done");
}

fetchAndStore();
