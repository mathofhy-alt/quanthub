import type { Metadata } from 'next';
import CompoundCalculator from '@/components/calculators/CompoundCalculator';

export const metadata: Metadata = {
    title: 'Compound Interest Calculator | Daily, Monthly Compounding',
    description: 'Calculate how your potential investment can grow over time with compound interest. Adjust monthly contributions, interest rate, and time period.',
};

export default function CompoundCalcPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Compound Interest <span className="text-blue-500">Accelerator</span>
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    Albert Einstein called compound interest the "eighth wonder of the world".
                    See how small, consistent habits turn into massive wealth.
                </p>
            </div>

            <CompoundCalculator />

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                <article className="prose prose-invert">
                    <h3>How Compounding Works</h3>
                    <p>
                        Compounding is the process where you earn interest on your interest.
                        In the early years, it looks slow. But after year 7-10 (the "hockey stick" moment), your portfolio grows more from interest than your contributions.
                    </p>
                </article>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-center justify-center text-center">
                    <div>
                        <p className="text-slate-500 text-sm mb-2">Rule of 72</p>
                        <div className="text-4xl font-bold text-white mb-2">72 / Rate = Years</div>
                        <p className="text-slate-400 text-sm">To double your money</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
