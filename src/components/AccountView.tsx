import React, { useState } from 'react';
import { User, Wallet, ShieldCheck, ArrowDownToLine, ArrowUpFromLine, Package, Sparkles, ExternalLink, QrCode } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { GoldTierBadge } from './GoldTierBadge';

interface AccountViewProps {
  walletBalance: number;
  totalVaultValue: number;
  totalCardsCount: number;
  onDeposit: () => void;
  onOpenPaywall: () => void;
  isVip: boolean;
}

export const AccountView: React.FC<AccountViewProps> = ({
  walletBalance,
  totalVaultValue,
  totalCardsCount,
  onDeposit,
  onOpenPaywall,
  isVip,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-36 text-white">
      {/* User Identity Header */}
      <div className="flex items-center space-x-4 p-5 rounded-3xl bg-gradient-to-br from-[#121624] via-[#090C16] to-[#120D22] border border-white/15 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 flex items-center justify-center shadow-lg">
          <div className="w-full h-full bg-black/80 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="space-y-1 overflow-hidden flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-black text-lg text-white truncate">
              Triumph Collector
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-400 font-mono">0x7F...9A42 • KYC Insured</p>
          <div className="pt-0.5">
            <GoldTierBadge size="sm" onClick={onOpenPaywall} />
          </div>
        </div>
      </div>

      {/* Financial Portfolio Overview */}
      <div className="grid grid-cols-2 gap-3">
        {/* Wallet Balance */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Pack Balance</span>
          <p className="text-xl font-black font-display text-white">
            {formatCurrency(walletBalance)}
          </p>
          <button
            onClick={onDeposit}
            className="w-full mt-2 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-display font-black text-xs transition-all cursor-pointer"
          >
            + Add Funds
          </button>
        </div>

        {/* Total Insured Portfolio Value */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Vault Equity</span>
          <p className="text-xl font-black font-display text-cyan-400">
            {formatCurrency(totalVaultValue)}
          </p>
          <div className="mt-2 py-1.5 text-center text-xs font-mono text-zinc-400">
            {totalCardsCount} Graded Slabs
          </div>
        </div>
      </div>

      {/* Vault Custody & Shipping Address */}
      <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white font-display">Physical Vault Custody</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            DELAWARE VAULT #4
          </span>
        </div>

        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
          All slabs in your collection are stored in Brink's insured Class 3 vaults. You can request physical insured shipping at any time.
        </p>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono font-bold text-white transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <ArrowUpFromLine className="w-4 h-4 text-cyan-400" />
          <span>Request Physical Delivery / Withdrawal</span>
        </button>
      </div>

      {/* Security & Verification Credentials */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs font-mono text-zinc-400">
        <div className="flex justify-between">
          <span>Lloyd's of London Policy:</span>
          <span className="text-white font-bold">#LL-890241-V</span>
        </div>
        <div className="flex justify-between">
          <span>PSA Barcode Scanner API:</span>
          <span className="text-emerald-400 font-bold">Connected (Live)</span>
        </div>
        <div className="flex justify-between">
          <span>2FA Hardware Enclave:</span>
          <span className="text-white font-bold">Biometrics Active</span>
        </div>
      </div>

      {/* Physical Delivery Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#0E121C] border border-white/15 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <h3 className="font-display font-black text-lg text-white">Insured Vault Shipment</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Select card slabs from your collection to be safely packaged in armored tamper-sealed bubble cases with signature-on-delivery tracking.
            </p>
            {withdrawSuccess ? (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-mono">
                ✓ Shipment order dispatched to vault dispatch team!
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setWithdrawSuccess(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-display font-black text-xs"
                >
                  Confirm Shipment ($15 Flat Insured Rate)
                </button>
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawSuccess(false);
                  }}
                  className="w-full py-2 text-zinc-400 text-xs font-mono"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
