import { UserProfile, GameData } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import { MatchHistoryCard } from './MatchHistoryCard';

interface ProfileDashboardProps {
  profile: UserProfile;
  onSelectGame: (game: GameData) => void;
  onLogout: () => void;
}

export function ProfileDashboard({ profile, onSelectGame, onLogout }: ProfileDashboardProps) {
  const { kills, deaths, assists } = profile.games.reduce(
    (acc, game) => ({
      kills: acc.kills + game.kda.kills,
      deaths: acc.deaths + game.kda.deaths,
      assists: acc.assists + game.kda.assists,
    }),
    { kills: 0, deaths: 0, assists: 0 }
  );

  const kda = deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);

  return (
    <div className="min-h-screen text-slate-100">
      {/* Header */}
      <div className="bg-[#0f1b2e]/90 backdrop-blur-sm border-b border-teal-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-slate-400 hover:text-teal-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl">
              {profile.summonerName}
              <span className="text-slate-500">#{profile.tag}</span>
            </h1>
            <p className="text-slate-400">{profile.region}</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 p-6 hover:border-teal-600/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Level</span>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl text-teal-300">{profile.level}</div>
          </Card>

          <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 p-6 hover:border-cyan-600/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Rank</span>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl text-cyan-300">{profile.rank}</div>
          </Card>

          <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 p-6 hover:border-green-600/50 transition-colors">
            <div className="text-slate-400 mb-2">Win Rate</div>
            <div className="text-3xl text-green-400">{profile.recentStats.winRate}%</div>
            <div className="text-slate-500 mt-1">
              {profile.recentStats.totalGames} games
            </div>
          </Card>
        </div>

        {/* Style DNA */}
        <Card className="bg-gradient-to-br from-teal-950/40 via-cyan-950/40 to-emerald-950/40 backdrop-blur-sm border-teal-900/50 p-6 mb-8 shadow-xl">
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Style DNA
            </span>
          </h2>
          <p className="text-slate-400 mb-6">Your lifelong playstyle fingerprint</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Aggression</span>
                <span className="text-teal-400">{profile.styleDNA.aggression}%</span>
              </div>
              <Progress value={profile.styleDNA.aggression} className="h-2 bg-teal-950" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Farming</span>
                <span className="text-green-400">{profile.styleDNA.farming}%</span>
              </div>
              <Progress value={profile.styleDNA.farming} className="h-2 bg-green-950" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Vision Control</span>
                <span className="text-yellow-400">{profile.styleDNA.vision}%</span>
              </div>
              <Progress value={profile.styleDNA.vision} className="h-2 bg-yellow-950" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Teamfighting</span>
                <span className="text-cyan-400">{profile.styleDNA.teamfight}%</span>
              </div>
              <Progress value={profile.styleDNA.teamfight} className="h-2 bg-cyan-950" />
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Top Champions */}
          <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 p-6">
            <h3 className="text-lg mb-4 text-slate-100">Top Champions</h3>
            <div className="space-y-4">
              {profile.topChampions.map((champ, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-100">{champ.name}</div>
                    <div className="text-slate-500">{champ.games} games</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={champ.winrate >= 50 ? 'text-green-400' : 'text-red-400'}
                    >
                      {champ.winrate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Performance */}
          <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 p-6 lg:col-span-2">
            <h3 className="text-lg mb-4 text-slate-100">Recent Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-slate-400 mb-1">Avg KDA</div>
                <div className="text-2xl text-teal-400">{kda}</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Total Kills</div>
                <div className="text-2xl text-green-400">{kills}</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Total Assists</div>
                <div className="text-2xl text-cyan-400">{assists}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Match History */}
        <div>
          <h2 className="text-2xl mb-4">Match History</h2>
          <div className="space-y-3">
            {profile.games.map((game) => (
              <MatchHistoryCard
                key={game.id}
                game={game}
                onSelect={() => onSelectGame(game)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
