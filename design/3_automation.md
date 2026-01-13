# 3. 자동화 및 데이터 흐름 (Automation Engine)

## 3.1 Architecture Diagram
[Data Source] --> [Cron Job] --> [Supabase DB] --> [Revalidation Webhook] --> [Next.js ISR]

## 3.2 Automation Pipelines

### A. News Aggregation (Every 1 Hour)
1.  **Fetch**: APIs (AlphaVantage, Yahoo, Naver Finance).
2.  **Filter**: Keyword match (Dividend, Earnings, Crisis).
3.  **Tagging**: Extract Tickers (e.g., "Apple" -> AAPL).
4.  **Store**: Save to `news` table.
5.  **Trigger**: If 'Major News', trigger `revalidateTag('news')`.

### B. Stock Price Update (Every day close / Real-time limit)
1.  **Batch Fetch**: Get end-of-day data for tracked 500 tickers.
2.  **Update DB**: Update `price`, `change_percent`.
3.  **Compute**: Update "Top Gainers" / "Top Losers" cache.

### C. Content Generation (SEO Factory)
1.  **Input**: New Dividend Data.
2.  **Template**: "AAPL Dividend History & 2025 Forecast".
3.  **Generate**: Create JSON for the page content.
4.  **Deploy**: Page becomes available via Dynamic Route.

## 3.3 Internal Linking Graph
- Every Stock page links to:
    - Sector Peers (AAPL -> MSFT, GOOGL).
    - ETFs holding this stock (AAPL -> QQQ, SPY).
    - Recent News.
- Every Calculator result links to:
    - Relevant ETFs (Tax calc -> Tax-efficient ETFs).
