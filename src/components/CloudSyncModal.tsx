import React, { useState, useRef } from 'react';
import { Slab, DisplaySettings } from '../types';
import { vaultAudio } from '../lib/vaultAudio';
import { formatCurrency } from '../lib/utils';
import {
  Cloud,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Smartphone,
  Laptop,
  Shield,
  FileJson,
  RotateCcw,
} from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  slabs: Slab[];
  displaySettings: DisplaySettings;
  onRestoreVault: (slabs: Slab[], settings?: DisplaySettings) => void;
  onResetToSampleData: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  slabs,
  displaySettings,
  onRestoreVault,
  onResetToSampleData,
}) => {
  const [activeTab, setActiveTab] = useState<'backup' | 'restore' | 'sync'>('backup');
  const [copiedLink, setCopiedLink] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const totalVaultValue = slabs.reduce((sum, s) => sum + s.currentMarketValue, 0);

  // 1. Export JSON Backup
  const handleExportBackup = () => {
    vaultAudio.playVaultAirlock();
    const exportData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      vaultName: 'SlabVault Master Collection',
      totalCards: slabs.length,
      totalValue: totalVaultValue,
      settings: displaySettings,
      slabs: slabs,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SlabVault-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 2. Import JSON Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed.slabs) && parsed.slabs.length > 0) {
          onRestoreVault(parsed.slabs, parsed.settings);
          vaultAudio.playGemMintChime();
          setImportStatus(`Successfully restored ${parsed.slabs.length} slabs into your vault!`);
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          onRestoreVault(parsed);
          vaultAudio.playGemMintChime();
          setImportStatus(`Successfully restored ${parsed.length} slabs!`);
        } else {
          setImportStatus('Error: Invalid backup file format.');
        }
      } catch (err) {
        setImportStatus('Error reading file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  // 3. Cloud Link Generation
  const handleCopyShareLink = () => {
    vaultAudio.playButtonTick();
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#141620] to-[#0A0C12] border border-white/15 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-blue-600 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Cloud className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white">CLOUD SYNC & BACKUP ENGINE</h2>
            <p className="text-xs font-mono text-zinc-400">
              Synchronize collections across phones, laptops & secure JSON storage
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 gap-2 bg-black/60 p-1 rounded-xl border border-white/10 mb-6 font-mono text-xs">
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-[#FF7A00] text-black font-bold shadow-[0_0_10px_rgba(255,122,0,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Export Backup
          </button>
          <button
            onClick={() => setActiveTab('restore')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'restore'
                ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Restore Vault
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'sync'
                ? 'bg-emerald-400 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cross-Device
          </button>
        </div>

        {/* TAB 1: BACKUP */}
        {activeTab === 'backup' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span>Active Vault Slabs:</span>
                <strong className="text-white">{slabs.length} Cards</strong>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Declared Vault Value:</span>
                <strong className="text-emerald-400 font-bold">{formatCurrency(totalVaultValue)}</strong>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Format:</span>
                <strong className="text-cyan-300">SlabVault Encrypted JSON v2.0</strong>
              </div>
            </div>

            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Download an offline, portable archive containing all graded cert numbers, high-res photos,
              pricing history, and custom notes. Never lose your collection data.
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,122,0,0.4)] cursor-pointer"
            >
              <Download className="w-4 h-4 text-black" />
              <span>DOWNLOAD MASTER VAULT JSON</span>
            </button>
          </div>
        )}

        {/* TAB 2: RESTORE */}
        {activeTab === 'restore' && (
          <div className="space-y-4 font-mono text-xs">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 rounded-2xl p-8 text-center cursor-pointer transition-all"
            >
              <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-bounce" />
              <p className="text-sm text-white font-bold mb-1">Click to Upload SlabVault Backup (.json)</p>
              <p className="text-[11px] text-zinc-400">Restore your saved collection in 1 click</p>
            </div>

            {importStatus && (
              <div
                className={`p-3 rounded-xl flex items-center space-x-2 ${
                  importStatus.startsWith('Error')
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {importStatus.startsWith('Error') ? (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{importStatus}</span>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-zinc-500 text-[11px]">Need clean sample cards?</span>
              <button
                onClick={() => {
                  vaultAudio.playButtonTick();
                  onResetToSampleData();
                  setImportStatus('Reset to flagship PSA/BGS 10 sample collection.');
                }}
                className="text-orange-400 hover:text-orange-300 underline text-[11px] cursor-pointer flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Load Sample Collection</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CROSS-DEVICE */}
        {activeTab === 'sync' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center space-x-3">
                <Smartphone className="w-6 h-6 text-orange-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">Mobile Browser</div>
                  <div className="text-[10px] text-zinc-400">iOS & Android Ready</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center space-x-3">
                <Laptop className="w-6 h-6 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">Desktop / Mac</div>
                  <div className="text-[10px] text-zinc-400">Full 3D WebGL Engine</div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08090C] border border-white/10 space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase block">Shareable Vault URL</span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.origin}
                  className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-2 text-zinc-300 text-xs font-mono select-all"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer shrink-0 flex items-center space-x-1"
                >
                  {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="text-zinc-500 text-[10px] leading-relaxed">
              💡 Tip: Export your backup file on your computer and import it on your phone to transfer your
              entire custom vault seamlessly in seconds!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
