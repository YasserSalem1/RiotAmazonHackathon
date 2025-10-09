import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ProfileDashboard } from './components/ProfileDashboard';
import { GameReview } from './components/GameReview';
import bgImage from 'figma:asset/715df4c2a23e4f231a74b8adb1a9fe4b50f70e23.png';

export type GameData = {
  id: string;
  champion: string;
  role: string;
  result: 'Victory' | 'Defeat';
  kda: { kills: number; deaths: number; assists: number };
  cs: number;
  gold: number;
  duration: string;
  gameMode: string;
  timestamp: number;
  items: number[];
  summonerSpells: string[];
  runes: string[];
  teammates: Array<{ name: string; champion: string }>;
  enemies: Array<{ name: string; champion: string }>;
};

export type UserProfile = {
  region: string;
  summonerName: string;
  tag: string;
  level: number;
  rank: string;
  styleDNA: {
    aggression: number;
    farming: number;
    vision: number;
    teamfight: number;
  };
  topChampions: Array<{ name: string; games: number; winrate: number }>;
  recentStats: {
    winRate: number;
    avgKDA: number;
    totalGames: number;
  };
  games: GameData[];
};

function App() {
  const [view, setView] = useState<'landing' | 'profile' | 'review'>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);

  const handleLogin = (region: string, ign: string, tag: string) => {
    // Mock user profile data
    const mockProfile: UserProfile = {
      region,
      summonerName: ign,
      tag,
      level: 247,
      rank: 'Diamond III',
      styleDNA: {
        aggression: 72,
        farming: 85,
        vision: 68,
        teamfight: 78,
      },
      topChampions: [
        { name: 'Jinx', games: 124, winrate: 58 },
        { name: 'Caitlyn', games: 89, winrate: 52 },
        { name: 'Kai\'Sa', games: 76, winrate: 61 },
      ],
      recentStats: {
        winRate: 54.3,
        avgKDA: 3.2,
        totalGames: 342,
      },
      games: [
        {
          id: '1',
          champion: 'Jinx',
          role: 'ADC',
          result: 'Victory',
          kda: { kills: 12, deaths: 3, assists: 8 },
          cs: 234,
          gold: 14200,
          duration: '32:14',
          gameMode: 'Ranked Solo/Duo',
          timestamp: Date.now() - 3600000,
          items: [1, 2, 3, 4, 5, 6],
          summonerSpells: ['Flash', 'Heal'],
          runes: ['Lethal Tempo', 'Triumph', 'Legend: Bloodline', 'Cut Down'],
          teammates: [
            { name: 'TopPlayer', champion: 'Aatrox' },
            { name: 'JungleMain', champion: 'Lee Sin' },
            { name: 'MidGod', champion: 'Ahri' },
            { name: 'SupportKing', champion: 'Thresh' },
          ],
          enemies: [
            { name: 'EnemyTop', champion: 'Garen' },
            { name: 'EnemyJG', champion: 'Graves' },
            { name: 'EnemyMid', champion: 'Zed' },
            { name: 'EnemyADC', champion: 'Ezreal' },
            { name: 'EnemySupp', champion: 'Lux' },
          ],
        },
        {
          id: '2',
          champion: 'Caitlyn',
          role: 'ADC',
          result: 'Defeat',
          kda: { kills: 6, deaths: 7, assists: 4 },
          cs: 198,
          gold: 11800,
          duration: '28:45',
          gameMode: 'Ranked Solo/Duo',
          timestamp: Date.now() - 7200000,
          items: [1, 2, 3, 4, 5, 6],
          summonerSpells: ['Flash', 'Heal'],
          runes: ['Fleet Footwork', 'Presence of Mind', 'Legend: Bloodline', 'Coup de Grace'],
          teammates: [
            { name: 'Player1', champion: 'Darius' },
            { name: 'Player2', champion: 'Vi' },
            { name: 'Player3', champion: 'Lux' },
            { name: 'Player4', champion: 'Nautilus' },
          ],
          enemies: [
            { name: 'Enemy1', champion: 'Ornn' },
            { name: 'Enemy2', champion: 'Kha\'Zix' },
            { name: 'Enemy3', champion: 'Syndra' },
            { name: 'Enemy4', champion: 'Jinx' },
            { name: 'Enemy5', champion: 'Leona' },
          ],
        },
        {
          id: '3',
          champion: 'Kai\'Sa',
          role: 'ADC',
          result: 'Victory',
          kda: { kills: 15, deaths: 2, assists: 11 },
          cs: 267,
          gold: 16500,
          duration: '35:22',
          gameMode: 'Ranked Solo/Duo',
          timestamp: Date.now() - 10800000,
          items: [1, 2, 3, 4, 5, 6],
          summonerSpells: ['Flash', 'Heal'],
          runes: ['Hail of Blades', 'Taste of Blood', 'Eyeball Collection', 'Ultimate Hunter'],
          teammates: [
            { name: 'TopLaner', champion: 'Sett' },
            { name: 'Jungler', champion: 'Elise' },
            { name: 'Midlaner', champion: 'Orianna' },
            { name: 'Support', champion: 'Nautilus' },
          ],
          enemies: [
            { name: 'ETop', champion: 'Malphite' },
            { name: 'EJg', champion: 'Nocturne' },
            { name: 'EMid', champion: 'Yasuo' },
            { name: 'EBot', champion: 'Lucian' },
            { name: 'ESup', champion: 'Braum' },
          ],
        },
      ],
    };

    setUserProfile(mockProfile);
    setView('profile');
  };

  const handleSelectGame = (game: GameData) => {
    setSelectedGame(game);
    setView('review');
  };

  const handleBackToProfile = () => {
    setView('profile');
    setSelectedGame(null);
  };

  const handleBackToLanding = () => {
    setView('landing');
    setUserProfile(null);
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Full page background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {view === 'landing' && <LandingPage onLogin={handleLogin} />}
        {view === 'profile' && userProfile && (
          <ProfileDashboard
            profile={userProfile}
            onSelectGame={handleSelectGame}
            onLogout={handleBackToLanding}
          />
        )}
        {view === 'review' && selectedGame && userProfile && (
          <GameReview
            game={selectedGame}
            summonerName={userProfile.summonerName}
            onBack={handleBackToProfile}
          />
        )}
      </div>
    </div>
  );
}

export default App;
