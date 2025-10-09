import bgImage from 'figma:asset/1253b31725a9efc07506531e701b34309fbd8d57.png';

interface SummonersRiftMapProps {
  selectedEvent: number | null;
  championPositions?: Array<{
    champion: string;
    x: number;
    y: number;
    team: 'blue' | 'red';
  }>;
}

export function SummonersRiftMap({ selectedEvent, championPositions }: SummonersRiftMapProps) {
  // Default champion positions if none provided
  const defaultPositions = [
    { champion: 'Jinx', x: 20, y: 80, team: 'blue' as const },
    { champion: 'Thresh', x: 25, y: 85, team: 'blue' as const },
    { champion: 'Ahri', x: 50, y: 50, team: 'blue' as const },
    { champion: 'Lee Sin', x: 40, y: 60, team: 'blue' as const },
    { champion: 'Aatrox', x: 30, y: 30, team: 'blue' as const },
    { champion: 'Ezreal', x: 80, y: 20, team: 'red' as const },
    { champion: 'Lux', x: 75, y: 15, team: 'red' as const },
    { champion: 'Zed', x: 50, y: 45, team: 'red' as const },
    { champion: 'Graves', x: 60, y: 40, team: 'red' as const },
    { champion: 'Garen', x: 70, y: 70, team: 'red' as const },
  ];

  const positions = championPositions || defaultPositions;

  // Helper to get champion icon URL
  const getChampionIcon = (championName: string) => {
    // Using Community Dragon CDN for champion icons
    const formattedName = championName.replace(/[' ]/g, '');
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${getChampionId(championName)}.png`;
  };

  // Helper function to map champion names to IDs (simplified version)
  const getChampionId = (name: string) => {
    const championIds: Record<string, number> = {
      'Jinx': 222, 'Thresh': 412, 'Ahri': 103, 'Lee Sin': 64, 'Aatrox': 266,
      'Ezreal': 81, 'Lux': 99, 'Zed': 238, 'Graves': 104, 'Garen': 86,
      'Caitlyn': 51, 'Kai\'Sa': 145, 'Darius': 122, 'Vi': 254, 'Nautilus': 111,
      'Ornn': 516, 'Kha\'Zix': 121, 'Syndra': 134, 'Leona': 89, 'Sett': 875,
      'Elise': 60, 'Orianna': 61, 'Malphite': 54, 'Nocturne': 56, 'Yasuo': 157,
      'Lucian': 236, 'Braum': 201,
    };
    return championIds[name] || 1;
  };

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-teal-900/50 shadow-2xl">
      {/* Background - Summoner's Rift inspired */}
      <div className="absolute inset-0 bg-[#0a1428]">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/60 via-emerald-950/40 to-cyan-950/60"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(91, 155, 213, 0.5)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* River diagonal */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-20">
          <line
            x1="0"
            y1="100%"
            x2="100%"
            y2="0"
            stroke="rgba(11, 197, 234, 0.6)"
            strokeWidth="80"
          />
        </svg>
      </div>

      {/* Blue side (bottom-left) */}
      <div className="absolute bottom-3 left-3 bg-blue-600/40 border border-blue-400/60 rounded px-3 py-1.5 backdrop-blur-sm">
        <span className="text-blue-200">Blue Side</span>
      </div>

      {/* Red side (top-right) */}
      <div className="absolute top-3 right-3 bg-red-600/40 border border-red-400/60 rounded px-3 py-1.5 backdrop-blur-sm">
        <span className="text-red-200">Red Side</span>
      </div>

      {/* Baron pit (top) */}
      <div
        className="absolute w-14 h-14 bg-purple-600/30 border-2 border-purple-400/70 rounded-full backdrop-blur-sm"
        style={{ left: '50%', top: '15%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-full h-full flex items-center justify-center text-purple-300">B</div>
      </div>

      {/* Dragon pit (bottom) */}
      <div
        className="absolute w-14 h-14 bg-orange-600/30 border-2 border-orange-400/70 rounded-full backdrop-blur-sm"
        style={{ left: '50%', bottom: '15%', transform: 'translate(-50%, 50%)' }}
      >
        <div className="w-full h-full flex items-center justify-center text-orange-300">D</div>
      </div>

      {/* Champion icons as position markers */}
      {positions.map((pos, idx) => (
        <div
          key={idx}
          className={`absolute transition-all cursor-pointer ${
            selectedEvent === idx
              ? 'scale-125 z-20'
              : 'hover:scale-110 z-10'
          }`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className={`relative w-12 h-12 rounded-full border-3 ${
            pos.team === 'blue'
              ? 'border-blue-400 shadow-lg shadow-blue-500/50'
              : 'border-red-400 shadow-lg shadow-red-500/50'
          } ${
            selectedEvent === idx
              ? 'ring-4 ring-yellow-400'
              : ''
          }`}>
            <img
              src={getChampionIcon(pos.champion)}
              alt={pos.champion}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                // Fallback to colored circle with initial
                e.currentTarget.style.display = 'none';
              }}
            />
            <div 
              className={`absolute inset-0 rounded-full flex items-center justify-center ${
                pos.team === 'blue' ? 'bg-blue-500/80' : 'bg-red-500/80'
              } text-white`}
              style={{ display: 'none' }}
            >
              {pos.champion[0]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
