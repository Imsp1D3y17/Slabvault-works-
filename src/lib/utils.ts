import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact) {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(1)}k`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatCertNumber(cert: string): string {
  // Clean format
  return cert.replace(/\s+/g, '');
}

export function getCompanyBadgeColor(company: string): { bg: string; text: string; border: string; labelBg: string } {
  switch (company) {
    case 'PSA':
      return {
        bg: 'bg-red-950/40',
        text: 'text-red-400',
        border: 'border-red-500/40',
        labelBg: 'bg-[#DF0000]',
      };
    case 'BGS':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
        labelBg: 'bg-[#C5A059]',
      };
    case 'CGC':
      return {
        bg: 'bg-blue-950/40',
        text: 'text-blue-400',
        border: 'border-blue-500/40',
        labelBg: 'bg-[#00529B]',
      };
    case 'SGC':
      return {
        bg: 'bg-zinc-900',
        text: 'text-zinc-200',
        border: 'border-zinc-500/50',
        labelBg: 'bg-[#111111]',
      };
    case 'TAG':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-300',
        border: 'border-emerald-500/40',
        labelBg: 'bg-[#00E599]',
      };
    default:
      return {
        bg: 'bg-zinc-800',
        text: 'text-zinc-300',
        border: 'border-zinc-700',
        labelBg: 'bg-zinc-800',
      };
  }
}
