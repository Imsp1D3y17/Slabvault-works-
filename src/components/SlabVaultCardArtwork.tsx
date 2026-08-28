import React from 'react';
import { Shield, Sparkles, Zap, Flame, Crown } from 'lucide-react';

interface SlabVaultCardArtworkProps {
  cardName?: string;
  category?: string;
  year?: number;
  rarityTier?: string;
  isHolyGrail?: boolean;
  className?: string;
}

export const SlabVaultCardArtwork: React.FC<SlabVaultCardArtworkProps> = ({
  cardName = 'TROPHY ASSET',
  category = 'ALTERNATIVE ASSET',
  year = 2024,
  rarityTier = 'TROPHY',
  isHolyGrail = true,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full min-h-[160px] rounded-[5px] overflow-hidden bg-gradient-to-b from-[#090C16] via-[#04060C] to-[#0A0D1A] flex flex-col justify-between p-3 select-none text-white border border-white/10 shadow-inner ${className}`}
    >
      {/* Dynamic Perforated Mesh Pattern Background */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00F0FF 0.75px, transparent 0.75px)',
          backgroundSize: '8px 8px',
        }}
      />

      {/* Cybernetic Geometric Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-amber-500/10 pointer-events-none" />

      {/* Corner Tech Angle Accents */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00F0FF]/80" />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00F0FF]/80" />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF007F]/80" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF007F]/80" />

      {/* Top Header inside the Card Artwork */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center space-x-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00F0FF] to-[#FF007F] p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            <Shield className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black font-display tracking-wider text-white flex items-center gap-1">
              SLAB<span className="text-[#00F0FF]">VAULT</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 font-bold border border-white/10">
            {year}
          </span>
          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-[#00F0FF]/20 text-[#00F0FF] font-black border border-[#00F0FF]/40">
            INSTITUTIONAL
          </span>
        </div>
      </div>

      {/* Center Emblem & 3D Typography Logo */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2 text-center">
        {/* Glowing Geometric Crest */}
        <div className="relative mb-2">
          {/* Ambient Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#00F0FF] via-[#FFD700] to-[#FF007F] rounded-full blur-md opacity-40 animate-pulse" />
          
          {/* Main Vault Shield Icon */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/90 border border-white/20 p-2.5 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-cyan-500/20 via-transparent to-amber-400/20 flex items-center justify-center border border-white/15">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
              <Crown className="w-4 h-4 text-[#FFD700] absolute -top-1.5 drop-shadow-[0_0_8px_rgba(255,215,0,0.9)] animate-bounce" />
            </div>
          </div>
        </div>

        {/* 3D Extruded SlabVault Logo Name */}
        <div className="relative">
          <h3 className="text-xl sm:text-2xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            SLABVAULT
          </h3>
          <p className="text-[8px] font-mono tracking-[0.25em] text-[#00F0FF] uppercase font-extrabold mt-0.5">
            AUTHENTICATED ASSET
          </p>
        </div>

        {/* Dynamic Card Name & Category Underwriting Strip */}
        <div className="mt-2 w-full px-2">
          <div className="bg-black/60 border border-white/10 rounded px-2 py-1 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-white uppercase truncate">
              {cardName}
            </p>
            <div className="flex items-center justify-between text-[7.5px] font-mono text-zinc-400 mt-0.5">
              <span className="text-amber-300 font-bold">{category}</span>
              <span className="text-emerald-400 font-bold">INSURED CUSTODY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Spec Bar */}
      <div className="relative z-10 border-t border-white/10 pt-1.5 flex items-center justify-between text-[8px] font-mono text-zinc-400">
        <div className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-zinc-300 font-semibold">SECURED LEDGER</span>
        </div>
        <div className="flex items-center space-x-1.5 text-zinc-400">
          <span>{rarityTier.toUpperCase()}</span>
          <span className="text-white/20">•</span>
          <span className="text-[#00F0FF] font-bold">1-OF-1 VAULTED</span>
        </div>
      </div>

      {/* Holographic Sheen Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-pink-500/10 mix-blend-overlay pointer-events-none opacity-60" />
    </div>
  );
};
