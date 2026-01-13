"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import { AdUnit } from "@/components/ads/AdUnit";
import { Calculator, Play } from "lucide-react";

export default function CompoundCalculator() {
    const [inputs, setInputs] = useState({
        principal: 0,
        monthly: 1000,
        rate: 10,
        years: 30,
        metrics: "inflation" // 'nominal' or 'inflation' adjusted could be added later
    });

    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        calculate();
    }, [inputs]);

    const handleChange = (field: string, val: number) => {
        setInputs(prev => ({ ...prev, [field]: val }));
    };

    const calculate = () => {
        const { principal, monthly, rate, years } = inputs;
        const r = rate / 100;
        const n = 12; // monthly compounding typically
        const t = years;

        let futureValue = 0;
        let totalInvested = principal + (monthly * 12 * years);

        // Yearly data for chart
        const data = [];
        let currentBalance = principal;

        for (let yr = 0; yr <= years; yr++) {
            data.push({
                year: yr,
                balance: Math.round(currentBalance),
                invested: principal + (monthly * 12 * yr)
            });

            // Add interest for next year + monthly contributions
            // FV = P(1+r)^t + PMT * ... simplified loop:
            for (let m = 0; m < 12 && yr < years; m++) {
                currentBalance += monthly;
                currentBalance *= (1 + r / 12);
            }
        }

        futureValue = currentBalance;

        setResult({
            futureValue,
            totalInvested,
            interestEarned: futureValue - totalInvested,
            data
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* INPUTS - Col 4 */}
                <div className="lg:col-span-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-6 text-blue-400">
                        <Calculator className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-wider text-sm">Parameters</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Initial Deposit</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                <input
                                    type="number"
                                    value={inputs.principal}
                                    onChange={(e) => handleChange("principal", Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 p-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Monthly Contribution</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                <input
                                    type="number"
                                    value={inputs.monthly}
                                    onChange={(e) => handleChange("monthly", Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 p-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Interest Rate</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={inputs.rate}
                                        onChange={(e) => handleChange("rate", Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                    />
                                    <span className="absolute right-3 top-2.5 text-slate-400">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Time Period</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={inputs.years}
                                        onChange={(e) => handleChange("years", Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                    />
                                    <span className="absolute right-3 top-2.5 text-slate-400">Yr</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={calculate} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                            <Play className="w-4 h-4 fill-current" /> Recalculate
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            * Assumes monthly compounding at the end of each period. Taxes and inflation are not included in this simple projection.
                        </p>
                    </div>
                </div>

                {/* RESULTS - Col 8 */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800">
                            <p className="text-sm text-slate-400 mb-1">Total Future Value</p>
                            <p className="text-3xl font-bold text-white tracking-tight">
                                {result ? formatCurrency(result.futureValue).split('.')[0] : "..."}
                            </p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <p className="text-sm text-slate-400 mb-1">Total Interest Earned</p>
                            <p className="text-2xl font-bold text-emerald-400 tracking-tight">
                                +{result ? formatCurrency(result.interestEarned).split('.')[0] : "..."}
                            </p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <p className="text-sm text-slate-400 mb-1">Total Invested</p>
                            <p className="text-2xl font-bold text-blue-400 tracking-tight">
                                {result ? formatCurrency(result.totalInvested).split('.')[0] : "..."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-[400px]">
                        <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Growth Trajectory</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result?.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <ChartTooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Balance" />
                                <Line type="monotone" dataKey="invested" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Principal" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <AdUnit slotId="calc-bottom-comp" className="h-[120px]" />
                </div>
            </div>
        </div>
    );
}
