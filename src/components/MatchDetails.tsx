"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  info: { 
    participants: RiotParticipant[];
    gameDuration: number;
    gameStartTimestamp: number;
  };
};

type Timeline = {
  info: {
    frames: Array<{
      participantFrames: Record<string, { position?: { x: number; y: number } }>;
      timestamp: number;
      events?: Array<{
        type: string;
        timestamp: number;
        participantId?: number;
        position?: { x: number; y: number };
        killerId?: number;
        victimId?: number;
      }>;
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


interface MatchDetailsProps {
  matchId: string;
}

export default function MatchDetails({ matchId }: MatchDetailsProps) {
  const router = useRouter();
  const [matchData, setMatchData] = useState<MatchBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);
  const [playerPuuid, setPlayerPuuid] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        setLoading(true);
        const res = await fetch(`/api/match?matchId=${encodeURIComponent(matchId)}&timeline=1`, { 
          cache: "no-store" 
        });
        const raw = (await res.json()) as unknown;
        
        if (isRiotMatch(raw)) {
          setMatchData({ match: raw });
        } else if (isMatchBundle(raw)) {
          setMatchData(raw);
          // For now, we'll use the first participant as the "player"
          // In a real app, you'd pass the actual player PUUID from the URL or context
          if (raw.match.info.participants.length > 0) {
            setPlayerPuuid(raw.match.info.participants[0].puuid);
          }
        } else {
          throw new Error("Unexpected match response.");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to fetch match.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchMatch();
  }, [matchId]);

  const timelineData = useMemo(() => {
    if (!matchData?.timeline || !playerPuuid) return { playerMoments: [], gameDuration: 0 };
    
    const playerMoments = [];
    const frames = matchData.timeline.info.frames;
    const gameDuration = matchData.match.info.gameDuration * 1000; // Convert to milliseconds
    
    // Find the player's participant ID
    const playerParticipant = matchData.match.info.participants.find(p => p.puuid === playerPuuid);
    if (!playerParticipant) return { playerMoments: [], gameDuration };
    
    const playerParticipantId = playerParticipant.participantId;
    
    for (const frame of frames) {
      if (frame.events) {
        for (const event of frame.events) {
          // Only include events where the player is involved
          const isPlayerInvolved = 
            event.killerId === playerParticipantId || 
            event.victimId === playerParticipantId ||
            event.participantId === playerParticipantId;
            
          if (isPlayerInvolved && (event.type === 'CHAMPION_KILL' || event.type === 'ELITE_MONSTER_KILL' || event.type === 'ITEM_PURCHASED')) {
            let description = '';
            if (event.type === 'CHAMPION_KILL') {
              if (event.killerId === playerParticipantId) {
                description = 'Kill';
              } else if (event.victimId === playerParticipantId) {
                description = 'Death';
              }
            } else if (event.type === 'ELITE_MONSTER_KILL') {
              description = 'Objective';
            } else if (event.type === 'ITEM_PURCHASED') {
              description = 'Item Purchase';
            }
            
            if (description) {
              playerMoments.push({
                timestamp: event.timestamp,
                type: event.type,
                description,
                position: event.position,
                participantId: event.participantId,
                killerId: event.killerId,
                victimId: event.victimId
              });
            }
          }
        }
      }
    }
    
    return {
      playerMoments: playerMoments.sort((a, b) => a.timestamp - b.timestamp),
      gameDuration
    };
  }, [matchData, playerPuuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading match details...</div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">{error || "Match not found"}</div>
          <Link 
            href="/" 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const { match, timeline } = matchData;
  const gameDuration = Math.floor(match.info.gameDuration / 60);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Match Analysis</h1>
              <p className="text-muted-foreground">Match ID: {match.metadata.matchId}</p>
            </div>
            <Link 
              href="/" 
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-accent"
            >
              Back to Search
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
            <div className="bg-secondary p-3 rounded-lg">
              <div className="text-muted-foreground">Duration</div>
              <div className="font-semibold text-secondary-foreground">{gameDuration}m {match.info.gameDuration % 60}s</div>
            </div>
            <div className="bg-secondary p-3 rounded-lg">
              <div className="text-muted-foreground">Game Mode</div>
              <div className="font-semibold text-secondary-foreground">Ranked Solo</div>
            </div>
            <div className="bg-secondary p-3 rounded-lg">
              <div className="text-muted-foreground">Map</div>
              <div className="font-semibold text-secondary-foreground">Summoner's Rift</div>
            </div>
            <div className="bg-secondary p-3 rounded-lg">
              <div className="text-muted-foreground">Patch</div>
              <div className="font-semibold text-secondary-foreground">14.1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Map Section - 2/3 width */}
          <div className="col-span-2 flex flex-col">
            <div className="bg-card border border-border rounded-lg p-4 flex-1">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Game Map</h2>
              <div className="flex-1 min-h-[500px]">
                <MapVisualization 
                  timeline={timeline}
                  selectedTimestamp={selectedTimestamp}
                  playerPuuid={playerPuuid}
                  matchData={matchData}
                />
              </div>
            </div>
          </div>

          {/* Chat Section - 1/3 width */}
          <div className="col-span-1 flex flex-col">
            <div className="bg-card border border-border rounded-lg p-4 flex-1">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">AI Analysis</h2>
              <div className="bg-muted rounded-lg p-4 flex-1 flex flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  <div className="bg-background p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">AI Coach</div>
                    <div className="text-card-foreground">Welcome to your match analysis! I'll help you understand what happened in this game.</div>
                  </div>
                  <div className="bg-background p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">AI Coach</div>
                    <div className="text-card-foreground">Click on timeline moments to see what happened at specific times in the game.</div>
                  </div>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask about this match..."
                      className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground"
                    />
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        {timelineData.playerMoments.length > 0 && (
          <div className="mt-6 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Player Timeline</h2>
            <PlayerTimeline 
              playerMoments={timelineData.playerMoments}
              gameDuration={timelineData.gameDuration}
              selectedTimestamp={selectedTimestamp}
              onTimestampSelect={setSelectedTimestamp}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MapVisualization({ 
  timeline, 
  selectedTimestamp, 
  playerPuuid,
  matchData
}: { 
  timeline?: Timeline;
  selectedTimestamp: number | null;
  playerPuuid?: string | null;
  matchData?: MatchBundle | null;
}) {
  const points = useMemo(() => {
    if (!timeline || !matchData) return [];
    
    const frames = timeline.info.frames;
    const points: { x: number; y: number; timestamp: number }[] = [];
    
    // Find the player's participant ID from match data
    let targetParticipantId: string | null = null;
    
    if (playerPuuid && matchData.match.info.participants) {
      const playerParticipant = matchData.match.info.participants.find(p => p.puuid === playerPuuid);
      if (playerParticipant) {
        targetParticipantId = playerParticipant.participantId.toString();
      }
    }
    
    // If we can't find the specific player, use the first participant as fallback
    if (!targetParticipantId) {
      targetParticipantId = Object.keys(timeline.info.frames[0]?.participantFrames || {})[0];
    }
    
    if (!targetParticipantId) return [];
    
    // Get positions for the target player
    for (const frame of frames) {
      const participantFrame = frame.participantFrames[targetParticipantId];
      if (participantFrame?.position?.x != null && participantFrame?.position?.y != null) {
        // If we have a selected timestamp, only show positions around that time
        if (selectedTimestamp) {
          if (Math.abs(frame.timestamp - selectedTimestamp) < 30000) { // Within 30 seconds
            points.push({
              x: participantFrame.position.x,
              y: participantFrame.position.y,
              timestamp: frame.timestamp
            });
          }
        } else {
          // Show all positions if no timestamp selected
          points.push({
            x: participantFrame.position.x,
            y: participantFrame.position.y,
            timestamp: frame.timestamp
          });
        }
      }
    }
    
    return points;
  }, [timeline, selectedTimestamp, playerPuuid, matchData]);

  // Define the map dimensions - Summoner's Rift is roughly square
  const mapWidth = 14870;
  const mapHeight = 14870;

  const circles = points.map((p, i) => {
    // Convert game coordinates to SVG coordinates
    // Game coordinates: (0,0) is bottom-left, (14870,14870) is top-right
    // SVG coordinates: (0,0) is top-left, so we need to flip Y
    const px = p.x;
    const py = mapHeight - p.y; // Flip Y coordinate
    const isSelected = selectedTimestamp && Math.abs(p.timestamp - selectedTimestamp) < 30000;
    
    return (
      <circle 
        key={i} 
        cx={px} 
        cy={py} 
        r={isSelected ? "120" : "60"} 
        fill={isSelected ? "url(#selectedPlayerGradient)" : "url(#playerGradient)"} 
        opacity={isSelected ? "0.9" : "0.6"}
        stroke={isSelected ? "#22d3ee" : "none"}
        strokeWidth={isSelected ? "20" : "0"}
      />
    );
  });

  return (
    <div className="w-full h-full relative bg-gray-900">
      <img 
        src="/SummonerRiftMap.jpg" 
        alt="Summoner's Rift Map"
        className="w-full h-full object-cover"
      />
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 14870 14870"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="playerGradient" r="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="selectedPlayerGradient" r="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>
        {circles}
      </svg>
    </div>
  );
}

function PlayerTimeline({ 
  playerMoments, 
  gameDuration, 
  selectedTimestamp, 
  onTimestampSelect 
}: {
  playerMoments: Array<{timestamp: number; type: string; description: string}>;
  gameDuration: number;
  selectedTimestamp: number | null;
  onTimestampSelect: (timestamp: number) => void;
}) {
  const formatTime = (timestamp: number) => {
    const minutes = Math.floor(timestamp / 60000);
    const seconds = Math.floor((timestamp % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCircleSize = (type: string) => {
    switch (type) {
      case 'ELITE_MONSTER_KILL': return 'w-4 h-4';
      case 'CHAMPION_KILL': return 'w-3 h-3';
      case 'ITEM_PURCHASED': return 'w-2 h-2';
      default: return 'w-2 h-2';
    }
  };

  const getCircleColor = (description: string, isSelected: boolean) => {
    let baseColor = 'bg-gray-400';
    if (description === 'Kill') baseColor = 'bg-green-400';
    else if (description === 'Death') baseColor = 'bg-red-400';
    else if (description === 'Objective') baseColor = 'bg-yellow-400';
    else if (description === 'Item Purchase') baseColor = 'bg-blue-400';
    
    return isSelected ? `${baseColor} ring-2 ring-white` : baseColor;
  };

  return (
    <div className="relative">
      {/* Time markers */}
      <div className="flex justify-between text-xs text-muted-foreground mb-4">
        <span>0:00</span>
        <span>{formatTime(gameDuration / 4)}</span>
        <span>{formatTime(gameDuration / 2)}</span>
        <span>{formatTime(gameDuration * 3 / 4)}</span>
        <span>{formatTime(gameDuration)}</span>
      </div>

      {/* Timeline container */}
      <div className="bg-slate-800 rounded-lg p-4 relative">
        <div className="text-white text-sm font-medium mb-3">Player Events</div>
        <div className="relative h-8 bg-slate-700 rounded">
          {playerMoments.map((moment, index) => {
            const position = (moment.timestamp / gameDuration) * 100;
            const isSelected = selectedTimestamp === moment.timestamp;
            return (
              <button
                key={index}
                onClick={() => onTimestampSelect(moment.timestamp)}
                className={`absolute ${getCircleSize(moment.type)} ${getCircleColor(moment.description, isSelected)} rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 top-1/2`}
                style={{ left: `${position}%` }}
                title={`${moment.description} at ${formatTime(moment.timestamp)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
