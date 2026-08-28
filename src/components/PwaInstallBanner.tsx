import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share, PlusSquare } from 'lucide-react';
import { vaultAudio } from '../lib/vaultAudio';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Check if already in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      return;
    }

    // Capture Chrome/Android beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If iOS and not standalone, show after a delay
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    vaultAudio.playVaultAirlock();
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Floating Bottom App Installation Bar */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-fade-in">
        <div className="rounded-2xl bg-gradient-to-r from-[#1E202B] via-[#12141C] to-[#0A0C12] border border-orange-500/40 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,122,0,0.2)] flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-black font-black font-mono shadow-[0_0_12px_#FF7A00] shrink-0">
              ⚡
            </div>
            <div>
              <div className="text-xs font-black font-mono text-white flex items-center gap-1.5">
                <span>INSTALL SLABVAULT APP</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-bold">
                  PWA
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                Launch instantly on your home screen
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-lg bg-[#FF7A00] hover:bg-[#FFA834] text-black font-mono font-black text-xs flex items-center space-x-1 cursor-pointer shadow-[0_0_10px_rgba(255,122,0,0.4)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 rounded-md text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Add to Home Screen Modal Instruction */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#141620] border border-orange-500/40 p-6 font-mono text-xs text-white space-y-4">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Install on iPhone / iPad</span>
            </div>

            <ol className="space-y-3 text-zinc-300 text-[11px] list-decimal pl-4">
              <li>
                Tap the <Share className="w-3.5 h-3.5 inline text-cyan-400 mx-1" /> <strong>Share</strong>{' '}
                button at the bottom of Safari.
              </li>
              <li>
                Scroll down and tap{' '}
                <PlusSquare className="w-3.5 h-3.5 inline text-orange-400 mx-1" />{' '}
                <strong>Add to Home Screen</strong>.
              </li>
              <li>
                Tap <strong>Add</strong> in the top right corner.
              </li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-orange-500 text-black font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
