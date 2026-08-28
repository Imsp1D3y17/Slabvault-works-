import React, { useState } from 'react';
import { Slab } from '../types';
import { formatCurrency, formatPercent, getCompanyBadgeColor } from '../lib/utils';
import { SlabVaultCardArtwork } from './SlabVaultCardArtwork';
import { PriceHistoryChart } from './PriceHistoryChart';
import {
  X,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Calendar,
  Layers,
  Award,
  DollarSign,
  Share2,
  Scale,
  Zap,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';

interface SlabDetailModalProps {
  slab: Slab | null;
  onClose: () => void;
  onOpenInsurancePDF?: () => void;
  onOpenComparator?: (slab: Slab) => void;
  onOpenCrossoverSimulator?: (slab: Slab) => void;
  onOpenImageReplace?: (slab: Slab) => void;
}

export const SlabDetailModal: React.FC<SlabDetailModalProps> = ({
  slab,
  onClose,
  onOpenInsurancePDF,
  onOpenComparator,
  onOpenCrossoverSimulator,
  onOpenImageReplace,
}) => {
  const [copiedCert, setCopiedCert] = useState(false);
  const [activeTab, setActiveTab] = useState<'comps' | 'pop' | 'provenance' | 'insurance'>('comps');
  const [artMode, setArtMode] = useState<'photo' | 'emblem'>(slab?.imageUrl ? 'photo' : 'emblem');

  if (!slab) return null;

  const profit = slab.currentMarketValue - slab.purchasePrice;
  const roi = slab.purchasePrice > 0 ? (profit / slab.purchasePrice) * 100 : 0;
  const badge = getCompanyBadgeColor(slab.gradingCompany);

  const copyCert = () => {
    navigator.clipboard.writeText(slab.certNumber);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#080912] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden my-6">
        {/* Ambient background aura */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#00F0FF]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#FF007F]/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Column: Slab Holographic Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.04] p-3 border border-white/20 shadow-2xl">
              {/* Header Label */}
              <div className="bg-white text-black p-2.5 rounded border-b-2 border-red-600 mb-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                  <span className="text-red-600">{slab.gradingCompany}</span>
                  <span className="text-zinc-500">{slab.year}</span>
                  <span className="text-red-600 font-extrabold">{slab.gradeModifier || 'GEM MT'}</span>
                </div>
                <p className="font-bold text-xs line-clamp-1 uppercase text-zinc-900 mt-0.5">{slab.cardName}</p>
                <div className="flex justify-between items-center text-[9px] text-zinc-600 mt-1">
                  <span>{slab.setName}</span>
                  <span className="font-mono bg-red-600 text-white px-1.5 py-0.2 rounded font-extrabold">
                    {slab.grade}
                  </span>
                </div>
              </div>

              {/* Card Image / SlabVault App Emblem Artwork */}
              <div className="relative rounded-lg overflow-hidden border border-white/20 aspect-[3/4] bg-black group">
                {artMode === 'photo' && slab.imageUrl ? (
                  <img
                    src={slab.imageUrl}
                    alt={slab.cardName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <SlabVaultCardArtwork
                    cardName={slab.cardName}
                    category={slab.category}
                    year={slab.year}
                    rarityTier={slab.rarityTier}
                    isHolyGrail={slab.isHolyGrail}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-cyan-400/20 mix-blend-overlay pointer-events-none" />

                {/* Quick Switch & Replace Image Actions overlay */}
                {onOpenImageReplace && (
                  <button
                    onClick={() => onOpenImageReplace(slab)}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-cyan-300 text-[10px] font-mono font-bold border border-cyan-400/50 flex items-center gap-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 backdrop-blur-md"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Replace Scan</span>
                  </button>
                )}

                {slab.imageUrl && (
                  <button
                    onClick={() => setArtMode(artMode === 'photo' ? 'emblem' : 'photo')}
                    className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-black/70 hover:bg-black text-white text-[9px] font-mono border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 backdrop-blur-sm"
                  >
                    {artMode === 'photo' ? 'Show Emblem' : 'Show Photo'}
                  </button>
                )}
              </div>

              {/* Explicit Replace Image Toolbar Button */}
              {onOpenImageReplace && (
                <div className="mt-2 w-full flex justify-center">
                  <button
                    onClick={() => onOpenImageReplace(slab)}
                    className="w-full py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload or Replace Card Image</span>
                  </button>
                </div>
              )}

              {/* Cert Barcode & Verify Tag */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Cert: #{slab.certNumber}</span>
                <button
                  onClick={copyCert}
                  className="text-[#00F0FF] hover:text-white flex items-center space-x-1"
                >
                  {copiedCert ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCert ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Official Registry Link & Compare / Crossover Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <a
                href={`https://www.psacard.com/cert/${slab.certNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#00F0FF] flex items-center space-x-1.5 underline underline-offset-4"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify Registry</span>
              </a>

              <div className="flex items-center gap-2">
                {onOpenCrossoverSimulator && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCrossoverSimulator(slab);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400/50 text-emerald-300 font-bold flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Crossover EV</span>
                  </button>
                )}

                {onOpenComparator && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenComparator(slab);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-400/50 text-purple-300 font-bold flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Deep Analytics & Comps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${badge.border} ${badge.bg} ${badge.text}`}>
                  {slab.gradingCompany} {slab.grade}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-zinc-300">
                  {slab.category}
                </span>
                {slab.isHolyGrail && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Trophy Asset</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                {slab.cardName}
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                {slab.setName} • Card {slab.cardNumber || 'Standard'} • Year {slab.year}
              </p>
            </div>

            {/* Valuation Stats Box */}
            <div className="grid grid-cols-3 gap-3 bg-[#0B0D18] border border-white/10 rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Est. Market Value</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#00F0FF]">
                  {formatCurrency(slab.currentMarketValue)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Cost Basis</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-zinc-200">
                  {formatCurrency(slab.purchasePrice)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Unrealized ROI</span>
                <span className={`text-xl sm:text-2xl font-black font-mono flex items-center ${
                  roi >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1 inline" />
                  {formatPercent(roi)}
                </span>
              </div>
            </div>

            {/* Subgrades Breakdown if available */}
            {slab.subgrades && (
              <div className="bg-[#0B0D18] border border-white/10 rounded-xl p-3.5">
                <p className="text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
                  Beckett Subgrades Analysis
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-black/50 p-2 rounded border border-white/10">
                    <span className="text-[10px] text-zinc-400 block">Centering</span>
                    <span className="font-extrabold text-amber-300">{slab.subgrades.centering}</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded border border-white/10">
                    <span className="text-[10px] text-zinc-400 block">Corners</span>
                    <span className="font-extrabold text-amber-300">{slab.subgrades.corners}</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded border border-white/10">
                    <span className="text-[10px] text-zinc-400 block">Edges</span>
                    <span className="font-extrabold text-amber-300">{slab.subgrades.edges}</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded border border-white/10">
                    <span className="text-[10px] text-zinc-400 block">Surface</span>
                    <span className="font-extrabold text-amber-300">{slab.subgrades.surface}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabbed Info View */}
            <div>
              <div className="flex border-b border-white/10 mb-4 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('comps')}
                  className={`pb-2 px-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'comps' ? 'border-[#00F0FF] text-[#00F0FF] font-bold' : 'border-transparent text-zinc-400'
                  }`}
                >
                  Auction Comps ({slab.historicalComps?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('pop')}
                  className={`pb-2 px-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'pop' ? 'border-[#00F0FF] text-[#00F0FF] font-bold' : 'border-transparent text-zinc-400'
                  }`}
                >
                  Pop Report
                </button>
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`pb-2 px-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'insurance' ? 'border-[#00F0FF] text-[#00F0FF] font-bold' : 'border-transparent text-zinc-400'
                  }`}
                >
                  Insurance & Provenance
                </button>
              </div>

              {/* Comps Tab */}
              {activeTab === 'comps' && (
                <div className="space-y-4">
                  <PriceHistoryChart
                    currentValue={slab.currentMarketValue}
                    initialCost={slab.purchasePrice}
                    historicalComps={slab.historicalComps}
                    title={`${slab.cardName} Comp Trajectory`}
                  />

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">
                      Realized Auction Comps
                    </span>
                    {slab.historicalComps?.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs font-mono"
                      >
                        <div>
                          <span className="text-white font-bold">{comp.auctionHouse}</span>
                          <span className="text-zinc-400 text-[10px] block">{comp.date} {comp.notes ? `• ${comp.notes}` : ''}</span>
                        </div>
                        <span className="text-[#00F0FF] font-extrabold text-sm">
                          {formatCurrency(comp.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pop Report Tab */}
              {activeTab === 'pop' && (
                <div className="p-4 rounded-xl bg-[#0B0D18] border border-white/10 space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-zinc-400">Population at this Grade ({slab.grade}):</span>
                    <span className="text-white font-bold">{slab.popReport?.popAtGrade ?? 122} copies</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-zinc-400">Population Higher:</span>
                    <span className="text-amber-400 font-bold">{slab.popReport?.popHigher ?? 0} copies</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Total Graded Population:</span>
                    <span className="text-zinc-200 font-bold">{slab.popReport?.totalPopulation ?? 3840}</span>
                  </div>
                </div>
              )}

              {/* Insurance Tab */}
              {activeTab === 'insurance' && (
                <div className="p-4 rounded-xl bg-[#0B0D18] border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Insurance Appraisal Schedule Active</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Underwriting valuation scheduled at <strong className="text-white font-mono">{formatCurrency(slab.insuranceValuation || slab.currentMarketValue * 1.05)}</strong>. Valid with AXA Art, Berkley One, and Chubb collectibles policies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
