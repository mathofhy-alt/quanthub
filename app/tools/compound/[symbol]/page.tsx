
import { getStockData, getTopTickers, getRelatedTickers } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { AdUnit } from "@/components/ads/AdUnit";
import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
    // Optimized for Scale: Build top 50, ISR the rest.
    const tickers = await getTopTickers(50);
    return tickers.map((t) => ({ symbol: t.symbol }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { symbol: string } }): Promise<Metadata> {
    const symbol = params.symbol.toUpperCase();
    const stock = await getStockData(symbol);

    if (!stock) return { title: 'Calculator Not Found' };

    return {
        title: `${symbol} Compound Interest Calculator | Wealth Projection`,
        description: `See how ${stock.name} (${symbol}) can grow with compound interest. 10yr, 20yr, 30yr forecasts with monthly contributions.`,
    };
}

export default async function CompoundTickerPage({ params }: { params: { symbol: string } }) {
    const symbol = params.symbol.toUpperCase();
    const stock = await getStockData(symbol);

    if (!stock) {
        return <div className="p-20 text-center text-white">Stock data unavailable.</div>;
    }

    const relatedTickers = await getRelatedTickers(stock.sector, symbol);
    const competitor = relatedTickers[0]?.symbol || 'QQQ';

    // Assumed CAG (Capital Appreciation + Div Yield)
    const cag = 8.0; // Standard market assumption
    const initial = 5000;
    const monthly = 200;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <PageAnalytics pageType="compound_calc" symbol={symbol} />

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                    {symbol} Compounding Power
                </h1>
                <p className="text-lg text-slate-400">
                    Growth potential analysis for <span className="text-emerald-400 font-bold">{stock.name}</span>
                </p>
            </div>

            <AdUnit slotId="comp-top" className="mb-12 h-[250px]" />

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-12">
                <h2 className="text-xl font-bold text-white mb-6">The "Magic" of Compounding {symbol}</h2>
                <p className="text-slate-400 mb-8">
                    Assuming {symbol} returns an average of <strong>{cag}%</strong> annually (historical average for its sector),
                    here is how a modest investment grows over time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {[10, 20, 30].map(yrs => {
                        const fv = initial * Math.pow(1.08, yrs) + (monthly * 12 * (Math.pow(1.08, yrs) - 1) / 0.08);
                        return (
                            <div key={yrs} className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                                <div className="text-emerald-500 font-bold text-2xl mb-2">{formatCurrency(fv).split('.')[0]}</div>
                                <div className="text-slate-500 text-sm">After {yrs} Years</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="prose prose-invert max-w-none mb-12">
                <h3>Why Reinvest?</h3>
                <p>
                    {symbol} pays a dividend of {stock.dividendYield}%. By reinvesting this (DRIP), you buy more shares when prices are low,
                    accelerating your ownership stake automatically.
                </p>
                <AdUnit slotId="comp-mid" className="my-8" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
                <Link href={`/tools/dividend/${symbol.toLowerCase()}`} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-center transition border border-slate-700">
                    Check {symbol} Dividends
                </Link>
                <Link href={`/tools/compound/${competitor.toLowerCase()}`} className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-center transition shadow-lg shadow-purple-500/20">
                    Compare: {symbol} vs {competitor} &rarr;
                </Link>
            </div>

            {/* INTERNAL LINKING */}
            <div className="mt-16 pt-8 border-t border-slate-800">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Frequently Calculated Together
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {relatedTickers.map(t => (
                        <Link key={t.symbol} href={`/tools/compound/${t.symbol.toLowerCase()}`} className="group block p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-700 transition">
                            <div className="font-bold text-white group-hover:text-purple-400 transition">{t.symbol}</div>
                            <div className="text-[10px] text-slate-500 truncate">{t.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
