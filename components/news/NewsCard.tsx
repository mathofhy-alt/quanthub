
import { NewsItem } from "@/lib/mock-news";
import Link from "next/link";
import { Clock } from "lucide-react";

export function NewsCard({ news, variant = "horizontal" }: { news: NewsItem, variant?: "horizontal" | "vertical" | "compact" }) {
    const sentimentColor = news.sentiment === "positive" ? "text-emerald-400" : news.sentiment === "negative" ? "text-red-400" : "text-slate-400";

    if (variant === "compact") {
        return (
            <Link href={`/news/${news.id}`} className="group block py-3 border-b border-slate-800 last:border-0">
                <div className="flex justify-between items-start gap-4">
                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition line-clamp-2 leading-snug">
                        {news.title}
                    </h4>
                    <span className={`text-xs font-bold uppercase ${sentimentColor} shrink-0`}>
                        {news.sentiment === "positive" ? "Bullish" : news.sentiment === "negative" ? "Bearish" : "Info"}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500">{news.source}</span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] text-slate-500">{new Date(news.published_at).getHours()}h ago</span>
                </div>
            </Link>
        );
    }

    if (variant === "vertical") {
        return (
            <Link href={`/news/${news.id}`} className="group flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition">
                {news.imageUrl && (
                    <div className="h-40 w-full bg-slate-800 overflow-hidden">
                        <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-2">
                        {news.tickers.map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                                ${t}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-400">{news.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-grow">{news.summary}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                        <span className="text-xs text-slate-500 font-semibold">{news.source}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Clock size={12} />
                            <span>2h ago</span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/news/${news.id}`} className="group flex gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-900 transition mb-4">
            {news.imageUrl && (
                <div className="hidden md:block w-48 h-32 shrink-0 bg-slate-800 rounded-lg overflow-hidden">
                    <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
            )}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${sentimentColor}`}>
                        {news.sentiment.toUpperCase()}
                    </span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-slate-500 text-xs uppercase">{news.source}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">{news.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">{news.summary}</p>
                <div className="flex gap-2 mt-3">
                    {news.tickers.map(t => (
                        <span key={t} className="text-xs px-2 py-1 rounded bg-slate-800 text-blue-400 font-mono hover:bg-slate-700">
                            ${t}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
