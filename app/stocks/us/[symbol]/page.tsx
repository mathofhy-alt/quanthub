import { getStockData, getRelatedNews } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { AdUnit } from "@/components/ads/AdUnit";
import { ArrowUp, ArrowDown } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const stock = await getStockData(symbol);
    if (!stock) return { title: 'Stock Not Found' };

    return {
        title: `${stock.symbol} Price, Dividend & News | Is ${stock.name} a Buy?`,
        description: `Real-time analysis for ${stock.name} (${stock.symbol}). Check dividend yield (${stock.dividendYield}%), price target, and latest news.`,
    };
}

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const stock = await getStockData(symbol);

    if (!stock) {
        return <div className="p-20 text-center text-white">Stock not found</div>;
    }

    const news = await getRelatedNews(stock.symbol);
    const isPositive = stock.change >= 0;

    return (
        <div className="min-h-screen pb-20 bg-slate-950 text-white">
            {/* Sticky Header */}
            <div className="sticky top-16 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            {stock.symbol}
                            <span className="text-sm font-normal text-slate-400 hidden sm:inline">{stock.name}</span>
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-mono font-bold text-white">{formatCurrency(stock.price)}</div>
                        <div className={`text-xs flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Chart Section Placeholder */}
                    <div className="bg-slate-900 h-80 rounded-xl border border-slate-800 flex items-center justify-center relative">
                        <span className="text-slate-500">Interactive Chart Loading...</span>
                        {/* Ad Inside Chart (Overlay) could be risky, better below */}
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Market Cap", value: stock.marketCap },
                            { label: "P/E Ratio", value: stock.peRatio },
                            { label: "Div Yield", value: `${stock.dividendYield}%`, highlight: true },
                            { label: "Sector", value: stock.sector },
                        ].map((m, i) => (
                            <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                <div className="text-xs text-slate-500 mb-1">{m.label}</div>
                                <div className={`text-lg font-semibold ${m.highlight ? 'text-emerald-400' : 'text-white'}`}>
                                    {m.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Automated Summary (SEO Content) */}
                    <div className="prose prose-invert max-w-none">
                        <h2>Why {stock.name} ({stock.symbol}) is trending?</h2>
                        <p>{stock.description}</p>
                        <p>
                            Investors are looking at {stock.symbol} for its <strong>{stock.dividendYield}% dividend yield</strong>.
                            With a P/E ratio of {stock.peRatio}, it presents a specific risk/reward profile in the {stock.sector} sector.
                        </p>
                        <AdUnit slotId="in-article-native" className="my-6" />
                        <h3>Key Risks</h3>
                        <p>
                            Market volatility affects all stocks in the {stock.sector} industry.
                            Monitor interest rates as they impact {stock.name}'s borrowing costs.
                        </p>
                    </div>

                    {/* News Section */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Latest News</h3>
                        <div className="space-y-4">
                            {news.map((n, i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition cursor-pointer">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-200 mb-2">{n.title}</h4>
                                        <div className="text-xs text-slate-500">{n.source} • {n.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <AdUnit slotId="sidebar-top" className="h-[300px]" />

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="font-bold text-white mb-4">Calculators</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href={`/tools/dividend-calculator?symbol=${stock.symbol}&price=${stock.price}&yield=${stock.dividendYield}`} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2">
                                    Calculate {stock.symbol} DRIP &rarr;
                                </a>
                            </li>
                            <li>
                                <a href="/tools/tax-calculator" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2">
                                    Calculate Taxes &rarr;
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="font-bold text-white mb-4">Similar Stocks</h3>
                        <div className="space-y-2">
                            {/* Placeholder for similar stocks */}
                            {['MSFT', 'GOOGL', 'AMZN'].map(s => (
                                <div key={s} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 last:border-0">
                                    <span className="text-slate-300">{s}</span>
                                    <span className="text-emerald-400">+1.2%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
