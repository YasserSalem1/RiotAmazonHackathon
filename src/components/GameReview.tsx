import { useState } from 'react';
import { GameData } from '../App';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { SummonersRiftMap } from './SummonersRiftMap';
import { GameTimeline } from './GameTimeline';
import { GameChatbot } from './GameChatbot';
import { Card } from './ui/card';

interface GameReviewProps {
  game: GameData;
  summonerName: string;
  onBack: () => void;
}

export function GameReview({ game, summonerName, onBack }: GameReviewProps) {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const kda = game.kda.deaths === 0 
    ? game.kda.kills + game.kda.assists 
    : ((game.kda.kills + game.kda.assists) / game.kda.deaths).toFixed(2);

  return (
    <div className="min-h-screen text-slate-100">
      {/* Header */}
      <div className="bg-[#0f1b2e]/90 backdrop-blur-sm border-b border-teal-900/30">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-400 hover:text-teal-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matches
            </Button>
            <div
              className={`px-4 py-2 rounded-lg border ${
                game.result === 'Victory'
                  ? 'bg-blue-950/50 text-blue-400 border-blue-600/50'
                  : 'bg-red-950/50 text-red-400 border-red-600/50'
              }`}
            >
              {game.result}
            </div>
          </div>

          {/* Game Summary */}
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <div className="text-slate-400">Champion</div>
              <div className="text-xl text-teal-300">{game.champion}</div>
            </div>
            <div>
              <div className="text-slate-400">KDA</div>
              <div className="text-xl">
                <span className="text-green-400">{game.kda.kills}</span>/
                <span className="text-red-400">{game.kda.deaths}</span>/
                <span className="text-cyan-400">{game.kda.assists}</span>
                <span className="text-teal-400 ml-2">({kda})</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400">CS</div>
              <div className="text-xl text-slate-200">{game.cs}</div>
            </div>
            <div>
              <div className="text-slate-400">Gold</div>
              <div className="text-xl text-yellow-400">{(game.gold / 1000).toFixed(1)}k</div>
            </div>
            <div>
              <div className="text-slate-400">Duration</div>
              <div className="text-xl text-slate-200">{game.duration}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Map & Timeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* Summoner's Rift Map */}
            <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 p-6">
              <h2 className="text-xl mb-4 text-teal-300">Summoner's Rift</h2>
              <SummonersRiftMap selectedEvent={selectedEvent} />
            </Card>

            {/* Game Timeline */}
            <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 p-6">
              <h2 className="text-xl mb-4 text-teal-300">Game Timeline</h2>
              <GameTimeline
                game={game}
                summonerName={summonerName}
                selectedEvent={selectedEvent}
                onSelectEvent={setSelectedEvent}
              />
            </Card>
          </div>

          {/* Right: AI Chatbot */}
          <div className="lg:col-span-4">
            <GameChatbot game={game} summonerName={summonerName} />
          </div>
        </div>
      </div>
    </div>
  );
}
