"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AdUnit } from "@/components/ads/AdUnit";

export default function DividendCalculator() {
    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [ticker, setTicker] = useState("SCHD");
    const [dividendRate, setDividendRate] = useState(3.5);
    const [dividendGrowth, setDividendGrowth] = useState(8.0);
    const [years, setYears] = useState(10);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [drip, setDrip] = useState(true);

    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        calculate();
    }, [initialInvestment, dividendRate, dividendGrowth, years, monthlyContribution, drip]);

    const calculate = () => {
        let currentPrincipal = initialInvestment;
        let totalDividends = 0;

        // Simple projection
        // In reality this should be year by year
        const yearlyData = [];
        let annualDividendIncome = 0;

        for (let yr = 1; yr <= years; yr++) {
            const annualYieldDecimal = dividendRate / 100;

            // Add Contributions (simplified as beginning of year)
            currentPrincipal += (monthlyContribution * 12);

            // Calculate Dividend
            let annualDiv = currentPrincipal * annualYieldDecimal;

            // Growth of Dividend Yield itself (on cost) or Growth of Stock Price?
            // Usually Div Growth means the *payout* increases.
            // For simplicity: Effective yield on original cost rises, or we just grow the div amount.
            // Let's assume stock price grows same as div growth for yield maintenance.

            // Reinvest
            if (drip) {
                currentPrincipal += annualDiv;
            }

            totalDividends += annualDiv;
            annualDividendIncome = annualDiv;

            yearlyData.push({
                year: yr,
                principal: currentPrincipal,
                dividends: annualDiv
            });

            // Apply Growth for next year
            // We simulate "Capital Appreciation" + "Dividend Growth" implicitly or straightforward
            // Standard Model: Price grows X%, Div grows Y%.
            // Simplified Model: Total Portfolio Value * Yield.
            // Let's stick to: Principal grows by 'Dividend Growth' rate (assuming yield stays constant so price must match div growth).
            currentPrincipal = currentPrincipal * (1 + (dividendGrowth / 100));
        }

        setResult({
            finalBalance: currentPrincipal,
            totalDividends,
            annualDividendIncome, // Last Year
            monthlyPassiveIncome: annualDividendIncome / 12,
            data: yearlyData
        });
    };

    const chartData = [
        { name: 'Principal Invested', value: initialInvestment + (monthlyContribution * 12 * years) },
        { name: 'Capital Gain & DRIP', value: result ? result.finalBalance - (initialInvestment + (monthlyContribution * 12 * years)) : 0 },
    ];

    const COLORS = ['#3b82f6', '#10b981'];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* INPUTS */}
                <div className="lg:col-span-1 space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-4">Inputs</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Stock Ticker</label>
                            <input
                                type="text"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Initial Investment ($)</label>
                            <input
                                type="number"
                                value={initialInvestment}
                                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Div Yield (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={dividendRate}
                                    onChange={(e) => setDividendRate(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Div Growth (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={dividendGrowth}
                                    onChange={(e) => setDividendGrowth(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Monthly Contribution ($)</label>
                            <input
                                type="number"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Years to Grow</label>
                            <input
                                type="range"
                                min="1" max="50"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-right text-xs text-blue-400">{years} Years</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={drip}
                                onChange={(e) => setDrip(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600"
                            />
                            <label className="text-sm font-medium text-slate-400">Reinvest Dividends (DRIP)</label>
                        </div>
                    </div>

                    <AdUnit slotId="sidebar-calc-internal" className="mt-6" />
                </div>

                {/* RESULTS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.72 2.13-1.71 0-1.63-2.69-1.92-3.83-3.21C9.65 10.97 10 9.77 10.51 9.07c.86-.94 2.21-1.57 3.99-1.63V5h2.67v2c1.3.26 2.58 1.11 2.89 2.94h-1.98c-.12-.86-.99-1.52-2.19-1.52-1.25 0-2.07.66-2.07 1.57 0 1.34 2.65 1.63 3.82 2.95 1.03 1.15 1.05 2.58.53 3.51-.77 1.36-2.28 1.96-4.16 2.05z" /></svg>
                            </div>
                            <p className="text-sm text-slate-400">Portfolio Value</p>
                            <p className="text-2xl md:text-3xl font-bold text-white mt-1">
                                {result ? formatCurrency(result.finalBalance) : "..."}
                            </p>
                            <p className="text-xs text-green-400 mt-2">After {years} years</p>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl border border-emerald-500/30">
                            <p className="text-sm text-slate-400">Annual Dividend Income</p>
                            <p className="text-2xl md:text-3xl font-bold text-emerald-400 mt-1">
                                {result ? formatCurrency(result.annualDividendIncome) : "..."}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">Yield on Cost: {result ? ((result.annualDividendIncome / (initialInvestment + monthlyContribution * 12 * years)) * 100).toFixed(2) : 0}%</p>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl border border-purple-500/30">
                            <p className="text-sm text-slate-400">Monthly Passive Income</p>
                            <p className="text-2xl md:text-3xl font-bold text-purple-400 mt-1">
                                {result ? formatCurrency(result.monthlyPassiveIncome) : "..."}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">Enough to retire?</p>
                        </div>
                    </div>

                    {/* AD SLOT */}
                    <AdUnit slotId="calc-mid-result" className="h-[250px]" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h4 className="text-lg font-bold text-white mb-4">Breakdown</h4>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h4 className="text-lg font-bold text-white mb-4">Why {ticker}?</h4>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Based on your input, you expect {ticker} to grow its dividend by <strong>{dividendGrowth}%</strong> annually.
                                If {ticker} maintains this growth, your yield on cost will skyrocket over time.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Tax Efficiency: US Dividends are taxed at 15%.
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Consistent Compounding is key.
                                </li>
                            </ul>
                            <a href={`/stocks/us/${ticker.toLowerCase()}`} className="block mt-6 text-center w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-sm font-semibold">
                                Analyze {ticker} Fundamentals &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
