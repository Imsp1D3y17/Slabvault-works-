import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Play, RotateCcw, Sliders, Volume2, Eye } from 'lucide-react';
import { GoldTierBadge } from './GoldTierBadge';

interface OpeningIntroProps {
  onEnter: () => void;
  autoCloseDelay?: number; // in seconds, default 4.5s
}

export const OpeningIntro: React.FC<OpeningIntroProps> = ({
  onEnter,
  autoCloseDelay = 5,
}) => {
  const [progress, setProgress] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [customText, setCustomText] = useState('SLABVAULT');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [fontTheme, setFontTheme] = useState<'white' | 'black' | 'gold'>('white');

  // Auto-progress bar and auto-close timer
  useEffect(() => {
    const startTime = Date.now();
    const duration = autoCloseDelay * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration && !isCustomizing) {
        clearInterval(interval);
        handleTriggerEnter();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoCloseDelay, isCustomizing]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20; // -10 to +10 deg
    const y = (clientY / innerHeight - 0.5) * -20; // -10 to +10 deg
    setMousePos({ x, y });
  };

  const handleTriggerEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 700);
  };

  // Letters of the 3D title for arch effect
  const letters = customText.split('');

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-perforated-mesh text-white transition-opacity duration-700 select-none overflow-hidden ${
        isEntering ? 'opacity-0 pointer-events-none scale-105 transition-all duration-700' : 'opacity-100'
      }`}
    >
      {/* Radial spotlight behind the 3D lettering (matching reference image) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-radial from-slate-400/10 via-cyan-500/5 to-transparent rounded-full blur-[110px] pointer-events-none animate-pulse-glow" />

      {/* Top Bar: Subtle luxury brand header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
          <span className="font-mono text-xs text-zinc-400 tracking-[0.25em] uppercase font-semibold">
            SECURE ASSET VAULT • INSTITUTIONAL EDITION
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* 3D Extrusion Font Style Selector */}
          <div className="flex bg-black/60 border border-white/15 rounded-lg p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setFontTheme('white')}
              className={`px-2.5 py-1 rounded transition-all flex items-center space-x-1 cursor-pointer ${
                fontTheme === 'white'
                  ? 'bg-white text-black font-extrabold shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white border border-zinc-400 inline-block" />
              <span>White</span>
            </button>
            <button
              onClick={() => setFontTheme('gold')}
              className={`px-2.5 py-1 rounded transition-all flex items-center space-x-1 cursor-pointer ${
                fontTheme === 'gold'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black shadow-[0_0_15px_rgba(255,215,0,0.6)]'
                  : 'text-amber-400 hover:text-amber-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 border border-amber-200 inline-block" />
              <span>Gold</span>
            </button>
            <button
              onClick={() => setFontTheme('black')}
              className={`px-2.5 py-1 rounded transition-all flex items-center space-x-1 cursor-pointer ${
                fontTheme === 'black'
                  ? 'bg-zinc-800 text-cyan-300 font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.4)] border border-cyan-400/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-black border border-zinc-600 inline-block" />
              <span>Black</span>
            </button>
          </div>

          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{isCustomizing ? 'Lock Text' : 'Custom Word'}</span>
          </button>

          <button
            onClick={handleTriggerEnter}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white transition-all flex items-center space-x-1.5 cursor-pointer group"
          >
            <span>Skip to Vault</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Editable 3D text input drawer if open */}
      {isCustomizing && (
        <div className="z-30 bg-black/80 border border-[#00F0FF]/40 rounded-2xl p-4 max-w-md w-full mx-4 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
            Custom 3D Extrusion Text
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              maxLength={14}
              onChange={(e) => setCustomText(e.target.value.toUpperCase())}
              className="flex-1 bg-[#121520] border border-white/20 rounded-xl px-3 py-2 text-sm font-bold uppercase tracking-wider text-white focus:border-[#00F0FF] outline-none"
            />
            <button
              onClick={() => setCustomText('SLABVAULT')}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-mono text-zinc-300"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* CENTERPIECE: 3D GLOSSY EXTRUSION TYPOGRAPHY (Rendered in White Font or Black Font) */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-20 px-4 max-w-6xl w-full my-auto">
        
        {/* Subtle cursive luxury eyebrow */}
        <div className="mb-2 text-center">
          <p className="font-cursive text-2xl sm:text-4xl text-zinc-300 tracking-wide select-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
            The Institutional Standard for Graded Assets
          </p>
        </div>

        {/* 3D ARMED GLOSSY LETTERS (Rendered in high-contrast 3D White or Obsidian Black) */}
        <div
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * 0.4}deg) rotateY(${mousePos.x * 0.4}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="relative my-4 sm:my-8 flex justify-center items-center select-none glossy-shine-overlay py-6 px-4 cursor-default"
        >
          {/* Letters container with subtle curve/arch matching reference photo */}
          <div className="flex items-center justify-center tracking-tight sm:tracking-normal">
            {letters.map((char, index) => {
              // Calculate slight vertical arch offset
              const centerIdx = (letters.length - 1) / 2;
              const distFromCenter = Math.abs(index - centerIdx);
              const archY = Math.pow(distFromCenter, 1.6) * 2.2; // slight parabolic arch
              const rotation = (index - centerIdx) * 2.2;

              return (
                <span
                  key={index}
                  style={{
                    transform: `translateY(${archY}px) rotateZ(${rotation}deg)`,
                    display: 'inline-block',
                    transition: 'transform 0.2s ease-out',
                  }}
                  className={`text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display hover:scale-105 transition-transform ${
                    fontTheme === 'white'
                      ? 'text-3d-glossy-white'
                      : fontTheme === 'gold'
                      ? 'text-3d-glossy-gold'
                      : 'text-3d-glossy-black'
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* UNDER-TITLE SPECIFICATION BLOCK (Mirroring reference image's text layout) */}
        <div className="text-center space-y-2 mt-2 sm:mt-4">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-block px-3 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-[0.3em] font-extrabold text-zinc-300 uppercase shadow-inner">
              ASSET PORTFOLIO & LIQUIDITY VAULT
            </div>
            <GoldTierBadge size="sm" />
          </div>
          
          <h2 className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] font-bold text-zinc-400">
            AUTHENTICATED GRADED SLAB ASSET SUITE
          </h2>

          <p className="font-cursive text-xl sm:text-2xl text-amber-200/90 font-light tracking-wide pt-1">
            Engineered for PSA, BGS, CGC & SGC Trophy Assets
          </p>
        </div>

        {/* Big Interactive "ENTER VAULT" CTA */}
        <div className="mt-8 flex flex-col items-center space-y-3">
          <button
            onClick={handleTriggerEnter}
            className="relative group px-10 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-[#FF007F] text-black font-display font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(0,240,255,0.4)] hover:shadow-[0_0_60px_rgba(0,240,255,0.7)] transition-all transform hover:scale-105 cursor-pointer flex items-center space-x-3"
          >
            <span>Enter Asset Vault</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
            Click to unlock showcase or wait for automatic initialization
          </span>
        </div>
      </div>

      {/* Bottom Status & Auto-Progress Bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 relative text-xs font-mono text-zinc-500">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CRYPTO-AUTHENTICATED CERT DATABASE • 256-BIT ENCRYPTION</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-64 flex items-center space-x-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] rounded-full transition-all duration-75"
            />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 w-8 text-right">
            {Math.round(progress)}%
          </span>
        </div>
      </footer>
    </div>
  );
};
