
export function ETFComparisonTable() {
    const etfs = [
        { symbol: "QQQ", name: "Invesco QQQ", expense: 0.20, yield: 0.58, perf1y: 45.2, perf5y: 158.4, strategy: "Growth" },
        { symbol: "SCHD", name: "Schwab US Dividend", expense: 0.06, yield: 3.45, perf1y: 8.5, perf5y: 54.2, strategy: "Dividend" },
        { symbol: "VOO", name: "Vanguard S&P 500", expense: 0.03, yield: 1.45, perf1y: 22.1, perf5y: 89.0, strategy: "Blend" },
        { symbol: "JEPI", name: "JPMorgan Equity Premium", expense: 0.35, yield: 7.85, perf1y: 12.4, perf5y: 32.1, strategy: "Income" },
    ];

    return (
        <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4">ETF</th>
                        <th className="px-6 py-4">Strategy</th>
                        <th className="px-6 py-4 text-right">Expense Ratio</th>
                        <th className="px-6 py-4 text-right">Div Yield</th>
                        <th className="px-6 py-4 text-right text-blue-400">1Y Return</th>
                        <th className="px-6 py-4 text-right text-emerald-400">5Y Return</th>
                    </tr>
                </thead>
                <tbody>
                    {etfs.map((etf) => (
                        <tr key={etf.symbol} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition">
                            <td className="px-6 py-4 font-medium text-white">
                                <a href={`/etf/${etf.symbol}`} className="hover:text-blue-400">{etf.symbol}</a>
                                <div className="text-xs font-normal text-slate-500">{etf.name}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-300">{etf.strategy}</td>
                            <td className="px-6 py-4 text-right text-slate-300">{etf.expense}%</td>
                            <td className="px-6 py-4 text-right text-slate-300">{etf.yield}%</td>
                            <td className="px-6 py-4 text-right text-blue-400 font-mono">+{etf.perf1y}%</td>
                            <td className="px-6 py-4 text-right text-emerald-400 font-mono">+{etf.perf5y}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
