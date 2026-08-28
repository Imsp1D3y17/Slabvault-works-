import React, { useState, useRef } from 'react';
import { Slab, GradingCompany, CardCategory } from '../types';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Scan,
  Zap,
  Shield,
  Loader2,
  Image as ImageIcon,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface SlabScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSlabScanned: (slab: Slab) => void;
}

const SAMPLE_SCAN_PRESETS = [
  {
    name: '1999 Pokémon Base Set 1st Ed. Charizard #4 Holo',
    set: '1999 Pokémon Base Set',
    year: 1999,
    company: 'PSA' as GradingCompany,
    grade: 10,
    modifier: 'GEM MT',
    cert: '48190284',
    marketValue: 335000,
    costBasis: 215000,
    category: 'Pokemon' as CardCategory,
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
    pop: 121,
  },
  {
    name: '2003 Topps Chrome LeBron James Rookie #111 Refractor',
    set: '2003 Topps Chrome Basketball',
    year: 2003,
    company: 'BGS' as GradingCompany,
    grade: 9.5,
    modifier: 'GEM MINT',
    cert: '0009481920',
    marketValue: 220000,
    costBasis: 145000,
    category: 'Basketball' as CardCategory,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    pop: 48,
  },
  {
    name: '2000 Playoff Contenders Tom Brady Rookie Auto #144',
    set: '2000 Playoff Contenders',
    year: 2000,
    company: 'PSA' as GradingCompany,
    grade: 9,
    modifier: 'MINT',
    cert: '10928374',
    marketValue: 580000,
    costBasis: 390000,
    category: 'Football' as CardCategory,
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
    pop: 14,
  },
  {
    name: '1986 Fleer Michael Jordan Rookie #57',
    set: '1986 Fleer Basketball',
    year: 1986,
    company: 'PSA' as GradingCompany,
    grade: 10,
    modifier: 'GEM MT',
    cert: '28401924',
    marketValue: 245000,
    costBasis: 180000,
    category: 'Basketball' as CardCategory,
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    pop: 312,
  },
];

