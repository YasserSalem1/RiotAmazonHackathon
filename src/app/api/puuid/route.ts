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

  const riotId = req.nextUrl.searchParams.get("riotId");
  const gameName = req.nextUrl.searchParams.get("gameName");
  const tagLine = req.nextUrl.searchParams.get("tagLine");

  let url: string | null = null;
  if (riotId) {
    url = `${BASE}/account?riotId=${encodeURIComponent(riotId)}`;
  } else if (gameName && tagLine) {
    url = `${BASE}/account?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`;
  }

  if (!url) {
    return NextResponse.json({ error: "Missing riotId or gameName+tagLine" }, { status: 400 });
  }

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
