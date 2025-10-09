import { useState, useRef, useEffect } from 'react';
import { GameData } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Bot, User } from 'lucide-react';

interface GameChatbotProps {
  game: GameData;
  summonerName: string;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function GameChatbot({ game, summonerName }: GameChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hi ${summonerName}! I'm your AI game coach. I've analyzed your ${game.champion} game and I'm here to help you improve. Ask me anything about your performance, decision-making, or strategies!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('kda') || lowerQuestion.includes('performance')) {
      return `Your KDA of ${game.kda.kills}/${game.kda.deaths}/${game.kda.assists} was ${
        game.kda.deaths <= 3 ? 'excellent' : 'decent'
      }! ${
        game.kda.deaths > 3
          ? `Try to work on positioning to reduce deaths. Focus on staying behind your frontline during teamfights.`
          : 'Great job staying alive while contributing to kills!'
      }`;
    }

    if (lowerQuestion.includes('cs') || lowerQuestion.includes('farm')) {
      const csPerMin = game.cs / parseInt(game.duration.split(':')[0]);
      return `You achieved ${game.cs} CS over ${game.duration}, which is about ${csPerMin.toFixed(
        1
      )} CS/min. ${
        csPerMin >= 7
          ? 'Excellent farming! Keep it up.'
          : 'Try to improve your CS by practicing last-hitting in practice tool and setting CS goals for each phase of the game.'
      }`;
    }

    if (lowerQuestion.includes('improve') || lowerQuestion.includes('better')) {
      return `Based on this game, here are key areas to focus on:\n\n1. Vision Control: Place more wards in river and enemy jungle\n2. Objective Prioritization: Coordinate with your team for dragons and Baron\n3. Build Path: Consider adapting your items based on enemy team composition\n4. Positioning: Stay at max range during teamfights as ${game.champion}`;
    }

    if (lowerQuestion.includes('build') || lowerQuestion.includes('item')) {
      return `Your build path was solid! For ${game.champion}, make sure to prioritize:\n\n1. Core items for damage scaling\n2. Boots based on enemy threats\n3. Situational defensive items when needed\n4. Consider Guardian Angel or QSS against high-threat enemies`;
    }

    if (lowerQuestion.includes('teamfight') || lowerQuestion.includes('fight')) {
      return `In teamfights as ${game.champion}, focus on:\n\n1. Positioning at max attack range\n2. Attacking the closest safe target\n3. Using your abilities to kite and reposition\n4. Staying with your support and waiting for engage\n5. Saving summoner spells for critical moments`;
    }

    return `That's a great question! In this game as ${game.champion}, you ended with a ${game.result.toLowerCase()} showing ${
      game.kda.kills
    }/${game.kda.deaths}/${game.kda.assists} KDA. Focus on maintaining strong CS, positioning safely in fights, and coordinating with your team for objectives. Would you like specific advice on any aspect of your gameplay?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(input),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-[#0f1b2e]/80 backdrop-blur-sm border-teal-900/30 flex flex-col h-[calc(100vh-12rem)] sticky top-6 shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-teal-900/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg text-slate-100">AI Game Coach</h3>
            <p className="text-slate-400">Ask me anything about this game</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-teal-600'
                  : 'bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-teal-600 text-white'
                  : 'bg-[#0a1428] border border-teal-900/30 text-slate-100'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-[#0a1428] border border-teal-900/30 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-teal-900/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your gameplay..."
            className="bg-[#0a1428] border-teal-900/50 text-slate-100 placeholder:text-slate-500 hover:border-teal-600/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex-shrink-0 shadow-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
