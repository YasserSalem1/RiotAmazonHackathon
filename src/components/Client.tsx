"use client";

import { useMemo, useState } from "react";

type RiotParticipant = {
  puuid: string; championName: string; kills: number; deaths: number; assists: number;
  teamId: number; participantId: number;
};
type RiotMatch = { metadata: { matchId: string }, info: { participants: RiotParticipant[], gameDuration: number } };
type Timeline = { info: { frames: Array<{ participantFrames: Record<string, { position?: {x:number,y:number} }> }> } };
type Region = "europe" | "americas" | "asia";

const MAP_MAX = 14870;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return typeof error === "string" ? error : "Unexpected error";
}

export default function Client() {
  const [region, setRegion] = useState<Region>("europe"); // visual for now
  const [query, setQuery] = useState("");
  const [puuid, setPuuid] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ match: RiotMatch; timeline?: Timeline } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSearch() {
    setErr(null); setMatches([]); setSelected(null); setSelectedId(null);

    const v = query.trim();
    if (!v) return;

    // direct match id (EUW1_####…)
    if (/^[A-Z0-9]+_\d+$/.test(v)) {
      await openMatch(v);
      return;
    }

    // Riot ID "Name#TAG"
    if (!v.includes("#")) { setErr('Use Riot ID as Name#TAG or a matchId like EUW1_123…'); return; }
    try {
      setLoading(true);
      const acc = await fetch(`/api/puuid?riotId=${encodeURIComponent(v)}`, { cache: "no-store" }).then(r => r.json());
      if (!acc?.puuid) throw new Error("Could not resolve Riot ID");
      setPuuid(acc.puuid);
      const ids: string[] = await fetch(`/api/matches?puuid=${encodeURIComponent(acc.puuid)}&count=10`, { cache: "no-store" }).then(r => r.json());
      setMatches(ids || []);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setErr(message || "Lookup failed");
    } finally { setLoading(false); }
  }

  async function openMatch(id: string) {
    setSelectedId(id); setSelected(null); setErr(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/match?matchId=${encodeURIComponent(id)}&timeline=1`, { cache: "no-store" });
      const data = await res.json();
      if (data?.info && data?.metadata) setSelected({ match: data });
      else setSelected({ match: data.match, timeline: data.timeline });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setErr(message || "Failed to fetch match");
    } finally { setLoading(false); }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10">
      {/* HERO (centered, slightly up) */}
      <section className="flex min-h-[72vh] items-center justify-center -mt-10">
        <div className="w-full">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                AI League Coach
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              Enter <span className="text-sky-300">Riot ID</span> <code className="text-sky-400">Name#TAG</code> or a{" "}
              <span className="text-cyan-300">Match ID</span>. We’ll fetch your last 10 games and break one down.
            </p>
          </div>

          {/* Pill search bar */}
          <div className="mx-auto w-full max-w-4xl rounded-full border border-white/10 bg-[#191c25]/90 p-2 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-4 px-4 py-2">
              {/* Region (visual only) */}
              <div className="flex min-w-[180px] items-center gap-3">
                <div className="text-sm font-semibold text-white/90">Region</div>
                <select
                  value={region}
                  onChange={event => {
                    const value = event.target.value;
                    if (value === "europe" || value === "americas" || value === "asia") {
                      setRegion(value);
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                >
                  <option value="europe">Europe West</option>
                  <option value="americas">North America</option>
                  <option value="asia">Korea / Japan</option>
                </select>
              </div>

              <div className="h-6 w-px bg-white/10" />

              {/* Search */}
              <div className="flex w-full items-center gap-3">
                <div className="min-w-[72px] text-sm font-semibold text-white/90">Search</div>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none placeholder:text-slate-400"
                  placeholder='Game name + #TAG (e.g., YasserSalem#RANK) or matchId "EUW1_123..."'
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && onSearch()}
                />
                <button
                  onClick={onSearch}
                  disabled={loading}
                  className="h-12 min-w-[88px] rounded-full bg-[#3557ff] px-5 text-base font-extrabold text-white shadow-sm hover:bg-[#4a6aff] disabled:opacity-60"
                  aria-label="Analyze"
                >
                  .GG
                </button>
              </div>
            </div>
          </div>

          {err && <p className="mx-auto mt-4 max-w-4xl text-center text-sm text-rose-300">{err}</p>}
        </div>
      </section>

      {/* MATCH LIST */}
      {puuid && matches.length > 0 && (
        <section className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#11141b] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent matches</h3>
            <span className="text-sm text-slate-400">{matches.length} games</span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {matches.map(id => (
              <li key={id}
                  className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                    selectedId === id ? "border-sky-500/60 bg-sky-500/5" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}>
                <span className="truncate text-sm">{id}</span>
                <button onClick={() => openMatch(id)}
                        className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-sm hover:bg-white/20">
                  Open
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* MATCH DETAIL */}
      {selected && <MatchDetail data={selected} puuid={puuid} />}
    </main>
  );
}

function MatchDetail({ data, puuid }: { data: { match: RiotMatch; timeline?: Timeline }, puuid: string | null }) {
  const parts = data.match.info.participants;
  const me = useMemo(() => (puuid ? parts.find(p => p.puuid === puuid) || null : null), [parts, puuid]);
  const kda = me ? `${me.kills}/${me.deaths}/${me.assists}` : "—";
  const champ = me ? me.championName : "—";

  const points = useMemo(() => {
    if (!data.timeline || !me) return [];
    const frames = data.timeline.info?.frames ?? [];
    const pid = me.participantId;
    const pts: {x:number;y:number}[] = [];
    for (const f of frames) {
      const pos = f?.participantFrames?.[String(pid)]?.position;
      if (pos?.x != null && pos?.y != null) pts.push({ x: pos.x, y: pos.y });
    }
    return pts;
  }, [data.timeline, me]);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 rounded-2xl border border-white/10 bg-[#11141b] p-6">
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Info label="Match ID" value={data.match.metadata.matchId} />
        <Info label="Duration (s)" value={String(data.match.info.gameDuration)} />
        <Info label="Your Champion" value={champ} />
        <Info label="Your KDA" value={kda} />
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="mb-2 text-sm font-semibold">Movement heatmap (you)</div>
          <Heatmap points={points} width={560} height={560} />
        </div>
        <div className="grid gap-3 md:col-span-2">
          {[100,200].map(team => (
            <div key={team} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-sm font-semibold">{team===100 ? "Blue Team" : "Red Team"}</div>
              <ul className="space-y-2 text-sm">
                {parts.filter(p => p.teamId===team).map(p => (
                  <li key={p.puuid} className="flex justify-between">
                    <span className="font-medium">{p.championName}</span>
                    <span className="text-slate-400">{p.kills}/{p.deaths}/{p.assists}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Info({label, value}:{label:string; value:string}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Heatmap({ points, width=560, height=560 }:{ points:{x:number;y:number}[]; width?:number; height?:number }) {
  const circles = points.map((p,i)=>{
    const px = (p.x / MAP_MAX) * width;
    const py = height - (p.y / MAP_MAX) * height;
    return <circle key={i} cx={px} cy={py} r="9" fill="url(#g)" opacity="0.28" />;
  });
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0e1118]">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        <defs>
          <radialGradient id="g" r="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="#0b1220" />
        {circles}
      </svg>
    </div>
  );
}
