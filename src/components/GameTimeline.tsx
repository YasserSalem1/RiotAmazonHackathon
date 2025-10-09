import { GameData } from '../App';
import { Skull, Crown, Building, TrendingUp, Circle, Target, Shield, Swords } from 'lucide-react';
import { useState } from 'react';
import timelineImage from 'figma:asset/908e87cc06cc3d66e8f0d7d9bc9662ef833f4ca4.png';

interface GameTimelineProps {
  game: GameData;
  summonerName: string;
  selectedEvent: number | null;
  onSelectEvent: (id: number) => void;
}

type TimelineEvent = {
  id: number;
  timeInSeconds: number;
  type: 'kill' | 'death' | 'assist' | 'objective' | 'item' | 'tower' | 'dragon' | 'baron';
  description: string;
  team: 'blue' | 'red';
  icon: React.ComponentType<{ className?: string }>;
};

export function GameTimeline({ game, summonerName, selectedEvent, onSelectEvent }: GameTimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  
  // Parse game duration to seconds
  const [minutes, seconds] = game.duration.split(':').map(Number);
  const totalGameSeconds = minutes * 60 + seconds;

  // Mock timeline events with seconds
  const events: TimelineEvent[] = [
    {
      id: 0,
      timeInSeconds: 204, // 3:24
      type: 'kill',
      description: 'First Blood! You killed EnemyADC',
      team: 'blue',
      icon: Crown,
    },
    {
      id: 1,
      timeInSeconds: 375, // 6:15
      type: 'dragon',
      description: 'Your team secured the first Dragon',
      team: 'blue',
      icon: Target,
    },
    {
      id: 2,
      timeInSeconds: 522, // 8:42
      type: 'death',
      description: 'You were killed by EnemyMid',
      team: 'red',
      icon: Skull,
    },
    {
      id: 3,
      timeInSeconds: 690, // 11:30
      type: 'tower',
      description: 'Your team destroyed the bottom tower',
      team: 'blue',
      icon: Building,
    },
    {
      id: 4,
      timeInSeconds: 858, // 14:18
      type: 'kill',
      description: 'You killed EnemySupp and EnemyADC (Double Kill!)',
      team: 'blue',
      icon: Swords,
    },
    {
      id: 5,
      timeInSeconds: 1015, // 16:55
      type: 'item',
      description: 'You completed Infinity Edge',
      team: 'blue',
      icon: Shield,
    },
    {
      id: 6,
      timeInSeconds: 1162, // 19:22
      type: 'baron',
      description: 'Your team secured Baron Nashor',
      team: 'blue',
      icon: Crown,
    },
    {
      id: 7,
      timeInSeconds: 1263, // 21:03
      type: 'assist',
      description: 'You assisted in killing EnemyJG',
      team: 'blue',
      icon: Target,
    },
    {
      id: 8,
      timeInSeconds: 1380, // 23:00
      type: 'tower',
      description: 'Enemy team destroyed mid inhibitor',
      team: 'red',
      icon: Building,
    },
    {
      id: 9,
      timeInSeconds: 1500, // 25:00
      type: 'dragon',
      description: 'Your team secured Elder Dragon',
      team: 'blue',
      icon: Target,
    },
    {
      id: 10,
      timeInSeconds: 1620, // 27:00
      type: 'kill',
      description: 'Team fight! 3 kills',
      team: 'blue',
      icon: Swords,
    },
    {
      id: 11,
      timeInSeconds: 1740, // 29:00
      type: 'death',
      description: 'You were killed by EnemyTop',
      team: 'red',
      icon: Skull,
    },
  ];

  // Generate time markers (every minute)
  const totalMinutes = Math.ceil(totalGameSeconds / 60);
  const timeMarkers = Array.from({ length: totalMinutes + 1 }, (_, i) => i);

  // Group events by position to stack them
  const getEventPosition = (timeInSeconds: number) => {
    return (timeInSeconds / totalGameSeconds) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Timeline Bar */}
      <div className="relative w-full bg-[#0a1428]/70 border border-teal-900/30 rounded-lg p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Time markers */}
          <div className="relative h-16 mb-2">
            <div className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-teal-900/50 via-cyan-900/50 to-teal-900/50"></div>
            
            {/* Minute markers */}
            <div className="relative flex justify-between">
              {timeMarkers.map((minute) => (
                <div
                  key={minute}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / totalMinutes}%` }}
                >
                  <div className="text-teal-400 text-xs mb-1">{minute}m</div>
                  <div className="w-px h-2 bg-teal-600/50"></div>
                </div>
              ))}
            </div>

            {/* Event icons */}
            <div className="absolute top-12 left-0 right-0 h-12">
              {events.map((event) => {
                const position = getEventPosition(event.timeInSeconds);
                const Icon = event.icon;
                const isSelected = selectedEvent === event.id;
                const isHovered = hoveredEvent === event.id;
                
                return (
                  <div
                    key={event.id}
                    className="absolute"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                  >
                    <button
                      onClick={() => onSelectEvent(event.id)}
                      onMouseEnter={() => setHoveredEvent(event.id)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      className={`relative group transition-all ${
                        isSelected ? 'z-20' : 'z-10'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${
                          event.team === 'blue'
                            ? isSelected
                              ? 'bg-blue-500 border-blue-300 shadow-lg shadow-blue-500/50'
                              : 'bg-blue-600/80 border-blue-400 hover:bg-blue-500 hover:scale-110'
                            : isSelected
                            ? 'bg-red-500 border-red-300 shadow-lg shadow-red-500/50'
                            : 'bg-red-600/80 border-red-400 hover:bg-red-500 hover:scale-110'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      
                      {/* Tooltip on hover */}
                      {isHovered && !isSelected && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-xs p-2 rounded shadow-lg border border-slate-700 pointer-events-none z-30">
                          <div className="text-slate-400">{formatTime(event.timeInSeconds)}</div>
                          <div className="mt-1">{event.description}</div>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {events.map((event) => {
          const Icon = event.icon;
          const isSelected = selectedEvent === event.id;
          
          return (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-teal-950/50 border-teal-600'
                  : 'bg-[#0a1428]/30 border-teal-900/30 hover:bg-[#0a1428]/50 hover:border-teal-700/50'
              }`}
            >
              {/* Time */}
              <div className="text-slate-400 text-sm w-12 flex-shrink-0">
                {formatTime(event.timeInSeconds)}
              </div>

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                  event.team === 'blue'
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                    : 'bg-red-600/30 text-red-300 border-red-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <div className="text-slate-100 text-sm">{event.description}</div>
              </div>

              {/* Type badge */}
              <div className="hidden md:block">
                <div
                  className={`px-2 py-1 rounded text-xs uppercase border ${
                    event.type === 'kill' || event.type === 'assist'
                      ? 'bg-green-950/50 text-green-400 border-green-700/30'
                      : event.type === 'death'
                      ? 'bg-red-950/50 text-red-400 border-red-700/30'
                      : event.type === 'objective' || event.type === 'dragon' || event.type === 'baron'
                      ? 'bg-purple-950/50 text-purple-400 border-purple-700/30'
                      : event.type === 'tower'
                      ? 'bg-orange-950/50 text-orange-400 border-orange-700/30'
                      : 'bg-cyan-950/50 text-cyan-400 border-cyan-700/30'
                  }`}
                >
                  {event.type}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
