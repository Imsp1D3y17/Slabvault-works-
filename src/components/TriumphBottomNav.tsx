import React from 'react';
import { Store, Grid, Gift, User, Sparkles } from 'lucide-react';

export type AppTab = 'collection' | 'showroom' | 'advisor' | 'rewards' | 'account';

interface TriumphBottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  collectionCount?: number;
}

export const TriumphBottomNav: React.FC<TriumphBottomNavProps> = ({
  activeTab,
  onSelectTab,
  collectionCount = 0,
}) => {
  const tabs = [
    {
      id: 'collection' as AppTab,
      label: 'Vault',
      icon: (active: boolean) => (
        <div className="relative">
          <Grid
            className={`w-6 h-6 transition-all ${
              active ? 'text-[#00F0FF] stroke-[2.5] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          />
          {collectionCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 min-w-[14px] text-[9px] font-mono font-bold bg-[#00F0FF] text-black rounded-full text-center">
              {collectionCount}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'showroom' as AppTab,
      label: 'Showroom',
      icon: (active: boolean) => (
        <Store
          className={`w-6 h-6 transition-all ${
            active ? 'text-[#00F0FF] stroke-[2.5] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        />
      ),
    },
    {
      id: 'advisor' as AppTab,
      label: 'AI Advisor',
      icon: (active: boolean) => (
        <Sparkles
          className={`w-6 h-6 transition-all ${
            active ? 'text-[#00F0FF] stroke-[2.5] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        />
      ),
    },
    {
      id: 'rewards' as AppTab,
      label: 'Rewards',
      icon: (active: boolean) => (
        <Gift
          className={`w-6 h-6 transition-all ${
            active ? 'text-[#00F0FF] stroke-[2.5] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        />
      ),
    },
    {
      id: 'account' as AppTab,
      label: 'Account',
      icon: (active: boolean) => (
        <User
          className={`w-6 h-6 transition-all ${
            active ? 'text-[#00F0FF] stroke-[2.5] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        />
      ),
    },
  ];

  return (
    <nav
      id="triumph-bottom-navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#07090E]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] select-none shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex-1 py-1 flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95"
            >
              <div className="flex items-center justify-center h-7">{tab.icon(isActive)}</div>
              <span
                className={`text-[10px] font-mono tracking-tight transition-colors mt-0.5 ${
                  isActive ? 'text-white font-black' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
