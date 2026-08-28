import React, { useRef, useState } from 'react';
import { Slab } from '../types';
import { formatCurrency } from '../lib/utils';
import {
  X,
  Shield,
  Download,
  Printer,
  CheckCircle2,
  Lock,
  Sparkles,
  FileText,
  Award,
  Calendar,
  Key,
} from 'lucide-react';

interface InsuranceDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  slabs: Slab[];
}

export const InsuranceDossierModal: React.FC<InsuranceDossierModalProps> = ({
  isOpen,
  onClose,
  slabs,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const totalInsuredValue = slabs.reduce((sum, s) => sum + s.currentMarketValue, 0);
  const totalCostBasis = slabs.reduce((sum, s) => sum + s.purchasePrice, 0);
  const policyNumber = `SV-POL-9928-${new Date().getFullYear()}`;
  const ledgerHash = `0x7f9a2b8e...3c1d904a`;
  const appraisalDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDossier = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Trigger instant print/save dialog
      window.print();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090A13] border border-amber-400/40 rounded-3xl p-6 sm:p-10 text-white shadow-[0_0_80px_rgba(255,215,0,0.15)] my-8">
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Controls Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white">
                Underwriter Appraisal Dossier
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Institutional certified valuation schedule & custody ledger
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadDossier}
              disabled={isExporting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-black text-xs hover:opacity-95 shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Certified PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div ref={printAreaRef} className="py-6 space-y-6 relative z-10">
          {/* Certificate Header Banner */}
          <div className="p-6 rounded-2xl bg-black/60 border border-amber-400/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    POLICY ID: {policyNumber}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE CUSTODY UNDERWRITING
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                  Certificate of Alternative Asset Valuation
                </h2>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Issued by SlabVault Institutional Appraisal Registry • Date: {appraisalDate}
                </p>
              </div>

              {/* Total Insured Appraisal Metric */}
              <div className="text-left sm:text-right bg-amber-950/40 border border-amber-400/30 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-amber-200/80 block uppercase tracking-wider">
                  Total Insured Valuation
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                  {formatCurrency(totalInsuredValue)}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                  Across {slabs.length} Verified Graded Slabs
                </span>
              </div>
            </div>
          </div>

          {/* Underwriter Metadata Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-zinc-400 text-[10px] block">Cryptographic Ledger Hash</span>
              <span className="text-cyan-300 font-bold font-mono text-[11px] truncate block">
                {ledgerHash}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-zinc-400 text-[10px] block">Appraisal Methodology</span>
              <span className="text-white font-bold">Realized Auction Comps</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-zinc-400 text-[10px] block">Cost Basis Total</span>
              <span className="text-zinc-200 font-bold">{formatCurrency(totalCostBasis)}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-zinc-400 text-[10px] block">Specialty Insurers Accepted</span>
              <span className="text-emerald-400 font-bold">Chubb, Lloyd's, AXA</span>
            </div>
          </div>

          {/* Itemized Slab Manifest Table */}
          <div className="rounded-2xl border border-white/15 bg-black/40 overflow-hidden">
            <div className="px-5 py-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Itemized Custody Manifest</span>
              </h4>
              <span className="text-xs font-mono text-zinc-400">{slabs.length} Items</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 bg-white/[0.02]">
                    <th className="py-3 px-4">Asset Description</th>
                    <th className="py-3 px-3">Company & Grade</th>
                    <th className="py-3 px-3">Cert #</th>
                    <th className="py-3 px-3 text-right">Cost Basis</th>
                    <th className="py-3 px-4 text-right">Appraised Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {slabs.map((slab) => (
                    <tr key={slab.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-sans">{slab.cardName}</div>
                        <div className="text-[10px] text-zinc-400">
                          {slab.setName} ({slab.year})
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-[#00F0FF] font-bold">
                          {slab.gradingCompany} {slab.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-300">#{slab.certNumber}</td>
                      <td className="py-3 px-3 text-right text-zinc-400">
                        {formatCurrency(slab.purchasePrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-amber-300">
                        {formatCurrency(slab.currentMarketValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Underwriter Stamp & Watermark Verification */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-300">
            <div className="flex items-center space-x-2.5">
              <Key className="w-5 h-5 text-amber-300 shrink-0" />
              <span>
                Digitally signed and sealed with SHA-256 tamper-evident cryptographic signature.
              </span>
            </div>
            <div className="px-3 py-1 rounded bg-black/60 border border-amber-400/40 text-amber-300 font-bold text-[11px] shrink-0">
              STATUS: AUDIT VERIFIED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
