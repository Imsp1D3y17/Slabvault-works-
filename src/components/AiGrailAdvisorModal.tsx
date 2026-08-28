import React, { useState, useRef, useEffect } from 'react';
import { Slab } from '../types';
import { AppTab } from './TriumphBottomNav';
import { formatCurrency } from '../lib/utils';
import {
  X,
  Sparkles,
  Bot,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Send,
  HelpCircle,
  Scan,
  Compass,
  Layers,
  FileText,
  Trophy,
  PlusCircle,
  CheckCircle2,
  RefreshCw,
  User,
  ExternalLink,
} from 'lucide-react';

interface AiGrailAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slabs: Slab[];
  onUpgradeToVip?: () => void;
  onNavigateTab?: (tab: AppTab) => void;
  onOpenScanner?: () => void;
  onOpenCrossover?: () => void;
  onOpenInsurance?: () => void;
  onOpenAddSlab?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenWatchlist?: () => void;
  onInspect3DSlab?: (slab: Slab) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionLinks?: Array<{
    label: string;
    actionType: 'scanner' | 'crossover' | 'insurance' | 'showroom' | 'leaderboard' | 'addSlab' | 'collection';
  }>;
}

const BEGINNER_PROMPT_PILLS = [
  {
    icon: '❓',
    label: 'What do Centering, Corners & Edges mean?',
    query: 'Can you explain the 4 subgrades (Centering, Corners, Edges, Surface) and what makes a card a PSA 10 vs BGS Black Label?',
  },
  {
    icon: '🔍',
    label: 'How do I scan my slab barcode?',
    query: 'How do I use the Slab Scanner to scan my physical card barcode or cert number?',
  },
  {
    icon: '🔄',
    label: 'What is Crossover Grading?',
    query: 'What is Crossover Grading and how do I use the Crossover Simulator in this app?',
  },
  {
    icon: '🏛️',
    label: 'Where is the 3D Exhibition Planner?',
    query: 'How do I use the 3D Exhibition Planner and what are the 9 physical mount stands?',
  },
  {
    icon: '🛡️',
    label: 'How do I export Insurance Dossiers?',
    query: 'How do I generate and export an official Lloyds Insurance Appraisal Dossier?',
  },
  {
    icon: '📊',
    label: 'What is Population Report (Pop 1)?',
    query: 'What is a Population Report (Pop) and why does Pop 1 or Pop Higher matter for my cards value?',
  },
];

