
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load Env
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
} catch (e) {
    console.log("Could not load local env");
}

async function seed() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error("Missing standard Supabase environment variables.");
        console.error("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
        process.exit(1);
    }

    const supabase = createClient(url, key);

    console.log("🌱 Starting Seed...");

    // 1. Seed Tickers
    const tickers = [
        { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'stock', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', type: 'stock', sector: 'Technology' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', type: 'stock', sector: 'Technology' },
        { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', type: 'stock', sector: 'Consumer Cyclical' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'stock', sector: 'Communication Services' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'stock', sector: 'Consumer Cyclical' },
        { symbol: 'META', name: 'Meta Platforms', exchange: 'NASDAQ', type: 'stock', sector: 'Technology' },
        { symbol: 'O', name: 'Realty Income', exchange: 'NYSE', type: 'stock', sector: 'Real Estate' },
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', exchange: 'NYSE', type: 'etf', sector: 'ETF' },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'NASDAQ', type: 'etf', sector: 'ETF' },
        { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', exchange: 'NYSE', type: 'etf', sector: 'ETF' },
    ];

    for (const t of tickers) {
        const { error } = await supabase.from('tickers').upsert(t, { onConflict: 'symbol' });
        if (error) console.error(`Error inserting ${t.symbol}:`, error.message);
        else console.log(`✓ Inserted/Updated ${t.symbol}`);
    }

    // 2. Seed Initial Prices (Mock History for Charting)
    console.log("Sending initial price signal...");
    // We can just hit our own API or mock insert directly. Mock insert for speed.
    // ... (Skipping verbose price simulation in seed, rely on Cron or basic insert)

    // 3. Seed Dividends
    const dividends = [
        { symbol: 'SCHD', ex_date: '2023-12-06', amount: 0.7423, frequency: 'quarterly' },
        { symbol: 'SCHD', ex_date: '2023-09-21', amount: 0.6545, frequency: 'quarterly' },
        { symbol: 'O', ex_date: '2024-01-01', amount: 0.2565, frequency: 'monthly' },
        { symbol: 'AAPL', ex_date: '2023-11-10', amount: 0.24, frequency: 'quarterly' },
    ];

    for (const d of dividends) {
        const { error } = await supabase.from('dividends').upsert(d, { onConflict: 'symbol,ex_date,amount' });
        if (error && !error.message.includes('duplicate')) console.error(`Error dividend ${d.symbol}:`, error.message);
    }

    console.log("✅ Seed Complete!");
}

seed();
