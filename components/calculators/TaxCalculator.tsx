"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { AdUnit } from "@/components/ads/AdUnit";

export default function TaxCalculator() {
    const [income, setIncome] = useState<number>(0);
    const [type, setType] = useState<"dividend_us" | "dividend_kr" | "cgt_us">("dividend_us");

    const calculateTax = () => {
        if (type === "dividend_us") return income * 0.15; // 15% Treaty
        if (type === "dividend_kr") return income * 0.154; // 15.4% Resident
        if (type === "cgt_us") {
            const deduction = 2500000; // 2.5m KRW deduction
            const textBase = Math.max(0, income - deduction);
            return textBase * 0.22; // 22%
        }
        return 0;
    };

    const tax = calculateTax();
    const profit = income - tax;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white mb-6">Tax Parameters</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Income Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                        >
                            <option value="dividend_us">US Dividend (15%)</option>
                            <option value="dividend_kr">Korean Dividend (15.4%)</option>
                            <option value="cgt_us">US Stock Capital Gains (22%)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Total Income / Profit (KRW)</label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                            placeholder="e.g. 10,000,000"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-4">Estimated Tax</h3>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400">Total Tax Bill</span>
                        <span className="text-xl font-bold text-red-400">-{formatCurrency(tax, "KRW")}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <span className="text-slate-400">Net Profit</span>
                        <span className="text-2xl font-bold text-emerald-400">{formatCurrency(profit, "KRW")}</span>
                    </div>
                </div>
                <AdUnit slotId="tax-results" className="h-[120px]" />
            </div>
        </div>
    );
}
