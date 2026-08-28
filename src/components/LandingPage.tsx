import React, { useState } from 'react';
import { Slab } from '../types';
import { INITIAL_GRAIL_SLABS } from '../data/sampleGrails';
import { SlabCard } from './SlabCard';
import { formatCurrency } from '../lib/utils';
import { vaultAudio } from '../lib/vaultAudio';
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
  CheckCircle2,
  ExternalLink,
  Smartphone,
  BarChart3,
  Search,
  Scan,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldCheck,
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
  const [activeTabFeature, setActiveTabFeature] = useState<'wall' | 'comps' | 'advisor' | 'insurance'>('wall');
  const [interactiveSearch, setInteractiveSearch] = useState('');
  const featuredGrail = INITIAL_GRAIL_SLABS[activeGrailIndex] || INITIAL_GRAIL_SLABS[0];

  const auctionTickerItems = [
    { title: '1999 1st Ed. Charizard PSA 10', price: 335000, source: 'PWCC Premier', delta: '+14.2%' },
    { title: '2003 Topps Chrome LeBron BGS 9.5', price: 220000, source: 'Goldin Elite', delta: '+18.8%' },
    { title: '1986 Fleer Michael Jordan PSA 10', price: 245000, source: 'Heritage Platinum', delta: '+11.5%' },
    { title: 'Pikachu Illustrator CGC 10', price: 1250000, source: 'Private Treaty', delta: '+22.4%' },
    { title: '2000 Tom Brady Contenders Auto BGS 9', price: 580000, source: 'Goldin 100', delta: '+15.0%' },
    { title: '1952 Topps Mickey Mantle PSA 8', price: 1420000, source: 'Heritage Vault', delta: '+12.0%' },
  ];

  const gradingCompanies = [
    { name: 'PSA', subtitle: 'Professional Sports Authenticator', badgeColor: 'border-red-500/40 text-red-400 bg-red-950/20' },
    { name: 'BGS', subtitle: 'Beckett Grading Services', badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/20' },
    { name: 'CGC', subtitle: 'Certified Guaranty Company', badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/20' },
    { name: 'SGC', subtitle: 'Sportscard Guaranty Corp', badgeColor: 'border-zinc-400/40 text-zinc-300 bg-zinc-900/40' },
    { name: 'TAG', subtitle: 'Transparent Automated Grading', badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20' },
  ];

  const filteredGrails = interactiveSearch.trim()
    ? INITIAL_GRAIL_SLABS.filter((s) =>
        `${s.cardName} ${s.year} ${s.gradingCompany} ${s.setName || ''}`
          .toLowerCase()
          .includes(interactiveSearch.toLowerCase())
      )
    : INITIAL_GRAIL_SLABS;

  return (
    <div className="min-h-screen bg-[#05060A] text-white selection:bg-[#FF7A00]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-b from-[#FF7A00]/15 via-[#00F0FF]/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[900px] -right-40 w-[700px] h-[700px] bg-[#FF7A00]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[1800px] -left-40 w-[700px] h-[700px] bg-[#00F0FF]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Brand Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#05060A]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onExploreVault}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-black text-base shadow-[0_0_20px_rgba(255,122,0,0.4)]">
              SV
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-wider text-white flex items-center gap-1.5">
                <span>SLABVAULT</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block -mt-0.5">
                Architectural Graded Card Vault
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-zinc-400">
            <button onClick={onExploreVault} className="hover:text-[#FF7A00] transition-colors cursor-pointer">
              Vault Collection
            </button>
            <button onClick={onExploreVault} className="hover:text-[#00F0FF] transition-colors cursor-pointer">
              3D Showroom
            </button>
            <button onClick={onStartOnboarding} className="hover:text-amber-300 transition-colors cursor-pointer">
              Asset Allocator
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                vaultAudio.playButtonTick();
                onExploreVault();
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/15 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Explore Demo</span>
            </button>

            <button
              onClick={() => {
                vaultAudio.playGemMintChime();
                onStartOnboarding();
              }}
              className="px-4 py-2 rounded-xl text-xs font-display font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black shadow-[0_0_20px_rgba(255,122,0,0.35)] transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>Launch Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Real-Time Auction Live Ticker Bar */}
      <div className="w-full bg-[#080A14] border-b border-white/10 py-2.5 overflow-hidden relative z-20">
        <div className="flex items-center space-x-2 px-4 whitespace-nowrap animate-marquee">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider mr-4 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block mr-1.5" />
            LIVE MARKET RADAR
          </div>
          {auctionTickerItems.map((item, idx) => (
            <div key={idx} className="inline-flex items-center space-x-3 text-xs font-mono px-4 text-zinc-300 border-r border-white/10">
              <span className="text-white font-semibold">{item.title}</span>
              <span className="text-amber-400 font-bold">{formatCurrency(item.price)}</span>
              <span className="text-emerald-400 text-[10px] font-bold">{item.delta}</span>
              <span className="text-zinc-500 text-[10px]">({item.source})</span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2.5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-amber-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(255,122,0,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ARCHITECTURAL ASSET PORTFOLIO</span>
              </div>
              <span className="font-cursive text-amber-200/90 text-2xl tracking-wide hidden sm:inline-block">
                Triumph Luxury Edition
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.05] text-white">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-[#00F0FF]">Trophy Cards</span> to Institutional Equity.
            </h1>

            <div className="space-y-3">
              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Transform high-end graded cards (PSA, BGS, CGC, SGC) into an interactive 3D luxury asset vault. Track real-time auction comps, simulate grade crossover yield, and curate physical wall exhibits.
              </p>
              <p className="font-cursive text-xl sm:text-2xl text-amber-100/85">
                Curated for discerning collectors treating sports & TCG grails as premier alternative assets.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => {
                  vaultAudio.playGemMintChime();
                  onStartOnboarding();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-black text-base bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black shadow-[0_0_35px_rgba(255,122,0,0.45)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>Curate Your Vault Assets</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  vaultAudio.playButtonTick();
                  onExploreVault();
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-display font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 hover:text-white backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <Eye className="w-4 h-4 text-[#00F0FF]" />
                <span>Explore Live Vault Demo</span>
              </button>

              {onReplayIntro && (
                <button
                  onClick={() => {
                    vaultAudio.playButtonTick();
                    onReplayIntro();
                  }}
                  className="w-full sm:w-auto px-4 py-4 rounded-xl font-mono text-xs bg-black/60 hover:bg-white/10 border border-amber-500/30 text-amber-300 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  title="Experience the opening 3D Glossy Extrusion"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D Title Intro</span>
                </button>
              )}
            </div>

            {/* Live Metrics Row */}
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
                <span className="font-mono text-2xl font-black text-amber-400">4.9 / 5</span>
                <span className="text-xs text-zinc-400 block font-mono">Collector Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Slab Spotlight */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-black/80 border border-amber-500/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(255,122,0,0.2)] w-full max-w-md">
              {/* Slab Selector Tabs */}
              <div className="flex items-center justify-between mb-4 bg-black/70 p-1.5 rounded-xl border border-white/10">
                {INITIAL_GRAIL_SLABS.slice(0, 4).map((slab, index) => (
                  <button
                    key={slab.id}
                    onClick={() => {
                      vaultAudio.playButtonTick();
                      setActiveGrailIndex(index);
                    }}
                    className={`px-2.5 py-1.5 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                      activeGrailIndex === index
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold shadow-[0_0_12px_rgba(255,122,0,0.5)]'
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
                  glowTheme="amber"
                  onClick={() => onSelectSlab(featuredGrail)}
                />
              </div>

              {/* Interactive Helper Button */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                  Tap slab to inspect in 3D Touch mode
                </span>
                <button
                  onClick={() => onSelectSlab(featuredGrail)}
                  className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                >
                  <span>3D Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPATIBILITY STRIP */}
      <section className="py-8 bg-black/60 border-y border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6">
            UNIVERSAL COMPATIBILITY WITH ALL MAJOR AUTHENTICATION REGISTRIES
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {gradingCompanies.map((comp) => (
              <div
                key={comp.name}
                className={`p-3.5 rounded-xl border ${comp.badgeColor} flex flex-col items-center justify-center text-center transition-all hover:scale-105`}
              >
                <span className="font-display font-black text-xl tracking-wider">{comp.name}</span>
                <span className="text-[10px] font-mono text-zinc-400 mt-0.5">{comp.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE SHOWCASE MATRIX */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-2">
            ENGINEERED FOR SERIOUS COLLECTORS & TRADERS
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            The Complete Asset Management Suite
          </h3>
          <p className="text-sm text-zinc-400 mt-3 max-w-xl mx-auto">
            From physical showcase architecture to real-time secondary market comp feeds and underwriter insurance dossiers.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="bg-zinc-900/80 p-1.5 rounded-2xl border border-white/10 flex space-x-2">
            <button
              onClick={() => setActiveTabFeature('wall')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTabFeature === 'wall'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(255,122,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Showcase Wall Architect</span>
            </button>
            <button
              onClick={() => setActiveTabFeature('comps')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTabFeature === 'comps'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(255,122,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Live Market Radar</span>
            </button>
            <button
              onClick={() => setActiveTabFeature('advisor')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTabFeature === 'advisor'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(255,122,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>AI Grail Advisor</span>
            </button>
            <button
              onClick={() => setActiveTabFeature('insurance')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTabFeature === 'insurance'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(255,122,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Underwriter Dossiers</span>
            </button>
          </div>
        </div>

        {/* Feature Deep Dive Panel */}
        <div className="bg-gradient-to-b from-zinc-900/90 to-black border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {activeTabFeature === 'wall' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  <Layers className="w-3.5 h-3.5" />
                  <span>PHYSICAL DISPLAY ARCHITECTURE</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Design Your VIP Monolith Gallery
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Simulate magnetic floating mounts, illuminated acrylic LED backplates, obsidian shadowboxes, and customizable neon halos. Layout your physical collector room before mounting a single bracket.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Real-time aspect ratio preservation across PSA, BGS, and CGC</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Dynamic LED lighting themes: Triumph Amber, Cyber Cyan, Emerald Glow</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>1-click shareable exhibition link for private collector viewing</span>
                  </div>
                </div>
                <button
                  onClick={onExploreVault}
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black font-display font-black text-xs hover:bg-amber-400 transition-colors flex items-center space-x-2 cursor-pointer mt-4"
                >
                  <span>Launch Showroom Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-black/80 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  {INITIAL_GRAIL_SLABS.slice(0, 2).map((slab) => (
                    <div key={slab.id} className="flex justify-center">
                      <SlabCard slab={slab} size="sm" interactive={false} />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-zinc-400 mt-4">Simulated Triumph Dual Rail Mount</span>
              </div>
            </div>
          )}

          {activeTabFeature === 'comps' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>SECONDARY MARKET PRICING RADAR</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Live Public Auction Transactions
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Stream verified sales records from Goldin, PWCC Premier, Heritage Platinum, and eBay Authenticity Guaranteed. Eliminate spreadsheet lag with automated pop report delta tracking.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                    <span>30-day moving volume-weighted average pricing</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                    <span>Direct cert registry verification against official databases</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                    <span>Automated portfolio gain/loss tracking per asset</span>
                  </div>
                </div>
                <button
                  onClick={onExploreVault}
                  className="px-6 py-3 rounded-xl bg-[#00F0FF] text-black font-display font-black text-xs hover:bg-[#00D8E6] transition-colors flex items-center space-x-2 cursor-pointer mt-4"
                >
                  <span>View Live Comps Feed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-black/80 rounded-2xl border border-white/10 p-4 space-y-2.5">
                {auctionTickerItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{item.source}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-amber-400">{formatCurrency(item.price)}</div>
                      <div className="text-[10px] font-mono text-emerald-400">{item.delta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTabFeature === 'advisor' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono">
                  <Zap className="w-3.5 h-3.5" />
                  <span>NEURAL VALUATION & REGIONAL COMPS</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Autonomous AI Grail Advisor
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Evaluate market depth, liquidity tiers, population risk, and optimal auction timing. Receive instant yield projections for cross-grading between BGS, PSA, and CGC.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Crossover probability calculator based on subgrade distribution</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Historical liquidity modeling for 5-figure and 6-figure cards</span>
                  </div>
                </div>
                <button
                  onClick={onExploreVault}
                  className="px-6 py-3 rounded-xl bg-purple-500 text-white font-display font-black text-xs hover:bg-purple-400 transition-colors flex items-center space-x-2 cursor-pointer mt-4"
                >
                  <span>Launch Advisor Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-purple-300">AI ASSET APPRAISAL</span>
                </div>
                <p className="text-xs text-zinc-300 italic">
                  "Recommendation: 1999 1st Edition Charizard PSA 10 demonstrates resilient +14.2% YoY growth despite population index fluctuations. Recommended hold window: 18-24 months."
                </p>
                <div className="pt-2 border-t border-purple-500/20 flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Confidence Score: 96.4%</span>
                  <span className="text-purple-300">Tier 1 Blue-Chip</span>
                </div>
              </div>
            </div>
          )}

          {activeTabFeature === 'insurance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  <span>UNDERWRITING & VALUATION SCHEDULES</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Institutional Underwriter Dossiers
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Generate cryptographic cert verification logs and comprehensive valuation schedules accepted by fine art and collectibles underwriters (Chubb, AXA, Collectibles Insurance Services).
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Official certificate QR integrity verification records</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>1-click export of structured valuation schedule</span>
                  </div>
                </div>
                <button
                  onClick={onExploreVault}
                  className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-display font-black text-xs hover:bg-emerald-400 transition-colors flex items-center space-x-2 cursor-pointer mt-4"
                >
                  <span>Export Sample Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-300">APPRAISAL SCHEDULE #SV-9942</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">AUDITED</span>
                </div>
                <div className="text-xs font-mono text-zinc-300 space-y-1">
                  <div>Certified Slabs: <strong>6 Assets</strong></div>
                  <div>Total Insurable Value: <strong className="text-emerald-400">$2,437,000</strong></div>
                  <div>Verification Hash: <span className="text-[10px] text-zinc-500">0x9f4a...88b2</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* INTERACTIVE ASSET VAULT GALLERY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="rounded-3xl bg-gradient-to-b from-[#0B0D18] via-[#070912] to-black border border-white/15 p-8 sm:p-12 shadow-[0_0_80px_rgba(255,122,0,0.1)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PINNACLE GRAIL EXHIBIT</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-display text-white">
                Inspect Trophy Assets in 3D
              </h3>
            </div>

            {/* Quick Filter Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={interactiveSearch}
                onChange={(e) => setInteractiveSearch(e.target.value)}
                placeholder="Search grail, year, grade..."
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {filteredGrails.slice(0, 4).map((slab) => (
              <SlabCard
                key={slab.id}
                slab={slab}
                size="md"
                interactive={true}
                onClick={() => onSelectSlab(slab)}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onExploreVault}
              className="px-8 py-3.5 rounded-xl font-display font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black shadow-[0_0_25px_rgba(255,122,0,0.35)] transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore Complete Master Vault</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative z-10">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-950/30 to-[#00F0FF]/15 border border-amber-500/40 shadow-[0_0_70px_rgba(255,122,0,0.25)] relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(255,122,0,0.3)]">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-3xl sm:text-5xl font-black font-display text-white mb-4">
            Curate Your Graded Asset Portfolio
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Join elite collectors and alternative asset traders who manage sports cards and TCG grails with institutional precision.
          </p>
          <button
            onClick={() => {
              vaultAudio.playGemMintChime();
              onStartOnboarding();
            }}
            className="px-10 py-5 rounded-2xl font-display font-black text-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black shadow-[0_0_40px_rgba(255,122,0,0.5)] transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            Launch 3-Step Asset Allocator
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 sm:px-8 border-t border-white/10 text-xs font-mono text-zinc-500 bg-[#030407]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
              SV
            </div>
            <span className="font-bold text-white tracking-widest uppercase">SLABVAULT</span>
            <span>— Luxury Graded Asset Management</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-400">
            <span>PSA • BGS • CGC • SGC • TAG Compatible</span>
            <span>·</span>
            <button onClick={onExploreVault} className="hover:text-amber-400 transition-colors">
              Vault
            </button>
            <span>·</span>
            <button onClick={onStartOnboarding} className="hover:text-amber-400 transition-colors">
              Onboarding
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
