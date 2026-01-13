# 1. 사이트 전체 구조 설계 (Site Architecture)

## 1.1 핵심 정체성
- **Type**: Investment Data & Tool Hub (Not a Blog)
- **Target**: Global & Domestic Investors looking for quick data/calcs
- **Profit Model**: High RPM AdSense (Finance Keywords)

## 1.2 Sitemap Structure

### Core Sections
1.  **`/stocks` (Stock Hub)**
    *   `/stocks/us/[symbol]`: Real-time price, dividend data, generated news summary.
    *   `/stocks/kr/[code]`: Domestic stock equivalent.
    *   *Features*: Sticky header with price, Auto-generated "Briefing" section.

2.  **`/etf` (ETF Intelligence)**
    *   `/etf/compare`: QQQ vs SCHD etc. (Comparison Table).
    *   `/etf/theme/[theme]`: "AI", "Dividend", "Chip" ETF lists.
    *   *Features*: Rebalancing visualizer, Expense ratio calculator.

3.  **`/tools` (Revenue Engine)**
    *   **Calculators**: Dividend, Compound, Tax, Fire.
    *   *URL Persistence*: `?principal=10000&rate=5` -> Generates shareable/indexable URL.
    *   *Layout*: Ad-heavy zone (Top, Side, Bottom of result).

4.  **`/news` (Auto-Aggregation)**
    *   Summarized news linked to related Stokcs/ETFs.
    *   Use NLP to tag tickers automatically.

5.  **`/data` (Macro)**
    *   Visual charts for Fed Rates, CPI, Sector Rotation.

## 1.3 Tech Stack Implementation
- **Frontend**: Next.js 15 (App Router)
    - `layout.tsx`: Global Shell
    - `page.tsx`: Specific Views
- **Database**: Supabase
    - `stocks`: ticker, name, price, last_updated
    - `news`: id, title, summary, related_tickers[]
- **Deploy**: Vercel
- **Styling**: Tailwind CSS (Premium Dark Mode Default)
