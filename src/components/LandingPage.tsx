import React, { useState } from 'react';
import { Slab } from '../types';
import { INITIAL_GRAIL_SLABS } from '../data/sampleGrails';
import { SlabCard } from './SlabCard';
import { formatCurrency } from '../lib/utils';
import {
  Sparkles,
  Shield,
  TrendingUp,
  ArrowRight,
  Zap,
  Layers,
  Award,
  Lock,
  ChevronRight,
  Eye,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onExploreVault: () => void;
  onSelectSlab: (slab: Slab) => void;
  onReplayIntro?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onExploreVault,
  onSelectSlab,
  onReplayIntro,
}) => {
  const [activeGrailIndex, setActiveGrailIndex] = useState(0);
  const featuredGrail = INITIAL_GRAIL_SLABS[activeGrailIndex] || INITIAL_GRAIL_SLABS[0];

  const auctionTickerItems = [
    { title: '1999 1st Ed. Charizard PSA 10', price: 335000, source: 'PWCC Premier', delta: '+14.2%' },
    { title: '2003 Topps Chrome LeBron BGS 9.5', price: 220000, source: 'Goldin Elite', delta: '+18.8%' },
    { title: '1986 Fleer Michael Jordan PSA 10', price: 245000, source: 'Heritage Platinum', delta: '+11.5%' },
    { title: 'Pikachu Illustrator CGC 10', price: 1250000, source: 'Private Treaty', delta: '+22.4%' },
    { title: '2000 Tom Brady Contenders Auto BGS 9', price: 580000, source: 'Goldin 100', delta: '+15.0%' },
    { title: '1952 Topps Mickey Mantle PSA 8', price: 1420000, source: 'Heritage Vault', delta: '+12.0%' },
  ];

  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-[#00F0FF]/30 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-[#00F0FF]/15 via-[#FF007F]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[800px] -right-32 w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[1600px] -left-32 w-[600px] h-[600px] bg-[#FF007F]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Real-Time Auction Live Ticker Bar */}
      <div className="w-full bg-[#080912] border-y border-white/10 py-2 overflow-hidden relative z-20">
        <div className="flex items-center space-x-2 px-4 whitespace-nowrap animate-marquee">
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-red-950/70 border border-red-500/50 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider mr-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block mr-1" />
            LIVE MARKET COMPS
          </div>
          {auctionTickerItems.map((item, idx) => (
            <div key={idx} className="inline-flex items-center space-x-3 text-xs font-mono px-4 text-zinc-300 border-r border-white/10">
              <span className="text-white font-semibold">{item.title}</span>
              <span className="text-[#00F0FF] font-bold">{formatCurrency(item.price)}</span>
              <span className="text-emerald-400 text-[10px]">{item.delta}</span>
              <span className="text-zinc-500 text-[10px]">({item.source})</span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Category Badge & Cursive Flourish */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#00F0FF]/30 backdrop-blur-md text-[#00F0FF] text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>THE MUSEUM GRADE PORTFOLIO ENGINE</span>
              </div>
              <span className="font-cursive text-amber-200/90 text-2xl tracking-wide">
                Excellence in Provenance
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.05] text-white">
              Stop Hiding Your Trophy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-[#FF007F]">Assets</span> in a Box. Track Them Like Equities.
            </h1>

            {/* Subhead with Cursive Touch */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Transform high-end graded cards (PSA, BGS, CGC) into an institutional-grade digital asset vault. Track real-time auction comps, calculate portfolio equity, and design physical wall displays.
              </p>
              <p className="font-cursive text-xl sm:text-2xl text-amber-100/80 font-normal">
                Curated for collectors and traders who view sports & TCG cards as high-yield alternative assets.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartOnboarding}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-extrabold text-base bg-gradient-to-r from-[#00F0FF] via-cyan-300 to-[#FF007F] text-black hover:opacity-95 shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>Curate Your Trophy Assets</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreVault}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-display font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 hover:text-white backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#00F0FF]" />
                <span>Explore Asset Portfolio Demo</span>
              </button>

              {onReplayIntro && (
                <button
                  onClick={onReplayIntro}
                  className="w-full sm:w-auto px-4 py-4 rounded-xl font-mono text-xs bg-[#0b0d16] hover:bg-white/10 border border-[#00F0FF]/30 text-cyan-300 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  title="Experience the opening 3D Glossy Extrusion"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF007F]" />
                  <span>3D Title Intro</span>
                </button>
              )}
            </div>

            {/* Key stats row */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="font-mono text-2xl font-black text-white">$42.8M+</span>
                <span className="text-xs text-zinc-400 block font-mono">Tracked in Vaults</span>
              </div>
              <div>
                <span className="font-mono text-2xl font-black text-[#00F0FF]">100%</span>
                <span className="text-xs text-zinc-400 block font-mono">Cert Verified</span>
              </div>
              <div>
                <span className="font-mono text-2xl font-black text-[#FF007F]">4.9 / 5</span>
                <span className="text-xs text-zinc-400 block font-mono">Collector Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Slab Highlight */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)]">
              {/* Selector Tabs */}
              <div className="flex items-center space-x-2 mb-4 bg-black/60 p-1 rounded-xl border border-white/10">
                {INITIAL_GRAIL_SLABS.slice(0, 4).map((slab, index) => (
                  <button
                    key={slab.id}
                    onClick={() => setActiveGrailIndex(index)}
                    className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                      activeGrailIndex === index
                        ? 'bg-[#00F0FF] text-black font-extrabold shadow-[0_0_10px_#00F0FF]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {slab.gradingCompany} {slab.grade}
                  </button>
                ))}
              </div>

              {/* Graded Slab with 3D Tilt */}
              <div className="flex justify-center py-2">
                <SlabCard
                  slab={featuredGrail}
                  size="hero"
                  interactive={true}
                  glowTheme="cyan"
                  onClick={() => onSelectSlab(featuredGrail)}
                />
              </div>

              {/* Micro Helper Note */}
              <div className="text-center mt-3">
                <span className="text-[11px] font-mono text-zinc-400 inline-flex items-center">
                  <Sparkles className="w-3 h-3 text-[#00F0FF] mr-1" />
                  Hover & tilt slab to inspect holographic foil sheen
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] font-bold mb-2">
            ENGINEERED FOR SERIOUS COLLECTORS & TRADERS
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            The Trinity of Alternative Asset Management
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Museum Display Planner */}
          <div className="p-8 rounded-2xl bg-[#090A13] border border-white/10 hover:border-[#00F0FF]/40 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/10 rounded-full blur-2xl group-hover:bg-[#00F0FF]/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold font-display text-white mb-3">
              Showcase Display Wall Planner
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Drag, arrange, and preview your slabs in physical spaces. Simulate magnetic floating mounts, lit acrylic LED panels, and customizable neon auras.
            </p>
            <span className="text-xs font-mono text-[#00F0FF] font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              <span>Explore Wall Architect</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>

          {/* Pillar 2: Live Comps & Valuation Engine */}
          <div className="p-8 rounded-2xl bg-[#090A13] border border-white/10 hover:border-[#FF007F]/40 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF007F]/10 rounded-full blur-2xl group-hover:bg-[#FF007F]/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-[#FF007F]/15 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,0,127,0.25)]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold font-display text-white mb-3">
              Live Auction Price Intelligence
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Connect to real sales feeds from PWCC Premier, Goldin, Heritage Auctions, and Fanatics Collect to track genuine net asset value.
            </p>
            <span className="text-xs font-mono text-[#FF007F] font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              <span>View Market Comp Feed</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>

          {/* Pillar 3: Insurance Dossier */}
          <div className="p-8 rounded-2xl bg-[#090A13] border border-white/10 hover:border-amber-400/40 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,215,0,0.25)]">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold font-display text-white mb-3">
              Institutional Underwriter Dossiers
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Generate cryptographic cert verification logs and comprehensive valuation schedules accepted by specialty fine art insurers.
            </p>
            <span className="text-xs font-mono text-amber-300 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              <span>Download Sample Dossier</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </section>

      {/* MUSEUM EXHIBITION PREVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="rounded-3xl bg-gradient-to-b from-[#080B17] via-[#05060C] to-black border border-white/15 p-8 sm:p-12 overflow-hidden relative shadow-[0_0_80px_rgba(0,240,255,0.15)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-[#00F0FF] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXHIBIT SHOWROOM PREVIEW</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
                The Pinnacle Asset Exhibition
              </h3>
            </div>
            <button
              onClick={onExploreVault}
              className="px-6 py-3 rounded-xl font-display font-bold text-xs bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black hover:opacity-90 transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <span>Open Interactive Gallery</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {INITIAL_GRAIL_SLABS.slice(0, 4).map((slab) => (
              <SlabCard
                key={slab.id}
                slab={slab}
                size="md"
                interactive={true}
                onClick={() => onSelectSlab(slab)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative z-10">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#00F0FF]/15 via-purple-950/40 to-[#FF007F]/15 border border-[#00F0FF]/40 shadow-[0_0_60px_rgba(0,240,255,0.25)]">
          <h3 className="text-3xl sm:text-5xl font-black font-display text-white mb-4">
            Ready to Elevate Your Graded Asset Portfolio?
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Join elite collectors and alternative asset traders who track rare cards with the precision of blue-chip equities.
          </p>
          <button
            onClick={onStartOnboarding}
            className="px-10 py-5 rounded-2xl font-display font-extrabold text-lg bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-[#FF007F] text-black hover:opacity-95 shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            Launch 3-Step Asset Allocator
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <span className="font-bold text-white tracking-widest uppercase">SLABVAULT</span>
            <span>— Luxury Graded Asset Management</span>
          </div>
          <div>
            <span>PSA • BGS • CGC • SGC • TAG Compatible</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
