"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchStock() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/stocks/us/${query.trim().toUpperCase()}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="pt-8 flex justify-center gap-4">
            <div className="relative w-80">
                <Search className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search ticker (e.g. AAPL)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
            </div>
            <button type="submit" className="bg-white text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-zinc-200 transition">
                Analyze
            </button>
        </form>
    );
}
