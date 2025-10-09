import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Swords, TrendingUp, Brain } from 'lucide-react';

interface LandingPageProps {
  onLogin: (region: string, ign: string, tag: string) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [region, setRegion] = useState('');
  const [ign, setIgn] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (region && ign && tag) {
      onLogin(region, ign, tag);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-5xl w-full px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Swords className="w-12 h-12 text-teal-400" />
          </div>
          <h1 className="text-6xl mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            LoL Game Coach
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your year-in-review + AI-powered game review coach. Discover your Style DNA and master every match.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0f1b2e]/80 backdrop-blur border border-teal-900/50 rounded-xl p-6 hover:border-teal-500/50 transition-colors shadow-lg">
            <Brain className="w-8 h-8 text-teal-400 mb-3" />
            <h3 className="text-lg mb-2 text-slate-100">Style DNA</h3>
            <p className="text-slate-400">Your lifelong playstyle fingerprint analyzed across all matches</p>
          </div>
          <div className="bg-[#0f1b2e]/80 backdrop-blur border border-cyan-900/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors shadow-lg">
            <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-lg mb-2 text-slate-100">Match Analytics</h3>
            <p className="text-slate-400">Deep dive into your performance, KDA, items, and runes</p>
          </div>
          <div className="bg-[#0f1b2e]/80 backdrop-blur border border-blue-900/50 rounded-xl p-6 hover:border-blue-500/50 transition-colors shadow-lg">
            <Swords className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg mb-2 text-slate-100">AI Game Review</h3>
            <p className="text-slate-400">Chess.com-style timeline with an AI coach to answer your questions</p>
          </div>
        </div>

        {/* Login form */}
        <div className="max-w-md mx-auto bg-[#0f1b2e]/90 backdrop-blur border border-teal-900/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl mb-6 text-center text-slate-100">Get Started</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="region" className="text-slate-300">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-[#0a1428] border-teal-900/50 text-slate-100 mt-1 hover:border-teal-600/50">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1b2e] border-teal-900/50">
                  <SelectItem value="NA">NA - North America</SelectItem>
                  <SelectItem value="EUW">EUW - Europe West</SelectItem>
                  <SelectItem value="EUNE">EUNE - Europe Nordic & East</SelectItem>
                  <SelectItem value="KR">KR - Korea</SelectItem>
                  <SelectItem value="BR">BR - Brazil</SelectItem>
                  <SelectItem value="LAN">LAN - Latin America North</SelectItem>
                  <SelectItem value="LAS">LAS - Latin America South</SelectItem>
                  <SelectItem value="OCE">OCE - Oceania</SelectItem>
                  <SelectItem value="JP">JP - Japan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ign" className="text-slate-300">Summoner Name</Label>
              <Input
                id="ign"
                type="text"
                placeholder="HideOnBush"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                className="bg-[#0a1428] border-teal-900/50 text-slate-100 placeholder:text-slate-500 mt-1 hover:border-teal-600/50"
              />
            </div>

            <div>
              <Label htmlFor="tag" className="text-slate-300">Riot ID Tag</Label>
              <Input
                id="tag"
                type="text"
                placeholder="KR1"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="bg-[#0a1428] border-teal-900/50 text-slate-100 placeholder:text-slate-500 mt-1 hover:border-teal-600/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 mt-6 shadow-lg shadow-teal-900/50"
            >
              Analyze My Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
