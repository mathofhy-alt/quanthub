import { MOCK_NEWS } from "@/lib/mock-news";
import { NewsCard } from "@/components/news/NewsCard";
import { AdUnit } from "@/components/ads/AdUnit";
import { TrendingUp, Filter } from "lucide-react";

export const metadata = {
    title: 'Global Market News & Sentiment Analysis | QuantHub',
    description: 'Real-time financial news aggregated from top sources with AI-driven sentiment analysis for stocks and ETFs.',
};

export default function NewsPage() {
    const featuredNews = MOCK_NEWS[0];
    const latestNews = MOCK_NEWS.slice(1, 4);
    const tickerNews = MOCK_NEWS.slice(2, 5); // Just recycling for demo

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        Market <span className="text-blue-500">Intelligence</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">AI-curated financial news stream.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-slate-300 text-sm hover:text-white transition">
                        <TrendingUp size={16} /> Trending
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-slate-300 text-sm hover:text-white transition">
                        <Filter size={16} /> Sentiment
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Feed - Col 8 */}
                <div className="lg:col-span-8">
                    <div className="mb-10">
                        <NewsCard news={featuredNews} variant="vertical" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-emerald-500">Latest Updates</h2>
                    <div className="space-y-6">
                        {latestNews.map(news => (
                            <NewsCard key={news.id} news={news} variant="horizontal" />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button className="px-6 py-2 bg-slate-900 text-slate-400 rounded-full border border-slate-800 hover:bg-slate-800 hover:text-white transition text-sm font-medium">
                            Load More Intelligence
                        </button>
                    </div>
                </div>

                {/* Sidebar - Col 4 */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-24">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Market Moving Tickers</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {["NVDA", "TSLA", "AAPL", "AMD", "SMCI"].map(t => (
                                <span key={t} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-md text-sm text-blue-400 font-mono hover:border-blue-500 cursor-pointer transition">
                                    ${t}
                                </span>
                            ))}
                        </div>

                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Recent Mentions</h3>
                        <div className="space-y-0">
                            {tickerNews.map(news => (
                                <NewsCard key={news.id} news={news} variant="compact" />
                            ))}
                        </div>
                    </div>

                    <AdUnit slotId="news-sidebar" className="h-[600px] sticky top-[600px]" />
                </div>

            </div>
        </div>
    );
}
