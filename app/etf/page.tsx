
import { ETFComparisonTable } from "@/components/etf/ETFComparisonTable";
import { AdUnit } from "@/components/ads/AdUnit";

export const metadata = {
    title: 'Top ETF Comparisons & Rankings | QuantHub',
    description: 'Compare best performing ETFs for Growth (QQQ), Dividends (SCHD), and S&P 500 (VOO). Analyze expense ratios and historical returns.',
};

export default function ETFPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">ETF Intelligence</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Don't pick stocks. Pick strategies. Compare the world's most liquid exchange traded funds.
                </p>
            </div>

            <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6">Popular Comparisons</h2>
                <ETFComparisonTable />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800">
                    <h3 className="text-2xl font-bold text-emerald-400 mb-4">Dividend ETFs</h3>
                    <p className="text-slate-400 mb-6">
                        Stable cash flow for retirement. Focus on "Dividend Aristocrats" and high-yield covered call strategies.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-slate-300">
                        <li>• <strong>SCHD</strong>: Dividend Growth (The King)</li>
                        <li>• <strong>JEPI</strong>: Monthly Income (High Risk)</li>
                        <li>• <strong>VIG</strong>: Vanguard Appreciation</li>
                    </ul>
                    <a href="/etf/theme/dividend" className="text-blue-400 text-sm hover:underline">View All Dividend ETFs &rarr;</a>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800">
                    <h3 className="text-2xl font-bold text-blue-400 mb-4">Tech & AI ETFs</h3>
                    <p className="text-slate-400 mb-6">
                        Aggressive growth powered by the AI revolution and semiconductor dominance.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-slate-300">
                        <li>• <strong>QQQ</strong>: Nasdaq 100 (Tech Heavy)</li>
                        <li>• <strong>SOXX</strong>: Semiconductor Index</li>
                        <li>• <strong>SMH</strong>: VanEck Semiconductor</li>
                    </ul>
                    <a href="/etf/theme/ai" className="text-blue-400 text-sm hover:underline">View All AI ETFs &rarr;</a>
                </div>
            </div>

            <div className="mt-12">
                <AdUnit slotId="etf-bottom" className="h-[250px]" />
            </div>
        </div>
    );
}
