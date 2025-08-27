// app/api/rss/route.js
import Parser from 'rss-parser';

export async function GET() {
  const parser = new Parser();

  try {
    const feed = await parser.parseURL('https://www.analyticsvidhya.com/blog/category/deep-learning/feed/');
    const articles = feed.items.map((item, index) => ({
      id: index,
      title: item.title,
      excerpt: item.contentSnippet,
      date: item.pubDate,
      author: item.creator || "Analytics Vidhya",
      link: item.link,
    }));

    return Response.json({ articles });
  } catch (error) {
    console.error("RSS fetch error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch RSS feed" }), { status: 500 });
  }
}
