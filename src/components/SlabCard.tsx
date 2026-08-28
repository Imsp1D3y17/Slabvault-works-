import React, { useState, useRef } from 'react';
import { Slab } from '../types';
import { formatCurrency, formatPercent, getCompanyBadgeColor } from '../lib/utils';
import { Eye, ShieldCheck, Sparkles, TrendingUp, Copy, Check, Info } from 'lucide-react';
import { SlabVaultCardArtwork } from './SlabVaultCardArtwork';

interface SlabCardProps {
  slab: Slab;
  onClick?: () => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showValuation?: boolean;
  showSubgrades?: boolean;
  glowTheme?: 'cyan' | 'magenta' | 'gold' | 'stealth' | 'emerald' | 'ultraviolet';
  className?: string;
}

export const SlabCard: React.FC<SlabCardProps> = ({
  slab,
  onClick,
  interactive = true,
  size = 'md',
  showValuation = true,
  showSubgrades = true,
  glowTheme = 'cyan',
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [copiedCert, setCopiedCert] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.45 });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const copyCert = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(slab.certNumber);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  const sizeClasses = {
    sm: 'w-[200px] h-[310px]',
    md: 'w-[260px] h-[395px]',
    lg: 'w-[310px] h-[470px]',
    hero: 'w-[340px] md:w-[380px] h-[520px] md:h-[570px]',
  };

  const profit = slab.currentMarketValue - slab.purchasePrice;
  const roi = slab.purchasePrice > 0 ? (profit / slab.purchasePrice) * 100 : 0;
  const badgeInfo = getCompanyBadgeColor(slab.gradingCompany);

  // Render authentic label based on company
  const renderHeaderLabel = () => {
    if (slab.gradingCompany === 'PSA') {
      return (
        <div className="bg-[#FFFFFF] text-black px-2.5 py-1.5 border-b-[2px] border-red-600 rounded-t-sm flex flex-col justify-between select-none shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600"></div>
          <div className="flex justify-between items-start leading-none">
            <div className="flex items-center space-x-1">
              <span className="font-mono text-[9px] font-extrabold text-red-600 tracking-tighter">PSA</span>
              <span className="font-mono text-[8px] text-zinc-500 font-semibold">{slab.year}</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] font-black tracking-tight text-red-600">
                {slab.gradeModifier || 'GEM MT'}
              </span>
            </div>
          </div>
          
          <div className="my-0.5">
            <p className="font-bold text-[10px] sm:text-[11px] leading-tight line-clamp-1 uppercase text-zinc-900 font-sans tracking-tight">
              {slab.cardName}
            </p>
            <p className="text-[8px] sm:text-[9px] text-zinc-600 line-clamp-1 font-medium leading-tight">
              {slab.setName} {slab.cardNumber ? `• ${slab.cardNumber}` : ''}
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-zinc-200 pt-0.5 mt-0.5">
            <div className="font-mono text-[8px] text-zinc-500 font-bold tracking-wider">
              #{slab.certNumber}
            </div>
            <div className="flex items-center space-x-1">
              <span className="bg-red-600 text-white font-mono text-[12px] font-black px-1.5 py-0.2 rounded-sm shadow-xs">
                {slab.grade}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (slab.gradingCompany === 'BGS') {
      const isBlackLabel = slab.subgrades?.isBlackLabel || (
        slab.subgrades?.centering === 10 &&
        slab.subgrades?.corners === 10 &&
        slab.subgrades?.edges === 10 &&
        slab.subgrades?.surface === 10
      );

      return (
        <div className={`px-2.5 py-1.5 rounded-t-sm flex flex-col justify-between select-none shadow-sm relative overflow-hidden ${
          isBlackLabel
            ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-amber-300 border-b-2 border-amber-400'
            : 'bg-gradient-to-r from-[#CBB079] via-[#E4D19E] to-[#C1A366] text-zinc-950 border-b border-amber-700'
        }`}>
          <div className="flex justify-between items-start leading-none">
            <div className="flex items-center space-x-1">
              <span className={`font-mono text-[9px] font-black tracking-wider ${isBlackLabel ? 'text-amber-400' : 'text-zinc-950'}`}>
                BECKETT
              </span>
              <span className="text-[8px] font-bold opacity-80">{slab.year}</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[11px] font-black tracking-tight">
                {isBlackLabel ? 'PRISTINE 10' : slab.gradeModifier || 'GEM MINT'}
              </span>
            </div>
          </div>

          <div className="my-0.5">
            <p className="font-bold text-[10px] sm:text-[11px] leading-tight line-clamp-1 uppercase tracking-tight">
              {slab.cardName}
            </p>
            <p className="text-[8px] sm:text-[9px] opacity-85 line-clamp-1 font-medium leading-tight">
              {slab.setName} {slab.cardNumber}
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-black/20 pt-0.5 mt-0.5">
            <div className="font-mono text-[8px] font-bold tracking-wider opacity-80">
              #{slab.certNumber}
            </div>
            <div className="flex items-center space-x-1">
              <span className={`font-mono text-[13px] font-black px-1.5 py-0.2 rounded-sm shadow-xs ${
                isBlackLabel ? 'bg-amber-400 text-black' : 'bg-zinc-950 text-amber-300'
              }`}>
                {slab.grade}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (slab.gradingCompany === 'CGC') {
      return (
        <div className="bg-[#0B1E36] text-white px-2.5 py-1.5 border-b-[2px] border-cyan-400 rounded-t-sm flex flex-col justify-between select-none shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start leading-none">
            <div className="flex items-center space-x-1">
              <span className="font-mono text-[9px] font-black text-cyan-400 tracking-tighter">CGC CARDS</span>
              <span className="text-[8px] text-zinc-300 font-semibold">{slab.year}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] font-black tracking-tight text-amber-300">
                {slab.gradeModifier || 'PRISTINE'}
              </span>
            </div>
          </div>

          <div className="my-0.5">
            <p className="font-bold text-[10px] sm:text-[11px] leading-tight line-clamp-1 uppercase text-zinc-100 font-sans tracking-tight">
              {slab.cardName}
            </p>
            <p className="text-[8px] sm:text-[9px] text-zinc-400 line-clamp-1 font-medium leading-tight">
              {slab.setName} {slab.cardNumber}
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-cyan-900/50 pt-0.5 mt-0.5">
            <div className="font-mono text-[8px] text-zinc-400 font-bold">
              #{slab.certNumber}
            </div>
            <div className="flex items-center space-x-1">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-mono text-[12px] font-black px-1.5 py-0.2 rounded-sm shadow-xs">
                {slab.grade}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // SGC or Default
    return (
      <div className="bg-[#12131A] text-white px-2.5 py-1.5 border-b-[2px] border-zinc-600 rounded-t-sm flex flex-col justify-between select-none shadow-sm">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[9px] font-black tracking-wider text-zinc-300">{slab.gradingCompany}</span>
          <span className="font-mono text-[8px] text-zinc-400">#{slab.certNumber}</span>
        </div>
        <p className="font-bold text-[10px] line-clamp-1 text-zinc-100">{slab.cardName}</p>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-[8px] text-zinc-400">{slab.setName}</span>
          <span className="font-mono text-[12px] font-black text-amber-300">{slab.grade}</span>
        </div>
      </div>
    );
  };

  const glowStyles = {
    cyan: 'hover:shadow-[0_0_35px_rgba(0,240,255,0.35)] hover:border-[#00F0FF]/50',
    magenta: 'hover:shadow-[0_0_35px_rgba(255,0,127,0.35)] hover:border-[#FF007F]/50',
    gold: 'hover:shadow-[0_0_35px_rgba(255,215,0,0.35)] hover:border-[#FFD700]/50',
    stealth: 'hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] hover:border-white/40',
    emerald: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:border-emerald-400/50',
    ultraviolet: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] hover:border-purple-400/50',
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactive
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${
              rotateX !== 0 || rotateY !== 0 ? 1.02 : 1
            }, ${rotateX !== 0 || rotateY !== 0 ? 1.02 : 1}, 1)`
          : undefined,
        transition: rotateX === 0 && rotateY === 0 ? 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.08s ease-out',
      }}
      className={`group relative select-none cursor-pointer flex flex-col justify-between ${sizeClasses[size]} ${className}`}
    >
      {/* Outer Acrylic Slab Shell */}
      <div
        className={`relative w-full h-full rounded-[14px] bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-white/[0.08] backdrop-blur-xl border border-white/20 p-2 sm:p-2.5 flex flex-col justify-between shadow-2xl transition-all duration-300 ${glowStyles[glowTheme]}`}
      >
        {/* Holographic light glare on hover */}
        {interactive && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[14px] overflow-hidden holo-sheen z-30"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.45) 0%, rgba(0,240,255,0.3) 25%, rgba(255,0,127,0.25) 45%, transparent 70%)`,
            }}
          />
        )}

        {/* Acrylic Edge Highlight */}
        <div className="absolute inset-[1px] rounded-[13px] border border-white/10 pointer-events-none z-10" />

        {/* Top Header Label */}
        <div className="relative z-20 shrink-0">
          {renderHeaderLabel()}
        </div>

        {/* Card Window Container with Photo Scan or App Emblem Artwork */}
        <div className="relative flex-1 my-1.5 sm:my-2 rounded-[6px] overflow-hidden bg-black border border-white/15 p-0.5 flex items-center justify-center group-hover:border-white/30 transition-colors min-h-[160px]">
          {slab.imageUrl ? (
            <img
              src={slab.imageUrl}
              alt={slab.cardName}
              className="w-full h-full object-cover rounded-[5px]"
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

          {/* Holographic Foil overlay inside card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-500/10 opacity-30 pointer-events-none mix-blend-overlay" />

          {/* Rarity & Trophy Asset Badge */}
          {slab.isHolyGrail && (
            <div className="absolute top-2 left-2 z-20 bg-black/80 backdrop-blur-md border border-amber-400/60 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex items-center space-x-1 shadow-lg">
              <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
              <span>TROPHY</span>
            </div>
          )}

          {/* Quick Cert Copy Button */}
          <button
            onClick={copyCert}
            title="Copy Slab Cert Number"
            className="absolute bottom-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white/80 hover:text-white p-1 rounded-sm border border-white/15 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copiedCert ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Subgrades Pills (if BGS or CGC and enabled) */}
        {showSubgrades && slab.subgrades && (
          <div className="relative z-20 grid grid-cols-4 gap-1 text-[8px] font-mono text-center mb-1 shrink-0">
            <div className="bg-black/60 rounded px-0.5 py-0.5 border border-white/10 text-zinc-300">
              <span className="text-[7px] text-zinc-500 block">CEN</span>
              <span className="font-bold">{slab.subgrades.centering || 9.5}</span>
            </div>
            <div className="bg-black/60 rounded px-0.5 py-0.5 border border-white/10 text-zinc-300">
              <span className="text-[7px] text-zinc-500 block">CRN</span>
              <span className="font-bold">{slab.subgrades.corners || 9.5}</span>
            </div>
            <div className="bg-black/60 rounded px-0.5 py-0.5 border border-white/10 text-zinc-300">
              <span className="text-[7px] text-zinc-500 block">EDG</span>
              <span className="font-bold">{slab.subgrades.edges || 9.5}</span>
            </div>
            <div className="bg-black/60 rounded px-0.5 py-0.5 border border-white/10 text-zinc-300">
              <span className="text-[7px] text-zinc-500 block">SRF</span>
              <span className="font-bold">{slab.subgrades.surface || 9.5}</span>
            </div>
          </div>
        )}

        {/* Valuation & ROI Bar at bottom */}
        {showValuation && (
          <div className="relative z-20 bg-[#090A12]/90 backdrop-blur-md rounded-b-[8px] p-1.5 sm:p-2 border border-white/10 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[8px] text-zinc-400 uppercase font-mono tracking-wider block leading-none">
                Est. Market Value
              </span>
              <span className="font-mono text-[11px] sm:text-[13px] font-extrabold text-white tracking-tight leading-tight">
                {formatCurrency(slab.currentMarketValue)}
              </span>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-[8px] text-zinc-400 uppercase font-mono tracking-wider block leading-none">
                All-Time ROI
              </span>
              <span
                className={`font-mono text-[10px] sm:text-[11px] font-bold flex items-center space-x-0.5 leading-tight ${
                  roi >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
                {formatPercent(roi)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ambient Acrylic Shadow Base */}
      <div className="absolute -bottom-2 left-4 right-4 h-3 bg-[#00F0FF]/15 blur-lg rounded-full -z-10 group-hover:bg-[#00F0FF]/30 transition-all duration-300" />
    </div>
  );
};
