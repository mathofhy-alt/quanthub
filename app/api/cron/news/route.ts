
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { XMLParser } from "fast-xml-parser";

// Helper: Basic Sentiment Analysis
function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const textLower = text.toLowerCase();
    const positives = ['surge', 'soar', 'beat', 'profit', 'record', 'gain', 'bull', 'growth', 'hike', 'dividend'];
    const negatives = ['drop', 'fall', 'miss', 'loss', 'bear', 'crash', 'risk', 'debt', 'cut', 'war'];

    let score = 0;
    positives.forEach(w => { if (textLower.includes(w)) score++; });
    negatives.forEach(w => { if (textLower.includes(w)) score--; });

    if (score > 0) return "positive";
    if (score < 0) return "negative";
    return "neutral";
}

// Helper: Ticker Extraction (Regex basic)
function extractTickers(text: string, knownTickers: string[]): string[] {
    const found = new Set<string>();
    // Look for exact matches or $SYMBOL
    knownTickers.forEach(sym => {
        const regex = new RegExp(`\\b${sym}\\b|\\$${sym}`, 'i');
        if (regex.test(text)) found.add(sym);
    });
    return Array.from(found);
}

export async function GET(request: Request) {
    const supabase = getServiceSupabase();

    // 1. Get Known Tickers for tagging
    const { data: tickerTypes } = await supabase.from('tickers').select('symbol');
    const knownSymbols = tickerTypes?.map(t => t.symbol) || [];

    // 2. Fetch RSS Feeds (e.g. Yahoo Finance)
    // Using a public RSS proxy or direct fetch if CORS allows server-side
    const feeds = [
        "https://feeds.content.dowjones.io/public/rss/mw_top_stories", // MarketWatch
        // "https://finance.yahoo.com/news/rssindex" // Often flaky, using MW for stability
    ];

    let articles = [];
    const parser = new XMLParser();

    try {
        for (const url of feeds) {
            const res = await fetch(url, { next: { revalidate: 0 } });
            const xml = await res.text();
            const jsonObj = parser.parse(xml);

            const items = jsonObj.rss?.channel?.item || [];
            // Normalizing
            const normalized = (Array.isArray(items) ? items : [items]).map((item: any) => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                description: item.description || ""
            })).slice(0, 10); // Limit to top 10 per feed

            articles.push(...normalized);
        }
    } catch (e) {
        console.error("RSS Fetch Error", e);
        return NextResponse.json({ error: 'Failed to fetch RSS', details: e }, { status: 500 });
    }

    // 3. Process & Insert
    let processedCount = 0;

    for (const art of articles) {
        if (!art.title) continue;

        const sentiment = analyzeSentiment(art.title + " " + art.description);
        const tags = extractTickers(art.title + " " + art.description, knownSymbols);

        const { error } = await supabase.from('news_items').upsert({
            source: 'MarketWatch', // dynamic based on feed
            title: art.title,
            url: art.link, // Unique Key
            published_at: new Date(art.pubDate).toISOString(),
            summary: art.description.slice(0, 200) + "...",
            sentiment: sentiment,
            tickers: tags,
        }, {
            onConflict: 'url'
        });

        if (!error) processedCount++;
    }

    return NextResponse.json({
        message: 'News Sync Complete',
        processed: processedCount
    });
}
