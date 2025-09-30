"use client";

import { useMemo, useState } from "react";

type RiotParticipant = {
  puuid: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  teamId: number;
  participantId: number;
};
type RiotMatch = {
  metadata: { matchId: string };
  info: { participants: RiotParticipant[]; gameDuration: number };
};
type Timeline = {
  info: {
    frames: Array<{
      participantFrames: Record<string, { position?: { x: number; y: number } }>;
    }>;
  };
};
type MatchBundle = { match: RiotMatch; timeline?: Timeline };

function isRiotMatch(x: unknown): x is RiotMatch {
  const m = x as RiotMatch;
  return !!m && typeof m === "object" && "metadata" in m && "info" in m;
}
function isMatchBundle(x: unknown): x is MatchBundle {
  const b = x as MatchBundle;
  return !!b && typeof b === "object" && "match" in b;
}

const MAP_MAX = 14870;

export default function Client() {
  const [region, setRegion] = useState<"europe" | "americas" | "asia">("europe"); // visual only for now
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  const [puuid, setPuuid] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<MatchBundle | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSearch() {
    setErr(null);
    setMatches([]);
    setSelected(null);
    setSelectedId(null);

    const name = gameName.trim();
    const tagRaw = tagLine.trim().replace(/^#/, ""); // strip leading '#'
    const tag = tagRaw.toUpperCase();

    if (!name) {
      setErr("Please enter your Game name.");
      return;
    }

    // If user pasted a direct match ID into the name box, open it
    if (/^[A-Z0-9]+_\d+$/.test(name)) {
      await openMatch(name);
      return;
    }

    if (!tag) {
      setErr("Please enter your Tag (e.g., RANK).");
      return;
    }

    try {
      setLoading(true);

      // EXACTLY like your curl: /account?gameName=...&tagLine=...
      const accRes = await fetch(
        `/api/puuid?gameName=${encodeURIComponent(name)}&tagLine=${encodeURIComponent(tag)}`,
        { cache: "no-store" }
      );
      const acc = (await accRes.json()) as { puuid?: string; error?: unknown };
      if (!accRes.ok || !acc?.puuid) {
        throw new Error("Could not resolve ID. Check name and tag.");
      }
      setPuuid(acc.puuid);

      const listRes = await fetch(`/api/matches?puuid=${encodeURIComponent(acc.puuid)}&count=10`, {
        cache: "no-store",
      });
      const ids = (await listRes.json()) as unknown;
      if (!Array.isArray(ids)) {
        throw new Error("Failed to fetch recent matches.");
      }
      setMatches(ids as string[]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lookup failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  async function openMatch(id: string) {
    setSelectedId(id);
    setSelected(null);
    setErr(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/match?matchId=${encodeURIComponent(id)}&timeline=1`, { cache: "no-store" });
      const raw = (await res.json()) as unknown;
      if (isRiotMatch(raw)) setSelected({ match: raw });
      else if (isMatchBundle(raw)) setSelected(raw);
      else throw new Error("Unexpected match response.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to fetch match.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10">
      {/* HERO */}
      <section className="flex min-h-[72vh] items-center justify-center -mt-10">
        <div className="w-full text-center">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              AI League Coach
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Enter Riot <span className="text-sky-300">Game name</span> and{" "}
            <span className="text-cyan-300">#Tag</span>, or paste a Match ID. We’ll fetch your last 10 games and break
            one down.
          </p>

          {/* Pill search */}
          <div className="mx-auto mt-6 w-full max-w-4xl rounded-full border border-white/10 bg-[#191c25]/90 p-2 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-4 px-4 py-2">
              {/* Region (visual) */}
              <div className="flex min-w-[180px] items-center gap-3 text-left">
                <div className="text-sm font-semibold text-white/90">Region</div>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as "europe" | "americas" | "asia")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                >
                  <option value="europe">Europe West</option>
                  <option value="americas">North America</option>
                  <option value="asia">Korea / Japan</option>
                </select>
              </div>

              <div className="h-6 w-px bg-white/10" />

              {/* Two inputs: Game name + #Tag */}
              <div className="flex w-full items-center gap-3">
                <div className="min-w-[72px] text-sm font-semibold text-white/90">Search</div>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none placeholder:text-slate-400"
                  placeholder='Game name (e.g., "YasserSalem" or paste "EUW1_123...")'
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
                <div className="text-xl text-slate-400">#</div>
                <input
                  className="h-12 w-40 rounded-xl border border-white/10 bg-white/5 px-3 text-base text-white outline-none placeholder:text-slate-400"
                  placeholder="RANK"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
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

          {err && <p className="mx-auto mt-3 max-w-4xl text-center text-sm text-rose-300">{err}</p>}
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
            {matches.map((id) => (
              <li
                key={id}
                className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                  selectedId === id ? "border-sky-500/60 bg-sky-500/5" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="truncate text-sm">{id}</span>
                <button
                  onClick={() => openMatch(id)}
                  className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
                >
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

function MatchDetail({ data, puuid }: { data: MatchBundle; puuid: string | null }) {
  const parts = data.match.info.participants;

  const me = useMemo(() => {
    if (!puuid) return null;
    return parts.find((p) => p.puuid === puuid) || null;
  }, [parts, puuid]);

  const kda = me ? `${me.kills}/${me.deaths}/${me.assists}` : "—";
  const champ = me ? me.championName : "—";

  const points = useMemo(() => {
    if (!data.timeline || !me) return [];
    const frames = data.timeline.info?.frames ?? [];
    const pid = me.participantId;
    const pts: { x: number; y: number }[] = [];
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
          {[100, 200].map((team) => (
            <div key={team} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-sm font-semibold">{team === 100 ? "Blue Team" : "Red Team"}</div>
              <ul className="space-y-2 text-sm">
                {parts
                  .filter((p) => p.teamId === team)
                  .map((p) => (
                    <li key={p.puuid} className="flex justify-between">
                      <span className="font-medium">{p.championName}</span>
                      <span className="text-slate-400">
                        {p.kills}/{p.deaths}/{p.assists}
                      </span>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Heatmap({
  points,
  width = 560,
  height = 560,
}: {
  points: { x: number; y: number }[];
  width?: number;
  height?: number;
}) {
  const circles = points.map((p, i) => {
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
