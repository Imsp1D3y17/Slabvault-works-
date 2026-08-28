import React, { useState, useMemo } from 'react';
import { Slab } from '../types';
import { formatCurrency, formatPercent, getCompanyBadgeColor } from '../lib/utils';
import {
  X,
  Scale,
  ArrowRightLeft,
  ChevronDown,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  Zap,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface SlabComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slabs: Slab[];
  initialSlabA?: Slab | null;
}

export const SlabComparatorModal: React.FC<SlabComparatorModalProps> = ({
  isOpen,
  onClose,
  slabs,
  initialSlabA,
}) => {
  const [selectedIdA, setSelectedIdA] = useState<string>(
    initialSlabA?.id || slabs[0]?.id || ''
  );
  const [selectedIdB, setSelectedIdB] = useState<string>(
    slabs.length > 1 ? (slabs[0]?.id === (initialSlabA?.id || slabs[0]?.id) ? slabs[1]?.id : slabs[0]?.id) : slabs[0]?.id || ''
  );

  if (!isOpen || slabs.length === 0) return null;

  const slabA = slabs.find((s) => s.id === selectedIdA) || slabs[0];
  const slabB = slabs.find((s) => s.id === selectedIdB) || (slabs[1] || slabs[0]);

  // Derived mock subgrades if not explicitly set (Centering, Corners, Edges, Surface)
  const getSubgrades = (slab: Slab) => {
    const base = slab.grade;
    const isBGS = slab.gradingCompany === 'BGS';
    const isCGC = slab.gradingCompany === 'CGC';
    return {
      centering: isBGS ? (base >= 10 ? 10 : 9.5) : base >= 10 ? 10 : 9.5,
      corners: isBGS ? (base >= 10 ? 9.5 : 9.0) : base >= 10 ? 10 : 9.0,
      edges: isBGS ? (base >= 10 ? 10 : 9.5) : base >= 10 ? 10 : 9.5,
      surface: isBGS ? (base >= 10 ? 10 : 9.5) : base >= 10 ? 9.5 : 9.0,
    };
  };

  const subgradesA = getSubgrades(slabA);
  const subgradesB = getSubgrades(slabB);

  const valueDiff = slabB.currentMarketValue - slabA.currentMarketValue;
  const valueRatio = slabA.currentMarketValue > 0 ? (slabB.currentMarketValue / slabA.currentMarketValue) : 1;

  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#090B14] border border-[#00F0FF]/30 rounded-3xl p-5 sm:p-8 text-white shadow-[0_0_80px_rgba(0,240,255,0.15)] my-8 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF007F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white">
                Slab Head-to-Head & Subgrade Analyzer
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Direct cross-company grade premiums, population scarcity & subgrade analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="hidden sm:inline">Swap Sides</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Head-to-Head Selectors Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 relative z-10">
          {/* Card A Selector */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Asset A (Benchmark Reference)
            </span>
            <div className="relative">
              <select
                value={selectedIdA}
                onChange={(e) => setSelectedIdA(e.target.value)}
                className="w-full bg-[#121526] border border-white/20 rounded-xl py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#00F0FF] appearance-none pr-8 cursor-pointer"
              >
                {slabs.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.gradingCompany} {s.grade}] {s.cardName} ({s.year})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Card B Selector */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-pink-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold block">
              Asset B (Comparison Target)
            </span>
            <div className="relative">
              <select
                value={selectedIdB}
                onChange={(e) => setSelectedIdB(e.target.value)}
                className="w-full bg-[#121526] border border-white/20 rounded-xl py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-pink-400 appearance-none pr-8 cursor-pointer"
              >
                {slabs.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.gradingCompany} {s.grade}] {s.cardName} ({s.year})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Side-by-Side Visual Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Card A Column */}
          <div className="p-5 rounded-2xl bg-[#0C0E1B] border border-cyan-500/30 flex flex-col space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={slabA.imageUrl}
                alt={slabA.cardName}
                className="w-24 h-34 object-cover rounded-xl border-2 border-cyan-400/40 shadow-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded font-mono font-black text-xs ${getCompanyBadgeColor(slabA.gradingCompany)}`}>
                    {slabA.gradingCompany} {slabA.grade}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{slabA.gradeModifier}</span>
                </div>
                <h4 className="font-display font-bold text-base text-white truncate">{slabA.cardName}</h4>
                <p className="text-xs font-mono text-zinc-400">{slabA.setName} • {slabA.year}</p>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">Cert #{slabA.certNumber}</p>

                <div className="mt-3">
                  <span className="text-[10px] font-mono text-zinc-400 block">Market Valuation</span>
                  <span className="text-xl font-black font-display text-cyan-300">
                    {formatCurrency(slabA.currentMarketValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Subgrade Radar / Bars for A */}
            <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                Subgrade Breakdown
              </span>
              {[
                { label: 'Centering', val: subgradesA.centering },
                { label: 'Corners', val: subgradesA.corners },
                { label: 'Edges', val: subgradesA.edges },
                { label: 'Surface', val: subgradesA.surface },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="font-bold text-white">{item.val.toFixed(1)} / 10</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all"
                      style={{ width: `${(item.val / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pop Report Scarcity Metric for A */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-zinc-400 text-[10px] block">Census Population</span>
                <span className="text-amber-300 font-bold">Pop {slabA.popReport?.popAtGrade || 48}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 text-[10px] block">Pop Higher</span>
                <span className="text-zinc-300 font-bold">{slabA.popReport?.popHigher || 0}</span>
              </div>
            </div>
          </div>

          {/* Card B Column */}
          <div className="p-5 rounded-2xl bg-[#0C0E1B] border border-pink-500/30 flex flex-col space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={slabB.imageUrl}
                alt={slabB.cardName}
                className="w-24 h-34 object-cover rounded-xl border-2 border-pink-400/40 shadow-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded font-mono font-black text-xs ${getCompanyBadgeColor(slabB.gradingCompany)}`}>
                    {slabB.gradingCompany} {slabB.grade}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{slabB.gradeModifier}</span>
                </div>
                <h4 className="font-display font-bold text-base text-white truncate">{slabB.cardName}</h4>
                <p className="text-xs font-mono text-zinc-400">{slabB.setName} • {slabB.year}</p>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">Cert #{slabB.certNumber}</p>

                <div className="mt-3">
                  <span className="text-[10px] font-mono text-zinc-400 block">Market Valuation</span>
                  <span className="text-xl font-black font-display text-pink-300">
                    {formatCurrency(slabB.currentMarketValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Subgrade Radar / Bars for B */}
            <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
              <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block">
                Subgrade Breakdown
              </span>
              {[
                { label: 'Centering', val: subgradesB.centering },
                { label: 'Corners', val: subgradesB.corners },
                { label: 'Edges', val: subgradesB.edges },
                { label: 'Surface', val: subgradesB.surface },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="font-bold text-white">{item.val.toFixed(1)} / 10</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-400 rounded-full transition-all"
                      style={{ width: `${(item.val / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pop Report Scarcity Metric for B */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-zinc-400 text-[10px] block">Census Population</span>
                <span className="text-amber-300 font-bold">Pop {slabB.popReport?.popAtGrade || 48}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 text-[10px] block">Pop Higher</span>
                <span className="text-zinc-300 font-bold">{slabB.popReport?.popHigher || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Delta Summary Matrix */}
        <div className="mt-6 p-4 rounded-2xl bg-black/50 border border-white/15 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Valuation Premium Delta</span>
              <span className="font-bold text-white text-sm">
                Asset B is{' '}
                <strong className={valueDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {valueDiff >= 0 ? `+${formatCurrency(valueDiff)}` : `-${formatCurrency(Math.abs(valueDiff))}`}
                </strong>{' '}
                ({(valueRatio * 100).toFixed(0)}% of Asset A)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
              Grade Delta: {slabB.grade - slabA.grade > 0 ? `+${(slabB.grade - slabA.grade).toFixed(1)}` : (slabB.grade - slabA.grade).toFixed(1)}
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
              ROI Delta: {formatPercent((slabB.currentMarketValue - slabB.purchasePrice) / (slabB.purchasePrice || 1) * 100 - (slabA.currentMarketValue - slabA.purchasePrice) / (slabA.purchasePrice || 1) * 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
