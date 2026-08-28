import React, { useState, useRef, useEffect } from 'react';
import { Slab, DisplayMount } from '../types';
import { VAULT_THEMES, VaultTheme } from '../data/vaultThemes';
import {
  ArrowLeft,
  Info,
  RotateCw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  QrCode,
  Share2,
  Layers,
  Palette,
  Play,
  Pause,
  Shield,
  Crown,
  CheckCircle2,
  Flame,
  Zap,
  Camera,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Box,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../lib/utils';
import { vaultAudio } from '../lib/vaultAudio';
import { GalaxyVaultBackground, GalaxyTheme } from './GalaxyVaultBackground';

export interface MountOptionConfig {
  id: DisplayMount;
  name: string;
  shortName: string;
  icon: string;
  badge: string;
  desc: string;
}

export const MOUNT_OPTIONS: MountOptionConfig[] = [
  {
    id: 'unmounted',
    name: 'Pristine Floating Slab',
    shortName: 'Pure Slab',
    icon: '✨',
    badge: 'CLEAN',
    desc: 'Pure zero-gravity floating graded card slab with no external plastic hardware',
  },
  {
    id: 'triumph-rail',
    name: 'Triumph Monolith Bay',
    shortName: 'Triumph Bay',
    icon: '⚡',
    badge: 'AMBER NEON',
    desc: 'Matte black architectural monolith rail with dual glowing vertical amber neon blades',
  },
  {
    id: 'lit-acrylic',
    name: 'Minimal Crystal LED Stand',
    shortName: 'Crystal Stand',
    icon: '💡',
    badge: 'LED HALO',
    desc: 'Beveled optical crystal display pedestal with subtle ambient underglow',
  },
  {
    id: 'pedestal',
    name: 'Museum Marble Pedestal',
    shortName: 'Marble Pedestal',
    icon: '🏛️',
    badge: 'ARCHIVE',
    desc: 'Tiered beveled black marble block with 24K gold engraved nameplate',
  },
  {
    id: 'floating-wall',
    name: 'Floating Magnetic Rails',
    shortName: 'Magnetic Rails',
    icon: '🧲',
    badge: 'TITANIUM',
    desc: 'Aerospace titanium magnetic locking brackets with flux diodes',
  },
  {
    id: 'armored-tray',
    name: 'Alcantara Safe Tray',
    shortName: 'Alcantara Safe',
    icon: '🧰',
    badge: 'INSURED',
    desc: 'Diamond-quilted velvet & alcantara padded vault safe inset with gold latches',
  },
  {
    id: 'gold-stanchion',
    name: '24K Gilded Stanchion',
    shortName: '24K Stanchion',
    icon: '👑',
    badge: '24K GOLD',
    desc: 'Solid mirror-gold upright dual stanchion columns with velvet ropes',
  },
  {
    id: 'cyber-claw',
    name: 'Cyber Mech-Claw Gripper',
    shortName: 'Mech Claw',
    icon: '🤖',
    badge: 'SERVO LOCK',
    desc: 'Pneumatic articulating robotic arms with laser optical tracking nodes',
  },
  {
    id: 'velvet-easel',
    name: 'Velvet & Mahogany Easel',
    shortName: 'Mahogany Easel',
    icon: '🖼️',
    badge: 'FINE ART',
    desc: 'Hand-rubbed mahogany fine-art easel tripod with deep velvet ledge',
  },
  {
    id: 'carbon-dock',
    name: 'Carbon Monolith Dock',
    shortName: 'Carbon Dock',
    icon: '🏎️',
    badge: '45° ANGLE',
    desc: '45° angled composite carbon cradle with wireless charging status halo',
  },
];

interface Slab3DViewerProps {
  slab: Slab;
  onBack: () => void;
  onOpenAdvisor?: () => void;
  onOpenImageReplace?: (slab: Slab) => void;
  initialThemeId?: string;
  initialMount?: DisplayMount;
  onMountChange?: (mount: DisplayMount) => void;
}

export const Slab3DViewer: React.FC<Slab3DViewerProps> = ({
  slab,
  onBack,
  onOpenAdvisor,
  onOpenImageReplace,
  initialThemeId = 'theme-sapphire',
  initialMount = 'unmounted',
  onMountChange,
}) => {
  // Mount state
  const [currentMount, setCurrentMount] = useState<DisplayMount>(initialMount);
  const [showMountPicker, setShowMountPicker] = useState(false);

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<VaultTheme>(
    VAULT_THEMES.find((t) => t.id === initialThemeId) || VAULT_THEMES[0]
  );
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [artDisplayMode, setArtDisplayMode] = useState<'photo' | 'theme'>(
    slab.imageUrl ? 'photo' : 'theme'
  );
  const [isAudioMuted, setIsAudioMuted] = useState(vaultAudio.getIsMuted());

  // Rotation and Flip State
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: -6, y: 15 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);

  // Touch & Momentum Tracking
  const dragStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const lastDeltaRef = useRef<{ dx: number; dy: number; dt: number }>({ dx: 0, dy: 0, dt: 16 });
  const lastFlipQuadrantRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const autoSpinFrameRef = useRef<number | null>(null);

  // Normalize rotation angle to determine if back is visible
  const normalizedY = ((rotation.y % 360) + 360) % 360;
  const isBackFacing = normalizedY > 90 && normalizedY < 270;

  // Initial Vault Atmospheric Entrance Sound
  useEffect(() => {
    vaultAudio.playVaultAirlock();
    if (slab.grade >= 10 || slab.rarityTier === 'holy_grail') {
      setTimeout(() => {
        vaultAudio.playGemMintChime();
      }, 400);
    }
  }, [slab]);

  // Handle pointer down (mouse or finger touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsAutoSpinning(false);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    lastDeltaRef.current = { dx: 0, dy: 0, dt: 16 };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    vaultAudio.playButtonTick();
  };

  // Handle pointer move (dragging horizontally/vertically)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(8, now - dragStartRef.current.time);
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    lastDeltaRef.current = { dx: deltaX, dy: deltaY, dt };

    setRotation((prev) => {
      const nextY = prev.y + deltaX * 0.45;
      const currentQuadrant = Math.floor((((nextY % 360) + 360) % 360) / 90);
      if (currentQuadrant !== lastFlipQuadrantRef.current) {
        lastFlipQuadrantRef.current = currentQuadrant;
        vaultAudio.playSlabFlip();
      }

      return {
        x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.35)),
        y: nextY,
      };
    });

    dragStartRef.current = { x: e.clientX, y: e.clientY, time: now };
  };

  // Handle pointer up (apply finger inertia/momentum)
  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Calculate release velocity
    const { dx, dt } = lastDeltaRef.current;
    let velocityY = (dx / dt) * 12;

    if (Math.abs(velocityY) > 0.5) {
      const applyInertia = () => {
        if (Math.abs(velocityY) < 0.05) return;
        velocityY *= 0.92; // friction damping
        setRotation((prev) => ({
          ...prev,
          y: prev.y + velocityY,
        }));
        animFrameRef.current = requestAnimationFrame(applyInertia);
      };
      animFrameRef.current = requestAnimationFrame(applyInertia);
    }
  };

  // Quick Flip 180° Action
  const handleQuickFlip = () => {
    setIsAutoSpinning(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    vaultAudio.playSlabFlip();
    
    // Flip to exact back (180°) or front (0°)
    setRotation((prev) => {
      const currentNorm = ((prev.y % 360) + 360) % 360;
      const targetDelta = currentNorm > 90 && currentNorm < 270 ? -180 : 180;
      return {
        x: -5,
        y: prev.y + targetDelta,
      };
    });
  };

  // Reset Angle Action
  const handleResetAngle = () => {
    setIsAutoSpinning(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    vaultAudio.playButtonTick();
    setRotation({ x: -6, y: 15 });
  };

  // Toggle Auto Spin 360°
  const toggleAutoSpin = () => {
    vaultAudio.playButtonTick();
    setIsAutoSpinning((prev) => !prev);
  };

  // Toggle Audio Mute
  const toggleAudio = () => {
    const muted = vaultAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  // Auto-spin animation loop
  useEffect(() => {
    if (isAutoSpinning) {
      const spin = () => {
        setRotation((prev) => ({
          ...prev,
          y: prev.y + 0.85,
        }));
        autoSpinFrameRef.current = requestAnimationFrame(spin);
      };
      autoSpinFrameRef.current = requestAnimationFrame(spin);
    }
    return () => {
      if (autoSpinFrameRef.current) cancelAnimationFrame(autoSpinFrameRef.current);
    };
  }, [isAutoSpinning]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (autoSpinFrameRef.current) cancelAnimationFrame(autoSpinFrameRef.current);
    };
  }, []);

  // Calculate dynamic specular highlight position from rotation angles
  const specX = 50 + ((rotation.y % 360) / 180) * 40;
  const specY = 50 - (rotation.x / 45) * 35;

  // Render 3D Mounting Hardware Apparatus attached to the slab in 3D space
  const render3DMount = () => {
    switch (currentMount) {
      case 'triumph-rail':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Left Vertical Glowing Amber Neon Blade */}
            <div
              style={{ transform: 'translateZ(12px)' }}
              className="absolute -left-5 top-2 -bottom-6 w-2 rounded-full bg-gradient-to-b from-[#FF7A00] via-[#FFA834] to-[#FF5500] shadow-[0_0_20px_#FF7A00,0_0_40px_rgba(255,122,0,0.6)] flex flex-col justify-between items-center py-2"
            >
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            </div>

            {/* Right Vertical Glowing Amber Neon Blade */}
            <div
              style={{ transform: 'translateZ(12px)' }}
              className="absolute -right-5 top-2 -bottom-6 w-2 rounded-full bg-gradient-to-b from-[#FF7A00] via-[#FFA834] to-[#FF5500] shadow-[0_0_20px_#FF7A00,0_0_40px_rgba(255,122,0,0.6)] flex flex-col justify-between items-center py-2"
            >
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            </div>

            {/* Matte Black Monolith Sub-Chassis with laser engraved TRIUMPH badge */}
            <div
              style={{ transform: 'translateZ(14px)' }}
              className="absolute -bottom-10 -inset-x-3 h-9 rounded-b-xl bg-[#090A0D] border-x border-b border-orange-500/50 shadow-[0_15px_35px_rgba(0,0,0,0.95),0_0_20px_rgba(255,122,0,0.25)] flex items-center justify-between px-3"
            >
              <span className="text-[8px] font-mono font-black tracking-widest text-[#FF8800] uppercase flex items-center gap-1">
                <span>⚡</span> TRIUMPH
              </span>
              <span className="text-[7.5px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                MONOLITH
              </span>
            </div>

            {/* Warm Floor Underglow */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#FF7A00]/30 rounded-full blur-xl pointer-events-none" />
          </div>
        );

      case 'lit-acrylic':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-x-4 -bottom-6 pointer-events-none"
          >
            {/* Minimal Beveled Crystal Pedestal */}
            <div
              style={{
                boxShadow: `0 8px 24px ${selectedTheme.primaryHex}40, inset 0 1px 2px rgba(255,255,255,0.6)`,
                borderColor: `${selectedTheme.primaryHex}60`,
              }}
              className="w-full h-6 rounded-b-xl bg-white/15 border backdrop-blur-md flex items-center justify-center px-4"
            >
              <div
                className="w-16 h-0.5 rounded-full opacity-75 shadow-[0_0_8px_#FFF]"
                style={{ backgroundColor: selectedTheme.primaryHex }}
              />
            </div>
          </div>
        );

      case 'pedestal':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-x-0 -bottom-16 pointer-events-none"
          >
            {/* Marble Column Main Pedestal Block */}
            <div className="w-[106%] -left-[3%] relative h-18 rounded-b-2xl bg-gradient-to-b from-[#222733] via-[#12151D] to-[#08090E] border-2 border-zinc-500 shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex flex-col items-center justify-between p-2">
              {/* Top Marble Slot Collar */}
              <div className="w-full h-2 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600 rounded-sm border-t border-white/40 shadow-inner" />
              {/* 24K Gold Plaque at translateZ(20px) */}
              <div
                style={{ transform: 'translateZ(20px)' }}
                className="px-4 py-1 rounded bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 border border-yellow-200 text-black text-center shadow-[0_4px_15px_rgba(245,158,11,0.5)]"
              >
                <p className="text-[7.5px] font-mono font-black tracking-widest uppercase">
                  🏛️ MUSEUM ARCHIVE EXHIBIT
                </p>
                <p className="text-[9px] font-mono font-black tracking-wider">
                  PSA {slab.grade} • CERT #{slab.certNumber}
                </p>
              </div>
              {/* Bottom Plinth Lip */}
              <div className="w-[108%] -left-[4%] h-2 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 rounded-b-lg border-b border-zinc-400" />
            </div>
          </div>
        );

      case 'floating-wall':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Rear Titanium Magnetic Rails at translateZ(-26px) */}
            <div
              style={{ transform: 'translateZ(-26px)' }}
              className="absolute inset-0 flex flex-col justify-around py-12 -mx-6"
            >
              <div className="h-7 rounded-lg bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 border border-zinc-400 shadow-2xl flex items-center justify-between px-3">
                <span className="w-4 h-4 rounded-full bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_10px_#00F0FF] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </span>
                <span className="text-[8px] font-mono text-cyan-300 font-bold tracking-widest">
                  MAG-LOCK UPPER [1500 Gauss]
                </span>
                <span className="w-4 h-4 rounded-full bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_10px_#00F0FF] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </span>
              </div>
              <div className="h-7 rounded-lg bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 border border-zinc-400 shadow-2xl flex items-center justify-between px-3">
                <span className="w-4 h-4 rounded-full bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_10px_#00F0FF] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </span>
                <span className="text-[8px] font-mono text-cyan-300 font-bold tracking-widest">
                  MAG-LOCK LOWER [1500 Gauss]
                </span>
                <span className="w-4 h-4 rounded-full bg-cyan-950 border-2 border-cyan-400 shadow-[0_0_10px_#00F0FF] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </span>
              </div>
            </div>

            {/* 4 Front Knurled Titanium Corner Clamps at translateZ(18px) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="absolute inset-0 pointer-events-none flex flex-col justify-between -m-2.5"
            >
              <div className="flex justify-between">
                <div className="w-5 h-5 rounded-tl-lg bg-zinc-800 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#00F0FF] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </div>
                <div className="w-5 h-5 rounded-tr-lg bg-zinc-800 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#00F0FF] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-5 h-5 rounded-bl-lg bg-zinc-800 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#00F0FF] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </div>
                <div className="w-5 h-5 rounded-br-lg bg-zinc-800 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#00F0FF] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'armored-tray':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-x-0 -bottom-10 pointer-events-none"
          >
            {/* Rear Alcantara Enclosure at translateZ(-22px) */}
            <div
              style={{ transform: 'translateZ(-22px)' }}
              className="w-[106%] -left-[3%] relative h-36 rounded-b-3xl bg-gradient-to-b from-[#2A0E1F] via-[#1A0813] to-[#0A0407] border-2 border-red-800/90 shadow-2xl p-3 flex flex-col justify-end"
            />
            {/* Front Quilted Alcantara Safe Lip at translateZ(18px) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="w-full absolute bottom-0 h-14 rounded-b-2xl bg-gradient-to-r from-[#4A152E] via-[#6D1F44] to-[#4A152E] border-t-2 border-amber-400/90 border-x border-b border-amber-900/80 shadow-2xl flex items-center justify-between px-3"
            >
              <div className="w-3 h-5 rounded-sm bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-200 shadow-md" />
              <div className="text-center">
                <span className="text-[7.5px] font-mono text-amber-200 font-black tracking-widest block">
                  ★ ALCANTARA ARMORED SAFE ★
                </span>
                <span className="text-[8.5px] font-mono text-white font-bold">
                  TAMPER SEAL: VERIFIED
                </span>
              </div>
              <div className="w-3 h-5 rounded-sm bg-gradient-to-b from-amber-300 to-amber-600 border border-amber-200 shadow-md" />
            </div>
          </div>
        );

      case 'gold-stanchion':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Left Gold Stanchion Post at translateZ(8px) */}
            <div
              style={{ transform: 'translateZ(8px)' }}
              className="absolute -left-6 top-8 -bottom-10 w-4 rounded-full bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 border border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex flex-col justify-between items-center py-1"
            >
              <div className="w-6 h-6 -mt-3 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-500 border border-yellow-100 shadow-lg" />
              <div className="w-3 h-3 rounded-full bg-amber-950 border border-yellow-400" />
            </div>

            {/* Right Gold Stanchion Post at translateZ(8px) */}
            <div
              style={{ transform: 'translateZ(8px)' }}
              className="absolute -right-6 top-8 -bottom-10 w-4 rounded-full bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 border border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex flex-col justify-between items-center py-1"
            >
              <div className="w-6 h-6 -mt-3 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-500 border border-yellow-100 shadow-lg" />
              <div className="w-3 h-3 rounded-full bg-amber-950 border border-yellow-400" />
            </div>

            {/* Velvet Rope Swag across Front at translateZ(20px) */}
            <div
              style={{ transform: 'translateZ(20px)' }}
              className="absolute -bottom-2 -inset-x-5 h-6 rounded-b-[100%] border-b-4 border-red-700 shadow-lg flex items-center justify-center pointer-events-none"
            />

            {/* Bottom 24K Plinth Base at translateZ(10px) */}
            <div
              style={{ transform: 'translateZ(10px)' }}
              className="absolute -bottom-12 -inset-x-8 h-9 rounded-xl bg-gradient-to-r from-amber-800 via-yellow-400 to-amber-800 border-2 border-yellow-200 shadow-[0_15px_40px_rgba(245,158,11,0.6)] flex items-center justify-center"
            >
              <span className="text-[8px] font-mono font-black tracking-widest text-amber-950 uppercase">
                👑 24K GILDED ROYAL STANCHION
              </span>
            </div>
          </div>
        );

      case 'cyber-claw':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Left Articulating Robotic Pincer at translateZ(18px) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="absolute -left-6 top-1/2 -bottom-8 w-6 flex flex-col justify-between items-end"
            >
              <div className="w-7 h-5 rounded-r bg-zinc-800 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_12px_#00F0FF] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
              </div>
              <div className="w-3 h-full bg-gradient-to-b from-zinc-700 to-zinc-900 border-l border-cyan-500/40 rounded-sm" />
            </div>

            {/* Right Articulating Robotic Pincer at translateZ(18px) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="absolute -right-6 top-1/2 -bottom-8 w-6 flex flex-col justify-between items-start"
            >
              <div className="w-7 h-5 rounded-l bg-zinc-800 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_12px_#00F0FF] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
              </div>
              <div className="w-3 h-full bg-gradient-to-b from-zinc-700 to-zinc-900 border-r border-cyan-500/40 rounded-sm" />
            </div>

            {/* Bottom Pneumatic Servo Chassis at translateZ(12px) */}
            <div
              style={{ transform: 'translateZ(12px)' }}
              className="absolute -bottom-14 -inset-x-3 h-13 rounded-b-2xl bg-zinc-950 border-2 border-cyan-500/70 shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-between px-4"
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[8px] font-mono text-cyan-300 font-bold tracking-widest">
                  SERVO MECH-CLAW 5.2kN
                </span>
              </div>
              <span className="text-[8px] font-mono text-zinc-400 font-bold">[ARM LOCKED]</span>
            </div>
          </div>
        );

      case 'velvet-easel':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Rear Easel Tripod Leg extending backwards */}
            <div
              style={{
                transformOrigin: 'top center',
                transform: 'translateZ(-20px) rotateX(-25deg)',
              }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 -bottom-20 bg-gradient-to-r from-[#200A0A] via-[#481818] to-[#200A0A] border border-amber-800/80 rounded shadow-2xl"
            />

            {/* Top Brass Hinge at translateZ(-8px) */}
            <div
              style={{ transform: 'translateZ(-8px)' }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 border border-yellow-200 rounded-t shadow-md"
            />

            {/* Front Velvet Padded Shelf at translateZ(18px) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="absolute -bottom-10 -inset-x-3 h-9 rounded-b-lg bg-gradient-to-r from-[#380D1E] via-[#5C1632] to-[#380D1E] border-t-2 border-amber-400 border-x border-b border-amber-900 shadow-xl flex items-center justify-between px-3"
            >
              <span className="text-[8px] font-serif text-amber-200 italic font-bold">
                Atelier d'Art Easel
              </span>
              <span className="text-[8px] font-mono text-amber-300 font-black">
                PSA {slab.grade}
              </span>
            </div>
          </div>
        );

      case 'carbon-dock':
        return (
          <div
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-x-0 -bottom-12 pointer-events-none"
          >
            {/* Carbon Composite Dock Body */}
            <div className="w-[106%] -left-[3%] relative h-15 rounded-b-2xl bg-[#0E1017] border-2 border-white/30 shadow-2xl flex items-center justify-between px-4 [background-image:repeating-linear-gradient(45deg,#1c2130_0px,#1c2130_2px,#0e1017_2px,#0e1017_4px)]">
              <div className="flex items-center space-x-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_#FFF]"
                  style={{ backgroundColor: selectedTheme.primaryHex }}
                />
                <span className="text-[8px] font-mono text-white font-bold tracking-widest uppercase">
                  CARBON DOCK 45°
                </span>
              </div>
              <span className="text-[8px] font-mono text-emerald-400 font-bold">
                WIRELESS COMPS ACTIVE
              </span>
            </div>

            {/* Side Stabilizing Claws at translateZ(18px) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="absolute -top-3 inset-x-2 flex justify-between"
            >
              <div className="w-5 h-4 rounded-t bg-zinc-900 border-t border-x border-white/40 shadow" />
              <div className="w-5 h-4 rounded-t bg-zinc-900 border-t border-x border-white/40 shadow" />
            </div>
          </div>
        );

      case 'unmounted':
      default:
        return null;
    }
  };

  return (
    <div
      id="slab-3d-spotlight-viewer"
      className="fixed inset-0 z-50 bg-[#04060A] text-white flex flex-col justify-between overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 3D Cosmic Galaxy Starfield and Nebula Backdrop */}
      <GalaxyVaultBackground
        initialTheme={
          selectedTheme.id === 'theme-ruby' || selectedTheme.id === 'theme-sunset'
            ? 'supernova_gold'
            : selectedTheme.id === 'theme-emerald' || selectedTheme.id === 'theme-matrix'
            ? 'andromeda_cyan'
            : selectedTheme.id === 'theme-amethyst'
            ? 'deep_violet'
            : 'cosmic_nebula'
        }
        intensity="deep"
        interactive={true}
        showControls={false}
      />

      {/* Studio Spotlight Ambient Glow with Dynamic Vault Theme */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={{
          background: selectedTheme.bgSpotlight,
        }}
      />

      {/* Grid Tech Pedestal Floor Line with High-Gloss Reflection Plane */}
      <div
        className="absolute bottom-0 inset-x-0 h-1/2 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, ${selectedTheme.primaryHex} 1.5px, transparent 1px), linear-gradient(to bottom, ${selectedTheme.primaryHex} 1.5px, transparent 1px)`,
          backgroundSize: '48px 48px',
          transform: 'perspective(500px) rotateX(65deg) translateY(120px)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Atmospheric High-Security Laser Pillars */}
      <div
        className="absolute top-0 bottom-0 left-8 sm:left-24 w-[1px] opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${selectedTheme.primaryHex}, transparent)`,
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-8 sm:right-24 w-[1px] opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${selectedTheme.primaryHex}, transparent)`,
        }}
      />

      {/* Floating Light Flare in Background */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[650px] h-[300px] sm:h-[480px] rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700"
        style={{
          backgroundColor: selectedTheme.primaryHex,
        }}
      />

      {/* TOP HEADER CONTROLS */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 pt-5 sm:pt-7 max-w-6xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => {
            vaultAudio.playButtonTick();
            onBack();
          }}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg active:scale-95 cursor-pointer"
          title="Back to Vault"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Status Chip: Showing Facing Side & Thickness indicator */}
        <div className="hidden sm:flex items-center space-x-3 px-4 py-1.5 rounded-full bg-black/75 border border-white/20 backdrop-blur-md shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-300">
            {isBackFacing ? 'REVERSE SECURITY CASE (360° INSPECTION)' : 'AUTHENTICATED OBVERSE (24MM SOLID ACRYLIC)'}
          </span>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            3D CHAMBER
          </span>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center space-x-2">
          {/* Audio Synthesizer Mute / Unmute Button */}
          <button
            onClick={toggleAudio}
            className={`p-2.5 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
              !isAudioMuted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-zinc-400'
            }`}
            title={isAudioMuted ? 'Unmute Vault Sound FX' : 'Mute Vault Sound FX'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Palette Switcher */}
          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              setShowThemePicker(!showThemePicker);
              setShowMountPicker(false);
            }}
            className={`px-3 py-2 rounded-full border backdrop-blur-md text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              showThemePicker
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-zinc-200'
            }`}
            title="Atmosphere Illumination Themes"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: showThemePicker ? '#000' : selectedTheme.secondaryHex }} />
            <span className="hidden md:inline">{selectedTheme.name}</span>
          </button>

          {/* Mount Hardware Switcher */}
          {(() => {
            const activeMount = MOUNT_OPTIONS.find((m) => m.id === currentMount) || MOUNT_OPTIONS[0];
            return (
              <button
                onClick={() => {
                  vaultAudio.playButtonTick();
                  setShowMountPicker(!showMountPicker);
                  setShowThemePicker(false);
                }}
                className={`px-3 py-2 rounded-full border backdrop-blur-md text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  showMountPicker
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-zinc-200'
                }`}
                title="3D Mounting Hardware Apparatus"
              >
                <span>{activeMount.icon}</span>
                <span className="hidden md:inline">{activeMount.shortName}</span>
              </button>
            );
          })()}

          {/* Photo / Theme Artwork View Toggle */}
          {slab.imageUrl && (
            <button
              onClick={() => {
                vaultAudio.playLaserScan();
                setArtDisplayMode(artDisplayMode === 'photo' ? 'theme' : 'photo');
              }}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-xs font-mono font-bold text-zinc-200 flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Toggle Photo / Cyber Theme"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{artDisplayMode === 'photo' ? 'Emblem' : 'Photo'}</span>
            </button>
          )}

          {/* Replace Image / Upload Scan */}
          {onOpenImageReplace && (
            <button
              onClick={() => {
                vaultAudio.playLaserScan();
                onOpenImageReplace(slab);
              }}
              className="p-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 backdrop-blur-md transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.3)]"
              title="Replace Card Image / Upload Scan"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Quick Flip Button */}
          <button
            onClick={handleQuickFlip}
            className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-xs font-mono font-bold text-zinc-200 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
            title="Touch or Drag to Flip Slab (Heavy Acrylic Clink)"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flip 180°</span>
          </button>

          {/* Auto Spin Button */}
          <button
            onClick={toggleAutoSpin}
            className={`p-2.5 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
              isAutoSpinning
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-zinc-300'
            }`}
            title={isAutoSpinning ? 'Pause Auto-Spin' : 'Auto 360° Spin'}
          >
            {isAutoSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Reset Angle */}
          <button
            onClick={handleResetAngle}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-zinc-300 transition-all cursor-pointer"
            title="Reset Angle"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Ledger & Info Button */}
          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              setShowInfoDrawer(!showInfoDrawer);
            }}
            className={`w-11 h-11 rounded-full border backdrop-blur-md flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer ${
              showInfoDrawer
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
            }`}
            title="Card Ledger & Comps"
          >
            <Info className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* THEME PALETTE DROPDOWN DRAWER */}
      {showThemePicker && (
        <div className="relative z-40 max-w-2xl mx-auto w-full px-4 -mt-2 animate-fadeIn">
          <div className="bg-[#0D111A]/95 border border-white/20 rounded-2xl p-3 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mr-1">
              Atmosphere:
            </span>
            {VAULT_THEMES.map((theme) => {
              const isSelected = selectedTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    vaultAudio.playLaserScan();
                    setSelectedTheme(theme);
                    setShowThemePicker(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/20 text-white border-2 border-white shadow-lg'
                      : 'bg-black/50 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shadow-xs"
                    style={{ backgroundColor: theme.primaryHex }}
                  />
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3D MOUNT HARDWARE PICKER DROPDOWN DRAWER */}
      {showMountPicker && (
        <div className="relative z-40 max-w-4xl mx-auto w-full px-4 -mt-2 animate-fadeIn">
          <div className="bg-[#0D111A]/95 border border-amber-400/40 rounded-2xl p-3.5 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                3D Physical Mounting Apparatus (Live Attached to Slab):
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Selected: <strong className="text-amber-300 uppercase">{MOUNT_OPTIONS.find((m) => m.id === currentMount)?.name}</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
              {MOUNT_OPTIONS.map((mount) => {
                const isSelected = currentMount === mount.id;
                return (
                  <button
                    key={mount.id}
                    onClick={() => {
                      vaultAudio.playVaultAirlock();
                      setCurrentMount(mount.id);
                      if (onMountChange) onMountChange(mount.id);
                      setShowMountPicker(false);
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-400/20 text-white border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        : 'bg-black/60 text-zinc-300 hover:text-white border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{mount.icon}</span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-black tracking-wider ${
                        isSelected ? 'bg-amber-400 text-black' : 'bg-white/10 text-amber-300'
                      }`}>
                        {mount.badge}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-mono font-black text-white leading-tight">
                        {mount.shortName}
                      </p>
                      <p className="text-[9px] font-mono text-zinc-400 leading-tight mt-0.5 line-clamp-1">
                        {mount.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CENTER STAGE: 3D ROTATABLE & FLIPPABLE THICK GRADED SLAB */}
      <div
        className="relative z-20 flex-1 flex flex-col items-center justify-center my-auto px-4 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
      >
        <div
          style={{
            perspective: '1400px',
          }}
          className="relative flex items-center justify-center"
        >
          {/* 3D Container with Solid Extruded Thickness */}
          <div
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="relative w-[285px] sm:w-[335px] md:w-[375px] aspect-[1/1.55]"
          >
            {/* Dynamic Drop Shadow Floating Plane (behind the slab in 3D space) */}
            <div
              style={{
                transform: 'translateZ(-40px)',
                filter: 'blur(35px)',
              }}
              className="absolute inset-0 rounded-[24px] bg-black/90 pointer-events-none"
            />

            {/* ========================================================================= */}
            {/* 3D SOLID EXTRUDED ACRYLIC SIDE WALLS (RAILS, CORNERS & REFRACTIVE EDGES) */}
            {/* ========================================================================= */}
            
            {/* LEFT ACRYLIC RAIL (Extruded Thickness: 24px) */}
            <div
              style={{
                width: '24px',
                height: '100%',
                left: '-12px',
                top: 0,
                transformOrigin: 'center center',
                transform: 'rotateY(-90deg)',
              }}
              className="absolute rounded-l-[4px] bg-gradient-to-r from-white/35 via-white/10 to-white/25 border-y-2 border-l border-white/50 backdrop-blur-md flex flex-col justify-between items-center py-6 shadow-inner pointer-events-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              <span className="text-[7px] font-mono font-bold text-white/50 -rotate-90 tracking-widest whitespace-nowrap">
                PSA® OPTICAL ACRYLIC 6MM
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            </div>

            {/* RIGHT ACRYLIC RAIL (Extruded Thickness: 24px) */}
            <div
              style={{
                width: '24px',
                height: '100%',
                right: '-12px',
                top: 0,
                transformOrigin: 'center center',
                transform: 'rotateY(90deg)',
              }}
              className="absolute rounded-r-[4px] bg-gradient-to-r from-white/25 via-white/10 to-white/35 border-y-2 border-r border-white/50 backdrop-blur-md flex flex-col justify-between items-center py-6 shadow-inner pointer-events-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              <span className="text-[7px] font-mono font-bold text-white/50 rotate-90 tracking-widest whitespace-nowrap">
                ULTRASONIC WELD • TAMPER EVIDENT
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            </div>

            {/* TOP ACRYLIC RIM (Extruded Thickness: 24px) */}
            <div
              style={{
                height: '24px',
                width: '100%',
                top: '-12px',
                left: 0,
                transformOrigin: 'center center',
                transform: 'rotateX(90deg)',
              }}
              className="absolute rounded-t-[4px] bg-gradient-to-b from-white/40 via-white/15 to-white/30 border-x-2 border-t border-white/50 backdrop-blur-md flex items-center justify-between px-6 shadow-inner pointer-events-none"
            >
              <span className="text-[7px] font-mono font-bold text-white/60 tracking-wider">
                LOCK-FIT RECESS
              </span>
              <div className="w-8 h-1 rounded-full bg-white/40 border border-white/60" />
              <span className="text-[7px] font-mono font-bold text-white/60 tracking-wider">
                UV ABSORBING
              </span>
            </div>

            {/* BOTTOM ACRYLIC RIM (Extruded Thickness: 24px) */}
            <div
              style={{
                height: '24px',
                width: '100%',
                bottom: '-12px',
                left: 0,
                transformOrigin: 'center center',
                transform: 'rotateX(-90deg)',
              }}
              className="absolute rounded-b-[4px] bg-gradient-to-b from-white/30 via-white/15 to-white/40 border-x-2 border-b border-white/50 backdrop-blur-md flex items-center justify-between px-6 shadow-inner pointer-events-none"
            >
              <div className="w-2 h-2 rounded-sm bg-white/50" />
              <span className="text-[7.5px] font-mono font-black text-white/70 tracking-widest">
                PSA® STACKABLE BASE
              </span>
              <div className="w-2 h-2 rounded-sm bg-white/50" />
            </div>

            {/* ========================================================================= */}
            {/* INNER SUSPENDED TRADING CARD CORE (translateZ: 0px - Deep in Acrylic)    */}
            {/* ========================================================================= */}
            <div
              style={{
                transform: 'translateZ(0px)',
              }}
              className="absolute inset-3 rounded-[12px] bg-black/60 border border-white/15 pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            />

            {/* ========================================================================= */}
            {/* FRONT OF THE SLAB (Obverse Face at translateZ: 12px)                      */}
            {/* ========================================================================= */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(12px)',
              }}
              className="absolute inset-0 rounded-[20px] p-2 bg-gradient-to-b from-white/30 via-white/10 to-white/25 border-2 border-white/45 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col justify-between overflow-hidden"
            >
              {/* Dynamic Acrylic Specular Reflection Line that tracks rotation */}
              <div
                className="absolute inset-0 rounded-[20px] pointer-events-none opacity-85 z-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${specX}% ${specY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
                }}
              />

              {/* Inner Frosted Acrylic Gasket Border */}
              <div className="absolute inset-1.5 rounded-[16px] border-2 border-white/25 pointer-events-none z-30" />

              {/* AUTHENTIC PSA GRADED HEADER LABEL */}
              <div className="relative z-20 w-full bg-[#FCFDFE] text-black rounded-[6px] border-2 border-[#E11D48] p-2.5 mb-2 relative overflow-hidden shadow-md flex flex-col justify-between shrink-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5 max-w-[72%]">
                    <p className="text-[9.5px] sm:text-[11px] font-mono font-bold leading-tight uppercase text-zinc-900 tracking-tight">
                      {slab.year} {slab.category.toUpperCase()} • #{slab.cardNumber?.replace('#', '') || '001'}
                    </p>
                    <p className="text-[11px] sm:text-[13px] font-mono font-black uppercase text-black leading-tight truncate">
                      {slab.cardName}
                    </p>
                    <p className="text-[8.5px] sm:text-[10px] font-mono font-semibold uppercase text-zinc-700 leading-tight truncate">
                      {slab.setName}
                    </p>
                  </div>

                  {/* PSA Grade Badge */}
                  <div className="text-right">
                    <span className="text-[9px] font-mono font-bold text-zinc-700 block">GEM MT</span>
                    <span className="text-2xl sm:text-3xl font-black font-display text-black leading-none block">
                      {slab.grade}
                    </span>
                  </div>
                </div>

                {/* Bottom Bar with Barcode & Cert */}
                <div className="flex items-end justify-between mt-1.5 pt-1 border-t border-zinc-200">
                  <div className="flex items-center space-x-[2px] h-3.5">
                    {[1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 1, 2, 3, 1, 1, 2].map((w, idx) => (
                      <div key={idx} className="bg-black h-full" style={{ width: `${w * 1.2}px` }} />
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    <div className="bg-[#E11D48] text-white px-1.5 py-0.2 rounded font-black text-[9px] font-display">
                      PSA
                    </div>
                  </div>

                  <span className="text-[9.5px] sm:text-[10.5px] font-mono font-bold text-zinc-800 tracking-wider">
                    {slab.certNumber}
                  </span>
                </div>
              </div>

              {/* CARD WINDOW: EMBEDDED PHYSICAL CARD WITH RECESSED CAVITY */}
              <div
                className={`relative z-20 flex-1 rounded-[12px] overflow-hidden bg-gradient-to-b from-[#090C16] via-[#04060C] to-[#0A0D1A] border-2 ${selectedTheme.accentBorder} p-2.5 flex flex-col justify-between text-white shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]`}
              >
                {artDisplayMode === 'photo' && slab.imageUrl ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black">
                    <img
                      src={slab.imageUrl}
                      alt={slab.cardName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                  </div>
                ) : (
                  <>
                    {/* Tech Diamond/Dot Pattern Overlay */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(${selectedTheme.secondaryHex} 1px, transparent 1px)`,
                        backgroundSize: '10px 10px',
                      }}
                    />

                    {/* Jewel Tone Ambient Radial Glow */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-40"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${selectedTheme.primaryHex} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Metallic Corner Brackets */}
                    <div
                      className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2"
                      style={{ borderColor: selectedTheme.secondaryHex }}
                    />
                    <div
                      className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2"
                      style={{ borderColor: selectedTheme.secondaryHex }}
                    />
                    <div
                      className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2"
                      style={{ borderColor: selectedTheme.secondaryHex }}
                    />
                    <div
                      className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2"
                      style={{ borderColor: selectedTheme.secondaryHex }}
                    />

                    {/* Card Top Banner inside window */}
                    <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <div
                          className="w-5 h-5 rounded p-0.5 flex items-center justify-center shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${selectedTheme.primaryHex}, ${selectedTheme.secondaryHex})`,
                          }}
                        >
                          <Shield className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                        </div>
                        <span className="text-[11px] font-black font-display tracking-wider text-white">
                          SLAB<span style={{ color: selectedTheme.secondaryHex }}>VAULT</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 font-bold border border-white/15">
                          {slab.year}
                        </span>
                        <span
                          className="text-[8px] font-mono px-1.5 py-0.2 rounded font-black border"
                          style={{
                            backgroundColor: `${selectedTheme.primaryHex}25`,
                            color: selectedTheme.secondaryHex,
                            borderColor: `${selectedTheme.secondaryHex}50`,
                          }}
                        >
                          INSTITUTIONAL
                        </span>
                      </div>
                    </div>

                    {/* Center Crest & 3D Logo Artwork */}
                    <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2 text-center">
                      <div className="relative mb-2">
                        <div
                          className="absolute -inset-3 rounded-full blur-lg opacity-60 animate-pulse pointer-events-none"
                          style={{
                            background: `linear-gradient(135deg, ${selectedTheme.primaryHex}, ${selectedTheme.secondaryHex})`,
                          }}
                        />
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/90 border-2 border-white/25 p-3 flex items-center justify-center shadow-2xl backdrop-blur-md">
                          <div
                            className="w-full h-full rounded-xl flex items-center justify-center relative border border-white/20"
                            style={{
                              background: `radial-gradient(circle, ${selectedTheme.primaryHex}35 0%, transparent 80%)`,
                            }}
                          >
                            <Shield
                              className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                              style={{ color: selectedTheme.secondaryHex }}
                            />
                            <Crown className="w-5 h-5 text-amber-300 absolute -top-2 drop-shadow-[0_0_10px_rgba(253,224,71,0.9)] animate-bounce" />
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        SLABVAULT
                      </h3>
                      <p
                        className="text-[8.5px] font-mono tracking-[0.25em] uppercase font-extrabold mt-1"
                        style={{ color: selectedTheme.secondaryHex }}
                      >
                        AUTHENTICATED TROPHY ASSET
                      </p>

                      <div className="mt-2.5 w-full px-1">
                        <div className="bg-black/75 border border-white/15 rounded-lg px-2.5 py-1.5 backdrop-blur-md shadow-lg">
                          <p className="text-[11px] font-bold text-white uppercase truncate">
                            {slab.cardName}
                          </p>
                          <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 mt-0.5">
                            <span className="text-amber-300 font-bold">{slab.category}</span>
                            <span className="text-emerald-400 font-bold">INSURED CUSTODY</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Technical Spec Bar */}
                    <div className="relative z-10 border-t border-white/15 pt-1.5 flex items-center justify-between text-[8.5px] font-mono text-zinc-400">
                      <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-zinc-300 font-semibold">SECURED LEDGER</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span>{slab.rarityTier.toUpperCase()}</span>
                        <span className="text-white/30">•</span>
                        <span className="font-bold" style={{ color: selectedTheme.secondaryHex }}>
                          1-OF-1 VAULTED
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Holographic Sheen Layer with Dynamic Angle Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
              </div>

              {/* Bottom Authentic Slab Edge Lip */}
              <div className="mt-1 flex items-center justify-between text-[8px] font-mono text-white/30 px-2 font-bold tracking-wider">
                <span>{slab.gradingCompany}</span>
                <span className="text-[7px] tracking-widest uppercase text-white/20">CUSTODIAL VAULT</span>
                <span>{slab.gradingCompany}</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* BACK OF THE SLAB (Reverse Face at rotateY(180deg) translateZ(12px))       */}
            {/* ========================================================================= */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(12px)',
              }}
              className="absolute inset-0 rounded-[20px] p-2 bg-gradient-to-b from-white/30 via-white/10 to-white/25 border-2 border-white/45 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col justify-between overflow-hidden"
            >
              {/* Dynamic Acrylic Specular Reflection Line that tracks rotation on Back */}
              <div
                className="absolute inset-0 rounded-[20px] pointer-events-none opacity-85 z-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${100 - specX}% ${specY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
                }}
              />

              {/* Inner Frosted Acrylic Gasket Border */}
              <div className="absolute inset-1.5 rounded-[16px] border-2 border-white/25 pointer-events-none z-30" />

              {/* PSA BACK LABEL (With Hologram, QR code, Barcode) */}
              <div className="relative z-20 w-full bg-[#151821] text-white rounded-[6px] border border-white/25 p-2 mb-2 relative overflow-hidden flex items-center justify-between shadow-inner shrink-0">
                {/* PSA Holographic Emblem */}
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-7 rounded bg-gradient-to-tr from-sky-400 via-amber-300 to-pink-500 p-0.5 flex items-center justify-center shadow-md">
                    <div className="w-full h-full bg-black/70 rounded flex items-center justify-center">
                      <span className="text-[10px] font-black font-display text-white">PSA</span>
                    </div>
                  </div>
                  <div className="text-[7.5px] font-mono text-zinc-400 leading-tight">
                    <span className="text-emerald-400 font-bold block">AUTHENTIC</span>
                    <span>TAMPER-PROOF</span>
                  </div>
                </div>

                {/* QR Code and Cert Number */}
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-white p-0.5 rounded flex items-center justify-center shadow-sm">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div className="text-right">
                    <span className="text-[7.5px] font-mono text-zinc-400 block">SECURITY CERT</span>
                    <span className="text-[10px] font-mono font-black text-cyan-300 block">
                      {slab.certNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* AUTHENTIC LUXURY SLABVAULT VAULTED CARD REVERSE */}
              <div
                className={`relative z-20 flex-1 rounded-[12px] overflow-hidden bg-gradient-to-b from-[#0B0F1C] via-[#060810] to-[#0A0D18] border-2 ${selectedTheme.accentBorder} p-2.5 flex flex-col items-center justify-between shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] text-white`}
              >
                {artDisplayMode === 'photo' && slab.backImageUrl ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black">
                    <img
                      src={slab.backImageUrl}
                      alt={`${slab.cardName} Reverse`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                  </div>
                ) : (
                  <>
                    {/* Header Brand on Back */}
                    <div className="text-center w-full border-b border-white/10 pb-1 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-zinc-400 font-bold">INSURED VAULT SECURED</span>
                      <span
                        className="text-xs sm:text-sm font-black font-display tracking-widest uppercase"
                        style={{ color: selectedTheme.secondaryHex }}
                      >
                        SLABVAULT
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 font-bold">100% CUSTODY</span>
                    </div>

                    {/* Center Cosmic Security Vortex */}
                    <div className="relative my-auto flex flex-col items-center justify-center">
                      {/* Swirling Outer Ring */}
                      <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/20 p-1 flex items-center justify-center shadow-2xl animate-spin-slow"
                        style={{
                          background: `conic-gradient(from 0deg, ${selectedTheme.primaryHex}, ${selectedTheme.secondaryHex}, #FFD700, ${selectedTheme.primaryHex})`,
                        }}
                      >
                        {/* Inner Core */}
                        <div className="w-full h-full rounded-full bg-black/90 border border-white/30 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                          <Shield className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                          <span className="text-[8px] font-mono font-black text-amber-300 tracking-wider mt-0.5">
                            VAULT CERT
                          </span>
                        </div>
                      </div>

                      <p className="text-[9px] font-mono text-zinc-300 mt-2 font-bold tracking-widest">
                        DECENTRALIZED CUSTODIAL PROOF
                      </p>
                    </div>

                    {/* Bottom Card Security Stamp */}
                    <div className="w-full bg-black/60 border border-white/10 rounded-lg p-2 flex items-center justify-between text-[8px] font-mono">
                      <div>
                        <span className="text-zinc-400 block">VAULT LOCATION</span>
                        <span className="text-white font-bold">BRINKS / DELAWARE</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-400 block">SECURITY STATUS</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-2.5 h-2.5 inline" /> VERIFIED
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom PSA Slab Markings */}
              <div className="mt-1.5 flex items-center justify-between text-[8px] font-mono text-zinc-400 px-1 font-bold">
                <span>PSA® CERTIFIED</span>
                <span>TAMPER-EVIDENT 24MM</span>
                <span>PSA®</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3D PHYSICAL MOUNTING HARDWARE APPARATUS (SYNCHRONIZED IN 3D SPACE)       */}
            {/* ========================================================================= */}
            {render3DMount()}
          </div>
        </div>

        {/* Tactile Sound & Gestures Hint Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 bg-black/70 border border-white/20 px-5 py-2.5 rounded-full backdrop-blur-md text-xs font-mono text-zinc-300 shadow-2xl">
          <div className="flex items-center space-x-1.5 text-cyan-300">
            <span>👆</span>
            <span>Drag or swipe in 3D</span>
          </div>
          <span className="text-white/30">•</span>
          <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
            <span>🔊</span>
            <span>Tactile Acrylic Clink Sound Enabled</span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: GLOWING PRICE & CARD TITLE & ACTION BUTTONS */}
      <footer className="relative z-30 pb-7 sm:pb-9 pt-3 text-center max-w-2xl mx-auto w-full px-4">
        {/* Massive Glowing White Price */}
        <h1
          id="spotlight-glowing-price"
          className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-white tracking-tight leading-none transition-all duration-300"
          style={{
            textShadow: `0 0 35px ${selectedTheme.glowRgba}, 0 0 10px rgba(255,255,255,0.8)`,
          }}
        >
          {formatCurrency(slab.currentMarketValue)}
        </h1>

        {/* Card Title Subtitle */}
        <p className="text-base sm:text-lg font-display font-bold text-zinc-200 mt-2 tracking-wide truncate">
          {slab.cardName}
        </p>

        {/* Action Pills */}
        <div className="flex items-center justify-center space-x-3 mt-4">
          <button
            onClick={() => {
              vaultAudio.playButtonTick();
              setShowInfoDrawer(true);
            }}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-all shadow-lg flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auction Comps</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playGemMintChime();
              if (onOpenAdvisor) onOpenAdvisor();
            }}
            className="px-5 py-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-mono font-bold text-[#00F0FF] transition-all shadow-lg flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AI Valuation Report</span>
          </button>
        </div>
      </footer>

      {/* COMPREHENSIVE COMPREHENSIVE CARD INFO DRAWER */}
      {showInfoDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-[#0D101C] border-t sm:border border-white/20 rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest block">
                  CUSTODIAL ASSET SPECIFICATION
                </span>
                <h3 className="text-xl font-black font-display text-white mt-1">
                  {slab.cardName}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {slab.year} • {slab.setName} • #{slab.cardNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  vaultAudio.playButtonTick();
                  setShowInfoDrawer(false);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 block">CURRENT VALUE</span>
                <span className="text-lg font-black font-mono text-white">
                  {formatCurrency(slab.currentMarketValue)}
                </span>
              </div>
              <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 block">PURCHASE BASIS</span>
                <span className="text-lg font-black font-mono text-zinc-300">
                  {formatCurrency(slab.purchasePrice)}
                </span>
              </div>
              <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 block">GRADE & AUTH</span>
                <span className="text-lg font-black font-mono text-amber-300">
                  {slab.gradingCompany} {slab.grade}
                </span>
              </div>
              <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 block">CERT NUMBER</span>
                <span className="text-lg font-black font-mono text-cyan-300">
                  {slab.certNumber}
                </span>
              </div>
            </div>

            {slab.historicalSales && slab.historicalSales.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                  Verified Auction Comps
                </span>
                <div className="space-y-1.5">
                  {slab.historicalSales.map((sale, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs font-mono"
                    >
                      <span className="text-zinc-400">{sale.date}</span>
                      <span className="text-zinc-200">{sale.auctionHouse || 'Goldin / Heritage'}</span>
                      <span className="font-bold text-emerald-400">{formatCurrency(sale.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