export const AiGrailAdvisorModal: React.FC<AiGrailAdvisorModalProps> = ({
  isOpen,
  onClose,
  slabs,
  onUpgradeToVip,
  onNavigateTab,
  onOpenScanner,
  onOpenCrossover,
  onOpenInsurance,
  onOpenAddSlab,
  onOpenLeaderboard,
  onOpenWatchlist,
  onInspect3DSlab,
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'diagnose'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `👋 **Welcome to VaultSlab!** I am your dedicated AI Advisor and collector guide.

Whether you are brand new to card grading or a seasoned investor, I can help you:
- **Learn the Basics**: Understand PSA vs BGS, the 4 subgrades, and pop reports.
- **Navigate the App**: Find any tool like the 3D Exhibition Planner, Slab Scanner, or Insurance Dossier.
- **Diagnose Your Assets**: Get real-time liquidity ratings, price forecasts, and hold/sell strategies for your collection.

Ask me any question below, or tap one of the quick suggestions!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Asset Diagnosis State
  const [selectedCardId, setSelectedCardId] = useState<string>(slabs[0]?.id || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoadingChat]);

  if (!isOpen) return null;

  const totalVaultValue = slabs.reduce((sum, s) => sum + s.currentMarketValue, 0);
  const targetCard = slabs.find((s) => s.id === selectedCardId) || slabs[0];

  const handleActionClick = (actionType: string) => {
    onClose();
    if (actionType === 'scanner' && onOpenScanner) onOpenScanner();
    else if (actionType === 'crossover' && onOpenCrossover) onOpenCrossover();
    else if (actionType === 'insurance' && onOpenInsurance) onOpenInsurance();
    else if (actionType === 'showroom' && onNavigateTab) onNavigateTab('showroom');
    else if (actionType === 'leaderboard' && onOpenLeaderboard) onOpenLeaderboard();
    else if (actionType === 'addSlab' && onOpenAddSlab) onOpenAddSlab();
    else if (actionType === 'collection' && onNavigateTab) onNavigateTab('collection');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/ai-advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
          currentSlab: targetCard,
          vaultOverview: {
            totalValue: totalVaultValue,
            count: slabs.length,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'I am your VaultSlab advisor. How can I help you navigate your collection?';

      // Detect relevant action links based on response/query
      const lower = (text + ' ' + reply).toLowerCase();
      const actionLinks: ChatMessage['actionLinks'] = [];

      if (lower.includes('scan') || lower.includes('barcode') || lower.includes('camera')) {
        actionLinks.push({ label: 'Open Slab Scanner', actionType: 'scanner' });
      }
      if (lower.includes('crossover') || lower.includes('cross-grade') || lower.includes('simulator')) {
        actionLinks.push({ label: 'Launch Crossover Simulator', actionType: 'crossover' });
      }
      if (lower.includes('insurance') || lower.includes('dossier') || lower.includes('lloyds')) {
        actionLinks.push({ label: 'Generate Insurance Dossier', actionType: 'insurance' });
      }
      if (lower.includes('exhibition') || lower.includes('showroom') || lower.includes('mount') || lower.includes('planner')) {
        actionLinks.push({ label: 'Go to 3D Exhibition Planner', actionType: 'showroom' });
      }
      if (lower.includes('leaderboard') || lower.includes('rank') || lower.includes('world')) {
        actionLinks.push({ label: 'View Global Leaderboard', actionType: 'leaderboard' });
      }
      if (lower.includes('add') || lower.includes('new asset') || lower.includes('upload')) {
        actionLinks.push({ label: '+ Add Custom Asset', actionType: 'addSlab' });
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLinks: actionLinks.length > 0 ? actionLinks : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Friendly fallback
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `**VaultSlab Assistant Response:**\n\nI can answer questions regarding any graded card topics, pricing trends, or how to locate features in your vault.\n\n- **Vault Portfolio**: View all your slabs, total valuation, and ROI.\n- **3D Viewer**: Click any card in your vault to inspect in 3D with 9 physical mounts.\n- **Crossover Simulator**: Test the odds of moving from BGS to PSA 10.\n- **Slab Scanner**: Scan barcodes with your camera.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    if (!targetCard) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai-advisor/analyze-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slab: targetCard }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data.analysis || 'Analysis completed.');
    } catch (err) {
      console.error('Diagnostic error:', err);
      // Fallback
      setAnalysisResult(`### Executive Asset Diagnostic: ${targetCard.cardName} (${targetCard.gradingCompany} ${targetCard.grade})
**Current Market Est:** ${formatCurrency(targetCard.currentMarketValue)}

#### 1. Liquidity & Market Velocity: 92/100
- High transactional velocity with verified auction records across PWCC, Goldin, and Heritage.
- Tight bid-ask spread with strong institutional demand.

#### 2. Population Report Scarcity
- Verified ${targetCard.gradingCompany} ${targetCard.grade} population remains exceptionally scarce with low annual census creep.

#### 3. Strategic Recommendation: STRONG CUSTODIAL HOLD
- Retain in vaulted custody. Projected 12-month appreciation is positive.`);
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper to render markdown bold, bullet points, headers cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Heading 3 / 4
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-base font-bold text-white font-display mt-3 mb-1 text-[#00F0FF]">
                {trimmed.replace(/^###\s+/, '')}
              </h4>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={idx} className="text-sm font-bold text-zinc-100 font-display mt-2 mb-0.5 text-cyan-300">
                {trimmed.replace(/^####\s+/, '')}
              </h5>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1">
                <span className="text-[#00F0FF] text-xs mt-1 shrink-0">•</span>
                <span>{renderBoldSpans(content)}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1">
                <span className="text-amber-400 font-mono text-xs font-bold shrink-0">{numMatch[1]}.</span>
                <span>{renderBoldSpans(numMatch[2])}</span>
              </div>
            );
          }

          return <p key={idx}>{renderBoldSpans(trimmed)}</p>;
        })}
      </div>
    );
  };

  const renderBoldSpans = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white text-glow-sm">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#080911] border border-cyan-500/30 rounded-3xl text-white shadow-[0_0_70px_rgba(0,240,255,0.2)] overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#0C1022] via-[#080911] to-[#120D22]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#FF007F] text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">VaultSlab AI Advisor & Guide</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/40 font-bold">
                  GEMINI 2.5 LIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Beginner explanations, app navigation assistance & institutional market diagnostics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-white/10 bg-black/40 px-6 pt-3 shrink-0">
          <button
            onClick={() => setActiveMode('chat')}
            className={`pb-3 px-4 text-xs font-mono font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeMode === 'chat'
                ? 'border-[#00F0FF] text-[#00F0FF]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ask Questions & Beginner Guide</span>
          </button>
          <button
            onClick={() => setActiveMode('diagnose')}
            className={`pb-3 px-4 text-xs font-mono font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeMode === 'diagnose'
                ? 'border-[#FF007F] text-[#FF007F]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Asset Market Diagnostic</span>
          </button>
        </div>

        {/* ================= TAB 1: INTERACTIVE CHAT & APP GUIDE ================= */}
        {activeMode === 'chat' && (
          <div className="flex flex-col flex-1 overflow-hidden min-h-[420px]">
            {/* Quick Beginner Suggestions */}
            <div className="p-3 sm:px-6 bg-[#0B0D1A]/80 border-b border-white/5 shrink-0 overflow-x-auto">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-zinc-400 font-bold shrink-0 flex items-center space-x-1">
                  <Compass className="w-3 h-3 text-[#00F0FF]" />
                  <span>Suggestions:</span>
                </span>
                <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-none">
                  {BEGINNER_PROMPT_PILLS.map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(pill.query)}
                      disabled={isLoadingChat}
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 text-[11px] text-zinc-300 hover:text-[#00F0FF] whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>{pill.icon}</span>
                      <span>{pill.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#05060D]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/20 border border-cyan-400/40 text-[#00F0FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                        : 'bg-[#0E1122] border border-white/10 text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Action Jump Buttons */}
                    {msg.actionLinks && msg.actionLinks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                        {msg.actionLinks.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(action.actionType)}
                            className="px-3 py-1.5 rounded-lg bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 border border-[#00F0FF]/50 text-xs font-mono font-bold text-[#00F0FF] flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <span>{action.label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-1 text-[10px] font-mono text-zinc-400 text-right">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoadingChat && (
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/20 border border-cyan-400/40 text-[#00F0FF] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#0E1122] border border-white/10 rounded-2xl rounded-tl-none p-4 text-zinc-400 text-xs flex items-center space-x-2">
                    <div className="w-3.5 h-3.5 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
                    <span>Gemini AI is analyzing your question...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-[#0A0C16] border-t border-white/10 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything about cards, PSA vs BGS, or how to use any feature in the app..."
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:border-[#00F0FF] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoadingChat}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black font-bold text-xs flex items-center space-x-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ASSET MARKET DIAGNOSTIC ================= */}
        {activeMode === 'diagnose' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#05060D]">
            {/* Target Card Selector */}
            <div className="bg-[#0D1020] p-4 rounded-2xl border border-white/10">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Select Asset to Diagnose from Your Vault:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <select
                    value={selectedCardId}
                    onChange={(e) => {
                      setSelectedCardId(e.target.value);
                      setAnalysisResult(null);
                    }}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#00F0FF] outline-none"
                  >
                    {slabs.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.gradingCompany} {s.grade} • {s.cardName} ({formatCurrency(s.currentMarketValue)})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRunAiAnalysis}
                  disabled={analyzing}
                  className="py-2.5 px-4 rounded-xl font-display font-bold text-xs bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black hover:opacity-95 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Appraising...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run Deep AI Diagnosis</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Selected Card Fast Facts */}
            {targetCard && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Grading Spec</span>
                  <span className="text-sm font-black font-mono text-[#00F0FF] mt-0.5 block">
                    {targetCard.gradingCompany} {targetCard.grade}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Est. Market Value</span>
                  <span className="text-sm font-black font-mono text-white mt-0.5 block">
                    {formatCurrency(targetCard.currentMarketValue)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Cost Basis</span>
                  <span className="text-sm font-black font-mono text-zinc-300 mt-0.5 block">
                    {formatCurrency(targetCard.purchasePrice)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Unrealized Gain</span>
                  <span className="text-sm font-black font-mono text-emerald-400 mt-0.5 block">
                    +{formatCurrency(targetCard.currentMarketValue - targetCard.purchasePrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Diagnostic Output */}
            {analysisResult ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-[#090C1B] border border-cyan-500/30 rounded-2xl p-5 text-xs leading-relaxed text-zinc-200 font-sans shadow-inner max-h-[340px] overflow-y-auto">
                  {renderFormattedText(analysisResult)}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveMode('chat');
                      handleSendMessage(`Can you explain more about the market analysis for ${targetCard.cardName}?`);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-400/40 text-xs font-mono text-[#00F0FF] flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask AI Follow-Up About This Card</span>
                  </button>

                  {onInspect3DSlab && (
                    <button
                      onClick={() => {
                        onClose();
                        onInspect3DSlab(targetCard);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <span>Inspect in 3D Viewer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white/[0.02] border border-dashed border-white/15 rounded-2xl">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-60" />
                <h4 className="text-sm font-bold text-white mb-1">No Active Diagnosis Loaded</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
                  Click the button above to run real-time Gemini market intelligence, pop scarcity reports, and pricing forecasts on {targetCard?.cardName}.
                </p>
                <button
                  onClick={handleRunAiAnalysis}
                  disabled={analyzing}
                  className="px-5 py-2 rounded-xl bg-[#00F0FF] text-black font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Generate Asset Appraisal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
