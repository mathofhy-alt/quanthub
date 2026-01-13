export const runtime = "nodejs";

import { supabase } from "@/lib/supabase";

function xmlEscape(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getBaseUrl(req: Request) {
    const env = process.env.NEXT_PUBLIC_SITE_URL;
    if (env) return env.replace(/\/$/, "");
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
}

export async function GET(req: Request) {
    const baseUrl = getBaseUrl(req);
    const CHUNK_SIZE = 5000;

    // tickers 테이블의 전체 개수를 조회해 chunkCount 계산
    const { count } = await supabase
        .from("tickers")
        .select("*", { count: "exact", head: true });

    const total = count || 0;
    // 최소 1개는 있어야 sitemap/0.xml 이 생성됨
    const chunkCount = Math.max(1, Math.ceil(total / CHUNK_SIZE));

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        Array.from({ length: chunkCount })
            .map((_, i) => `  <sitemap><loc>${xmlEscape(`${baseUrl}/sitemap/${i}.xml`)}</loc></sitemap>`)
            .join("\n") +
        `\n</sitemapindex>`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
        // 1시간 캐시
        // headers: { 
        //   "Content-Type": "application/xml; charset=utf-8",
        //   "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59"
        // },
    });
}
