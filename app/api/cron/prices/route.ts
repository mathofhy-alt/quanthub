
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Helper to simulate fetching data (Since we don't have paid API keys)
// Captures snapshot of 'real' market behavior logic
async function fetchMockMarketData(symbol: string) {
    // In production: const res = await fetch(`https://api.alphavantage.co/...`);
    // Here: Generate realistic varying data based on a base seed
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

export async function GET(request: Request) {
    // 1. Verify Vercel Cron Secret (Security)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', { status: 401 });
    // }

    const supabase = getServiceSupabase();

    // 2. Get Symbols to Update
    const { data: tickers } = await supabase.from('tickers').select('symbol');

    if (!tickers) return NextResponse.json({ processed: 0 });

    const results = [];

    // 3. Batch Update
    for (const t of tickers) {
        const marketData = await fetchMockMarketData(t.symbol);

        // Upsert Price
        const { error } = await supabase.from('prices_daily').upsert({
            symbol: t.symbol,
            date: marketData.date,
            open: marketData.open,
            high: marketData.high,
            low: marketData.low,
            close: marketData.close,
            volume: marketData.volume,
            source: 'cron_simulation'
        }, {
            onConflict: 'symbol,date'
        });

        if (error) console.error(`Failed ${t.symbol}`, error);
        results.push({ symbol: t.symbol, status: error ? 'error' : 'ok' });
    }

    return NextResponse.json({
        processed: results.length,
        timestamp: new Date().toISOString()
    });
}
