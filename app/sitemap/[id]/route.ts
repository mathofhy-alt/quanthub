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

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const baseUrl = getBaseUrl(req);

    // params.id e.g. "0.xml"
    const idStr = params.id;
    if (!idStr || !idStr.endsWith(".xml")) {
        return new Response("Not Found", { status: 404 });
    }

    const page = Number(idStr.replace(".xml", ""));
    if (!Number.isFinite(page) || page < 0) {
        return new Response("Invalid sitemap id", { status: 400 });
    }

    const CHUNK_SIZE = 5000;
    const from = page * CHUNK_SIZE;
    const to = from + CHUNK_SIZE - 1;

    // Supabase chunk query
    const { data: tickers, error } = await supabase
        .from("tickers")
        .select("symbol")
        .range(from, to)
        .order("symbol"); // 순서 보장

    if (error) {
        console.error("Sitemap fetch error:", error);
        // 에러 시 빈 urlset이라도 반환 (500 방지)
        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
            { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8" } }
        );
    }

    // tickers가 없거나 비어있어도 빈 urlset 반환
    const list = tickers || [];

    const urls: string[] = [];
    for (const t of list) {
        if (!t.symbol) continue;
        const s = t.symbol.trim();
        if (!s) continue;

        const lowerS = s.toLowerCase();

        // 1) /tools/dividend/{SYMBOL}
        urls.push(`${baseUrl}/tools/dividend/${s}`);
        // 2) /tools/compound/{SYMBOL}
        urls.push(`${baseUrl}/tools/compound/${s}`);
        // 3) /compare/{symbolLower}-vs-spy
        urls.push(`${baseUrl}/compare/${lowerS}-vs-spy`);
    }

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
            .map((u) => `  <url><loc>${xmlEscape(u)}</loc></url>`)
            .join("\n") +
        `\n</urlset>`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            // "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59" 
        },
    });
}
