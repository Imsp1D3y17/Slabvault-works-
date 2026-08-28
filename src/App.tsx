import React, { useState } from 'react';
import { Slab, DisplaySettings, MembershipTier, DisplayMount, DisplayTheme } from './types';
import { INITIAL_GRAIL_SLABS } from './data/sampleGrails';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { VaultDashboard } from './components/VaultDashboard';
import { ShowcasePlanner } from './components/ShowcasePlanner';
import { SlabDetailModal } from './components/SlabDetailModal';
import { AddSlabModal } from './components/AddSlabModal';
import { AiGrailAdvisorModal } from './components/AiGrailAdvisorModal';
import { PaywallModal } from './components/PaywallModal';
import { OpeningIntro } from './components/OpeningIntro';
import { TriumphBottomNav, AppTab } from './components/TriumphBottomNav';
import { Slab3DViewer } from './components/Slab3DViewer';
import { RewardsView } from './components/RewardsView';
import { AccountView } from './components/AccountView';
import { DepositModal } from './components/DepositModal';
import { SlabScannerModal } from './components/SlabScannerModal';
import { InsuranceDossierModal } from './components/InsuranceDossierModal';
import { ShowcaseShareModal } from './components/ShowcaseShareModal';
import { SlabComparatorModal } from './components/SlabComparatorModal';
import { AuctionWatchlistModal } from './components/AuctionWatchlistModal';
import { CrossoverSimulatorModal } from './components/CrossoverSimulatorModal';
import { ImageReplaceModal } from './components/ImageReplaceModal';
import { SlabLeaderboardModal } from './components/SlabLeaderboardModal';
import { GalaxyVaultBackground } from './components/GalaxyVaultBackground';
import { CloudSyncModal } from './components/CloudSyncModal';
import { LiveMarketCompsModal } from './components/LiveMarketCompsModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';

