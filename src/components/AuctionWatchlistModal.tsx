import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../lib/utils';
import {
  X,
  Bell,
  Gavel,
  Clock,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export interface AuctionLot {
  id: string;
  title: string;
  category: 'Basketball' | 'Baseball' | 'Pokemon' | 'Football' | 'Hockey';
  gradingCompany: 'PSA' | 'BGS' | 'CGC' | 'SGC';
  grade: number;
  auctionHouse: 'Goldin Elite' | 'PWCC Premier' | 'Heritage Signature' | 'Fanatics Collect';
  currentBid: number;
  estMarketValue: number;
  bidsCount: number;
  endsAt: number; // timestamp in ms
  imageUrl: string;
  certNumber: string;
  targetPriceAlert?: number;
}

export const INITIAL_AUCTION_LOTS: AuctionLot[] = [
  {
    id: 'lot-1',
    title: '1986 Fleer Michael Jordan #57 Rookie',
    category: 'Basketball',
    gradingCompany: 'PSA',
    grade: 10,
    auctionHouse: 'Goldin Elite',
    currentBid: 185000,
    estMarketValue: 240000,
    bidsCount: 34,
    endsAt: Date.now() + 1000 * 60 * 45 + 1000 * 22, // ~45 mins
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    certNumber: '48291048',
    targetPriceAlert: 200000,
  },
  {
    id: 'lot-2',
    title: '1999 Pokémon Base Set 1st Edition Charizard #4 Shadowless Holo',
    category: 'Pokemon',
    gradingCompany: 'BGS',
    grade: 9.5,
    auctionHouse: 'PWCC Premier',
    currentBid: 295000,
    estMarketValue: 360000,
    bidsCount: 47,
    endsAt: Date.now() + 1000 * 60 * 120 + 1000 * 50, // ~2 hours
    imageUrl: 'https://images.unsplash.com/photo-1613770418186-b4b600869a8b?w=600&auto=format&fit=crop&q=80',
    certNumber: '0012948201',
    targetPriceAlert: 310000,
  },
  {
    id: 'lot-3',
    title: '2000 Playoff Contenders Tom Brady Rookie Ticket Auto',
    category: 'Football',
    gradingCompany: 'BGS',
    grade: 9,
    auctionHouse: 'Heritage Signature',
    currentBid: 142000,
    estMarketValue: 190000,
    bidsCount: 28,
    endsAt: Date.now() + 1000 * 60 * 360, // ~6 hours
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop&q=80',
    certNumber: '0009841284',
    targetPriceAlert: 160000,
  },
  {
    id: 'lot-4',
    title: '2003 Topps Chrome LeBron James #111 Refractor Rookie',
    category: 'Basketball',
    gradingCompany: 'PSA',
    grade: 10,
    auctionHouse: 'Goldin Elite',
    currentBid: 88000,
    estMarketValue: 115000,
    bidsCount: 19,
    endsAt: Date.now() + 1000 * 60 * 540, // ~9 hours
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    certNumber: '58102947',
    targetPriceAlert: 95000,
  },
  {
    id: 'lot-5',
    title: '1952 Topps Mickey Mantle #311 High Number',
    category: 'Baseball',
    gradingCompany: 'SGC',
    grade: 8,
    auctionHouse: 'Heritage Signature',
    currentBid: 420000,
    estMarketValue: 650000,
    bidsCount: 52,
    endsAt: Date.now() + 1000 * 60 * 18 + 1000 * 10, // ~18 mins (closing soon!)
    imageUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=600&auto=format&fit=crop&q=80',
    certNumber: '1948201',
    targetPriceAlert: 480000,
  },
];

interface AuctionWatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuctionWatchlistModal: React.FC<AuctionWatchlistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [lots, setLots] = useState<AuctionLot[]>(INITIAL_AUCTION_LOTS);
  const [now, setNow] = useState<number>(Date.now());
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [alertFormLotId, setAlertFormLotId] = useState<string | null>(null);
  const [targetAlertInput, setTargetAlertInput] = useState<string>('');
  const [activeAlertTriggered, setActiveAlertTriggered] = useState<string | null>(null);

  // Live timer tick every second for real-time countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const formatCountdown = (endsAt: number) => {
    const diff = Math.max(0, endsAt - now);
    if (diff === 0) return 'AUCTION CLOSED';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleSetAlert = (lotId: string) => {
    const val = parseFloat(targetAlertInput.replace(/[^0-9.]/g, ''));
    if (!isNaN(val) && val > 0) {
      setLots((prev) =>
        prev.map((lot) => (lot.id === lotId ? { ...lot, targetPriceAlert: val } : lot))
      );
      setAlertFormLotId(null);
      setTargetAlertInput('');
    }
  };

  const handleRemoveAlert = (lotId: string) => {
    setLots((prev) =>
      prev.map((lot) => (lot.id === lotId ? { ...lot, targetPriceAlert: undefined } : lot))
    );
  };

  const filteredLots = lots.filter((lot) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'CLOSING_SOON') {
      const diff = lot.endsAt - now;
      return diff > 0 && diff < 1000 * 60 * 60; // under 1 hr
    }
    if (selectedFilter === 'ALERTS_SET') return !!lot.targetPriceAlert;
    return lot.category.toUpperCase() === selectedFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#090B14] border border-[#00F0FF]/30 rounded-3xl p-5 sm:p-8 text-white shadow-[0_0_80px_rgba(0,240,255,0.15)] my-8 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-xl text-white">
                  Live Auction Radar & Target Price Alarms
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-mono text-rose-300 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  LIVE FEEDS
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                Track Premier & Signature auction houses with automated target asset sniper triggers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-white/10 relative z-10">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              { id: 'ALL', label: 'All Lots' },
              { id: 'CLOSING_SOON', label: '⚡ Closing < 1hr' },
              { id: 'ALERTS_SET', label: '🔔 Active Alarms' },
              { id: 'BASKETBALL', label: 'Basketball' },
              { id: 'POKEMON', label: 'Pokémon' },
              { id: 'BASEBALL', label: 'Baseball' },
              { id: 'FOOTBALL', label: 'Football' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span>Tracking <strong>{filteredLots.length}</strong> premier lots</span>
          </div>
        </div>

        {/* Auction Lots Stream */}
        <div className="py-4 space-y-4 max-h-[58vh] overflow-y-auto pr-1 relative z-10 custom-scrollbar">
          {filteredLots.map((lot) => {
            const isClosingSoon = lot.endsAt - now < 1000 * 60 * 60 && lot.endsAt - now > 0;
            const isUnderTarget = lot.targetPriceAlert && lot.currentBid <= lot.targetPriceAlert;
            const discountFromEst = ((lot.estMarketValue - lot.currentBid) / lot.estMarketValue) * 100;

            return (
              <div
                key={lot.id}
                className={`p-4 sm:p-5 rounded-2xl bg-[#0C0E1B] border transition-all duration-300 ${
                  isUnderTarget
                    ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                    : isClosingSoon
                    ? 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                    : 'border-white/10 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Card Info */}
                  <div className="flex items-start space-x-4 min-w-0">
                    <img
                      src={lot.imageUrl}
                      alt={lot.title}
                      className="w-20 h-28 object-cover rounded-xl border border-white/20 shadow-md shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-mono font-bold">
                          {lot.gradingCompany} {lot.grade}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10 text-[10px] font-mono">
                          {lot.auctionHouse}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          Cert #{lot.certNumber}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-base text-white truncate max-w-md">
                        {lot.title}
                      </h4>

                      {/* Live countdown timer badge */}
                      <div className="mt-2 flex items-center space-x-3 text-xs font-mono">
                        <div
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border ${
                            isClosingSoon
                              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 font-bold animate-pulse'
                              : 'bg-black/60 border-white/10 text-zinc-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatCountdown(lot.endsAt)}</span>
                        </div>

                        <span className="text-zinc-400">
                          {lot.bidsCount} bids logged
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center/Right: Pricing & Target Alert Engine */}
                  <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                        Current High Bid
                      </span>
                      <span className="text-2xl font-black font-display text-amber-300">
                        {formatCurrency(lot.currentBid)}
                      </span>
                      <div className="text-[11px] font-mono text-emerald-400 flex items-center sm:justify-end gap-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>{discountFromEst.toFixed(0)}% below est. ({formatCurrency(lot.estMarketValue)})</span>
                      </div>
                    </div>

                    {/* Alarm configuration box */}
                    <div className="w-full sm:w-auto min-w-[200px] p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                      {lot.targetPriceAlert ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              <Bell className="w-3 h-3 text-amber-400 animate-bounce" /> Target Alert Set
                            </span>
                            <button
                              onClick={() => handleRemoveAlert(lot.id)}
                              className="text-zinc-500 hover:text-rose-400 transition-colors"
                              title="Delete Alarm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="font-bold text-white text-sm">
                            Buy Target: {formatCurrency(lot.targetPriceAlert)}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {lot.currentBid <= lot.targetPriceAlert ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Target Met! Ready to bid
                              </span>
                            ) : (
                              <span>Bid is {formatCurrency(lot.currentBid - lot.targetPriceAlert)} above target</span>
                            )}
                          </div>
                        </div>
                      ) : alertFormLotId === lot.id ? (
                        <div className="space-y-2">
                          <span className="text-[10px] text-cyan-400 font-bold block">Set Max Target Alarm ($)</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              placeholder="e.g. 210000"
                              value={targetAlertInput}
                              onChange={(e) => setTargetAlertInput(e.target.value)}
                              className="w-full bg-[#121526] border border-white/20 rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                            />
                            <button
                              onClick={() => handleSetAlert(lot.id)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setAlertFormLotId(null)}
                              className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAlertFormLotId(lot.id);
                            setTargetAlertInput(lot.currentBid.toString());
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Set Price Alarm</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Bar */}
        <div className="pt-4 border-t border-white/10 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct WebSocket sync with Goldin Premier & PWCC Verified feeds</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-300">Live Comps Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
