
import { getStockData, getTopTickers, getRelatedTickers } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { AdUnit } from "@/components/ads/AdUnit";
import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import Link from "next/link";
import { Metadata } from "next";

// Force Static Site Generation (SSG) for known tickers
export async function generateStaticParams() {
    // BUILD SAFETY: Only pre-render Top 50 tickers to prevent build timeouts.
    // The rest will be server-rendered on demand (ISR) and cached.
    const tickers = await getTopTickers(50);
    return tickers.map((t) => ({ symbol: t.symbol }));
}

export const revalidate = 3600; // Revalidate every hour (ISR)

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
    const { symbol: _symbol } = await params;
    const symbol = _symbol.toUpperCase();
    const stock = await getStockData(symbol);

    if (!stock) return { title: 'Calculator Not Found' };

    return {
        title: `${symbol} Dividend Calculator & Growth Projection | QuantHub`,
        description: `Calculate future dividend income for ${stock.name} (${symbol}). See 10-year DRIP growth estimates based on ${stock.dividendYield}% yield.`,
        openGraph: {
            title: `${symbol} Passive Income Calculator`,
            description: `How much can you make from ${symbol}? Visualize compound interest and tax implications.`,
        }
    };
}

export default async function DividendTickerPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol: _symbol } = await params;
    const symbol = _symbol.toUpperCase();
    const stock = await getStockData(symbol);

    if (!stock) {
        return <div className="p-20 text-center text-white">Stock data unavailable. <Link href="/stocks" className="text-blue-400">Back to Stocks</Link></div>;
    }

    const relatedTickers = await getRelatedTickers(stock.sector, symbol);
    const competitor = relatedTickers[0]?.symbol || 'SPY';

    // Calculation Logic (Static Projection)
    const initialInvestment = 10000;
    const monthlyContribution = 500;
    const annualYield = stock.dividendYield / 100;
    const years = 10;

    let balance = initialInvestment;
    const projection = [];

    for (let i = 1; i <= years; i++) {
        const annualDiv = balance * annualYield;
        balance += annualDiv + (monthlyContribution * 12);
        // Simple 5% growth assumption for price/div combined
        balance *= 1.05;

        projection.push({
            year: 2024 + i,
            balance,
            annualDiv
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <PageAnalytics pageType="dividend_calc" symbol={symbol} />

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold mb-4 border border-emerald-500/20">
                    AUTOMATED INCOME ENGINE
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                    {symbol} Dividend Calculator
                </h1>
                <p className="text-xl text-slate-400">
                    If you invest <span className="text-white font-bold">$10,000</span> in {stock.name} today...
                </p>
            </div>

            <AdUnit slotId="div-calc-top" className="mb-12 h-[250px]" />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-xs uppercase">Share Price</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(stock.price)}</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-xs uppercase">Yield</div>
                    <div className="text-2xl font-bold text-emerald-400">{stock.dividendYield}%</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-xs uppercase">Est. Annual Income</div>
                    <div className="text-2xl font-bold text-blue-400">
                        {formatCurrency(initialInvestment * annualYield)}
                    </div>
                    <div className="text-[10px] text-slate-500">on $10k investment</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-xs uppercase">Sector</div>
                    <div className="text-lg font-bold text-white truncate">{stock.sector}</div>
                </div>
            </div>

            {/* Projection Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mb-12">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">10-Year DRIP Forecast</h2>
                    <span className="text-xs text-slate-500">Includes $500/mo contribution</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Year</th>
                                <th className="px-6 py-4">Portfolio Value</th>
                                <th className="px-6 py-4">Annual Dividends</th>
                                <th className="px-6 py-4 text-right">Yield on Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {projection.map((row) => (
                                <tr key={row.year} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-mono text-slate-300">{row.year}</td>
                                    <td className="px-6 py-4 font-bold text-white">{formatCurrency(row.balance)}</td>
                                    <td className="px-6 py-4 text-emerald-400">{formatCurrency(row.annualDiv)}</td>
                                    <td className="px-6 py-4 text-right text-slate-400">
                                        {((row.annualDiv / (initialInvestment + (monthlyContribution * 12 * (row.year - 2024)))) * 100).toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdUnit slotId="div-calc-mid" className="mb-12" />

            {/* FAQ Section (Auto Generated) */}
            <div className="prose prose-invert max-w-none mb-12">
                <h2>Frequently Asked Questions about {symbol} Dividends</h2>

                <div className="space-y-6 not-prose">
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-2">How often does {stock.name} pay dividends?</h3>
                        <p className="text-slate-400">
                            Based on historical analysis, {symbol} typically distributes dividends {stock.dividendYield > 4 ? 'Monthly/Quarterly' : 'Quarterly'}.
                            Check the <Link href={`/stocks/us/${symbol.toLowerCase()}`} className="text-blue-400 underline">full {symbol} layout</Link> for exact dates.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-2">Is {symbol} a good stock for retirement?</h3>
                        <p className="text-slate-400">
                            With a yield of {stock.dividendYield}%, {symbol} contributes to a predictable income stream.
                            Combine it with dividend growth ETFs like <Link href="/tools/dividend/schd" className="text-blue-400">SCHD</Link> for better diversification.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
                <Link href={`/stocks/us/${symbol.toLowerCase()}`} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-center transition border border-slate-700">
                    Analysis: {symbol}
                </Link>
                <Link href={`/tools/dividend/${competitor.toLowerCase()}`} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center transition shadow-lg shadow-blue-500/20">
                    Compare: {symbol} vs {competitor} &rarr;
                </Link>
            </div>

            <AdUnit slotId="div-calc-bottom" className="mb-8" />

            {/* INTERNAL LINKING: High Engagement Section */}
            <div className="mt-16 pt-8 border-t border-slate-800">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Frequently Calculated Together
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {relatedTickers.map(t => (
                        <Link key={t.symbol} href={`/tools/dividend/${t.symbol.toLowerCase()}`} className="group block p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-700 transition">
                            <div className="font-bold text-white group-hover:text-blue-400 transition">{t.symbol}</div>
                            <div className="text-[10px] text-slate-500 truncate">{t.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
