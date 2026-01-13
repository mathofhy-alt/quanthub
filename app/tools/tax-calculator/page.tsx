import type { Metadata } from 'next';
import TaxCalculator from '@/components/calculators/TaxCalculator';

export const metadata: Metadata = {
    title: 'Investment Tax Calculator 2026 | Dividend & Capital Gains',
    description: 'Calculate your exact tax liability for US Stocks and Korean Dividends. Includes 2.5 Million KRW deduction logic for Capital Gains.',
};

export default function TaxCalcPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Investment Tax Estimator</h1>
                <p className="text-slate-400">Don't let taxes surprise you. Plan ahead.</p>
            </div>

            <TaxCalculator />

            <div className="mt-12 prose prose-invert max-w-none">
                <h2>How Investment Taxes Work in Korea</h2>
                <ul>
                    <li><strong>US Dividends</strong>: 15% is withheld automatically. If your global income exceeds 20M KRW, you may owe more.</li>
                    <li><strong>Capital Gains</strong>: You get a 2.5 Million KRW deduction per year. Any profit above that is taxed at 22%.</li>
                </ul>
            </div>
        </div>
    );
}
