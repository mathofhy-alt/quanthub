import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp, DollarSign } from "lucide-react";

export const metadata = {
    title: 'Financial Tools & Calculators | QuantHub',
    description: 'Free financial calculators for dividend investing, FIRE planning, and tax estimation.',
};

export default function ToolsIndex() {
    const tools = [
        {
            href: "/tools/dividend-calculator",
            title: "Dividend DRIP Calculator",
            desc: "Visualize monthly passive income and portfolio growth over time.",
            icon: <DollarSign className="w-8 h-8 text-emerald-400" />,
            color: "border-emerald-500/20 hover:border-emerald-500/50"
        },
        {
            href: "/tools/compound-calculator",
            title: "Compound Interest Calc",
            desc: "See how small contributions grow into millions with the power of compounding.",
            icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
            color: "border-blue-500/20 hover:border-blue-500/50"
        },
        {
            href: "/tools/tax-calculator",
            title: "Investment Tax Estimator",
            desc: "Calculate taxes on US Stocks, KR Stocks, and ISA accounts.",
            icon: <Calculator className="w-8 h-8 text-purple-400" />,
            color: "border-purple-500/20 hover:border-purple-500/50"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">Financial Engineering Tools</h1>
                <p className="text-slate-400 text-lg">Precision instruments for your wealth journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className={`group relative block p-8 bg-slate-900 rounded-2xl border ${tool.color} transition-all duration-300 hover:-translate-y-1`}>
                        <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="bg-slate-950 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-slate-800">
                            {tool.icon}
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">{tool.title}</h2>
                        <p className="text-slate-400 leading-relaxed">
                            {tool.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