export default function App() {
  const [showOpeningIntro, setShowOpeningIntro] = useState(false);
  const [currentTab, setCurrentTab] = useState<AppTab>('collection');
  const [legacyView, setLegacyView] = useState<'app' | 'landing' | 'onboarding'>('app');
  const [slabs, setSlabs] = useState<Slab[]>(() => {
    // Restore from localStorage if available
    try {
      const saved = localStorage.getItem('slabvault_collection');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_GRAIL_SLABS;
  });
  const [walletBalance, setWalletBalance] = useState<number>(1500);

  // Sync to localStorage on change
  React.useEffect(() => {
    try {
      localStorage.setItem('slabvault_collection', JSON.stringify(slabs));
    } catch (e) {}
  }, [slabs]);

  // 3D Spotlight Viewer State
  const [active3DSlab, setActive3DSlab] = useState<Slab | null>(null);

  // Display configuration
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    mount: 'triumph-rail',
    theme: 'triumph-amber',
    background: 'triumph-vault',
    layout: 'triumph-monolith',
    showSubgrades: true,
    showLiveComps: true,
    showLightingHalo: true,
    tiltEffect: true,
    spacing: 'normal',
  });

  // Modals
  const [selectedSlab, setSelectedSlab] = useState<Slab | null>(null);
  const [isAddSlabOpen, setIsAddSlabOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [comparatorInitialSlab, setComparatorInitialSlab] = useState<Slab | null>(null);
  const [isCrossoverSimulatorOpen, setIsCrossoverSimulatorOpen] = useState(false);
  const [crossoverInitialSlab, setCrossoverInitialSlab] = useState<Slab | null>(null);
  const [isImageReplaceOpen, setIsImageReplaceOpen] = useState(false);
  const [imageReplaceSlab, setImageReplaceSlab] = useState<Slab | null>(null);
  const [isAuctionWatchlistOpen, setIsAuctionWatchlistOpen] = useState(false);
  const [isInsuranceDossierOpen, setIsInsuranceDossierOpen] = useState(false);
  const [isShareShowcaseOpen, setIsShareShowcaseOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isLiveCompsOpen, setIsLiveCompsOpen] = useState(false);
  const [liveCompsSelectedSlab, setLiveCompsSelectedSlab] = useState<Slab | undefined>(undefined);
  const [membership, setMembership] = useState<MembershipTier>('vip-annual');

  const totalVaultValue = slabs.reduce((sum, s) => sum + s.currentMarketValue, 0);

  const handleUpdateDisplaySettings = (newSettings: Partial<DisplaySettings>) => {
    setDisplaySettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleAddSlab = (newSlab: Slab) => {
    setSlabs([newSlab, ...slabs]);
    setActive3DSlab(newSlab); // Instantly inspect newly vaulted card in 3D tactile spotlight
  };

  const handleUpdateSlabImage = (slabId: string, imageUrl: string, backImageUrl?: string) => {
    setSlabs((prevSlabs) =>
      prevSlabs.map((s) =>
        s.id === slabId ? { ...s, imageUrl, backImageUrl: backImageUrl || s.backImageUrl } : s
      )
    );
    if (selectedSlab && selectedSlab.id === slabId) {
      setSelectedSlab((prev) => (prev ? { ...prev, imageUrl, backImageUrl: backImageUrl || prev.backImageUrl } : null));
    }
    if (active3DSlab && active3DSlab.id === slabId) {
      setActive3DSlab((prev) => (prev ? { ...prev, imageUrl, backImageUrl: backImageUrl || prev.backImageUrl } : null));
    }
  };

  const handleOnboardingComplete = (
    userGrails: Slab[],
    mountPref: DisplayMount,
    themePref: DisplayTheme
  ) => {
    const merged = [...userGrails, ...slabs.filter((s) => !userGrails.some((ug) => ug.id === s.id))];
    setSlabs(merged);
    setDisplaySettings((prev) => ({
      ...prev,
      mount: mountPref,
      theme: themePref,
    }));
    setLegacyView('app');
    setCurrentTab('collection');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#00F0FF]/30 selection:text-white relative">
      {/* 3D Cosmic Galaxy Canvas Background for Depository Vault */}
      <GalaxyVaultBackground
        initialTheme="cosmic_nebula"
        intensity="vibrant"
        interactive={true}
        showControls={false}
      />

      {/* 3D Opening Screen Intro */}
      {showOpeningIntro && (
        <OpeningIntro
          onEnter={() => setShowOpeningIntro(false)}
          autoCloseDelay={5}
        />
      )}

      {/* 3D SPOTLIGHT VIEWER WITH TACTILE FINGER FLIP & ROTATION */}
      {active3DSlab && (
        <Slab3DViewer
          slab={active3DSlab}
          initialMount={displaySettings.mount}
          onMountChange={(newMount) => handleUpdateDisplaySettings({ mount: newMount })}
          onBack={() => setActive3DSlab(null)}
          onOpenAdvisor={() => {
            setActive3DSlab(null);
            setIsAiAdvisorOpen(true);
          }}
          onOpenImageReplace={(slab) => {
            setImageReplaceSlab(slab);
            setIsImageReplaceOpen(true);
          }}
        />
      )}

      {/* Top Navigation Bar */}
      {legacyView === 'app' ? (
        <Navbar
          currentView={currentTab === 'showroom' ? 'museum' : currentTab === 'collection' ? 'vault' : 'landing'}
          onNavigate={(view) => {
            if (view === 'museum') setCurrentTab('showroom');
            else if (view === 'vault') setCurrentTab('collection');
            else if (view === 'landing') setLegacyView('landing');
          }}
          totalVaultValue={totalVaultValue}
          isVip={membership !== 'free'}
          onOpenPaywall={() => setIsPaywallOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onReplayIntro={() => setShowOpeningIntro(true)}
          onOpenCloudSync={() => setIsCloudSyncOpen(true)}
          onOpenLiveComps={() => {
            setLiveCompsSelectedSlab(undefined);
            setIsLiveCompsOpen(true);
          }}
        />
      ) : null}

      {/* Main App Switcher */}
      <main className="flex-1">
        {legacyView === 'landing' && (
          <LandingPage
            onStartOnboarding={() => setLegacyView('onboarding')}
            onExploreVault={() => {
              setLegacyView('app');
              setCurrentTab('collection');
            }}
            onSelectSlab={(slab) => setActive3DSlab(slab)}
            onReplayIntro={() => setShowOpeningIntro(true)}
          />
        )}

        {legacyView === 'onboarding' && (
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onCancel={() => setLegacyView('landing')}
          />
        )}

        {legacyView === 'app' && (
          <div>
            {/* TAB 1: COLLECTION (Vault Dashboard & Live Comps) */}
            {currentTab === 'collection' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36">
                <VaultDashboard
                  slabs={slabs}
                  onSelectSlab={(slab) => setActive3DSlab(slab)}
                  onOpenAddModal={() => setIsAddSlabOpen(true)}
                  onOpenScanner={() => setIsScannerOpen(true)}
                  onOpenComparator={() => {
                    setComparatorInitialSlab(null);
                    setIsComparatorOpen(true);
                  }}
                  onOpenAuctionWatchlist={() => setIsAuctionWatchlistOpen(true)}
                  onOpenCrossoverSimulator={() => {
                    setCrossoverInitialSlab(null);
                    setIsCrossoverSimulatorOpen(true);
                  }}
                  onOpenInsuranceDossier={() => setIsInsuranceDossierOpen(true)}
                  onOpenShareShowcase={() => setIsShareShowcaseOpen(true)}
                  onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
                  onOpenShowcasePlanner={() => setCurrentTab('showroom')}
                  onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                  onOpenPaywall={() => setIsPaywallOpen(true)}
                  onOpenLiveComps={() => {
                    setLiveCompsSelectedSlab(undefined);
                    setIsLiveCompsOpen(true);
                  }}
                  onOpenCloudSync={() => setIsCloudSyncOpen(true)}
                  isVip={membership !== 'free'}
                />
              </div>
            )}

            {/* TAB 2: SHOWROOM (Museum Display & Pedestal Planner) */}
            {currentTab === 'showroom' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white">
                      Showroom Gallery Planner
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">
                      Configure 3D acrylic pedestals, illumination themes, and spatial layouts
                    </p>
                  </div>
                </div>
                <ShowcasePlanner
                  slabs={slabs}
                  settings={displaySettings}
                  onUpdateSettings={handleUpdateDisplaySettings}
                  onSelectSlab={(slab) => setActive3DSlab(slab)}
                  onOpenShareShowcase={() => setIsShareShowcaseOpen(true)}
                />
              </div>
            )}

            {/* TAB 3: AI ADVISOR & COMPS */}
            {currentTab === 'advisor' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white flex items-center gap-2">
                      <span>AI Asset Advisor & Market Intelligence</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/30">
                        LIVE
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      Autonomous underwriting, pop report delta analysis, and auction comp aggregation
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAiAdvisorOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-display font-black text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    Open Deep AI Valuation Console
                  </button>
                </div>

                {/* Slabs Grid with Instant 3D Tactile Inspection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {slabs.map((slab) => (
                    <div
                      key={slab.id}
                      onClick={() => setActive3DSlab(slab)}
                      className="bg-black/60 border border-white/15 rounded-2xl p-4 backdrop-blur-xl hover:border-[#00F0FF]/60 transition-all cursor-pointer group shadow-xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#00F0FF]">
                            {slab.gradingCompany} {slab.grade}
                          </span>
                          <h4 className="font-display font-bold text-sm text-white group-hover:text-[#00F0FF] transition-colors truncate max-w-[220px]">
                            {slab.cardName}
                          </h4>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-300">
                          {slab.popReport?.popAtGrade || 44} in pop
                        </span>
                      </div>

                      <div className="py-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-mono text-zinc-400">Current Valuation</p>
                          <p className="text-xl font-black font-display text-white">
                            ${slab.currentMarketValue.toLocaleString()}
                          </p>
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-mono font-bold text-zinc-200 group-hover:bg-[#00F0FF] group-hover:text-black transition-all flex items-center gap-1.5">
                          <span>3D Touch & Flip</span>
                          <span>→</span>
                        </span>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-zinc-400">
                        <span>Cert #{slab.certNumber}</span>
                        <span className="text-emerald-400 font-bold">Custody Insured</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REWARDS */}
            {currentTab === 'rewards' && (
              <RewardsView
                onAddCredit={(amt) => setWalletBalance((prev) => prev + amt)}
                onOpenPaywall={() => setIsPaywallOpen(true)}
                isVip={membership !== 'free'}
              />
            )}

            {/* TAB 5: ACCOUNT */}
            {currentTab === 'account' && (
              <AccountView
                walletBalance={walletBalance}
                totalVaultValue={totalVaultValue}
                totalCardsCount={slabs.length}
                onDeposit={() => setIsDepositOpen(true)}
                onOpenPaywall={() => setIsPaywallOpen(true)}
                isVip={membership !== 'free'}
              />
            )}
          </div>
        )}
      </main>

      {/* Triumph Bottom Navigation */}
      {legacyView === 'app' && !active3DSlab && (
        <TriumphBottomNav
          activeTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          collectionCount={slabs.length}
        />
      )}

      {/* Modals & Dialogs */}
      <SlabDetailModal
        slab={selectedSlab}
        onClose={() => setSelectedSlab(null)}
        onOpenComparator={(slab) => {
          setComparatorInitialSlab(slab);
          setIsComparatorOpen(true);
        }}
        onOpenCrossoverSimulator={(slab) => {
          setCrossoverInitialSlab(slab);
          setIsCrossoverSimulatorOpen(true);
        }}
        onOpenImageReplace={(slab) => {
          setImageReplaceSlab(slab);
          setIsImageReplaceOpen(true);
        }}
      />

      <SlabComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => {
          setIsComparatorOpen(false);
          setComparatorInitialSlab(null);
        }}
        slabs={slabs}
        initialSlabA={comparatorInitialSlab}
      />

      <CrossoverSimulatorModal
        isOpen={isCrossoverSimulatorOpen}
        onClose={() => {
          setIsCrossoverSimulatorOpen(false);
          setCrossoverInitialSlab(null);
        }}
        slabs={slabs}
        initialSlab={crossoverInitialSlab}
      />

      <AuctionWatchlistModal
        isOpen={isAuctionWatchlistOpen}
        onClose={() => setIsAuctionWatchlistOpen(false)}
      />

      <AddSlabModal
        isOpen={isAddSlabOpen}
        onClose={() => setIsAddSlabOpen(false)}
        onAddSlab={handleAddSlab}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      <SlabScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSlabScanned={handleAddSlab}
      />

      <InsuranceDossierModal
        isOpen={isInsuranceDossierOpen}
        onClose={() => setIsInsuranceDossierOpen(false)}
        slabs={slabs}
      />

      <ShowcaseShareModal
        isOpen={isShareShowcaseOpen}
        onClose={() => setIsShareShowcaseOpen(false)}
        slabs={slabs}
        settings={displaySettings}
      />

      <AiGrailAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        slabs={slabs}
        onUpgradeToVip={() => setIsPaywallOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenCrossover={() => setIsCrossoverSimulatorOpen(true)}
        onOpenInsurance={() => setIsInsuranceDossierOpen(true)}
        onOpenAddSlab={() => setIsAddSlabOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenWatchlist={() => setIsAuctionWatchlistOpen(true)}
        onInspect3DSlab={(slab) => setActive3DSlab(slab)}
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={(tier) => {
          setMembership(tier);
          setIsPaywallOpen(false);
        }}
        portfolioValue={totalVaultValue}
      />

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDepositSuccess={(amt) => setWalletBalance((prev) => prev + amt)}
      />

      <SlabLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        userSlabs={slabs}
        onInspect3DSlab={(slab) => {
          setIsLeaderboardOpen(false);
          setActive3DSlab(slab);
        }}
        onCompareSlab={(slab) => {
          setIsLeaderboardOpen(false);
          setComparatorInitialSlab(slab);
          setIsComparatorOpen(true);
        }}
      />

      {imageReplaceSlab && (
        <ImageReplaceModal
          isOpen={isImageReplaceOpen}
          onClose={() => {
            setIsImageReplaceOpen(false);
            setImageReplaceSlab(null);
          }}
          slab={imageReplaceSlab}
          onSaveImage={handleUpdateSlabImage}
        />
      )}

      {/* Cloud Sync & Master Backup Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        slabs={slabs}
        displaySettings={displaySettings}
        onRestoreVault={(restoredSlabs, restoredSettings) => {
          setSlabs(restoredSlabs);
          if (restoredSettings) setDisplaySettings(restoredSettings);
        }}
        onResetToSampleData={() => setSlabs(INITIAL_GRAIL_SLABS)}
      />

      {/* Live Market Comps & Cert Verification Modal */}
      <LiveMarketCompsModal
        isOpen={isLiveCompsOpen}
        onClose={() => setIsLiveCompsOpen(false)}
        selectedSlab={liveCompsSelectedSlab}
        onApplyValuation={(slabId, newVal) => {
          setSlabs((prev) =>
            prev.map((s) => (s.id === slabId ? { ...s, currentMarketValue: newVal } : s))
          );
        }}
      />

      {/* PWA 1-Click Install App Banner for Mobile & Desktop */}
      <PwaInstallBanner />
    </div>
  );
}
