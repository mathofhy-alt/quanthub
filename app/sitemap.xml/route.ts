export const runtime = "nodejs";

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

    // TODO: 실제 chunkCount를 Supabase tickers 개수 기반으로 계산하도록 연결
    // 임시로 20개 chunk로 잡아도 되고, 이후 자동 계산으로 교체해라.
    const chunkCount = 20;

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        Array.from({ length: chunkCount })
            .map((_, i) => `  <sitemap><loc>${xmlEscape(`${baseUrl}/sitemap/${i}.xml`)}</loc></sitemap>`)
            .join("\n") +
        `\n</sitemapindex>`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
