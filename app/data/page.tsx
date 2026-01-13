
import { AdUnit } from "@/components/ads/AdUnit";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
    title: 'Global Macro Economic Data | QuantHub',
    description: 'Real-time charts for Fed Interest Rates, CPI Inflation, and Treasury Yields.',
};

export default function DataPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Macro Economic Dashboard</h1>
                <p className="text-slate-400">The big picture driving asset prices.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                    { title: "Fed Interest Rate", value: "5.25%", trend: "Neutral", desc: "Next meeting: March 20" },
                    { title: "US CPI (YoY)", value: "3.1%", trend: "Down", desc: "Target: 2.0%" },
                    { title: "10Y Treasury", value: "4.12%", trend: "Up", desc: "Risk-free rate benchmark" }
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">{item.title}</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-bold text-white">{item.value}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.trend === 'Down' ? 'bg-green-500/20 text-green-400' : item.trend === 'Up' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                                {item.trend}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">{item.desc}</p>
                    </div>
                ))}
            </div>

            <AdUnit slotId="macro-mid" className="mb-12 h-[150px]" />

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 flex items-center justify-center h-96">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Interactive Charts Coming Soon</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        We are integrating with the FRED (Federal Reserve Economic Data) API to bring you live historical charts.
                    </p>
                </div>
            </div>
        </div>
    );
}
