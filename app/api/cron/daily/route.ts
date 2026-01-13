
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { XMLParser } from "fast-xml-parser";

// ----------------------------------------------------------------------
// HELPER: MARKET UPDATE LOGIC
// ----------------------------------------------------------------------
async function fetchMockMarketData(symbol: string) {
    const basePrices: Record<string, number> = {
        AAPL: 185.00, MSFT: 420.00, TSLA: 240.00, SCHD: 78.50, O: 55.20,
        SPY: 480.00, QQQ: 410.00, NVDA: 650.00
    };

    const base = basePrices[symbol] || 100;
    const volatilty = base * 0.02; // 2% daily move
    const randomChange = (Math.random() * volatilty * 2) - volatilty;
    const close = base + randomChange;

    return {
        date: new Date().toISOString().split('T')[0],
        open: Number((close - (Math.random() * 2)).toFixed(2)),
        high: Number((close + (Math.random() * 1)).toFixed(2)),
        low: Number((close - (Math.random() * 3)).toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000)
    };
}

async function updatePrices(supabase: any, tickers: any[]) {
    let count = 0;
    for (const t of tickers) {
        try {
            const marketData = await fetchMockMarketData(t.symbol);
            const { error } = await supabase.from('prices_daily').upsert({
                symbol: t.symbol,
                date: marketData.date,
                open: marketData.open,
                high: marketData.high,
                low: marketData.low,
                close: marketData.close,
                volume: marketData.volume,
                source: 'cron_simulation'
            }, { onConflict: 'symbol,date' });

            if (!error) count++;
        } catch (e) {
            console.error(`Price Update Failed: ${t.symbol}`, e);
        }
    }
    return count;
}

// ----------------------------------------------------------------------
// HELPER: NEWS UPDATE LOGIC
// ----------------------------------------------------------------------
function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const textLower = text.toLowerCase();
    const positives = ['surge', 'soar', 'beat', 'profit', 'record', 'gain', 'bull', 'growth', 'hike', 'dividend'];
    const negatives = ['drop', 'fall', 'miss', 'loss', 'bear', 'crash', 'risk', 'debt', 'cut', 'war'];
    let score = 0;
    positives.forEach(w => { if (textLower.includes(w)) score++; });
    negatives.forEach(w => { if (textLower.includes(w)) score--; });
    return score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
}

function extractTickers(text: string, knownTickers: string[]): string[] {
    const found = new Set<string>();
    knownTickers.forEach(sym => {
        const regex = new RegExp(`\\b${sym}\\b|\\$${sym}`, 'i');
        if (regex.test(text)) found.add(sym);
    });
    return Array.from(found);
}

async function updateNews(supabase: any, knownSymbols: string[]) {
    const feeds = ["https://feeds.content.dowjones.io/public/rss/mw_top_stories"];
    const parser = new XMLParser();
    let count = 0;

    for (const url of feeds) {
        try {
            const res = await fetch(url, { next: { revalidate: 0 } });
            const xml = await res.text();
            const jsonObj = parser.parse(xml);
            const items = jsonObj.rss?.channel?.item || [];
            const articles = (Array.isArray(items) ? items : [items]).slice(0, 10);

            for (const art of articles) {
                if (!art.title) continue;
                const sentiment = analyzeSentiment(art.title + " " + art.description);
                const tags = extractTickers(art.title + " " + art.description, knownSymbols);

                const { error } = await supabase.from('news_items').upsert({
                    source: 'MarketWatch',
                    title: art.title,
                    url: art.link,
                    published_at: new Date(art.pubDate).toISOString(),
                    summary: (art.description || "").slice(0, 200) + "...",
                    sentiment: sentiment,
                    tickers: tags,
                }, { onConflict: 'url' });
                if (!error) count++;
            }
        } catch (e) {
            console.error("News Fetch Error", e);
        }
    }
    return count;
}

// ----------------------------------------------------------------------
// MAIN CRON HANDLER
// ----------------------------------------------------------------------
export async function GET(request: Request) {
    // Basic Auth Check (optional, Vercel verifies via header securely if configured)
    const supabase = getServiceSupabase();

    // 1. Fetch Tickers
    const { data: tickers } = await supabase.from('tickers').select('symbol');
    const knownSymbols = tickers?.map((t: any) => t.symbol) || [];

    if (knownSymbols.length === 0) {
        return NextResponse.json({ message: "No tickers found to update." });
    }

    // 2. Run Updates Sequentially (to save resources on hobby plan)
    const pricesUpdated = await updatePrices(supabase, tickers);
    const newsUpdated = await updateNews(supabase, knownSymbols);

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        summary: {
            prices_updated: pricesUpdated,
            news_items_processed: newsUpdated
        }
    });
}
