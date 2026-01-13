"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageAnalyticsProps {
    pageType: "dividend_calc" | "compound_calc" | "stock_detail";
    symbol: string;
}

export const PageAnalytics: React.FC<PageAnalyticsProps> = ({ pageType, symbol }) => {
    const pathname = usePathname();
    const startTime = useRef(Date.now());
    const maxScroll = useRef(0);

    useEffect(() => {
        // Record Scroll Depth
        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
            if (scrollPercent > maxScroll.current) {
                maxScroll.current = scrollPercent;
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Record Exit / Unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
            const duration = (Date.now() - startTime.current) / 1000;

            // In production, send this to Supabase or GA4
            console.log(`[Analytics] ${pageType} (${symbol}) | Duration: ${duration}s | Scroll: ${maxScroll.current.toFixed(0)}%`);

            // OPTIONAL: Send to an API route
            // navigator.sendBeacon('/api/log/dwell', JSON.stringify({ symbol, duration, scroll: maxScroll.current }));
        };
    }, [pathname, pageType, symbol]);

    return null; // Invisible component
};
