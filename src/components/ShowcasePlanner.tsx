import React, { useState } from 'react';
import { Slab, DisplaySettings, DisplayMount, DisplayTheme, DisplayBackground, DisplayLayout } from '../types';
import { SlabCard } from './SlabCard';
import { formatCurrency } from '../lib/utils';
import { vaultAudio } from '../lib/vaultAudio';
import {
  Maximize2,
  Minimize2,
  Sparkles,
  Sliders,
  Palette,
  Layers,
  LayoutGrid,
  RefreshCw,
  Share2,
  Download,
  Info,
  ShieldCheck,
  Zap,
  Check,
  RotateCcw,
  Volume2,
  Eye,
} from 'lucide-react';

interface ShowcasePlannerProps {
  slabs: Slab[];
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: Partial<DisplaySettings>) => void;
  onSelectSlab: (slab: Slab) => void;
  onOpenShareShowcase?: () => void;
}

export const ShowcasePlanner: React.FC<ShowcasePlannerProps> = ({
  slabs,
  settings,
  onUpdateSettings,
  onSelectSlab,
  onOpenShareShowcase,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSlotSlabs, setActiveSlotSlabs] = useState<Slab[]>(slabs);
  const [selectedHeroId, setSelectedHeroId] = useState<string>(slabs[0]?.id || '');

  // Sound-enabled settings updater
  const handleUpdate = (newSettings: Partial<DisplaySettings>) => {
    vaultAudio.playButtonTick();
    onUpdateSettings(newSettings);
  };

  const themeGlowStyles: Record<
    DisplayTheme,
    { border: string; glow: string; halo: string; text: string; lightBeam: string; hex: string; cardGlow: 'cyan' | 'magenta' | 'gold' | 'stealth' | 'emerald' | 'ultraviolet' }
  > = {
    'triumph-amber': {
      border: 'border-[#FF7A00]/60',
      glow: 'shadow-[0_0_60px_rgba(255,122,0,0.35)]',
      halo: 'bg-[#FF7A00]/25',
      text: 'text-[#FF8800]',
      lightBeam: 'from-[#FF7A00]/35 via-[#FF7A00]/10 to-transparent',
      hex: '#FF7A00',
      cardGlow: 'gold',
    },
    'cyber-cyan': {
      border: 'border-[#00F0FF]/50',
      glow: 'shadow-[0_0_60px_rgba(0,240,255,0.25)]',
      halo: 'bg-[#00F0FF]/25',
      text: 'text-[#00F0FF]',
      lightBeam: 'from-[#00F0FF]/30 via-[#00F0FF]/10 to-transparent',
      hex: '#00F0FF',
      cardGlow: 'cyan',
    },
    'neon-magenta': {
      border: 'border-[#FF007F]/50',
      glow: 'shadow-[0_0_60px_rgba(255,0,127,0.25)]',
      halo: 'bg-[#FF007F]/25',
      text: 'text-[#FF007F]',
      lightBeam: 'from-[#FF007F]/30 via-[#FF007F]/10 to-transparent',
      hex: '#FF007F',
      cardGlow: 'magenta',
    },
    'vault-gold': {
      border: 'border-[#FFD700]/50',
      glow: 'shadow-[0_0_60px_rgba(255,215,0,0.25)]',
      halo: 'bg-[#FFD700]/25',
      text: 'text-[#FFD700]',
      lightBeam: 'from-[#FFD700]/30 via-[#FFD700]/10 to-transparent',
      hex: '#FFD700',
      cardGlow: 'gold',
    },
    'stealth-obsidian': {
      border: 'border-white/30',
      glow: 'shadow-[0_0_50px_rgba(255,255,255,0.15)]',
      halo: 'bg-white/15',
      text: 'text-white',
      lightBeam: 'from-white/20 via-white/5 to-transparent',
      hex: '#FFFFFF',
      cardGlow: 'stealth',
    },
    'emerald-matrix': {
      border: 'border-emerald-400/50',
      glow: 'shadow-[0_0_60px_rgba(16,185,129,0.25)]',
      halo: 'bg-emerald-400/25',
      text: 'text-emerald-400',
      lightBeam: 'from-emerald-400/30 via-emerald-400/10 to-transparent',
      hex: '#10B981',
      cardGlow: 'emerald',
    },
    'ultraviolet': {
      border: 'border-purple-400/50',
      glow: 'shadow-[0_0_60px_rgba(168,85,247,0.25)]',
      halo: 'bg-purple-400/25',
      text: 'text-purple-400',
      lightBeam: 'from-purple-400/30 via-purple-400/10 to-transparent',
      hex: '#A855F7',
      cardGlow: 'ultraviolet',
    },
  };

  const currentThemeInfo = themeGlowStyles[settings.theme] || themeGlowStyles['cyber-cyan'];

  const handleSwapSlot = (fromIdx: number, toIdx: number) => {
    vaultAudio.playButtonTick();
    const updated = [...activeSlotSlabs];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    setActiveSlotSlabs(updated);
  };

  const heroSlab = activeSlotSlabs.find((s) => s.id === selectedHeroId) || activeSlotSlabs[0];
  const satelliteSlabs = activeSlotSlabs.filter((s) => s.id !== (heroSlab?.id || ''));

  const totalExhibitionValue = activeSlotSlabs.reduce((sum, s) => sum + s.currentMarketValue, 0);

  // Background visual rendering details
  const renderBackgroundLayer = () => {
    switch (settings.background) {
      case 'triumph-vault':
        return (
          <>
            {/* Moody Industrial Dark Room */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#14100C] via-[#0A0908] to-[#030303] pointer-events-none" />
            {/* Top Volumetric Downlight Spotlight */}
            <div className="absolute -top-16 inset-x-0 h-64 bg-gradient-to-b from-amber-500/20 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />
            {/* Floor Amber Glow Reflection Pool */}
            <div className="absolute bottom-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_bottom,rgba(255,122,0,0.35)_0%,transparent_75%)] pointer-events-none" />
            {/* Subtle Industrial Grid */}
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,122,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,122,0,0.05)_1px,transparent_1px)] [background-size:60px_60px] opacity-40 pointer-events-none" />
          </>
        );

      case 'dark-velvet':
        return (
          <>
            {/* Rich Deep Red & Wine Velvet Wall Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2A081D] via-[#14030E] to-[#080106] pointer-events-none" />
            
            {/* Left Draped Velvet Curtain with 3D Pleated Folds & Gold Tassel */}
            <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 z-20 pointer-events-none overflow-hidden select-none">
              <div className="w-full h-full bg-gradient-to-r from-[#4A0D23] via-[#7B113A] to-[#2B0614] shadow-[14px_0_35px_rgba(0,0,0,0.85)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.45)_0px,transparent_14px,rgba(255,255,255,0.12)_28px,rgba(0,0,0,0.5)_42px)]" />
              {/* Gold Tassel Tieback */}
              <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center">
                <div className="w-4 h-14 bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 rounded-sm shadow-xl border border-amber-200" />
                <div className="w-2 h-9 bg-amber-400/90 rounded-r blur-xs" />
              </div>
            </div>

            {/* Right Draped Velvet Curtain with 3D Pleated Folds & Gold Tassel */}
            <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 z-20 pointer-events-none overflow-hidden select-none">
              <div className="w-full h-full bg-gradient-to-l from-[#4A0D23] via-[#7B113A] to-[#2B0614] shadow-[-14px_0_35px_rgba(0,0,0,0.85)] [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.5)_0px,rgba(255,255,255,0.12)_14px,transparent_28px,rgba(0,0,0,0.45)_42px)]" />
              {/* Gold Tassel Tieback */}
              <div className="absolute top-1/2 left-2 -translate-y-1/2 flex items-center">
                <div className="w-4 h-14 bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 rounded-sm shadow-xl border border-amber-200" />
                <div className="w-2 h-9 bg-amber-400/90 rounded-l blur-xs" />
              </div>
            </div>

            {/* Top Swag Valance Drapery */}
            <div className="absolute top-0 inset-x-0 h-12 z-25 bg-gradient-to-b from-[#640E30] to-[#2E0716] border-b-2 border-amber-400/70 shadow-2xl [background-image:radial-gradient(ellipse_at_top,rgba(255,255,255,0.25)_0%,transparent_70%)] pointer-events-none flex justify-around">
              <div className="w-full h-full flex justify-between items-center px-8">
                <span className="text-[11px] font-mono text-amber-300 tracking-widest font-black">
                  ROYAL MUSEUM GALLERY
                </span>
                <span className="text-[11px] font-mono text-amber-300 tracking-widest font-black">
                  VELVET DRAPERY CUSTODY
                </span>
              </div>
            </div>
          </>
        );

      case 'cyber-grid':
        return (
          <>
            <div className="absolute inset-0 bg-[#030712] pointer-events-none" />
            {/* Luminous Neon Grid Background */}
            <div
              className="absolute inset-0 opacity-45 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentThemeInfo.hex} 1.5px, transparent 1.5px), linear-gradient(to bottom, ${currentThemeInfo.hex} 1.5px, transparent 1.5px)`,
                backgroundSize: '3rem 3rem',
              }}
            />
            {/* Perspective Floor Grid */}
            <div
              className="absolute bottom-0 inset-x-0 h-64 opacity-60 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentThemeInfo.hex} 2px, transparent 2px), linear-gradient(to bottom, ${currentThemeInfo.hex} 2px, transparent 2px)`,
                backgroundSize: '40px 40px',
                transform: 'perspective(450px) rotateX(65deg)',
                transformOrigin: 'bottom center',
              }}
            />
          </>
        );

      case 'carbon-weave':
        return (
          <>
            <div className="absolute inset-0 bg-[#0A0C13] pointer-events-none" />
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #1d2235 25%, transparent 25%), 
                  linear-gradient(-45deg, #1d2235 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #1d2235 75%), 
                  linear-gradient(-45deg, transparent 75%, #1d2235 75%)
                `,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
              }}
            />
            {/* Carbon Fiber Sheen Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none" />
          </>
        );

      case 'cosmic-galaxy':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F0826] via-[#060314] to-[#020005] pointer-events-none" />
            {/* Nebula Clouds */}
            <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />
            {/* Starlight Field */}
            <div
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px), radial-gradient(rgba(0,240,255,0.9) 2px, transparent 2px)',
                backgroundSize: '40px 40px, 90px 90px',
                backgroundPosition: '0 0, 20px 20px',
              }}
            />
          </>
        );

      case 'obsidian-titanium':
      default:
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#141828] via-[#0C0E18] to-[#040509] pointer-events-none" />
            {/* Industrial Titanium Seams */}
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:120px_120px] opacity-60 pointer-events-none" />
            {/* Heavy Hex Rivets at corners */}
            <div className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-inner border border-zinc-600" />
            <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-inner border border-zinc-600" />
            <div className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-inner border border-zinc-600" />
            <div className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-inner border border-zinc-600" />
          </>
        );
    }
  };

  // Mount Hardware Graphic Rendering
  const renderMountGraphics = (idx: number) => {
    switch (settings.mount) {
      case 'triumph-rail':
        return (
          <div className="flex flex-col items-center mt-2 w-full max-w-[260px]">
            {/* Triumph Monolith Shelf Rail Base */}
            <div className="w-full h-5 rounded-b-lg bg-[#0C0D12] border-x border-b border-orange-500/50 shadow-xl flex items-center justify-between px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]" />
              <span className="text-[8px] font-mono text-zinc-300 font-bold uppercase tracking-wider">
                ⚡ TRIUMPH MONOLITH BAY 0{idx + 1}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]" />
            </div>
            <div className="w-3/4 h-2 rounded-full blur-xs bg-[#FF7A00]/30 -mt-0.5" />
          </div>
        );

      case 'lit-acrylic':
        return (
          <div className="flex flex-col items-center mt-2 w-full max-w-[260px]">
            {/* Lit Acrylic Edge Halo Base Stand */}
            <div
              className="w-full h-4 rounded-b-xl border-t-2 border-b border-x backdrop-blur-md shadow-2xl flex items-center justify-between px-3"
              style={{
                borderColor: currentThemeInfo.hex,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                boxShadow: `0 8px 25px ${currentThemeInfo.hex}40, inset 0 1px 4px ${currentThemeInfo.hex}`,
              }}
            >
              <div className="w-2 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[8px] font-mono font-black uppercase tracking-wider text-white">
                ACRYLIC HALO LED
              </span>
              <div className="w-2 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
            {/* Radiant Downlight Reflection on floor */}
            <div
              className="w-3/4 h-3.5 rounded-full blur-md -mt-1 opacity-80"
              style={{ backgroundColor: currentThemeInfo.hex }}
            />
          </div>
        );

      case 'pedestal':
        return (
          <div className="flex flex-col items-center mt-1 w-full max-w-[270px]">
            {/* Beveled Top Plate */}
            <div className="w-[88%] h-2 bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 rounded-t-sm shadow-md border-t border-white/60" />
            {/* Tiered Marble Column Pedestal */}
            <div className="w-full h-9 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black rounded-b-lg border-x border-b border-white/25 shadow-2xl flex flex-col justify-center items-center px-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:6px_6px]" />
              {/* Brass Inset Plaque */}
              <div className="relative z-10 px-3.5 py-0.5 rounded bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border border-amber-200 text-black text-[9px] font-mono font-black tracking-widest shadow-md">
                PEDESTAL-0{idx + 1}
              </div>
            </div>
            {/* Heavy Cast Shadow */}
            <div className="w-[95%] h-3.5 bg-black/90 rounded-full blur-sm -mt-1" />
          </div>
        );

      case 'floating-wall':
        return (
          <div className="flex flex-col items-center mt-2 w-full max-w-[260px]">
            {/* Top Magnetic Locking Rail */}
            <div className="w-[92%] h-3 bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 rounded-md border-y border-zinc-400 shadow-xl flex items-center justify-around px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
              <span className="text-[8px] font-mono text-zinc-200 font-bold tracking-widest">
                MAG-RAIL LOCK
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
            </div>
          </div>
        );

      case 'armored-tray':
        return (
          <div className="flex flex-col items-center mt-1.5 w-full max-w-[260px]">
            {/* Diamond Quilted Alcantara Safe Inset */}
            <div className="w-full h-6 rounded-b-xl bg-gradient-to-r from-[#1F131B] via-[#321B27] to-[#1F131B] border border-red-800/80 shadow-2xl flex items-center justify-between px-3">
              <span className="w-2 h-2 rounded-sm bg-amber-400 border border-amber-200" />
              <span className="text-[8px] font-mono text-amber-200 font-bold uppercase tracking-wider">
                ALCANTARA SAFE TRAY
              </span>
              <span className="w-2 h-2 rounded-sm bg-amber-400 border border-amber-200" />
            </div>
          </div>
        );

      case 'gold-stanchion':
        return (
          <div className="flex flex-col items-center mt-1.5 w-full max-w-[260px]">
            {/* Dual 24K Gold Stanchion Prongs */}
            <div className="w-full flex items-center justify-between px-6 -mb-1 z-10">
              <div className="w-3 h-4 bg-gradient-to-t from-amber-600 via-yellow-300 to-amber-100 rounded-t-sm shadow-md border-t border-x border-amber-200" />
              <div className="w-3 h-4 bg-gradient-to-t from-amber-600 via-yellow-300 to-amber-100 rounded-t-sm shadow-md border-t border-x border-amber-200" />
            </div>
            {/* Heavy Gold Plinth Base */}
            <div className="w-full h-6 rounded-md bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-700 border border-yellow-200 shadow-[0_6px_20px_rgba(245,158,11,0.35)] flex items-center justify-between px-3">
              <span className="text-[7.5px] font-mono text-black font-black uppercase tracking-widest">
                24K GILDED STAND
              </span>
              <span className="text-[7.5px] font-mono text-amber-950 font-bold">
                MINT ROYAL
              </span>
            </div>
          </div>
        );

      case 'cyber-claw':
        return (
          <div className="flex flex-col items-center mt-1 w-full max-w-[260px]">
            {/* Mech Claw Pincers holding slab */}
            <div className="w-full flex items-center justify-between px-3 -mb-1 z-10">
              <div className="w-4 h-3 bg-zinc-700 rounded-t border-t-2 border-cyan-400 shadow-[0_0_8px_#00F0FF]" />
              <div className="w-4 h-3 bg-zinc-700 rounded-t border-t-2 border-cyan-400 shadow-[0_0_8px_#00F0FF]" />
            </div>
            {/* Robotic Arm Chassis Base */}
            <div className="w-full h-7 rounded-b-xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-cyan-500/50 shadow-2xl flex items-center justify-between px-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[8px] font-mono text-cyan-300 font-bold tracking-wider">
                  MECH-CLAW PNEUMATIC
                </span>
              </div>
              <span className="text-[8px] font-mono text-zinc-400">SERVO: LOCKED</span>
            </div>
          </div>
        );

      case 'velvet-easel':
        return (
          <div className="flex flex-col items-center mt-1 w-full max-w-[260px]">
            {/* Mahogany Easel Shelf with Crimson Inset */}
            <div className="w-full h-6 rounded-b bg-gradient-to-r from-[#2A0815] via-[#4A0D23] to-[#2A0815] border-t-2 border-amber-400/80 border-b border-amber-900/60 shadow-xl flex items-center justify-between px-3">
              <span className="text-[8px] font-serif text-amber-200 font-bold italic tracking-wide">
                Galerie d'Art Easel
              </span>
              <span className="text-[8px] font-mono text-amber-400 font-black">
                N° 0{idx + 1}
              </span>
            </div>
            {/* Tripod Legs Shadow */}
            <div className="w-4/5 h-2 bg-gradient-to-b from-black/80 to-transparent blur-xs" />
          </div>
        );

      case 'carbon-dock':
        return (
          <div className="flex flex-col items-center mt-1.5 w-full max-w-[260px]">
            {/* Carbon Fiber Composite Monolith Base */}
            <div className="w-full h-6 rounded-b-xl bg-[#11131A] border-x border-b border-white/20 shadow-2xl flex items-center justify-between px-3 [background-image:repeating-linear-gradient(45deg,#181c29_0px,#181c29_2px,#11131a_2px,#11131a_4px)]">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                <span className="text-[8px] font-mono text-zinc-200 font-bold uppercase tracking-wider">
                  CARBON DOCK 45°
                </span>
              </div>
              <span className="text-[7.5px] font-mono text-emerald-400">WIRELESS COMPS</span>
            </div>
          </div>
        );

      case 'unmounted':
        return (
          <div className="mt-2 text-center">
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
              • ZERO-GRAVITY FREE FLOAT •
            </span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Controls Ribbon */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#090A14] border border-white/10 rounded-2xl p-5 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <h2 className="text-xl font-extrabold font-display text-white">
              Display Wall & Showcase Planner
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Exhibition Worth: <strong className="text-emerald-400 font-mono">{formatCurrency(totalExhibitionValue)}</strong> • Stage: <span className="text-pink-400 font-mono uppercase font-bold">{settings.background.replace('-', ' ')}</span> / <span className="text-amber-300 font-mono uppercase font-bold">{settings.mount.replace('-', ' ')}</span> / <span className="text-cyan-300 font-mono uppercase font-bold">{settings.theme.replace('-', ' ')}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Selector */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => handleUpdate({ layout: 'triumph-monolith', background: 'triumph-vault', theme: 'triumph-amber', mount: 'triumph-rail' })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                settings.layout === 'triumph-monolith' ? 'bg-[#FF7A00] text-black font-bold shadow-[0_0_15px_rgba(255,122,0,0.5)]' : 'text-orange-400 hover:text-orange-200'
              }`}
            >
              <span>⚡</span>
              <span>Triumph Monolith</span>
            </button>
            <button
              onClick={() => handleUpdate({ layout: 'gallery-grid' })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                settings.layout === 'gallery-grid' ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Gallery Grid</span>
            </button>
            <button
              onClick={() => handleUpdate({ layout: 'spotlight-hero' })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                settings.layout === 'spotlight-hero' ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centerpiece</span>
            </button>
          </div>

          {/* Share Showcase Button */}
          {onOpenShareShowcase && (
            <button
              onClick={() => {
                vaultAudio.playVaultAirlock();
                onOpenShareShowcase();
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/40 text-[#00F0FF] text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share 3D Room</span>
            </button>
          )}

          {/* Fullscreen Kiosk Mode */}
          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              setIsFullscreen(!isFullscreen);
            }}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isFullscreen ? 'Exit Kiosk' : 'Kiosk Mode'}</span>
          </button>
        </div>
      </div>

      {/* Control Palettes Drawer with Live Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Wall Backdrop & Theater Curtains */}
        <div className="bg-[#090A14] border border-white/15 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
              <span>Stage & Curtains</span>
            </label>
            <span className="text-[10px] font-mono text-pink-400 font-semibold">Active</span>
          </div>
          <select
            value={settings.background}
            onChange={(e) => handleUpdate({ background: e.target.value as DisplayBackground })}
            className="w-full bg-black/80 border border-pink-500/40 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-pink-400 outline-none cursor-pointer shadow-sm"
          >
            <option value="triumph-vault">⚡ Triumph Dark Monolith Chamber</option>
            <option value="dark-velvet">🎭 Royal Velvet Theatre Curtains</option>
            <option value="cyber-grid">🌐 Cyber Holographic Grid</option>
            <option value="obsidian-titanium">🛡️ Obsidian Brushed Titanium</option>
            <option value="carbon-weave">🏎️ Carbon Fiber Weave</option>
            <option value="cosmic-galaxy">🌌 Deep Cosmic Galaxy</option>
          </select>
        </div>

        {/* 2. Mounting Structure */}
        <div className="bg-[#090A14] border border-white/15 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Mounting Hardware</span>
            </label>
            <span className="text-[10px] font-mono text-amber-300 font-semibold">Custom</span>
          </div>
          <select
            value={settings.mount}
            onChange={(e) => handleUpdate({ mount: e.target.value as DisplayMount })}
            className="w-full bg-black/80 border border-amber-400/40 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-amber-300 outline-none cursor-pointer shadow-sm"
          >
            <option value="triumph-rail">⚡ Triumph Monolith Bay Rail</option>
            <option value="unmounted">✨ Bare Handheld (Floating)</option>
            <option value="lit-acrylic">💡 Lit Acrylic Edge Halo</option>
            <option value="pedestal">🏛️ Museum Marble Pedestal</option>
            <option value="floating-wall">🧲 Floating Magnetic Rails</option>
            <option value="armored-tray">🧰 Alcantara Armored Safe Tray</option>
            <option value="gold-stanchion">👑 24K Gilded Stanchion Stand</option>
            <option value="cyber-claw">🤖 Cyber Mech-Claw Gripper</option>
            <option value="velvet-easel">🖼️ Velvet & Mahogany Easel</option>
            <option value="carbon-dock">🏎️ Carbon Monolith Dock</option>
          </select>
        </div>

        {/* 3. Neon Lighting Mood */}
        <div className="bg-[#090A14] border border-white/15 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span>Spotlight Lighting</span>
            </label>
            <span className="text-[10px] font-mono text-cyan-300 font-semibold">{currentThemeInfo.hex}</span>
          </div>
          <select
            value={settings.theme}
            onChange={(e) => handleUpdate({ theme: e.target.value as DisplayTheme })}
            className="w-full bg-black/80 border border-cyan-400/40 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-cyan-300 outline-none cursor-pointer shadow-sm"
          >
            <option value="triumph-amber">🟠 Triumph Amber Neon (590nm)</option>
            <option value="cyber-cyan">🔵 Cyber Cyan (450nm)</option>
            <option value="neon-magenta">🟣 Neon Magenta (580nm)</option>
            <option value="vault-gold">🟡 Vault Gold (Warm 3000K)</option>
            <option value="emerald-matrix">🟢 Hyper Emerald Matrix</option>
            <option value="ultraviolet">🔮 Ultra-Violet Blacklight</option>
            <option value="stealth-obsidian">⚪ Stealth Pure White</option>
          </select>
        </div>

        {/* 4. Display Toggles */}
        <div className="bg-[#090A14] border border-white/15 rounded-2xl p-4 shadow-xl flex items-center justify-around">
          <label className="flex items-center space-x-2 cursor-pointer text-xs font-mono text-zinc-200 hover:text-white">
            <input
              type="checkbox"
              checked={settings.showSubgrades}
              onChange={(e) => handleUpdate({ showSubgrades: e.target.checked })}
              className="w-4 h-4 accent-[#00F0FF] rounded cursor-pointer"
            />
            <span className="font-bold">Subgrades</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer text-xs font-mono text-zinc-200 hover:text-white">
            <input
              type="checkbox"
              checked={settings.showLightingHalo}
              onChange={(e) => handleUpdate({ showLightingHalo: e.target.checked })}
              className="w-4 h-4 accent-[#00F0FF] rounded cursor-pointer"
            />
            <span className="font-bold">Spotlight Beam</span>
          </label>
        </div>
      </div>

      {/* ================= THE MAIN VIRTUAL DISPLAY WALL ================= */}
      <div
        className={`relative w-full rounded-3xl border-2 ${currentThemeInfo.border} p-6 sm:p-10 transition-all duration-700 overflow-hidden shadow-2xl ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen overflow-y-auto' : 'min-h-[660px]'
        }`}
      >
        {/* Dynamic Background Texture / Velvet Curtains / Cyber Grid Layer */}
        {renderBackgroundLayer()}

        {/* Ambient Overhead Light Beam Cone */}
        {settings.showLightingHalo && (
          <div
            className={`absolute -top-36 left-1/2 -translate-x-1/2 w-4/5 h-96 bg-gradient-to-b ${currentThemeInfo.lightBeam} rounded-full blur-[120px] pointer-events-none transition-all duration-700`}
          />
        )}

        {/* Wall Mounting Header Plate */}
        <div className="relative z-25 flex justify-between items-center mb-10 border-b border-white/15 pb-4">
          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-1 rounded-md bg-black/80 border border-white/20 text-xs font-mono font-black tracking-widest text-white shadow-md">
              VAULT-EXHIBITION-STAGE
            </div>
            <span className="text-xs font-mono text-zinc-300">
              Mount: <strong className="text-amber-300 uppercase">{settings.mount.replace('-', ' ')}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/70 border border-white/15 text-xs font-mono">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentThemeInfo.hex }} />
              <span className="text-zinc-300">Lighting:</span>
              <span className={`font-bold ${currentThemeInfo.text}`}>{settings.theme.toUpperCase()}</span>
            </div>
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-black/90 text-white hover:bg-white/20 border border-white/25 cursor-pointer shadow-lg"
              >
                <Minimize2 className="w-4 h-4 text-cyan-400" />
              </button>
            )}
          </div>
        </div>

        {/* ================= LAYOUT 0: TRIUMPH VIP MONOLITH CABINET ================= */}
        {settings.layout === 'triumph-monolith' && (
          <div className="relative z-25 flex flex-col items-center w-full py-2 select-none">
            {/* Top Volumetric Downlight Spotlight Beam */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-gradient-to-b from-[#FF7A00]/25 via-[#FF7A00]/5 to-transparent blur-3xl pointer-events-none" />

            {/* The Main Triumph Monolith Enclosure */}
            <div className="relative w-full max-w-5xl rounded-3xl bg-gradient-to-b from-[#181920] via-[#0E1015] to-[#07080B] border-2 border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_60px_rgba(255,122,0,0.2)] overflow-hidden">
              {/* Dual Outer Vertical Neon Amber Light Blades */}
              <div className="absolute top-0 bottom-0 left-0 w-3 sm:w-4 bg-gradient-to-b from-[#FF5500] via-[#FFA834] to-[#FF5500] shadow-[0_0_25px_#FF7A00,0_0_50px_rgba(255,122,0,0.7)] z-30" />
              <div className="absolute top-0 bottom-0 right-0 w-3 sm:w-4 bg-gradient-to-b from-[#FF5500] via-[#FFA834] to-[#FF5500] shadow-[0_0_25px_#FF7A00,0_0_50px_rgba(255,122,0,0.7)] z-30" />

              {/* Upper Cabinet Canopy with Air Vents & Downlight Bar */}
              <div className="relative px-6 sm:px-10 py-5 bg-gradient-to-b from-[#242630] to-[#12141C] border-b border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
                {/* Brand & Kiosk Status */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-300 flex items-center justify-center font-black text-black font-mono shadow-[0_0_15px_#FF7A00]">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black font-mono tracking-widest text-white uppercase flex items-center gap-2">
                      <span>RIPS BY TRIUMPH</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-[#FFA834] border border-orange-500/40">VIP MONOLITH</span>
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400">
                      SECURE VAULT DISPENSER • AUTOMATED CUSTODY CHASSIS
                    </p>
                  </div>
                </div>

                {/* Industrial Louver Air Vents */}
                <div className="hidden sm:flex items-center space-x-1.5 opacity-60">
                  <div className="w-1.5 h-6 rounded-full bg-zinc-700 shadow-inner" />
                  <div className="w-1.5 h-6 rounded-full bg-zinc-700 shadow-inner" />
                  <div className="w-1.5 h-6 rounded-full bg-zinc-700 shadow-inner" />
                  <div className="w-1.5 h-6 rounded-full bg-zinc-700 shadow-inner" />
                  <div className="w-1.5 h-6 rounded-full bg-zinc-700 shadow-inner" />
                </div>

                {/* Overhead LED Spotlight Bar Casting Down */}
                <div className="flex items-center space-x-2 bg-black/60 px-3 py-1.5 rounded-full border border-orange-500/40 text-[11px] font-mono text-orange-300">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping" />
                  <span className="font-bold">ARMORED KIOSK ONLINE</span>
                </div>
              </div>

              {/* Monolith Interior: Showcase Shelving & Right-Side Control Terminal */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 relative">
                {/* Left/Center Columns: Recessed Illuminated Display Bays */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                  {/* Recessed Showcase Window */}
                  <div className="relative rounded-2xl bg-gradient-to-b from-[#08090C] to-[#040507] border border-white/10 p-5 sm:p-6 shadow-inner">
                    {/* Top Shelf Downlight Strip */}
                    <div className="absolute top-0 inset-x-6 h-1 bg-gradient-to-r from-transparent via-[#FFA834]/80 to-transparent shadow-[0_4px_16px_#FF7A00]" />

                    {/* Graded Slabs on Monolith Rails */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                      {activeSlotSlabs.slice(0, 6).map((slab, idx) => (
                        <div key={slab.id} className="flex flex-col items-center group relative cursor-pointer">
                          {/* Bay Number Pill */}
                          <div className="mb-2 px-2.5 py-0.5 rounded bg-black/80 border border-orange-500/30 text-[9px] font-mono text-orange-400 font-bold group-hover:border-orange-400 transition-colors">
                            BAY 0{idx + 1} • PSA {slab.grade}
                          </div>

                          {/* Slab Card */}
                          <div
                            onClick={() => {
                              vaultAudio.playSlabFlip();
                              onSelectSlab(slab);
                            }}
                            className="transition-transform duration-300 group-hover:scale-105"
                          >
                            <SlabCard
                              slab={slab}
                              size="sm"
                              showSubgrades={settings.showSubgrades}
                              glowTheme="gold"
                              onClick={() => {
                                vaultAudio.playSlabFlip();
                                onSelectSlab(slab);
                              }}
                            />
                          </div>

                          {/* Monolith Base Rail */}
                          <div className="mt-2 w-full max-w-[200px] h-4 rounded-b bg-[#12141C] border-x border-b border-orange-500/40 flex items-center justify-between px-2 text-[8px] font-mono text-zinc-400">
                            <span className="text-emerald-400 font-bold">{formatCurrency(slab.currentMarketValue)}</span>
                            <span className="text-zinc-500">READY</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Industrial Control Console & Terminal (From Reference Style) */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-4 rounded-2xl bg-gradient-to-b from-[#141620] to-[#0A0C12] border border-white/15 p-5 shadow-2xl">
                  {/* Triumph Emblem / Keycard Slot */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-md bg-black border border-orange-500/60 flex items-center justify-center font-black text-orange-400 font-mono shadow-[0_0_10px_#FF7A00]">
                        T
                      </div>
                      <span className="text-xs font-mono font-black text-white tracking-wider">
                        TRIUMPH TERMINAL
                      </span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                  </div>

                  {/* OLED Status Screen */}
                  <div className="rounded-xl bg-[#040508] border border-orange-500/40 p-3.5 font-mono text-xs space-y-2 shadow-inner">
                    <div className="flex justify-between text-[10px] text-zinc-400 border-b border-white/10 pb-1.5">
                      <span>KIOSK NODE: #01-VIP</span>
                      <span className="text-orange-400 font-bold">ARMORED</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-zinc-300">
                        <span>Slabs In Vault:</span>
                        <strong className="text-white">{activeSlotSlabs.length} Items</strong>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Total Portfolio:</span>
                        <strong className="text-emerald-400 font-bold">{formatCurrency(totalExhibitionValue)}</strong>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Atmosphere:</span>
                        <span className="text-cyan-400">68°F • 42% RH</span>
                      </div>
                    </div>
                  </div>

                  {/* Keypad & Tactile Pushbuttons */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold block">
                      Tactile Dispenser Controls
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          vaultAudio.playVaultAirlock();
                          if (heroSlab) onSelectSlab(heroSlab);
                        }}
                        className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-black font-mono font-extrabold text-xs flex items-center justify-center space-x-1 shadow-[0_0_15px_rgba(255,122,0,0.4)] hover:brightness-110 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Inspect Grail</span>
                      </button>
                      <button
                        onClick={() => {
                          vaultAudio.playButtonTick();
                          setIsFullscreen(!isFullscreen);
                        }}
                        className="py-2.5 px-3 rounded-lg bg-black/80 hover:bg-white/10 border border-white/20 text-white font-mono text-xs flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
                        <span>Kiosk Mode</span>
                      </button>
                    </div>
                  </div>

                  {/* Keycard / Certificate Laser Scanner Slot */}
                  <div className="rounded-lg bg-black/80 border border-white/10 p-2.5 flex items-center justify-between text-[9px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      CERT SCANNER READY
                    </span>
                    <span className="text-orange-400 font-bold">SLOT 01</span>
                  </div>
                </div>
              </div>

              {/* Lower Monolith Base with Laser-Cut Illuminated "TRIUMPH" Plaque */}
              <div className="relative px-8 py-6 bg-gradient-to-b from-[#10121A] to-[#050608] border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl sm:text-3xl font-black font-display tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 drop-shadow-[0_2px_10px_rgba(255,122,0,0.3)]">
                    TRIUMPH
                  </div>
                  <div className="h-6 w-px bg-white/20" />
                  <span className="text-[10px] font-mono text-orange-300 font-bold tracking-widest uppercase">
                    SOVEREIGN VAULT MONOLITH
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400">
                  <span>HIGH-SECURITY GRADE • ZERO REFLECTION GLASS</span>
                </div>
              </div>
            </div>

            {/* Bottom Floor Amber Reflection Pool */}
            <div className="w-4/5 h-10 bg-[radial-gradient(ellipse_at_top,rgba(255,122,0,0.45)_0%,transparent_70%)] blur-lg -mt-3 pointer-events-none" />
          </div>
        )}

        {/* ================= LAYOUT 1: GALLERY GRID ================= */}
        {settings.layout === 'gallery-grid' && (
          <div className="relative z-25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {activeSlotSlabs.map((slab, idx) => (
              <div key={slab.id} className="flex flex-col items-center group relative">
                {/* Slab Card with Dynamic Edge Theme */}
                <SlabCard
                  slab={slab}
                  size="md"
                  showSubgrades={settings.showSubgrades}
                  glowTheme={currentThemeInfo.cardGlow}
                  onClick={() => {
                    vaultAudio.playSlabFlip();
                    onSelectSlab(slab);
                  }}
                />

                {/* Physical Mounting Base Graphic */}
                {renderMountGraphics(idx)}

                {/* Quick Swap Slot Controls */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2 bg-black/90 px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono text-zinc-300 shadow-xl">
                  <span className="font-bold text-zinc-400">Slot {idx + 1}</span>
                  {idx > 0 && (
                    <button
                      onClick={() => handleSwapSlot(idx, idx - 1)}
                      className="hover:text-[#00F0FF] cursor-pointer font-bold"
                    >
                      ← Left
                    </button>
                  )}
                  {idx < activeSlotSlabs.length - 1 && (
                    <button
                      onClick={() => handleSwapSlot(idx, idx + 1)}
                      className="hover:text-[#00F0FF] cursor-pointer font-bold"
                    >
                      Right →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= LAYOUT 2: SPOTLIGHT CENTERPIECE ================= */}
        {settings.layout === 'spotlight-hero' && (
          <div className="relative z-25 flex flex-col items-center space-y-12">
            {/* Centerpiece Hero Grail */}
            {heroSlab && (
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold uppercase mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>CENTERPIECE CROWN GRAIL</span>
                </div>

                <div className="relative p-3 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border-2 border-amber-400/60 shadow-[0_0_80px_rgba(255,215,0,0.35)] flex flex-col items-center">
                  <SlabCard
                    slab={heroSlab}
                    size="hero"
                    showSubgrades={settings.showSubgrades}
                    glowTheme="gold"
                    onClick={() => {
                      vaultAudio.playSlabFlip();
                      onSelectSlab(heroSlab);
                    }}
                  />
                  {renderMountGraphics(0)}
                </div>
              </div>
            )}

            {/* Satellite Supporting Grails */}
            <div className="w-full">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold text-center mb-6">
                Supporting Exhibition Grails (Click to set as centerpiece)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {satelliteSlabs.map((slab, sIdx) => (
                  <div
                    key={slab.id}
                    onClick={() => {
                      vaultAudio.playSlabFlip();
                      setSelectedHeroId(slab.id);
                    }}
                    className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-105"
                  >
                    <SlabCard
                      slab={slab}
                      size="sm"
                      showSubgrades={false}
                      glowTheme={currentThemeInfo.cardGlow}
                      onClick={() => {
                        vaultAudio.playSlabFlip();
                        setSelectedHeroId(slab.id);
                      }}
                    />
                    {renderMountGraphics(sIdx + 1)}
                    <span className="mt-2 text-[11px] font-mono font-bold text-zinc-400 group-hover:text-[#00F0FF] transition-colors">
                      Make Centerpiece ↑
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
