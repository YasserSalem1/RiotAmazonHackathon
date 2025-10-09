import { GameData } from '../App';
import { Card } from './ui/card';
import { ChevronRight } from 'lucide-react';

interface MatchHistoryCardProps {
  game: GameData;
  onSelect: () => void;
}

export function MatchHistoryCard({ game, onSelect }: MatchHistoryCardProps) {
  const kda = game.kda.deaths === 0 
    ? game.kda.kills + game.kda.assists 
    : ((game.kda.kills + game.kda.assists) / game.kda.deaths).toFixed(2);

  const kdaColor = Number(kda) >= 3 ? 'text-green-400' : Number(kda) >= 2 ? 'text-blue-400' : 'text-slate-400';

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card
      onClick={onSelect}
      className={`p-4 border cursor-pointer transition-all ${
        game.result === 'Victory'
          ? 'bg-blue-950/20 border-blue-900/40 hover:bg-blue-950/30 hover:border-blue-700/60'
          : 'bg-red-950/20 border-red-900/40 hover:bg-red-950/30 hover:border-red-700/60'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Result */}
        <div className="w-20 text-center">
          <div
            className={`text-sm ${
              game.result === 'Victory' ? 'text-blue-400' : 'text-red-400'
            }`}
          >
            {game.result}
          </div>
          <div className="text-slate-500">{timeAgo(game.timestamp)}</div>
        </div>

        {/* Champion & Role */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-[#0a1428] rounded-lg flex items-center justify-center border border-teal-900/50">
            <span className="text-xs text-teal-300">{game.champion.slice(0, 3).toUpperCase()}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-100">{game.champion}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{game.role}</span>
          </div>
          <div className="text-slate-500">{game.gameMode}</div>
        </div>

        {/* KDA */}
        <div className="text-center hidden sm:block">
          <div className="text-slate-100">
            <span className="text-green-400">{game.kda.kills}</span>/
            <span className="text-red-400">{game.kda.deaths}</span>/
            <span className="text-cyan-400">{game.kda.assists}</span>
          </div>
          <div className={`${kdaColor}`}>{kda} KDA</div>
        </div>

        {/* CS & Gold */}
        <div className="text-center hidden md:block">
          <div className="text-slate-100">{game.cs} CS</div>
          <div className="text-yellow-400">{(game.gold / 1000).toFixed(1)}k</div>
        </div>

        {/* Duration */}
        <div className="text-slate-400 hidden lg:block">{game.duration}</div>

        {/* Items Preview */}
        <div className="hidden xl:flex gap-1">
          {game.items.slice(0, 6).map((_, idx) => (
            <div
              key={idx}
              className="w-6 h-6 bg-[#0a1428] rounded border border-teal-900/50"
            />
          ))}
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-teal-500" />
      </div>
    </Card>
  );
}
