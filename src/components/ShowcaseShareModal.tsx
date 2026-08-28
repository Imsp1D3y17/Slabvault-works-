import React, { useState } from 'react';
import { Slab, DisplaySettings } from '../types';
import { formatCurrency } from '../lib/utils';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  QrCode,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

interface ShowcaseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  slabs: Slab[];
  settings: DisplaySettings;
}

export const ShowcaseShareModal: React.FC<ShowcaseShareModalProps> = ({
  isOpen,
  onClose,
  slabs,
  settings,
}) => {
  const [copied, setCopied] = useState(false);
  const [handle, setHandle] = useState('grail_collector_88');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const totalVaultValue = slabs.reduce((sum, s) => sum + s.currentMarketValue, 0);
  const shareUrl = `https://slabvault.app/@${handle}/exhibition`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0A0C16] border border-[#00F0FF]/30 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_70px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF007F]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Share 3D Museum Showcase
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Generate public 3D exhibition links for collectors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Body */}
        <div className="py-6 space-y-5 relative z-10">
          {/* Custom Vanity Handle */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Custom Collector Vanity Handle
            </label>
            <div className="flex items-center bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono">
              <span className="text-zinc-500 mr-1">slabvault.app/@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                className="bg-transparent text-cyan-300 font-bold focus:outline-none flex-1"
                placeholder="your_handle"
              />
            </div>
          </div>

          {/* Social Card Live Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0E1222] to-black border border-white/15 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  SLABVAULT EXHIBITION
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-[10px] font-mono text-[#00F0FF]">
                {slabs.length} Assets • {formatCurrency(totalVaultValue)}
              </span>
            </div>

            {/* Mini thumbnails preview */}
            <div className="grid grid-cols-4 gap-2 my-3">
              {slabs.slice(0, 4).map((slab) => (
                <div key={slab.id} className="relative rounded-lg overflow-hidden border border-cyan-400/30">
                  <img
                    src={slab.imageUrl}
                    alt={slab.cardName}
                    className="w-full h-16 object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 px-1 py-0.5 text-[8px] font-mono text-center text-cyan-300">
                    {slab.gradingCompany} {slab.grade}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between pt-2 border-t border-white/10">
              <span>Theme: {settings.theme}</span>
              <span className="text-emerald-400 font-bold">360° Touch Interactive</span>
            </div>
          </div>

          {/* Copy Link Trigger Box */}
          <div className="flex items-center space-x-2 bg-black/60 border border-cyan-400/40 p-2 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs font-mono text-zinc-200 px-2 flex-1 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-display font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-[#00F0FF] text-black hover:opacity-90 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Social Buttons */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=Check%20out%20my%203D%20graded%20slab%20gallery%20on%20SlabVault!&url=${encodeURIComponent(
                    shareUrl
                  )}`,
                  '_blank'
                )
              }
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Share on 𝕏</span>
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://reddit.com/submit?url=${encodeURIComponent(
                    shareUrl
                  )}&title=My%20SlabVault%203D%20Graded%20Card%20Showcase`,
                  '_blank'
                )
              }
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Reddit</span>
            </button>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center justify-center space-x-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Discord</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
