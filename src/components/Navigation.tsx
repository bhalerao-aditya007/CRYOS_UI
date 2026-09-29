import React from 'react';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Zap, 
  Activity, 
  Users, 
  Radio, 
  FileText, 
  Flame 
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'overview', label: 'Station Overview', icon: LayoutDashboard },
    { id: 'ship-window', label: 'Ship Window & Autonomy', icon: CalendarClock },
    { id: 'microgrid', label: 'Microgrid & Thermal', icon: Zap },
    { id: 'health', label: 'ISHM / FDIR Diagnostics', icon: Activity },
    { id: 'agents', label: 'Multi-Agent & Guardrail', icon: Users },
    { id: 'satlink', label: 'Twin-as-Codec Sync', icon: Radio },
    { id: 'compliance', label: 'Madrid Protocol Ledger', icon: FileText },
    { id: 'hero-demo', label: 'Hero Crisis Demo', icon: Flame, highlight: true },
  ];

  return (
    <aside className="w-64 border-r border-polar-800 bg-polar-950/80 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono tracking-wider text-polar-400 uppercase">
          Digital Twin Operations
        </div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                tab.highlight && !isActive
                  ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  : isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-polar-300 hover:text-white hover:bg-polar-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${tab.highlight ? 'text-amber-400 animate-pulse' : isActive ? 'text-cyan-400' : 'text-polar-400'}`} />
              <span className="truncate">{tab.label}</span>
              {tab.highlight && (
                <span className="ml-auto text-[9px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700">
                  HERO
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Edge System Specs Card */}
      <div className="p-3 rounded-lg bg-polar-900/60 border border-polar-800/80 text-xs font-mono space-y-1.5">
        <div className="flex items-center justify-between text-polar-400">
          <span>EDGE NODE:</span>
          <span className="text-emerald-400 font-semibold">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between text-polar-400">
          <span>RESOLUTION:</span>
          <span className="text-white">1-min physics</span>
        </div>
        <div className="flex items-center justify-between text-polar-400">
          <span>STORAGE:</span>
          <span className="text-white">Offline Hot</span>
        </div>
      </div>
    </aside>
  );
};
