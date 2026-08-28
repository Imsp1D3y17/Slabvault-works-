import React, { useState } from 'react';
import { Slab, GradingCompany } from '../types';
import { vaultAudio } from '../lib/vaultAudio';
import { formatCurrency } from '../lib/utils';
import {
  TrendingUp,
  Search,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  X,
  Sparkles,
  DollarSign,
  Activity,
  Calendar,
  AlertCircle,
  Building,
} from 'lucide-react';

interface LiveMarketCompsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlab?: Slab;
  onApplyValuation?: (slabId: string, newValue: number) => void;
}

export const LiveMarketCompsModal: React.FC<LiveMarketCompsModalProps> = ({
  isOpen,
  onClose,
  selectedSlab,
  onApplyValuation,
}) => {
  const [searchTerm, setSearchTerm] = useState(
    selectedSlab ? `${selectedSlab.cardName} ${selectedSlab.year || ''}` : '1999 Pokemon Base Set Charizard #4 1st Edition'
  );
  const [selectedCompany, setSelectedCompany] = useState<GradingCompany>(
    selectedSlab?.gradingCompany || 'PSA'
  );
  const [selectedGrade, setSelectedGrade] = useState<number>(selectedSlab?.grade || 10);
  const [certInput, setCertInput] = useState<string>(selectedSlab?.certNumber || '84920481');
  const [certResult, setCertResult] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [compsData, setCompsData] = useState<any>(null);

  if (!isOpen) return null;

  const handleSearchComps = async () => {
    vaultAudio.playButtonTick();
    setIsLoading(true);
    try {
      const res = await fetch('/api/market-comps/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardName: searchTerm,
          company: selectedCompany,
          grade: selectedGrade,
        }),
      });
      const data = await res.json();
      setCompsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCert = async () => {
    vaultAudio.playVaultAirlock();
    try {
      const res = await fetch('/api/cert/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certNumber: certInput,
          company: selectedCompany,
        }),
      });
      const data = await res.json();
      setCertResult(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#12141C] to-[#08090C] border border-white/15 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white">LIVE MARKET COMPS & PRICING RADAR</h2>
            <p className="text-xs font-mono text-zinc-400">
              Real-time auction records from Goldin, PWCC, Heritage & eBay
            </p>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="space-y-4 font-mono text-xs mb-6">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Card / Grail Query</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. 2000 Tom Brady Championship Ticket /100 PSA 9"
                className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
              />
              <button
                onClick={handleSearchComps}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Search className="w-4 h-4 text-black" />
                <span>{isLoading ? 'Scanning...' : 'Scan Comps'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value as GradingCompany)}
                className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-white text-xs font-mono"
              >
                <option value="PSA">PSA</option>
                <option value="BGS">BGS (Beckett)</option>
                <option value="CGC">CGC</option>
                <option value="SGC">SGC</option>
                <option value="TAG">TAG</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-white text-xs font-mono"
              >
                <option value={10}>10 (Gem Mint / Pristine)</option>
                <option value={9.5}>9.5 (Mint+)</option>
                <option value={9}>9 (Mint)</option>
                <option value={8.5}>8.5 (NM-MT+)</option>
                <option value={8}>8 (NM-MT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Area */}
        {compsData && (
          <div className="space-y-4 font-mono text-xs border-t border-white/10 pt-5">
            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-center">
                <span className="text-[10px] text-zinc-400 block">EST. VALUE</span>
                <span className="text-base font-bold text-emerald-400 font-display">
                  {formatCurrency(compsData.estimatedValue || 0)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
                <span className="text-[10px] text-zinc-400 block">30D AVG COMP</span>
                <span className="text-sm font-bold text-white font-mono">
                  {formatCurrency(compsData.average30DayPrice || 0)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
                <span className="text-[10px] text-zinc-400 block">30D SALES VOL</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  {compsData.totalSalesVolume30d || 8} Verified
                </span>
              </div>
            </div>

            {/* Comps List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                Verified Auction Comps
              </span>
              <div className="space-y-2">
                {compsData.comps?.map((comp: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-zinc-300">
                        {comp.auctionHouse?.[0] || 'A'}
                      </div>
                      <div>
                        <div className="text-white font-bold">{comp.auctionHouse}</div>
                        <div className="text-[10px] text-zinc-400 flex items-center space-x-2">
                          <span>{comp.date}</span>
                          <span>•</span>
                          <span>{comp.notes || 'Verified Sale'}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {formatCurrency(comp.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply to Vault Button */}
            {selectedSlab && onApplyValuation && (
              <button
                onClick={() => {
                  vaultAudio.playGemMintChime();
                  onApplyValuation(selectedSlab.id, compsData.estimatedValue);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <DollarSign className="w-4 h-4 text-black" />
                <span>Apply New Valuation ({formatCurrency(compsData.estimatedValue)}) to Vault</span>
              </button>
            )}
          </div>
        )}

        {/* Cert Authenticity Verification Sub-Tool */}
        <div className="mt-6 pt-5 border-t border-white/10 font-mono text-xs space-y-3">
          <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Slab Certification & Registry Verification</span>
          </span>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="Enter Cert # (e.g. 84920481)"
              className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-white text-xs font-mono"
            />
            <button
              onClick={handleVerifyCert}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold cursor-pointer shrink-0"
            >
              Verify Cert
            </button>
          </div>

          {certResult && (
            <div className="p-3 rounded-xl bg-black/60 border border-orange-500/40 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Cert #{certResult.certNumber}:</span>
                <span className="text-emerald-400 font-bold">{certResult.status}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Tamper-Evident Hash:</span>
                <span className="text-zinc-200">{certResult.verificationHash}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
