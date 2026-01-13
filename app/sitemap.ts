
import { MetadataRoute } from 'next';
import { supabase } from "@/lib/supabase";

const BASE_URL = 'https://quanthub.com';

export async function generateSitemaps() {
    // Logic to split sitemap. 
    // We fetch count of tickers and divide by 10,000 (safe limit per file)
    const { count } = await supabase.from('tickers').select('*', { count: 'exact', head: true });
    const total = count || 0;

    // Example: If 20,000 tickers, we need 2 chunks + 1 for basics + more for comparisons
    // We return IDs: 0, 1, 2...
    // Smaller chunks because we add compare links (approx 4x URL density now)
    const chunks = Math.ceil(total / 2000);
    return Array.from({ length: chunks }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    // If id is 0, we include static routes + first batch of tickers
    const start = id * 2000;
    const end = start + 1999;

    const { data: tickers } = await supabase
        .from('tickers')
        .select('symbol')
        .range(start, end);

    const symbols = tickers?.map(t => t.symbol) || [];

    const entries: MetadataRoute.Sitemap = [];

    // 1. Static Routes (Only included in chunk 0)
    if (id === 0) {
        const staticRoutes = ['', '/news', '/etf', '/data', '/tools/dividend-calculator', '/tools/compound-calculator', '/tools/tax-calculator'];
        staticRoutes.forEach(route => {
            entries.push({
                url: `${BASE_URL}${route}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            });
        });
    }

    // 2. Dynamic Ticker Routes
    symbols.forEach(sym => {
        // Stock Hub
        entries.push({
            url: `${BASE_URL}/stocks/us/${sym}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        });
        // Tool: Dividend
        entries.push({
            url: `${BASE_URL}/tools/dividend/${sym}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        });
        // Tool: Compound
        entries.push({
            url: `${BASE_URL}/tools/compound/${sym}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
        // Comparison Page (High Traffic)
        entries.push({
            url: `${BASE_URL}/compare/${sym.toLowerCase()}-vs-spy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        });
    });

    return entries;
}
