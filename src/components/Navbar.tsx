import React, { useState } from 'react';
import { Sparkles, Shield, Layers, LayoutDashboard, Crown, Menu, X, Zap, Volume2, VolumeX } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { GoldTierBadge } from './GoldTierBadge';
import { vaultAudio } from '../lib/vaultAudio';

interface NavbarProps {
  currentView: 'landing' | 'onboarding' | 'vault' | 'museum';
  onNavigate: (view: 'landing' | 'onboarding' | 'vault' | 'museum') => void;
  totalVaultValue: number;
  isVip: boolean;
  onOpenPaywall: () => void;
  onOpenLeaderboard?: () => void;
  onReplayIntro?: () => void;
  onOpenCloudSync?: () => void;
  onOpenLiveComps?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  totalVaultValue,
  isVip,
  onOpenPaywall,
  onOpenLeaderboard,
  onReplayIntro,
  onOpenCloudSync,
  onOpenLiveComps,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(vaultAudio.getIsMuted());

  const handleToggleAudio = () => {
    const muted = vaultAudio.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      vaultAudio.playButtonTick();
    }
  };

  const handleNavClick = (view: 'landing' | 'onboarding' | 'vault' | 'museum') => {
    vaultAudio.playButtonTick();
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#05050A]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Cursive Subtext */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#FF007F] p-[1px] shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg tracking-tight text-white flex items-center leading-none">
              SLAB<span className="text-[#00F0FF]">VAULT</span>
            </span>
            <span className="font-cursive text-amber-200 text-sm leading-none pt-0.5 tracking-wider">
              Private Asset Vault
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 font-mono text-xs">
          <button
            onClick={() => handleNavClick('landing')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'landing' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Showcase
          </button>
          <button
            onClick={() => handleNavClick('vault')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'vault' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Asset Portfolio
          </button>
          <button
            onClick={() => handleNavClick('museum')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'museum' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Display Wall
          </button>
          <button
            onClick={() => handleNavClick('onboarding')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'onboarding' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Asset Wizard
          </button>
          {onOpenLeaderboard && (
            <button
              onClick={() => {
                vaultAudio.playGemMintChime();
                onOpenLeaderboard();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Leaderboard</span>
            </button>
          )}
          {onOpenLiveComps && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenLiveComps();
              }}
              title="Search Live Auction Comps & Verify Slabs"
              className="px-2.5 py-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer flex items-center space-x-1 text-[11px]"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Live Comps</span>
            </button>
          )}
          {onOpenCloudSync && (
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onOpenCloudSync();
              }}
              title="Cloud Sync, Backup & Restore Vault"
              className="px-2.5 py-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer flex items-center space-x-1 text-[11px]"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Cloud Sync</span>
            </button>
          )}
          {onReplayIntro && (
            <button
              onClick={() => {
                vaultAudio.playVaultAirlock();
                onReplayIntro();
              }}
              title="View 3D Extrusion Opening Scene"
              className="px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-[#00F0FF] hover:bg-white/5 transition-colors cursor-pointer flex items-center space-x-1 text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-[#00F0FF]" />
              <span>3D Intro</span>
            </button>
          )}
        </nav>

        {/* Right Action: Portfolio Value & VIP Pass & Audio */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Audio FX Controller Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-1 text-xs font-mono ${
              !isAudioMuted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-black/60 text-zinc-500 hover:text-zinc-300 border-white/10'
            }`}
            title={isAudioMuted ? 'Enable High-Fidelity Audio' : 'Mute High-Fidelity Audio'}
          >
            {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden lg:inline">{!isAudioMuted ? 'FX ON' : 'MUTED'}</span>
          </button>

          {/* Live Portfolio Ticker */}
          <div className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-right">
            <span className="text-[9px] font-mono uppercase text-zinc-400 block leading-none">
              Vault Equity
            </span>
            <span className="font-mono text-xs font-black text-[#00F0FF] leading-tight">
              {formatCurrency(totalVaultValue, true)}
            </span>
          </div>

          {/* Membership Badge or Paywall Trigger */}
          {isVip ? (
            <GoldTierBadge size="sm" showDetails={true} onClick={onOpenPaywall} />
          ) : (
            <div className="flex items-center space-x-2">
              <GoldTierBadge size="sm" className="cursor-pointer" onClick={onOpenPaywall} />
              <button
                onClick={() => {
                  vaultAudio.playGemMintChime();
                  onOpenPaywall();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black font-display font-extrabold text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:opacity-90 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-black" />
                <span>VIP Pass</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07080F] border-b border-white/10 px-4 py-4 space-y-2 font-mono text-xs">
          <button
            onClick={() => {
              onNavigate('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-300 hover:bg-white/5"
          >
            Showcase
          </button>
          <button
            onClick={() => {
              onNavigate('vault');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-300 hover:bg-white/5"
          >
            Asset Portfolio
          </button>
          <button
            onClick={() => {
              onNavigate('museum');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-300 hover:bg-white/5"
          >
            Display Wall
          </button>
          <button
            onClick={() => {
              onNavigate('onboarding');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-zinc-300 hover:bg-white/5"
          >
            Asset Wizard
          </button>
          {onOpenLeaderboard && (
            <button
              onClick={() => {
                onOpenLeaderboard();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-amber-300 bg-amber-500/10 border border-amber-400/30 flex items-center space-x-2 font-bold"
            >
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Sovereign Leaderboard</span>
            </button>
          )}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                onOpenPaywall();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black font-extrabold text-center font-display"
            >
              Unlock VIP Pass ($8.99/wk or $89/yr)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
