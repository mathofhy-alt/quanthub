
import { supabase } from "@/lib/supabase";

// --- Types ---
export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: string; // Simplified for display
    peRatio: number;
    dividendYield: number;
    sector: string;
    description: string;
}

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    tickers: string[];
    sentiment: "positive" | "negative" | "neutral";
    imageUrl?: string;
}

// --- Real Data Implementations ---

export async function getStockData(symbol?: string) {
    if (!symbol) return null;

    const { data: ticker } = await supabase
        .from('tickers')
        .select('*')
        .eq('symbol', symbol.toUpperCase())
        .single();

    if (!ticker) return null;

    // 2. Fetch Latest Price
    const { data: priceData } = await supabase
        .from('prices_daily')
        .select('*')
        .eq('symbol', symbol.toUpperCase())
        .order('date', { ascending: false })
        .limit(2); // Get today and yesterday for change calc

    const current = priceData?.[0];
    const prev = priceData?.[1];

    // Fallback if no price data (Seed/Mock scenario handling)
    const price = current?.close ?? 150;
    const prevPrice = prev?.close ?? 148;
    const change = price - prevPrice;
    const changePercent = (change / prevPrice) * 100;

    // 3. Fetch Dividend Info (Simplified Yield Calc)
    const { data: divData } = await supabase
        .from('dividends')
        .select('amount, frequency')
        .eq('symbol', symbol.toUpperCase())
        .order('ex_date', { ascending: false })
        .limit(1)
        .single();

    let annualDiv = 0;
    if (divData) {
        // Simple estimation: last amount * 4 (if quarterly)
        // In prod, check 'frequency' field
        annualDiv = Number(divData.amount) * (divData.frequency === 'monthly' ? 12 : 4);
    }
    const yieldPercent = (annualDiv / price) * 100;

    return {
        symbol: ticker.symbol,
        name: ticker.name,
        price: Number(price),
        change: Number(change),
        changePercent: Number(changePercent),
        marketCap: "N/A", // Would need shares_outstanding field
        peRatio: 0, // Would need earnings data
        dividendYield: Number(yieldPercent.toFixed(2)),
        sector: ticker.sector ?? "Unknown",
        description: `Automated analysis for ${ticker.name}.`,
    };
}

export async function getRelatedNews(symbol: string): Promise<NewsItem[]> {
    const { data } = await supabase
        .from('news_items')
        .select('*')
        .contains('tickers', [symbol.toUpperCase()])
        .order('published_at', { ascending: false })
        .limit(5);

    if (!data || data.length === 0) {
        // If no specific news, fallback to general news
        const { data: general } = await supabase
            .from('news_items')
            .select('*')
            .limit(3);
        return (general as any) || [];
    }

    return (data as any).map((item: any) => ({
        ...item,
        sentiment: item.sentiment ?? "neutral"
    }));
}

export async function getTickers() {
    const { data } = await supabase.from('tickers').select('*').limit(20);
    return data || [];
}

export async function getTopTickers(limit: number = 100) {
    // Used for SSG: Only pre-build the most popular pages
    // Assumes 'market_cap' or similar ranking field exists, or sorts by symbol
    const { data } = await supabase
        .from('tickers')
        .select('symbol')
        .limit(limit);
    // .order('market_cap', { ascending: false }); // Future enhancement
    return data || [];
}

export async function getRelatedTickers(sector: string, currentSymbol: string, limit: number = 6) {
    // Used for Internal Linking
    const { data } = await supabase
        .from('tickers')
        .select('symbol, name, type')
        .eq('sector', sector)
        .neq('symbol', currentSymbol.toUpperCase())
        .limit(limit);
    return data || [];
}