export const SlabScannerModal: React.FC<SlabScannerModalProps> = ({
  isOpen,
  onClose,
  onSlabScanned,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<Slab | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<'idle' | 'analyzing' | 'verifying' | 'complete'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processScan = (customImgUrl?: string) => {
    setScanning(true);
    setScanStep('analyzing');

    // Simulate AI Vision recognition pipeline
    setTimeout(() => {
      setScanStep('verifying');
      setTimeout(() => {
        const randomPreset =
          SAMPLE_SCAN_PRESETS[Math.floor(Math.random() * SAMPLE_SCAN_PRESETS.length)];
        const createdSlab: Slab = {
          id: `scanned-${Date.now()}`,
          cardName: randomPreset.name,
          setName: randomPreset.set,
          year: randomPreset.year,
          gradingCompany: randomPreset.company,
          grade: randomPreset.grade,
          gradeModifier: randomPreset.modifier as any,
          certNumber: randomPreset.cert,
          purchasePrice: randomPreset.costBasis,
          purchaseDate: new Date().toISOString().split('T')[0],
          currentMarketValue: randomPreset.marketValue,
          rarityTier: 'Trophy',
          category: randomPreset.category,
          isHolyGrail: true,
          imageUrl: customImgUrl || randomPreset.imageUrl,
          historicalComps: [
            {
              id: `comp-scan-1`,
              date: '2024-06-15',
              price: randomPreset.marketValue,
              auctionHouse: 'Goldin',
              notes: 'Verified live comp match',
            },
            {
              id: `comp-scan-2`,
              date: '2024-03-20',
              price: Math.round(randomPreset.marketValue * 0.94),
              auctionHouse: 'PWCC',
            },
          ],
          popReport: {
            popAtGrade: randomPreset.pop,
            popHigher: randomPreset.grade === 10 ? 0 : 8,
            totalPopulation: randomPreset.pop * 18,
          },
        };

        setScannedResult(createdSlab);
        setScanStep('complete');
        setScanning(false);
      }, 1200);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      processScan(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateCameraSnap = () => {
    const defaultImage =
      SAMPLE_SCAN_PRESETS[Math.floor(Math.random() * SAMPLE_SCAN_PRESETS.length)].imageUrl;
    setPreviewImage(defaultImage);
    processScan(defaultImage);
  };

  const handleConfirmVault = () => {
    if (scannedResult) {
      onSlabScanned(scannedResult);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setScannedResult(null);
    setPreviewImage(null);
    setScanStep('idle');
    setScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#090B14] border border-[#00F0FF]/30 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF007F]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                AI Slab Vision Scanner
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Instant cert verification & automated cataloging
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

        {/* Scanner Body */}
        <div className="py-6 relative z-10">
          {scanStep === 'idle' && (
            <div className="space-y-6">
              {/* Drop / Scan Viewfinder Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative rounded-2xl border-2 border-dashed border-[#00F0FF]/40 hover:border-[#00F0FF] bg-black/40 hover:bg-[#00F0FF]/5 p-8 text-center cursor-pointer transition-all duration-300 group overflow-hidden"
              >
                {/* Viewfinder Target Reticle */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF]" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF]" />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-white group-hover:text-[#00F0FF] transition-colors">
                      Drag & Drop Graded Slab Photo
                    </h4>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      Supports JPG, PNG, WEBP (PSA, BGS, CGC, SGC labels)
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Alternative Quick Scan Action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSimulateCameraSnap}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00F0FF]/20 to-[#FF007F]/20 hover:from-[#00F0FF]/30 hover:to-[#FF007F]/30 border border-[#00F0FF]/40 text-cyan-300 font-display font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
                >
                  <Camera className="w-4 h-4 text-[#00F0FF]" />
                  <span>Simulate Live Camera Snap</span>
                </button>
              </div>

              {/* Supported authenticators badge */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Shield className="w-4 h-4 text-[#00F0FF]" />
                  <span>Direct API Verification</span>
                </span>
                <span className="text-[#00F0FF] font-bold">PSA • BGS • CGC • SGC</span>
              </div>
            </div>
          )}

          {/* Analyzing / Verification In Progress */}
          {(scanStep === 'analyzing' || scanStep === 'verifying') && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-[#00F0FF] border-t-transparent animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center text-[#00F0FF]">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="font-display font-black text-xl text-white">
                  {scanStep === 'analyzing' ? 'Extracting Label OCR & Barcode...' : 'Verifying Registry Database...'}
                </h4>
                <p className="text-xs font-mono text-cyan-400 mt-1">
                  Parsing cert registration, subgrades, and pop report
                </p>
              </div>
            </div>
          )}

          {/* Scan Complete / Preview Result */}
          {scanStep === 'complete' && scannedResult && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      Cert Authenticated & Verified
                    </span>
                    <span className="text-xs text-zinc-300 font-mono">
                      Cert #{scannedResult.certNumber} ({scannedResult.gradingCompany})
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rescan</span>
                </button>
              </div>

              {/* Scanned Slab Card Details Preview */}
              <div className="p-5 rounded-2xl bg-[#0F1220] border border-white/15 flex items-start space-x-4">
                <img
                  src={scannedResult.imageUrl}
                  alt={scannedResult.cardName}
                  className="w-20 h-28 object-cover rounded-lg border border-cyan-400/40 shadow-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#00F0FF] text-black font-mono font-black text-xs">
                      {scannedResult.gradingCompany} {scannedResult.grade}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {scannedResult.gradeModifier}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white truncate">
                    {scannedResult.cardName}
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {scannedResult.setName} ({scannedResult.year})
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-zinc-400 text-[10px] block">Live Comps Value</span>
                      <span className="text-[#00F0FF] font-black text-base">
                        {formatCurrency(scannedResult.currentMarketValue)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-400 text-[10px] block">Population</span>
                      <span className="text-amber-300 font-bold">
                        Pop {scannedResult.popReport?.popAtGrade || 48}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Trigger */}
              <button
                onClick={handleConfirmVault}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-black font-display font-extrabold text-sm hover:opacity-95 shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Deposit & Vault In 3D Spotlight</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
