import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const BASE = process.env.BACKEND_API_BASE_URL;
  if (!BASE) {
    return NextResponse.json({ error: "BACKEND_API_BASE_URL is not set" }, { status: 500 });
  }

  const riotId = req.nextUrl.searchParams.get("riotId");
  const gameName = req.nextUrl.searchParams.get("gameName");
  const tagLine = req.nextUrl.searchParams.get("tagLine");

  let url: string;
  if (riotId) {
    url = `${BASE}/account?riotId=${encodeURIComponent(riotId)}`;
  } else if (gameName && tagLine) {
    url = `${BASE}/account?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`;
  } else {
    return NextResponse.json({ error: "Missing riotId or gameName+tagLine" }, { status: 400 });
  }

  const r = await fetch(url, { cache: "no-store" });
  const text = await r.text();
  try {
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json(
      { error: "Upstream not JSON", status: r.status, body_prefix: text.slice(0, 400) },
      { status: r.ok ? 500 : r.status }
    );
  }
}
