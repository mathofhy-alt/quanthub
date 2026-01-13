
import { getStockData, getTopTickers, getRelatedTickers } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { AdUnit } from "@/components/ads/AdUnit";
import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
    // GENERATE TOP COMPARISON PAIRS
    // 1. Get Top 20 Tickers
    const topTickers = await getTopTickers(20);
    const pairs: { symbols: string }[] = [];

    // 2. Pair them (A vs B)
    // In production, pair by Sector. For now, simple permutation.
    for (let i = 0; i < topTickers.length; i++) {
        // Compare with next 2 tickers just to create some static pages
        if (i + 1 < topTickers.length) pairs.push({ symbols: `${topTickers[i].symbol}-vs-${topTickers[i + 1].symbol}`.toLowerCase() });
        if (i + 2 < topTickers.length) pairs.push({ symbols: `${topTickers[i].symbol}-vs-${topTickers[i + 2].symbol}`.toLowerCase() });
    }

    return pairs;
}

export const revalidate = 86400; // Daily Revalidation

export async function generateMetadata({ params }: { params: Promise<{ symbols: string }> }): Promise<Metadata> {
    const { symbols } = await params;
    const parts = (symbols || '').split('-');
    if (parts.length < 3) return { title: 'Comparison' };

    const symA = parts[0] || 'A';
    const symB = parts[2] || 'B';

    return {
        title: `${symA.toUpperCase()} vs ${symB.toUpperCase()} - Stock Comparison & Forecast | QuantHub`,
        description: `Compare ${symA.toUpperCase()} vs ${symB.toUpperCase()}. Dividend yield, 10-year growth potential, and risk analysis. Which stock is better for you?`,
    };
}

export default async function ComparePage({ params }: { params: Promise<{ symbols: string }> }) {
    const { symbols } = await params;
    const parts = (symbols || '').split('-');

    // Fallback if URL is malformed
    if (parts.length < 3) {
        return <div className="p-20 text-center text-white">Invalid comparison URL. Try <Link href="/stocks" className="text-blue-400">Search</Link></div>;
    }

    const symA = (parts[0] || '').toUpperCase();
    const symB = (parts[2] || '').toUpperCase();

    const [stockA, stockB] = await Promise.all([
        getStockData(symA),
        getStockData(symB)
    ]);

    if (!stockA || !stockB) {
        return <div className="p-20 text-center text-white">Comparison data unavailable.</div>;
    }

    const winner = stockA.dividendYield > stockB.dividendYield ? stockA : stockB;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <PageAnalytics pageType="stock_detail" symbol={`${symA}-vs-${symB}`} />

            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 justify-center mb-6">
                    <span className="text-2xl font-bold text-white">{symA}</span>
                    <span className="text-slate-500 font-mono">VS</span>
                    <span className="text-2xl font-bold text-white">{symB}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                    {stockA.name} vs {stockB.name}
                </h1>
                <p className="text-xl text-slate-400">
                    Head-to-Head Investment Analysis
                </p>
            </div>

            <AdUnit slotId="compare-top" className="mb-12 h-[200px]" />

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 mb-12">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400">
                        <tr>
                            <th className="p-4 pl-8">Metric</th>
                            <th className="p-4 text-center border-l border-slate-800 w-1/3">{symA}</th>
                            <th className="p-4 text-center border-l border-slate-800 w-1/3 bg-slate-900/50">{symB}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-white">
                        <tr>
                            <td className="p-4 pl-8 text-slate-400">Share Price</td>
                            <td className="p-4 text-center font-bold border-l border-slate-800">{formatCurrency(stockA.price)}</td>
                            <td className="p-4 text-center font-bold border-l border-slate-800 bg-slate-800/20">{formatCurrency(stockB.price)}</td>
                        </tr>
                        <tr>
                            <td className="p-4 pl-8 text-slate-400">Dividend Yield</td>
                            <td className={`p-4 text-center font-bold border-l border-slate-800 ${stockA.dividendYield > stockB.dividendYield ? 'text-emerald-400' : ''}`}>{stockA.dividendYield}%</td>
                            <td className={`p-4 text-center font-bold border-l border-slate-800 bg-slate-800/20 ${stockB.dividendYield > stockA.dividendYield ? 'text-emerald-400' : ''}`}>{stockB.dividendYield}%</td>
                        </tr>
                        <tr>
                            <td className="p-4 pl-8 text-slate-400">Sector</td>
                            <td className="p-4 text-center text-sm border-l border-slate-800">{stockA.sector}</td>
                            <td className="p-4 text-center text-sm border-l border-slate-800 bg-slate-800/20">{stockB.sector}</td>
                        </tr>
                        <tr>
                            <td className="p-4 pl-8 text-slate-400">Market Cap</td>
                            <td className="p-4 text-center text-sm border-l border-slate-800">{stockA.marketCap}</td>
                            <td className="p-4 text-center text-sm border-l border-slate-800 bg-slate-800/20">{stockB.marketCap}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AdUnit slotId="compare-mid" className="mb-12" />

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Why Choose {symA}?</h3>
                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                        {stockA.name} offers a yield of {stockA.dividendYield}%. If you are looking for {stockA.sector} exposure,
                        this stock presents a solid opportunity.
                    </p>
                    <Link href={`/tools/dividend/${symA.toLowerCase()}`} className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-center rounded-lg text-white font-bold transition">
                        Calculate {symA} Returns
                    </Link>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Why Choose {symB}?</h3>
                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                        {stockB.name} is a strong contender with {stockB.dividendYield}%.
                        Investors favoring growth in {stockB.sector} might prefer this option.
                    </p>
                    <Link href={`/tools/dividend/${symB.toLowerCase()}`} className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-center rounded-lg text-white font-bold transition">
                        Calculate {symB} Returns
                    </Link>
                </div>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/20 p-8 rounded-xl text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">The Verdict</h3>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
                    Based on dividend yield alone, <span className="text-emerald-400 font-bold">{winner.symbol}</span> is the winner today with {winner.dividendYield}%.
                    However, total return depends on reinvestment.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href={`/tools/compound/${symA.toLowerCase()}`} className="text-blue-400 hover:underline">
                        Simulate {symA} DRIP
                    </Link>
                    <span className="text-slate-600">|</span>
                    <Link href={`/tools/compound/${symB.toLowerCase()}`} className="text-blue-400 hover:underline">
                        Simulate {symB} DRIP
                    </Link>
                </div>
            </div>

            <AdUnit slotId="compare-bottom" className="mb-4" />
        </div>
    );
}
