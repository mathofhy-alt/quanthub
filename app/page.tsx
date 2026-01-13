
import { SearchStock } from "@/components/SearchStock";

export default function Home() {
  return (
    <div className="bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            AdSense Revenue Optimization Engine v1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Data-Driven <span className="text-blue-500">Wealth</span> Only.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            No opinions, just numbers. Automated financial tools, ETF comparisons, and tax calculators designed for the intelligent investor.
          </p>

          <SearchStock />
        </div>
      </section>

      {/* Core Tools Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-bold text-white">Profit & Tax Calculators</h2>
          <span className="text-slate-500 text-sm">Automated SEO Pages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Dividend Tax Calc", desc: "Calculate real after-tax income for US/KR stocks.", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", link: "/tools/dividend-calculator" },
            { title: "Compound Growth", desc: "Visualize the power of long-term reinvestment.", color: "bg-blue-500/10 border-blue-500/20 text-blue-400", link: "/tools/compound-calculator" },
            { title: "ETF Comparison", desc: "QQQ vs SCHD vs SPY performance overlap.", color: "bg-purple-500/10 border-purple-500/20 text-purple-400", link: "/etf" }
          ].map((tool, i) => (
            <a key={i} href={tool.link} className={`p-6 rounded-xl border ${tool.color} hover:opacity-80 transition cursor-pointer block text-left`}>
              <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
              <p className="text-sm opacity-80">{tool.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Market Data Mockup */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Market Intelligence</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["S&P 500", "Nasdaq 100", "KOSPI", "Gold"].map((m, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-sm">{m}</div>
                <div className="text-2xl font-mono font-medium text-white mt-1">
                  {i % 2 === 0 ? "+" : "-"}{(Math.random() * 2).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
