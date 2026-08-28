import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, Zap, Lock, Star, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MembershipTier } from '../types';
import { GoldTierBadge } from './GoldTierBadge';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tier: MembershipTier) => void;
  portfolioValue?: number;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  portfolioValue = 850000,
}) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'weekly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#FF007F', '#FFD700', '#ffffff'],
        });
      } catch (e) {
        // Confetti fallback
      }
      onSuccess(billingCycle === 'yearly' ? 'yearly_founder' : 'weekly_vip');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#080911] border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.25)] p-6 md:p-8 text-white overflow-hidden my-8">
        {/* Background glow highlights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#00F0FF]/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#FF007F]/20 rounded-full blur-[90px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 mb-3">
          <GoldTierBadge size="sm" />
          <span className="text-xs text-amber-400 font-mono font-semibold flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Insurer Certified
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white mb-2">
          Unlock Full Museum Vault & Live Comps
        </h2>
        <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
          Your curated trophy assets represent serious equity. Manage, insure, and showcase your collection with the industry's premier digital vault engine.
        </p>

        {/* Plan Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Yearly Founder Plan */}
          <div
            onClick={() => setBillingCycle('yearly')}
            className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-b from-[#00F0FF]/15 to-[#050B14] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                : 'bg-[#0E101B]/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-mono font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full shadow-sm">
              Save 81% • Most Popular
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-base text-white">Annual Founder</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    billingCycle === 'yearly' ? 'border-[#00F0FF] bg-[#00F0FF]' : 'border-zinc-500'
                  }`}
                >
                  {billingCycle === 'yearly' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>
              <p className="text-xs text-zinc-400">Full annual license + priority comps</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-mono text-2xl font-black text-white">$89.00</span>
                <span className="text-xs text-zinc-400">/ year</span>
              </div>
              <span className="text-[11px] font-mono text-[#00F0FF] font-medium block mt-0.5">
                Just $1.71 / week billed yearly
              </span>
            </div>
          </div>

          {/* Weekly Plan */}
          <div
            onClick={() => setBillingCycle('weekly')}
            className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
              billingCycle === 'weekly'
                ? 'bg-gradient-to-b from-[#FF007F]/15 to-[#14050D] border-[#FF007F] shadow-[0_0_20px_rgba(255,0,127,0.2)]'
                : 'bg-[#0E101B]/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-base text-white">Weekly Access</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    billingCycle === 'weekly' ? 'border-[#FF007F] bg-[#FF007F]' : 'border-zinc-500'
                  }`}
                >
                  {billingCycle === 'weekly' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>
              <p className="text-xs text-zinc-400">Flexible pay-as-you-go membership</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-mono text-2xl font-black text-white">$8.99</span>
                <span className="text-xs text-zinc-400">/ week</span>
              </div>
              <span className="text-[11px] text-zinc-400 block mt-0.5">Cancel anytime in 1-click</span>
            </div>
          </div>
        </div>

        {/* Feature List Matrix */}
        <div className="bg-[#0B0D18] rounded-xl p-4 border border-white/10 mb-6">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
            What's Included with SlabVault Black Pass:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Live Auction Comps (Goldin, PWCC, Heritage)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>3D Virtual Museum & Wall Display Customizer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Direct Insurance Valuation PDF Dossier Export</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>Unlimited Slab Cert Tracking & Pop Alerts</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-xl font-display font-extrabold text-base text-black bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-[#FF007F] hover:opacity-95 shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Provisioning Vault Credentials...</span>
            </div>
          ) : (
            <>
              <span>Unlock Instant Vault Access</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center space-x-4 mt-4 text-[11px] text-zinc-400">
          <span className="flex items-center">
            <Lock className="w-3 h-3 mr-1 text-[#00F0FF]" /> 256-Bit Encrypted
          </span>
          <span>•</span>
          <span>100% Satisfaction Guarantee</span>
          <span>•</span>
          <button
            onClick={() => {
              onSuccess('free');
            }}
            className="text-zinc-400 hover:text-white underline underline-offset-2"
          >
            Continue in Guest Preview
          </button>
        </div>
      </div>
    </div>
  );
};
