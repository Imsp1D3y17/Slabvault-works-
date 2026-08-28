import React, { useState, useRef } from 'react';
import { Slab } from '../types';
import {
  LEADERBOARD_COLLECTORS,
  LeaderboardCollector,
} from '../data/leaderboardData';
import {
  formatCurrency,
  formatPercent,
  getCompanyBadgeColor,
} from '../lib/utils';
import { vaultAudio } from '../lib/vaultAudio';
import {
  Crown,
  Trophy,
  Shield,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Eye,
  Scale,
  Lock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Flame,
  X,
  Search,
  Gem,
  Building,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { SlabVaultCardArtwork } from './SlabVaultCardArtwork';

interface SlabLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSlabs: Slab[];
  onInspect3DSlab: (slab: Slab) => void;
  onCompareSlab?: (slab: Slab) => void;
}

type LeaderboardTab = 'aum' | 'single_grail' | 'gem_rate' | 'velocity';

export const SlabLeaderboardModal: React.FC<SlabLeaderboardModalProps> = ({
  isOpen,
  onClose,
  userSlabs,
  onInspect3DSlab,
  onCompareSlab,
}) => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('aum');
  const [selectedCollector, setSelectedCollector] = useState<LeaderboardCollector>(
    LEADERBOARD_COLLECTORS[0]
  );
  const [leaderTilt, setLeaderTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInspectingHover, setIsInspectingHover] = useState(false);

  const handleTabChange = (tab: LeaderboardTab) => {
    vaultAudio.playButtonTick();
    setActiveTab(tab);
  };

  const handleInspect = (slab: Slab) => {
    vaultAudio.playVaultAirlock();
    onInspect3DSlab(slab);
  };

  // User Vault stats calculation
  const userVaultAum = userSlabs.reduce((sum, s) => sum + s.currentMarketValue, 0);
  const userHighestSlab = [...userSlabs].sort((a, b) => b.currentMarketValue - a.currentMarketValue)[0];
  const userGemCount = userSlabs.filter((s) => s.grade >= 10 || s.gradeModifier === 'BLACK LABEL' || s.gradeModifier === 'PRISTINE').length;
  const userGemRate = userSlabs.length > 0 ? (userGemCount / userSlabs.length) * 100 : 0;

  // Sorted list based on active tab
  const sortedCollectors = [...LEADERBOARD_COLLECTORS].sort((a, b) => {
    if (activeTab === 'aum') return b.totalAum - a.totalAum;
    if (activeTab === 'single_grail') return b.crownJewelSlab.currentMarketValue - a.crownJewelSlab.currentMarketValue;
    if (activeTab === 'gem_rate') return b.gemMintRate - a.gemMintRate;
    if (activeTab === 'velocity') return b.thirtyDayRoi - a.thirtyDayRoi;
    return 0;
  });

  const apexLeader = sortedCollectors[0];

  // Mouse tilt tracking on leader's crown slab
  const handleLeaderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setLeaderTilt({ x: y, y: x });
  };

  const handleLeaderMouseLeave = () => {
    setLeaderTilt({ x: 0, y: 0 });
    setIsInspectingHover(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#070913] border border-amber-500/30 rounded-3xl p-4 sm:p-8 text-white shadow-[0_0_100px_rgba(245,158,11,0.2)] my-auto overflow-hidden">
        {/* Background Sovereign Ambient Lights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-500 p-[1.5px] shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 tracking-wider">
                  Global High-Asset Registry
                </span>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Lloyds & Brinks Custodial Verified
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5 mt-0.5">
                Apex Sovereign Leaderboard
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Leaderboard Metric Filter Switcher */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 my-6">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-2xl">
            <button
              onClick={() => handleTabChange('aum')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'aum'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Total Vault AUM (Whales)</span>
            </button>

            <button
              onClick={() => handleTabChange('single_grail')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'single_grail'
                  ? 'bg-gradient-to-r from-cyan-400 to-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              <span>Single Crown Asset</span>
            </button>

            <button
              onClick={() => handleTabChange('gem_rate')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'gem_rate'
                  ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-black shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>100% Gem Mint Density</span>
            </button>

            <button
              onClick={() => handleTabChange('velocity')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'velocity'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>30D Market ROI Velocity</span>
            </button>
          </div>

          {/* Quick Telemetry Indicator */}
          <div className="text-right font-mono text-xs text-zinc-400 hidden sm:block">
            <span className="text-amber-300 font-bold">Top 0.01% Global Slabs</span> • Real-Time Comp Indexing
          </div>
        </div>

        {/* 👑 SPECIAL DISPLAY: THE APEX SOVEREIGN THRONE (RANK #1 COMMANDING MONOLITH) */}
        <div className="relative z-10 mb-8 rounded-3xl bg-gradient-to-b from-[#181308] via-[#0E0C16] to-[#070914] border-2 border-amber-400/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden">
          {/* Cybernetic Golden Grid and Beams */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Top Banner Tag of the #1 Leader */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-amber-500/20">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-lg bg-amber-400 text-black font-black font-display text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                <Crown className="w-4 h-4 fill-black" />
                Rank #1 • Apex Sovereign Champion
              </span>
              <span className="text-xs font-mono text-amber-200 font-bold">
                {apexLeader.vaultTitle}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>{apexLeader.vaultLocation}</span>
            </div>
          </div>

          {/* Core Apex Exhibition Grid: Centerpiece 3D Slab + Deep Telemetry */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            {/* Left Column: 3D Refractive Floating Centerpiece Slab */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div
                onMouseMove={handleLeaderMouseMove}
                onMouseEnter={() => setIsInspectingHover(true)}
                onMouseLeave={handleLeaderMouseLeave}
                className="relative cursor-pointer transition-transform duration-200 ease-out group"
                style={{
                  transform: `perspective(1000px) rotateX(${leaderTilt.x}deg) rotateY(${leaderTilt.y}deg) scale3d(${isInspectingHover ? 1.03 : 1}, ${isInspectingHover ? 1.03 : 1}, 1)`,
                }}
                onClick={() => onInspect3DSlab(apexLeader.crownJewelSlab)}
              >
                {/* Golden Radial Aura under the slab */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-cyan-400/20 rounded-3xl blur-2xl group-hover:opacity-100 opacity-70 transition-opacity pointer-events-none" />

                {/* Outer High-Tech Slab Frame */}
                <div className="relative w-64 sm:w-72 bg-gradient-to-b from-[#1C1F2E]/90 to-[#0A0D18]/90 rounded-2xl border-2 border-amber-400/70 p-3 shadow-2xl backdrop-blur-xl">
                  {/* PSA/BGS Grade Header Plaque */}
                  <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-xl p-2.5 text-black mb-3 shadow-md border border-amber-200">
                    <div className="flex items-center justify-between font-mono font-black text-xs">
                      <span>{apexLeader.crownJewelSlab.gradingCompany} GEM MINT</span>
                      <span className="text-base font-black px-2 py-0.5 bg-black text-amber-300 rounded-md">
                        {apexLeader.crownJewelSlab.grade}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold truncate mt-1 text-zinc-900">
                      {apexLeader.crownJewelSlab.cardName}
                    </div>
                    <div className="text-[9px] font-mono text-zinc-800 truncate">
                      {apexLeader.crownJewelSlab.setName} • #{apexLeader.crownJewelSlab.certNumber}
                    </div>
                  </div>

                  {/* High-Resolution Artwork Window */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-white/20">
                    {apexLeader.crownJewelSlab.imageUrl ? (
                      <img
                        src={apexLeader.crownJewelSlab.imageUrl}
                        alt={apexLeader.crownJewelSlab.cardName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <SlabVaultCardArtwork
                        cardName={apexLeader.crownJewelSlab.cardName}
                        category={apexLeader.crownJewelSlab.category}
                        year={apexLeader.crownJewelSlab.year}
                        rarityTier={apexLeader.crownJewelSlab.rarityTier}
                        isHolyGrail={true}
                      />
                    )}

                    {/* Holographic Refractive Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/15 to-cyan-300/15 opacity-60 mix-blend-overlay pointer-events-none" />

                    {/* Holographic Stamp Badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 rounded-md border border-amber-400/50 text-[9px] font-mono font-bold text-amber-300">
                      CROWN JEWEL
                    </div>
                  </div>

                  {/* Valuation Plaque at Base of Slab */}
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Insured Asset Valuation:</span>
                    <span className="font-black text-amber-300">
                      {formatCurrency(apexLeader.crownJewelSlab.currentMarketValue)}
                    </span>
                  </div>
                </div>

                {/* Interactive 3D Inspection Tag */}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-mono text-amber-300 font-bold bg-amber-400/10 py-1.5 px-3 rounded-full border border-amber-400/30 group-hover:bg-amber-400/20 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to Inspect in 3D Tactile Chamber</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sovereign Collector Profile & Institutional Vault Stats */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-display font-black text-3xl text-white">
                    {apexLeader.vaultHandle}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED WHALE
                  </span>
                </div>
                <p className="text-sm font-sans text-zinc-300 italic mt-2 border-l-2 border-amber-400 pl-3">
                  "{apexLeader.signatureQuote}"
                </p>
              </div>

              {/* Big Asset Telemetry Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-400/30">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-0.5">
                    Total Insured AUM
                  </span>
                  <span className="text-xl font-black font-mono text-amber-300">
                    {formatCurrency(apexLeader.totalAum)}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                    +{apexLeader.thirtyDayRoi}% 30d Velocity
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-0.5">
                    Vault Inventory
                  </span>
                  <span className="text-xl font-black font-mono text-white">
                    {apexLeader.totalSlabsCount} Slabs
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                    100% Insured Custody
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-purple-500/30">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-0.5">
                    Gem Mint Rate
                  </span>
                  <span className="text-xl font-black font-mono text-purple-300">
                    {apexLeader.gemMintRate}%
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 block mt-1">
                    PSA 10 / BGS Pristine
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-0.5">
                    Crown Asset Value
                  </span>
                  <span className="text-xl font-black font-mono text-cyan-300">
                    {formatCurrency(apexLeader.crownJewelSlab.currentMarketValue)}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 block mt-1">
                    {apexLeader.crownJewelSlab.cardName.substring(0, 14)}...
                  </span>
                </div>
              </div>

              {/* Featured Trophy Grails in Sovereign Vault */}
              <div>
                <span className="text-xs font-mono font-bold uppercase text-zinc-400 block mb-2">
                  Featured Holy Grails in Sovereign Vault:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {apexLeader.featuredGrailsSummary.map((grail, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2 text-xs font-mono text-zinc-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{grail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Rank #1 */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onInspect3DSlab(apexLeader.crownJewelSlab)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-display font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect #1 Crown Asset in 3D</span>
                </button>

                {onCompareSlab && (
                  <button
                    onClick={() => onCompareSlab(apexLeader.crownJewelSlab)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-display font-bold text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <span>Compare with Your Grails</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 PODIUM TRIO (RANKS 2 & 3 EXHIBITION TIERS) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sortedCollectors.slice(1, 3).map((collector) => {
            const isRank2 = collector.rank === 2;
            const borderColor = isRank2 ? 'border-zinc-300/40' : 'border-cyan-500/40';
            const auraColor = isRank2 ? 'from-zinc-400/20 to-slate-200/5' : 'from-cyan-500/20 to-blue-500/5';
            const badgeColor = isRank2
              ? 'bg-zinc-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
              : 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]';

            return (
              <div
                key={collector.id}
                className={`relative rounded-2xl bg-gradient-to-b ${auraColor} bg-[#0A0D1A] border ${borderColor} p-5 flex flex-col justify-between shadow-xl`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-display ${badgeColor}`}>
                        Rank #{collector.rank}
                      </span>
                      <span className="font-display font-bold text-base text-white">
                        {collector.vaultHandle}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-amber-300">
                      {formatCurrency(collector.totalAum)}
                    </span>
                  </div>

                  {/* Slab Preview and stats */}
                  <div className="flex items-center space-x-4 my-4">
                    <div
                      onClick={() => onInspect3DSlab(collector.crownJewelSlab)}
                      className="w-20 h-28 rounded-xl overflow-hidden border border-white/20 bg-black relative shrink-0 cursor-pointer group shadow-lg"
                    >
                      {collector.crownJewelSlab.imageUrl ? (
                        <img
                          src={collector.crownJewelSlab.imageUrl}
                          alt={collector.crownJewelSlab.cardName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <SlabVaultCardArtwork
                          cardName={collector.crownJewelSlab.cardName}
                          category={collector.crownJewelSlab.category}
                          year={collector.crownJewelSlab.year}
                          rarityTier={collector.crownJewelSlab.rarityTier}
                          isHolyGrail={true}
                        />
                      )}
                      <div className="absolute top-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono font-bold text-cyan-300">
                        3D
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 font-mono text-xs">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        Crowning Asset
                      </span>
                      <div className="font-bold text-white truncate">
                        {collector.crownJewelSlab.cardName}
                      </div>
                      <div className="text-zinc-400 text-[11px] truncate">
                        {collector.crownJewelSlab.gradingCompany} {collector.crownJewelSlab.grade} • {formatCurrency(collector.crownJewelSlab.currentMarketValue)}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-300">
                        <span>{collector.totalSlabsCount} Slabs</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{collector.gemMintRate}% Gems</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {collector.vaultLocation}
                  </span>
                  <button
                    onClick={() => onInspect3DSlab(collector.crownJewelSlab)}
                    className="text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Slab</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 📋 GLOBAL HIGH-ASSET TIERS (RANKS 4+) */}
        <div className="relative z-10 rounded-2xl bg-black/40 border border-white/10 overflow-hidden mb-8">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono font-bold text-zinc-400 uppercase">
            <span>Global Collector & Depository Rank</span>
            <span>Total Insured AUM & Crown Asset</span>
          </div>

          <div className="divide-y divide-white/5">
            {sortedCollectors.slice(3).map((collector) => (
              <div
                key={collector.id}
                className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-black text-zinc-300 text-xs">
                    #{collector.rank}
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                      <span>{collector.vaultHandle}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                        {collector.vaultLocation}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      {collector.vaultTitle} • {collector.totalSlabsCount} Slabs ({collector.gemMintRate}% Gem Rate)
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-amber-300">
                      {formatCurrency(collector.totalAum)}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate max-w-[180px]">
                      Grail: {collector.crownJewelSlab.cardName}
                    </div>
                  </div>

                  <button
                    onClick={() => onInspect3DSlab(collector.crownJewelSlab)}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Inspect Grail in 3D"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">3D</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🛡️ YOUR VAULT STANDING & DISTANCE TO SOVEREIGN */}
        <div className="relative z-10 rounded-2xl bg-gradient-to-r from-[#0C1527] via-[#090D1A] to-[#120F24] border border-cyan-500/40 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                  Your Vault Standing
                </span>
                <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                  Live Portfolio
                </span>
              </div>
              <div className="text-base font-display font-black text-white">
                Total Equity: {formatCurrency(userVaultAum)} ({userSlabs.length} Graded Slabs)
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-0.5">
                Top Asset: {userHighestSlab ? userHighestSlab.cardName : 'None'} ({userHighestSlab ? formatCurrency(userHighestSlab.currentMarketValue) : '$0'})
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right font-mono text-xs text-zinc-300 hidden md:block">
              <span className="text-zinc-400 block text-[10px]">DISTANCE TO SOVEREIGN #1:</span>
              <span className="text-amber-300 font-bold">
                {formatCurrency(Math.max(0, apexLeader.totalAum - userVaultAum))}
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00F0FF] text-black font-display font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Deposit & Climb Ranks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
