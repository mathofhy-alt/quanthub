import type { Metadata } from 'next';
import DividendCalculator from '@/components/calculators/DividendCalculator';

export const metadata: Metadata = {
    title: 'Dividend Calculator | DRIP & Compound Interest Visualizer',
    description: 'Calculate your future monthly dividend income with our precision DRIP calculator. Visualize compound growth for SCHD, O, and other dividend stocks.',
    keywords: ['dividend calculator', 'drip calculator', 'dividend growth', 'passive income', 'schd calculator'],
};

export default function DividendCalcPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Dividend <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Growth Engine</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Visualize the power of compound interest and dividend reinvestment (DRIP).
                    See how much passive income you could generate in 10, 20, or 30 years.
                </p>
            </div>

            <DividendCalculator />

            {/* SEO Content Block */}
            <article className="mt-24 prose prose-invert prose-lg max-w-4xl mx-auto">
                <h2>How to use this Dividend Calculator</h2>
                <p>
                    The key to building wealth with dividends is <strong>time</strong> and <strong>growth</strong>.
                    Unlike simple interest, dividend growth stocks increase their payout annually, protecting your income from inflation.
                </p>

                <h3>What is DRIP?</h3>
                <p>
                    DRIP stands for <strong>Dividend Reinvestment Plan</strong>. Instead of taking the cash, you buy more shares.
                    This accelerates the compounding effect, creating a "snowball" of income.
                </p>

                <h3>Why Dividend Growth Matters?</h3>
                <p>
                    A stock yielding 3% today that grows its dividend by 10% annually will have a <strong>Yield on Cost</strong> of nearly 8% in 10 years.
                    Our calculator models this exact scenario to help you plan your retirement (FIRE).
                </p>
            </article>
        </div>
    );
}
