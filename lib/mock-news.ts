
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

export const MOCK_NEWS: NewsItem[] = [
    {
        id: "1",
        title: "Fed Signals Potential Rate Cuts in Late 2025",
        summary: "Jerome Powell hints that inflation data is cooling faster than expected, opening the door for rate cuts. This is bullish for growth stocks and REITs.",
        source: "Bloomberg",
        published_at: "2026-01-14T09:00:00Z",
        tickers: ["SPY", "TLT", "O"],
        sentiment: "positive",
        imageUrl: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "2",
        title: "Apple Announces New AI Integration for iPhone 17",
        summary: "The tech giant revealed its proprietary 'Apple Intelligence' chip, promising to revolutionize on-device processing.",
        source: "TechCrunch",
        published_at: "2026-01-14T08:30:00Z",
        tickers: ["AAPL", "QQQ"],
        sentiment: "positive",
        imageUrl: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "3",
        title: "Oil Prices Surge Amidst Geopolitical Tensions",
        summary: "Supply chain disruptions in the Middle East have caused crude oil futures to jump 4% overnight.",
        source: "Reuters",
        published_at: "2026-01-14T07:15:00Z",
        tickers: ["XLE", "USO", "CVX"],
        sentiment: "negative"
    },
    {
        id: "4",
        title: "Tesla CyberCab Production Delayed to Q4",
        summary: "Production challenges have pushed back the release of the autonomous taxi fleet, disappointing investors.",
        source: "CNBC",
        published_at: "2026-01-13T22:00:00Z",
        tickers: ["TSLA"],
        sentiment: "negative"
    },
    {
        id: "5",
        title: "Dividend Aristocrats Outlook for 2026",
        summary: "Why defensive sectors are becoming attractive again as the economy normalizes.",
        source: "Morningstar",
        published_at: "2026-01-13T18:00:00Z",
        tickers: ["SCHD", "VIG", "NOBL"],
        sentiment: "neutral"
    }
];
