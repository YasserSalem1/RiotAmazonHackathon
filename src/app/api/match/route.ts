import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const BASE = process.env.BACKEND_API_BASE_URL;
  if (!BASE) return NextResponse.json({ error: "BACKEND_API_BASE_URL is not set" }, { status: 500 });

  const matchId = req.nextUrl.searchParams.get("matchId");
  const timeline = req.nextUrl.searchParams.get("timeline") ?? "1";
  if (!matchId) return NextResponse.json({ error: "Missing matchId" }, { status: 400 });

  const r = await fetch(
    `${BASE}/match?matchId=${encodeURIComponent(matchId)}&timeline=${encodeURIComponent(timeline)}`,
    { cache: "no-store" }
  );
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
