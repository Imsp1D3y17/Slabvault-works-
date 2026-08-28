import React, { useState, useMemo } from 'react';
import { Slab, GradingCompany, CardCategory, RarityTier, DisplaySettings } from '../types';
import { SlabCard } from './SlabCard';
import { formatCurrency, formatPercent, getCompanyBadgeColor } from '../lib/utils';
import { GoldTierBadge } from './GoldTierBadge';
import { PriceHistoryChart } from './PriceHistoryChart';
import { vaultAudio } from '../lib/vaultAudio';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Sparkles,
  Layers,
  Bot,
  ExternalLink,
  ChevronDown,
  Lock,
  ArrowUpDown,
  FileSpreadsheet,
  Camera,
  Share2,
  LineChart,
  Scale,
  Gavel,
  Zap,
  Crown,
  Radio,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';

interface VaultDashboardProps {
  slabs: Slab[];
  onSelectSlab: (slab: Slab) => void;
  onOpenAddModal: () => void;
  onOpenScanner?: () => void;
  onOpenComparator?: () => void;
  onOpenAuctionWatchlist?: () => void;
  onOpenCrossoverSimulator?: () => void;
  onOpenInsuranceDossier?: () => void;
  onOpenShareShowcase?: () => void;
  onOpenAiAdvisor: () => void;
  onOpenShowcasePlanner: () => void;
  onOpenLeaderboard?: () => void;
  onOpenPaywall: () => void;
  onOpenLiveComps?: () => void;
  onOpenCloudSync?: () => void;
  isVip: boolean;
}

