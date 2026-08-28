import React, { useState, useRef } from 'react';
import { Slab } from '../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Sparkles,
  RefreshCw,
  Eye,
  Link,
  ShieldCheck,
  AlertCircle,
  FileImage,
} from 'lucide-react';

interface ImageReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  slab: Slab;
  onSaveImage: (slabId: string, imageUrl: string, backImageUrl?: string) => void;
}

const PRESET_SCANS = [
  {
    name: '1999 1st Edition Charizard Holo #4',
    category: 'Pokemon',
    url: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
    backUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '2010 World Championship Promo Lugia Holo',
    category: 'Pokemon',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '1986 Fleer Michael Jordan #57 Rookie',
    category: 'Basketball',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '2003 Topps Chrome LeBron James #111 Refractor',
    category: 'Basketball',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '2000 Playoff Contenders Tom Brady Rookie Auto',
    category: 'Football',
    url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '1993 Magic: The Gathering Alpha Black Lotus',
    category: 'Magic: The Gathering',
    url: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '1952 Topps Mickey Mantle #311 Icon',
    category: 'Baseball',
    url: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Marvel 2013 Retro Spider-Man PMG Precious Metal',
    category: 'Marvel',
    url: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageReplaceModal: React.FC<ImageReplaceModalProps> = ({
  isOpen,
  onClose,
  slab,
  onSaveImage,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [frontUrl, setFrontUrl] = useState<string>(slab.imageUrl || '');
  const [backUrl, setBackUrl] = useState<string>(slab.backImageUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file read & conversion to Data URL (works 100% offline & persistence)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isBack = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isBack) {
        setBackUrl(dataUrl);
      } else {
        setFrontUrl(dataUrl);
        setImageError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, isBack = false) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isBack) {
        setBackUrl(dataUrl);
      } else {
        setFrontUrl(dataUrl);
        setImageError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!frontUrl.trim()) return;
    onSaveImage(slab.id, frontUrl.trim(), backUrl.trim() || undefined);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0B0D19] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_80px_rgba(0,240,255,0.15)] my-6 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                Replace Slab Scan / Artwork
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Update the high-resolution obverse (front) & reverse (back) photography for [{slab.gradingCompany} {slab.grade}] {slab.cardName}
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

        {/* Mode Selector Tabs */}
        <div className="flex space-x-2 my-5 relative z-10">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload File (Drag & Drop)</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Direct Web URL</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Curated Presets</span>
          </button>
        </div>

        {/* Tab 1: Local File Upload & Drag-and-Drop */}
        {activeTab === 'upload' && (
          <div className="space-y-4 relative z-10">
            {/* Front Image Uploader */}
            <div>
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 mb-1.5 block">
                Primary Front Image (Required)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                className="hidden"
                onChange={(e) => handleFileChange(e, false)}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => handleDrop(e, false)}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                    : 'border-white/20 bg-black/40 hover:border-cyan-400/60 hover:bg-black/60'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white">Click to browse or drag & drop high-res scan</p>
                <p className="text-[11px] font-mono text-zinc-400 mt-1">
                  Supports PNG, JPG, WebP (Converted and stored securely locally)
                </p>
              </div>
            </div>

            {/* Optional Back Image Uploader */}
            <div>
              <span className="text-xs font-mono font-bold uppercase text-purple-300 mb-1.5 block flex items-center gap-1.5">
                <span>Reverse / Back Image (Optional for 3D Flip Viewer)</span>
              </span>
              <input
                ref={backFileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                className="hidden"
                onChange={(e) => handleFileChange(e, true)}
              />

              <div
                onClick={() => backFileInputRef.current?.click()}
                className="border border-dashed border-white/15 rounded-xl p-3 text-center cursor-pointer hover:border-purple-400/60 hover:bg-black/40 transition-all flex items-center justify-between px-4 bg-black/20"
              >
                <div className="flex items-center space-x-3 text-left">
                  <FileImage className="w-5 h-5 text-purple-400" />
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      {backUrl ? 'Back Image Loaded' : 'Upload Card Back (Optional)'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Renders in 3D tactile inspection mode
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30">
                  {backUrl ? 'Change' : 'Browse'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Image URL */}
        {activeTab === 'url' && (
          <div className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-cyan-400">
                Front Card Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://example.com/cards/my-charizard-psa10.jpg"
                  value={frontUrl}
                  onChange={(e) => {
                    setFrontUrl(e.target.value);
                    setImageError(false);
                  }}
                  className="w-full bg-[#121526] border border-white/20 rounded-xl py-3 px-4 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-purple-300">
                Back Card Image URL (Optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://example.com/cards/my-charizard-back.jpg"
                  value={backUrl}
                  onChange={(e) => setBackUrl(e.target.value)}
                  className="w-full bg-[#121526] border border-white/20 rounded-xl py-3 px-4 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Curated Library Presets */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1 relative z-10">
            {PRESET_SCANS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFrontUrl(preset.url);
                  if (preset.backUrl) setBackUrl(preset.backUrl);
                  setImageError(false);
                }}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col group ${
                  frontUrl === preset.url
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/60'
                }`}
              >
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-1.5 bg-black border border-white/10 relative">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 px-1 py-0.2 bg-black/80 rounded text-[8px] font-mono text-cyan-300">
                    {preset.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white line-clamp-2 leading-tight">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Live Preview Bar */}
        <div className="mt-5 p-3 rounded-2xl bg-black/60 border border-white/10 relative z-10 flex items-center space-x-4">
          <div className="w-14 h-18 rounded-lg overflow-hidden border border-cyan-400/40 bg-zinc-900 shrink-0 relative">
            {frontUrl ? (
              <img
                src={frontUrl}
                alt="Preview"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 text-xs font-mono">
            <span className="text-zinc-400 text-[10px] uppercase tracking-wider block">Live Preview Target</span>
            <div className="font-bold text-white truncate">{slab.cardName}</div>
            <div className="text-zinc-400 text-[10px] truncate mt-0.5">
              {frontUrl ? (imageError ? '⚠️ Image link failed to render' : '✓ Photo ready to attach to slab') : 'No image selected'}
            </div>
          </div>

          {backUrl && (
            <div className="text-right text-[10px] font-mono text-purple-300 shrink-0">
              <span className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/40 font-bold block">
                + Back Scan Attached
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-white/10 relative z-10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-xs font-bold border border-white/10 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!frontUrl.trim()}
            className={`px-6 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              isSuccess
                ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                : frontUrl.trim()
                ? 'bg-gradient-to-r from-cyan-400 to-[#00F0FF] text-black shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02]'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Image Saved to Vault!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save & Replace Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
