import React, { useState } from 'react';
import { Plus, Check, ShieldCheck, Zap, CreditCard, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../lib/utils';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const amounts = [50, 150, 250, 500, 1000, 2500];

  const handleDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onDepositSuccess(selectedAmount);
      setIsProcessing(false);
      onClose();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#00F0FF', '#FFD700'],
        });
      } catch (err) {
        // fallback
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-sm w-full bg-[#0E121D] border border-white/15 rounded-3xl p-6 shadow-2xl text-left space-y-5 text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-black text-lg text-white">Add Pack Balance</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs font-mono"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-400 font-mono">
          Instant deposit for live pack ripping, showroom display upgrades, and vault insurance.
        </p>

        {/* Amount Selector Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {amounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`py-3 rounded-xl font-display font-black text-sm border transition-all cursor-pointer ${
                selectedAmount === amount
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-black border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border-white/10'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-display font-black text-base shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>{isProcessing ? 'Processing...' : `Deposit ${formatCurrency(selectedAmount)}`}</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Encrypted Instant Settlement</span>
        </div>
      </div>
    </div>
  );
};
