import React from 'react';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';

interface GoldTierBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showDetails?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GoldTierBadge: React.FC<GoldTierBadgeProps> = ({
  size = 'md',
  showIcon = true,
  showDetails = false,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: {
      container: 'px-2.5 py-1 text-[10px] gap-1.5',
      icon: 'w-3 h-3',
      text: 'text-xs tracking-wider',
    },
    md: {
      container: 'px-3.5 py-1.5 text-xs gap-2',
      icon: 'w-4 h-4',
      text: 'text-sm tracking-wider',
    },
    lg: {
      container: 'px-5 py-2.5 text-sm gap-2.5',
      icon: 'w-5 h-5',
      text: 'text-lg tracking-widest',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      id="gold-tier-status-badge"
      onClick={onClick}
      className={`relative group inline-flex items-center rounded-xl bg-gradient-to-r from-amber-950/40 via-black/80 to-amber-950/30 border border-amber-400/30 shadow-[0_0_12px_rgba(255,215,0,0.12)] hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:border-amber-400/50 transition-all duration-300 backdrop-blur-md ${
        onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${currentSize.container} ${className}`}
    >
      {/* Specular Top Rim Reflection - Subtle */}
      <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200/40 to-transparent opacity-60" />

      {/* Gold Ambient Background Aura - Subtle */}
      <div className="absolute inset-0 rounded-xl bg-amber-500/[0.04] opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none" />

      {showIcon && (
        <div className="relative flex items-center justify-center">
          <Crown className={`${currentSize.icon} text-amber-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]`} />
          <Sparkles className="w-2.5 h-2.5 text-amber-200/80 absolute -top-1 -right-1 opacity-70" />
        </div>
      )}

      {/* The Razor-Sharp Polished 24K Gold Typography Component */}
      <div className="relative flex items-center">
        <span
          className={`font-black font-display uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFDF66] to-[#C99700] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] select-none leading-none antialiased ${currentSize.text}`}
        >
          GOLD TIER
        </span>
      </div>

      {showDetails && (
        <div className="hidden sm:flex items-center pl-2 border-l border-amber-400/20 text-[10px] font-mono text-amber-200/70 font-semibold uppercase tracking-wider space-x-1">
          <ShieldCheck className="w-3 h-3 text-amber-400/80" />
          <span>INSTITUTIONAL ALLOCATION</span>
        </div>
      )}
    </div>
  );
};
