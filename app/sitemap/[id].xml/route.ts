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

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const baseUrl = getBaseUrl(req);
    const page = Number(params.id);
    if (!Number.isFinite(page) || page < 0) {
        return new Response("Invalid sitemap id", { status: 400 });
    }

    // TODO: Supabase에서 tickers를 5000개 단위로 읽어 URL 리스트를 만든다.
    // 여기서는 404 방지를 위해 최소 1개 URL이라도 반환한다.
    const urls = [
        `${baseUrl}/tools/dividend/AAPL`,
        `${baseUrl}/tools/compound/AAPL`,
        `${baseUrl}/compare/aapl-vs-spy`,
    ];

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.map((u) => `  <url><loc>${xmlEscape(u)}</loc></url>`).join("\n") +
        `\n</urlset>`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
