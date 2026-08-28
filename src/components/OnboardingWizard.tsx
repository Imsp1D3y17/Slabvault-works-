import React, { useState } from 'react';
import { Slab, DisplayMount, DisplayTheme, GradingCompany, CardCategory } from '../types';
import { PRESET_GRAIL_LIBRARY } from '../data/sampleGrails';
import { SlabCard } from './SlabCard';
import { PaywallModal } from './PaywallModal';
import { formatCurrency, formatPercent } from '../lib/utils';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Palette,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Sliders,
  Check,
  Search,
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (userGrails: Slab[], mountPref: DisplayMount, themePref: DisplayTheme) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 State: Top 3 Holy Grails
  const [selectedGrails, setSelectedGrails] = useState<Slab[]>([
    {
      id: 'onboard-1',
      cardName: '1st Edition Shadowless Charizard Holo #4',
      setName: '1999 Pokémon Base Set',
      year: 1999,
      cardNumber: '#4/102',
      gradingCompany: 'PSA',
      grade: 10,
      gradeModifier: 'GEM MT',
      certNumber: '42881903',
      purchasePrice: 215000,
      purchaseDate: '2021-04-12',
      currentMarketValue: 335000,
      rarityTier: 'Grail',
      category: 'Pokemon',
      isHolyGrail: true,
      imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
      historicalComps: [
        { id: 'h1', date: '2024-03-18', price: 335000, auctionHouse: 'PWCC' },
      ],
    },
    {
      id: 'onboard-2',
      cardName: 'LeBron James Topps Chrome Refractor Rookie #111',
      setName: '2003 Topps Chrome Basketball',
      year: 2003,
      cardNumber: '#111',
      gradingCompany: 'BGS',
      grade: 9.5,
      gradeModifier: 'GEM MT',
      certNumber: '0008472911',
      purchasePrice: 140000,
      purchaseDate: '2020-08-19',
      currentMarketValue: 220000,
      rarityTier: 'Grail',
      category: 'Basketball',
      isHolyGrail: true,
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      subgrades: { centering: 9.5, corners: 9.5, edges: 9.5, surface: 10.0 },
      historicalComps: [
        { id: 'h2', date: '2024-06-10', price: 220000, auctionHouse: 'Goldin' },
      ],
    },
    {
      id: 'onboard-3',
      cardName: 'Michael Jordan Fleer Rookie #57',
      setName: '1986 Fleer Basketball',
      year: 1986,
      cardNumber: '#57',
      gradingCompany: 'PSA',
      grade: 10,
      gradeModifier: 'GEM MT',
      certNumber: '28401924',
      purchasePrice: 180000,
      purchaseDate: '2021-12-05',
      currentMarketValue: 245000,
      rarityTier: 'Grail',
      category: 'Basketball',
      isHolyGrail: true,
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      historicalComps: [
        { id: 'h3', date: '2024-07-02', price: 245000, auctionHouse: 'Heritage' },
      ],
    },
  ]);

  // Custom modal for adding custom card
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customCardName, setCustomCardName] = useState('');
  const [customSetName, setCustomSetName] = useState('');
  const [customYear, setCustomYear] = useState<number>(2020);
  const [customCompany, setCustomCompany] = useState<GradingCompany>('PSA');
  const [customGrade, setCustomGrade] = useState<number>(10);
  const [customCert, setCustomCert] = useState('59281044');
  const [customPurchasePrice, setCustomPurchasePrice] = useState<number>(15000);
  const [customCurrentValue, setCustomCurrentValue] = useState<number>(24000);
  const [customCategory, setCustomCategory] = useState<CardCategory>('Pokemon');

  // Step 2 State: Display Mount & Lighting Theme
  const [displayMount, setDisplayMount] = useState<DisplayMount>('lit-acrylic');
  const [displayTheme, setDisplayTheme] = useState<DisplayTheme>('cyber-cyan');

  // Step 3 State: Paywall modal trigger
  const [showPaywall, setShowPaywall] = useState(false);

  // Quick Preset Add
  const addPresetGrail = (preset: (typeof PRESET_GRAIL_LIBRARY)[0]) => {
    if (selectedGrails.length >= 5) return;
    const newSlab: Slab = {
      ...preset,
      id: `custom-grail-${Date.now()}`,
      purchasePrice: Math.round(preset.currentMarketValue * 0.7),
      purchaseDate: '2022-01-15',
    };
    setSelectedGrails([...selectedGrails, newSlab]);
  };

  const removeGrail = (id: string) => {
    if (selectedGrails.length <= 1) return;
    setSelectedGrails(selectedGrails.filter((g) => g.id !== id));
  };

  const handleCreateCustomSlab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCardName.trim()) return;
    const newSlab: Slab = {
      id: `custom-${Date.now()}`,
      cardName: customCardName,
      setName: customSetName || 'Collector Edition',
      year: Number(customYear) || 2020,
      gradingCompany: customCompany,
      grade: Number(customGrade) || 10,
      gradeModifier: Number(customGrade) === 10 ? 'GEM MT' : 'MINT',
      certNumber: customCert || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      purchasePrice: Number(customPurchasePrice) || 1000,
      purchaseDate: '2023-01-01',
      currentMarketValue: Number(customCurrentValue) || 1500,
      rarityTier: 'Grail',
      category: customCategory,
      isHolyGrail: true,
      imageUrl:
        customCategory === 'Pokemon'
          ? 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80'
          : customCategory === 'Basketball'
          ? 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      historicalComps: [
        { id: 'c-init', date: '2024-05-01', price: Number(customCurrentValue) || 1500, auctionHouse: 'PWCC' },
      ],
    };
    setSelectedGrails([...selectedGrails, newSlab]);
    setShowAddCustom(false);
    setCustomCardName('');
  };

  // Calculations for Step 3 Payoff
  const totalValue = selectedGrails.reduce((sum, g) => sum + g.currentMarketValue, 0);
  const totalCostBasis = selectedGrails.reduce((sum, g) => sum + g.purchasePrice, 0);
  const totalProfit = totalValue - totalCostBasis;
  const overallRoi = totalCostBasis > 0 ? (totalProfit / totalCostBasis) * 100 : 0;

  const displayMountOptions: {
    id: DisplayMount;
    title: string;
    description: string;
    icon: string;
    previewBg: string;
  }[] = [
    {
      id: 'lit-acrylic',
      title: 'Lit Acrylic LED Edge Halo',
      description: 'Edge-lit halo glow with frosted acrylic floating bezels and ultra-violet filtration.',
      icon: '💡',
      previewBg: 'from-cyan-950/40 via-blue-950/20 to-black',
    },
    {
      id: 'pedestal',
      title: 'Museum Black Marble Pedestal',
      description: 'Architectural beveled marble podium with 24K gold certified engraving plaque.',
      icon: '🏛️',
      previewBg: 'from-amber-950/30 via-zinc-950 to-black',
    },
    {
      id: 'floating-wall',
      title: 'Floating Titanium Mag-Rails',
      description: 'Aerospace matte obsidian rails with 1500-Gauss magnetic levitation nodes.',
      icon: '🧲',
      previewBg: 'from-zinc-900 via-zinc-950 to-black',
    },
    {
      id: 'armored-tray',
      title: 'Alcantara Armored Safe Tray',
      description: 'Diamond-quilted velvet vault tray inset with solid gold security latches.',
      icon: '🧰',
      previewBg: 'from-zinc-950 via-purple-950/20 to-black',
    },
    {
      id: 'gold-stanchion',
      title: '24K Gilded Royal Stanchion',
      description: 'Solid mirror-gold upright dual stanchion columns with velvet ropes & plinth.',
      icon: '👑',
      previewBg: 'from-amber-950/40 via-yellow-950/20 to-black',
    },
    {
      id: 'cyber-claw',
      title: 'Cyber Mech-Claw Gripper',
      description: 'Pneumatic articulating robotic arms with laser optical tracking nodes.',
      icon: '🤖',
      previewBg: 'from-cyan-950/40 via-zinc-950 to-black',
    },
    {
      id: 'velvet-easel',
      title: 'Velvet & Mahogany Easel',
      description: 'Hand-rubbed mahogany fine-art easel tripod with deep crimson velvet ledge.',
      icon: '🖼️',
      previewBg: 'from-rose-950/40 via-zinc-950 to-black',
    },
    {
      id: 'carbon-dock',
      title: 'Carbon Monolith Dock 45°',
      description: '45° angled composite carbon cradle with wireless charging status halo.',
      icon: '🏎️',
      previewBg: 'from-emerald-950/30 via-zinc-950 to-black',
    },
    {
      id: 'unmounted',
      title: 'Bare Handheld Slab (Zero-G)',
      description: 'Zero-gravity free floating acrylic slab without external hardware.',
      icon: '✨',
      previewBg: 'from-zinc-950 via-zinc-900 to-black',
    },
  ];

  const displayThemeOptions: {
    id: DisplayTheme;
    name: string;
    color: string;
    borderGlow: string;
  }[] = [
    { id: 'cyber-cyan', name: 'Cyber Cyan', color: '#00F0FF', borderGlow: 'border-[#00F0FF] shadow-[0_0_20px_#00F0FF]' },
    { id: 'neon-magenta', name: 'Neon Magenta', color: '#FF007F', borderGlow: 'border-[#FF007F] shadow-[0_0_20px_#FF007F]' },
    { id: 'vault-gold', name: 'Vault Gold', color: '#FFD700', borderGlow: 'border-[#FFD700] shadow-[0_0_20px_#FFD700]' },
    { id: 'stealth-obsidian', name: 'Stealth Obsidian', color: '#8E8E93', borderGlow: 'border-white shadow-[0_0_20px_white]' },
  ];

  return (
    <div className="min-h-screen bg-[#05050A] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[500px] h-[400px] bg-[#FF007F]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Progress Bar & Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onCancel}
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#00F0FF] font-semibold">
                STEP {currentStep} OF 3
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentStep >= stepNum
                    ? 'bg-gradient-to-r from-[#00F0FF] to-[#FF007F] shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= STEP 1: TOP 3 TROPHY ASSETS ================= */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00F0FF] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>PHASE 01: ASSET ALLOCATION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-3">
                Select Your Top Graded Trophy Assets
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Select from benchmark auction assets or configure your personal slabs to initialize your alternative asset portfolio.
              </p>
            </div>

            {/* Current Selected Grails */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#00F0FF]" />
                  <span>Your Active Trophy Assets ({selectedGrails.length})</span>
                </h3>
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Add Custom Asset</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {selectedGrails.map((slab) => (
                  <div key={slab.id} className="relative group w-full flex justify-center">
                    <SlabCard slab={slab} size="md" interactive={true} />
                    {selectedGrails.length > 1 && (
                      <button
                        onClick={() => removeGrail(slab.id)}
                        className="absolute top-2 right-4 z-40 bg-rose-950/80 hover:bg-rose-600 text-white p-1.5 rounded-full border border-rose-500/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                        title="Remove Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Library Presets */}
            <div className="bg-[#0B0D16] border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-4">
                Or Quick-Add from Blue-Chip Asset Catalog:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_GRAIL_LIBRARY.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => addPresetGrail(preset)}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#00F0FF]/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-md bg-black border border-cyan-400/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                        <Shield className="w-5 h-5 text-[#00F0FF]" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate group-hover:text-[#00F0FF] transition-colors">
                          {preset.cardName}
                        </p>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {preset.gradingCompany} {preset.grade} • {formatCurrency(preset.currentMarketValue, true)}
                        </span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-zinc-400 group-hover:text-[#00F0FF] shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black hover:opacity-90 shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Continue to Display Config</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PHYSICAL & DIGITAL DISPLAY PREFERENCES ================= */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00F0FF] mb-3">
                <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>PHASE 02: ARCHITECTURE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-3">
                Choose Your Museum Exhibition Style
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Configure how your slabs are framed, illuminated, and presented in both the digital showcase and physical wall planner.
              </p>
            </div>

            {/* Display Mount Selection */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold mb-4">
                1. Select Physical Casing & Mounting System
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayMountOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setDisplayMount(opt.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      displayMount === opt.id
                        ? 'bg-gradient-to-br from-[#00F0FF]/15 via-white/[0.05] to-black border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                        : 'bg-[#0B0D18]/80 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{opt.icon}</span>
                          <span className="font-bold text-base text-white">{opt.title}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            displayMount === opt.id ? 'border-[#00F0FF] bg-[#00F0FF]' : 'border-zinc-600'
                          }`}
                        >
                          {displayMount === opt.id && <Check className="w-3 h-3 text-black" />}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{opt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambient Lighting Theme */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold mb-4">
                2. Select Ambient Neon Mood & Illumination
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {displayThemeOptions.map((th) => (
                  <div
                    key={th.id}
                    onClick={() => setDisplayTheme(th.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center ${
                      displayTheme === th.id
                        ? `${th.borderGlow} bg-white/[0.08]`
                        : 'bg-[#0B0D18] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full mb-2 shadow-lg"
                      style={{ backgroundColor: th.color, boxShadow: `0 0 15px ${th.color}` }}
                    />
                    <span className="text-xs font-bold text-white">{th.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black hover:opacity-90 shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Generate Vault Payoff</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: INSTANT PAYOFF & PORTFOLIO VALUATION ================= */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-[#00F0FF]/20 border border-emerald-400/40 text-xs font-mono text-emerald-400 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PORTFOLIO VALUATION SYNCHRONIZED</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
                Your Digital Vault Is Ready
              </h2>
              <p className="text-sm text-zinc-400">
                Live auction comps computed across PWCC, Goldin, and Heritage for your {selectedGrails.length} Trophy Assets.
              </p>
            </div>

            {/* Portfolio Equity Payoff Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0B0E1B] border border-[#00F0FF]/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F0FF]/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Total Vault Valuation
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {formatCurrency(totalValue)}
                </div>
                <span className="text-[11px] font-mono text-[#00F0FF] flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 mr-1 inline" /> Real-time market comps active
                </span>
              </div>

              <div className="bg-[#0B0E1B] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Cost Basis Invested
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-zinc-200 tracking-tight">
                  {formatCurrency(totalCostBasis)}
                </div>
                <span className="text-[11px] font-mono text-zinc-400 mt-2 block">
                  Original acquisition capital
                </span>
              </div>

              <div className="bg-[#0B0E1B] border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Unrealized Gain / Net Profit
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                  +{formatCurrency(totalProfit)}
                </div>
                <span className="text-[11px] font-mono text-emerald-300 font-bold mt-2 block">
                  {formatPercent(overallRoi)} All-Time Return
                </span>
              </div>
            </div>

            {/* Showcase Visual Display Preview */}
            <div className="bg-[#07080F] border border-white/15 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white">
                    Museum Showcase Grid Preview
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Cased in {displayMount.replace('-', ' ')} with {displayTheme.replace('-', ' ')} glow.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Insured Vault Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {selectedGrails.map((slab) => (
                  <SlabCard
                    key={slab.id}
                    slab={slab}
                    size="md"
                    interactive={true}
                    glowTheme={displayTheme === 'cyber-cyan' ? 'cyan' : displayTheme === 'neon-magenta' ? 'magenta' : 'gold'}
                  />
                ))}
              </div>
            </div>

            {/* Payoff Conversion Callout */}
            <div className="bg-gradient-to-r from-[#00F0FF]/15 via-purple-950/30 to-[#FF007F]/15 border border-[#00F0FF]/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
              <div>
                <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-[#00F0FF] uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Instant Membership Unlock</span>
                </span>
                <h4 className="text-2xl font-extrabold font-display text-white">
                  Unlock Complete Vault, Live Comps & Wall Planner
                </h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-xl">
                  Export verified insurance dossiers, customize 3D multi-slab museum layouts, and monitor auction prices 24/7.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setShowPaywall(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-extrabold text-base bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-[#FF007F] text-black hover:opacity-95 shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Claim VIP Pass ($8.99/wk or $89/yr)</span>
                  <Zap className="w-4 h-4 fill-black" />
                </button>
                <button
                  onClick={() => onComplete(selectedGrails, displayMount, displayTheme)}
                  className="w-full sm:w-auto px-5 py-4 rounded-xl font-display font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Enter Vault in Preview Mode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Slab Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0B0D18] border border-white/20 rounded-2xl p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold font-display mb-4 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#00F0FF]" />
              <span>Add Custom Graded Slab</span>
            </h3>

            <form onSubmit={handleCreateCustomSlab} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Card Name & Variation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kobe Bryant Topps Chrome Rookie"
                  value={customCardName}
                  onChange={(e) => setCustomCardName(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Set Name</label>
                  <input
                    type="text"
                    placeholder="e.g. 1996 Topps Chrome"
                    value={customSetName}
                    onChange={(e) => setCustomSetName(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={customYear}
                    onChange={(e) => setCustomYear(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Grading Company</label>
                  <select
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value as GradingCompany)}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                  >
                    <option value="PSA">PSA</option>
                    <option value="BGS">BGS (Beckett)</option>
                    <option value="CGC">CGC</option>
                    <option value="SGC">SGC</option>
                    <option value="TAG">TAG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Grade</label>
                  <input
                    type="number"
                    step="0.5"
                    max="10"
                    min="1"
                    value={customGrade}
                    onChange={(e) => setCustomGrade(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Purchase Price ($)</label>
                  <input
                    type="number"
                    value={customPurchasePrice}
                    onChange={(e) => setCustomPurchasePrice(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Est. Current Value ($)</label>
                  <input
                    type="number"
                    value={customCurrentValue}
                    onChange={(e) => setCustomCurrentValue(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-white focus:border-[#00F0FF] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00F0FF] text-black font-bold hover:opacity-90"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={(tier) => {
          setShowPaywall(false);
          onComplete(selectedGrails, displayMount, displayTheme);
        }}
        portfolioValue={totalValue}
      />
    </div>
  );
};