export const VaultDashboard: React.FC<VaultDashboardProps> = ({
  slabs,
  onSelectSlab,
  onOpenAddModal,
  onOpenScanner,
  onOpenComparator,
  onOpenAuctionWatchlist,
  onOpenCrossoverSimulator,
  onOpenInsuranceDossier,
  onOpenShareShowcase,
  onOpenAiAdvisor,
  onOpenShowcasePlanner,
  onOpenLeaderboard,
  onOpenPaywall,
  onOpenLiveComps,
  onOpenCloudSync,
  isVip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'value_desc' | 'roi_desc' | 'grade_desc' | 'year_desc'>('value_desc');
  const [showChart, setShowChart] = useState(true);
  const [showExportToast, setShowExportToast] = useState(false);

  // Filter & Sort Logic
  const filteredSlabs = useMemo(() => {
    return slabs
      .filter((slab) => {
        const matchesSearch =
          slab.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          slab.setName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          slab.certNumber.includes(searchQuery);

        const matchesCompany = selectedCompany === 'ALL' || slab.gradingCompany === selectedCompany;
        const matchesCategory = selectedCategory === 'ALL' || slab.category === selectedCategory;

        return matchesSearch && matchesCompany && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'value_desc') return b.currentMarketValue - a.currentMarketValue;
        if (sortBy === 'roi_desc') {
          const roiA = a.purchasePrice > 0 ? (a.currentMarketValue - a.purchasePrice) / a.purchasePrice : 0;
          const roiB = b.purchasePrice > 0 ? (b.currentMarketValue - b.purchasePrice) / b.purchasePrice : 0;
          return roiB - roiA;
        }
        if (sortBy === 'grade_desc') return b.grade - a.grade;
        if (sortBy === 'year_desc') return b.year - a.year;
        return 0;
      });
  }, [slabs, searchQuery, selectedCompany, selectedCategory, sortBy]);

  // Aggregate Portfolio Stats
  const totalValuation = slabs.reduce((sum, s) => sum + s.currentMarketValue, 0);
  const totalCostBasis = slabs.reduce((sum, s) => sum + s.purchasePrice, 0);
  const totalProfit = totalValuation - totalCostBasis;
  const overallRoi = totalCostBasis > 0 ? (totalProfit / totalCostBasis) * 100 : 0;
  const avgGrade = slabs.length > 0 ? (slabs.reduce((sum, s) => sum + s.grade, 0) / slabs.length).toFixed(1) : '10.0';

  const handleExportReport = () => {
    vaultAudio.playButtonTick();
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3500);
  };

  const handleSelectCard = (slab: Slab) => {
    vaultAudio.playVaultAirlock();
    onSelectSlab(slab);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Depository Custodial Security HUD Banner */}
      <div className="bg-black/80 border border-white/10 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-zinc-300 font-bold tracking-wider">
            DEPOSITORY SECTOR 7G • ARMORED SEISMIC STEEL CUSTODY
          </span>
        </div>
        <div className="flex items-center space-x-4 text-zinc-400">
          <span className="hidden sm:inline">LLOYD&apos;S UNDERWRITTEN 100%</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-cyan-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> DELAWARE FREE TRADE ZONE
          </span>
        </div>
      </div>

      {/* Institutional Vault Header & Status Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0E1326] via-[#090C1A] to-[#140D24] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
            <h1 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
              Trophy Asset Depository
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Real-time equity valuation, auction comp indexing & 24mm 3D physical slab verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GoldTierBadge size="md" showDetails={true} onClick={onOpenPaywall} />
        </div>
      </div>

      {/* Portfolio Equity Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vault Net Worth */}
        <div className="bg-[#090B16] border border-[#00F0FF]/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F0FF]/10 rounded-full blur-xl group-hover:bg-[#00F0FF]/20 transition-all pointer-events-none" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1">
            Total Vault Net Worth
          </span>
          <div className="text-3xl font-black font-mono text-white tracking-tight">
            {formatCurrency(totalValuation)}
          </div>
          <div className="flex items-center space-x-1 mt-2 text-xs font-mono text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% (30d Comps)</span>
          </div>
        </div>

        {/* Unrealized Gain */}
        <div className="bg-[#090B16] border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1">
            Unrealized Portfolio Gain
          </span>
          <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
            +{formatCurrency(totalProfit)}
          </div>
          <div className="text-xs font-mono text-emerald-300 font-semibold mt-2">
            {formatPercent(overallRoi)} All-Time Return
          </div>
        </div>

        {/* Acquisition Cost Basis */}
        <div className="bg-[#090B16] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1">
            Total Capital Basis
          </span>
          <div className="text-3xl font-black font-mono text-zinc-200 tracking-tight">
            {formatCurrency(totalCostBasis)}
          </div>
          <span className="text-xs font-mono text-zinc-400 mt-2 block">
            Across {slabs.length} Curated Assets
          </span>
        </div>

        {/* Average Grade & Quality Index */}
        <div className="bg-[#090B16] border border-amber-400/30 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1">
            Average Vault Grade
          </span>
          <div className="text-3xl font-black font-mono text-amber-300 tracking-tight flex items-baseline space-x-2">
            <span>{avgGrade}</span>
            <span className="text-xs font-mono text-zinc-400 font-normal">GEM MINT AVG</span>
          </div>
          <span className="text-xs font-mono text-amber-400/80 mt-2 block">
            94% Tier-1 PSA/BGS 10s
          </span>
        </div>
      </div>

      {/* Action Strip: Add Slab, Scanner, Museum Wall Planner, AI Advisor, Export, Share */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#090A14] border border-white/10 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              onOpenAddModal();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black font-display font-extrabold text-xs flex items-center space-x-1.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Deposit Graded Asset</span>
          </button>

          {onOpenScanner && (
            <button
              onClick={() => {
                vaultAudio.playLaserScan();
                onOpenScanner();
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/40 text-[#00F0FF] font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Slab</span>
            </button>
          )}

          {onOpenComparator && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenComparator();
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-400/40 text-purple-300 font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Slabs</span>
            </button>
          )}

          {onOpenAuctionWatchlist && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenAuctionWatchlist();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-400/40 text-amber-300 font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.2)]"
            >
              <Gavel className="w-4 h-4" />
              <span>Auction Radar</span>
            </button>
          )}

          {onOpenCrossoverSimulator && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenCrossoverSimulator();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-400/40 text-emerald-300 font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Zap className="w-4 h-4" />
              <span>Crossover & Regrade EV</span>
            </button>
          )}

          {onOpenLiveComps && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenLiveComps();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-400/40 text-emerald-300 font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Live Comps Radar</span>
            </button>
          )}

          {onOpenCloudSync && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenCloudSync();
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-cyan-400/40 text-cyan-300 font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Cloud Sync & Backup</span>
            </button>
          )}

          {onOpenLeaderboard && (
            <button
              onClick={() => {
                vaultAudio.playGemMintChime();
                onOpenLeaderboard();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 border border-amber-400/50 text-amber-300 font-display font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
            >
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Sovereign Leaderboard</span>
            </button>
          )}

          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              onOpenShowcasePlanner();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#00F0FF]" />
            <span>Display Wall Planner</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              onOpenAiAdvisor();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-display font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#FF007F]" />
            <span>AI Pop & Market Advisor</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              setShowChart(!showChart);
            }}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              showChart
                ? 'bg-cyan-500/20 border-cyan-400/50 text-[#00F0FF]'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-zinc-300'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>{showChart ? 'Hide Price Chart' : 'Show Price Chart'}</span>
          </button>

          {onOpenInsuranceDossier && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenInsuranceDossier();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Insurance Dossier</span>
            </button>
          )}

          {onOpenShareShowcase && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenShareShowcase();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Share Showcase</span>
            </button>
          )}

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Embedded Portfolio Valuation Trajectory Chart */}
      {showChart && (
        <PriceHistoryChart
          currentValue={totalValuation}
          initialCost={totalCostBasis}
          title="Aggregate Vault Net Worth Trajectory"
        />
      )}

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by card name, player, set, or cert #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090A14] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#00F0FF] outline-none"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-[#090A14] border border-white/15 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white outline-none cursor-pointer"
              >
                <option value="value_desc" className="bg-[#090A14]">Value: High to Low</option>
                <option value="roi_desc" className="bg-[#090A14]">ROI %: Highest Gain</option>
                <option value="grade_desc" className="bg-[#090A14]">Grade: 10s First</option>
                <option value="year_desc" className="bg-[#090A14]">Year: Vintage First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-[#090A14] border border-white/15 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Company & Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500 text-[11px] uppercase mr-1">Grading Company:</span>
          {['ALL', 'PSA', 'BGS', 'CGC', 'SGC'].map((co) => (
            <button
              key={co}
              onClick={() => setSelectedCompany(co)}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                selectedCompany === co
                  ? 'bg-[#00F0FF] text-black font-extrabold border-[#00F0FF]'
                  : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {co}
            </button>
          ))}

          <span className="text-zinc-500 text-[11px] uppercase ml-3 mr-1">Category:</span>
          {['ALL', 'Pokemon', 'Basketball', 'Football', 'Baseball', 'Magic: The Gathering'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF007F] text-white font-extrabold border-[#FF007F]'
                  : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ================= VIEW 1: 3D SLAB GRID ================= */}
      {viewMode === 'grid' && (
        <div>
          {filteredSlabs.length === 0 ? (
            <div className="text-center py-16 bg-[#090A14] border border-white/10 rounded-2xl">
              <p className="text-zinc-400 text-sm font-mono">No slabs matched your filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCompany('ALL');
                  setSelectedCategory('ALL');
                }}
                className="mt-3 text-xs font-mono text-[#00F0FF] underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {filteredSlabs.map((slab) => (
                <SlabCard
                  key={slab.id}
                  slab={slab}
                  size="md"
                  interactive={true}
                  onClick={() => handleSelectCard(slab)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: DENSE FINANCIAL TABLE ================= */}
      {viewMode === 'table' && (
        <div className="bg-[#090A14] border border-white/10 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Card & Set</th>
                <th className="py-3.5 px-3">Grade</th>
                <th className="py-3.5 px-3">Cert #</th>
                <th className="py-3.5 px-3">Acquisition Cost</th>
                <th className="py-3.5 px-3">Market Value</th>
                <th className="py-3.5 px-3">ROI (%)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              {filteredSlabs.map((slab) => {
                const profit = slab.currentMarketValue - slab.purchasePrice;
                const roi = slab.purchasePrice > 0 ? (profit / slab.purchasePrice) * 100 : 0;
                const badge = getCompanyBadgeColor(slab.gradingCompany);

                return (
                  <tr
                    key={slab.id}
                    onClick={() => handleSelectCard(slab)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={slab.imageUrl}
                          alt={slab.cardName}
                          className="w-8 h-10 object-cover rounded border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                            {slab.cardName}
                          </p>
                          <span className="text-[10px] text-zinc-400">
                            {slab.setName} • {slab.year}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.border} ${badge.bg} ${badge.text}`}>
                        {slab.gradingCompany} {slab.grade}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-400">
                      #{slab.certNumber}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-zinc-300">
                      {formatCurrency(slab.purchasePrice)}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-[#00F0FF]">
                      {formatCurrency(slab.currentMarketValue)}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`font-bold flex items-center ${roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                        {formatPercent(roi)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCard(slab);
                        }}
                        className="text-xs text-[#00F0FF] hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
