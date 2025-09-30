import { NextRequest, NextResponse } from "next/server";

const FALLBACK_BASE = "https://0vsr7n9vj1.execute-api.us-east-1.amazonaws.com";

function getBaseUrl(): string {
  const base =
    process.env.BACKEND_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ||
    FALLBACK_BASE;

  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export async function GET(req: NextRequest) {
  const BASE = getBaseUrl();

  const puuid = req.nextUrl.searchParams.get("puuid");
  const count = req.nextUrl.searchParams.get("count") ?? "10";
  if (!puuid) {
    return NextResponse.json({ error: "Missing puuid" }, { status: 400 });
  }

  const url = `${BASE}/matches?puuid=${encodeURIComponent(puuid)}&count=${encodeURIComponent(count)}`;
  const resp = await fetch(url, { cache: "no-store" });
  const text = await resp.text();

  try {
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: resp.status });
  } catch {
    return NextResponse.json(
      { error: "Upstream not JSON", status: resp.status, url, body_prefix: text.slice(0, 400) },
      { status: resp.ok ? 500 : resp.status }
    );
  }
}
