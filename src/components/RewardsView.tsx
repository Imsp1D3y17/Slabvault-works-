import React, { useState } from 'react';
import { Gift, Sparkles, Award, ShieldCheck, Flame, Star, Trophy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../lib/utils';
import { GoldTierBadge } from './GoldTierBadge';

interface RewardsViewProps {
  onAddCredit: (amount: number) => void;
  onOpenPaywall: () => void;
  isVip: boolean;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  onAddCredit,
  onOpenPaywall,
  isVip,
}) => {
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [streakDays, setStreakDays] = useState(7);

  const handleClaimDaily = () => {
    if (claimedDaily) return;
    setClaimedDaily(true);
    onAddCredit(50);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#00F0FF', '#FFD700'],
      });
    } catch (e) {
      // fallback
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-36 text-white">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>TRIUMPH VAULT REWARDS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
          Collector Perks & Drops
        </h2>
        <p className="text-xs text-zinc-400 font-mono">
          Earn pack credits, free PSA grading submissions & VIP multiplier spins
        </p>
      </div>

      {/* Daily Login Reward Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0A0D16] to-[#150E24] border border-white/15 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
              DAILY VAULT CRATE
            </span>
            <h3 className="text-xl font-black font-display text-white">
              Day {streakDays} Login Bonus
            </h3>
            <p className="text-xs text-emerald-400 font-mono font-bold">
              +$50 Instant Pack Credits
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <div className="w-full h-full bg-black/80 rounded-2xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-emerald-400 animate-bounce" />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleClaimDaily}
            disabled={claimedDaily}
            className={`w-full py-3.5 rounded-2xl font-display font-black text-sm transition-all cursor-pointer ${
              claimedDaily
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-black hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-98'
            }`}
          >
            {claimedDaily ? 'Claimed for Today (Next in 18h)' : 'Claim $50 Free Credit'}
          </button>
        </div>
      </div>

      {/* Membership Gold Tier Pass Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-black to-amber-600/10 border border-amber-400/30 flex items-center justify-between">
        <div className="space-y-1">
          <GoldTierBadge size="sm" />
          <p className="text-xs text-zinc-300 font-mono mt-1">
            Zero-fee physical vaulting, 2x drop odds, & priority pack allocations.
          </p>
        </div>
        <button
          onClick={onOpenPaywall}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-display font-black text-xs hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
        >
          {isVip ? 'VIP Active' : 'Upgrade VIP'}
        </button>
      </div>

      {/* Collector Milestones */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
          Active Quests
        </h4>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white">Rip 3 Pokémon Packs</p>
            <p className="text-[10px] text-zinc-400 font-mono">Progress: 2/3 packs ripped</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">+$100 Credit</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white">Inspect a Slab in 3D Spotlight</p>
            <p className="text-[10px] text-zinc-400 font-mono">Progress: Completed</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">Unlocked</span>
        </div>
      </div>
    </div>
  );
};
