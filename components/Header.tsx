'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  GitFork, 
  BarChart3, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  Terminal, 
  Radio,
  Share2,
  Navigation,
  Network
} from 'lucide-react';
import { SystemVersioning } from '../lib/types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  versioning: SystemVersioning;
  activeStopConditionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  versioning,
  activeStopConditionsCount
}) => {
  const tabs = [
    { id: 'transport-medium', label: 'Transport Medium (R ⊕ V)', icon: Network, highlight: true },
    { id: 'workbench', label: 'Field Workbench', icon: Radio },
    { id: 'gn-benchmark', label: 'G_n Topology Suite', icon: BarChart3 },
    { id: 'vessel-engine', label: 'Vessel as Engine', icon: Navigation },
    { id: 'graph', label: 'Substrate Graph', icon: GitFork },
    { id: 'crystal', label: 'Crystal Bridges', icon: Share2 },
    { id: 'rapids', label: 'RAPIDS & Centrality', icon: Cpu },
    { id: 'gates', label: 'Transaction Gates', icon: Layers },
    { id: 'backlog', label: 'Isolated Backlog', icon: Layers },
    { id: 'evidence', label: 'Aether Ledger', icon: FileText },
    { id: 'octagon', label: 'Octagon & Sentinel', icon: ShieldCheck, alertCount: activeStopConditionsCount },
    { id: 'guild', label: 'Operator Console', icon: Terminal }
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Doctrine & Sovereign Versioning Bar */}
      <div className="border-b border-zinc-800/60 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-zinc-400 bg-zinc-900/50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-zinc-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold tracking-wider text-zinc-200">PATHFINDER</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 font-serif italic">“Identify the rails before the destinations.”</span>
          </div>
        </div>

        {/* Multi-Dimensional Versioning Matrix */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
          <div className="flex items-center space-x-1">
            <span className="text-zinc-500">ARCH:</span>
            <span className="text-zinc-300 px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">{versioning.architectureVersion}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-zinc-500">RUNTIME:</span>
            <span className="text-zinc-300 px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">{versioning.runtimeVersion}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-zinc-500">UNIVERSE:</span>
            <span className="text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/50">{versioning.datasetUniverseVersion}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-zinc-500">SNAPSHOT:</span>
            <span className="text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/50">{versioning.graphSnapshotEpoch}</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">OPERATOR SOVEREIGNTY: HELD</span>
          </div>
        </div>
      </div>

      {/* Main Navigation & Title */}
      <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Frontier Substrate Evidence Architecture</h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                Quantum • Fusion • AI Rails
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Evidence-bound dependency graph, RAPIDS 7-pillar scorecards, and corporate action gate state-machines.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center overflow-x-auto no-scrollbar gap-1.5 pb-1 md:pb-0" id="main-nav-bar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
                } ${tab.highlight && !isActive ? 'border-cyan-900/50 text-cyan-300' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : tab.highlight ? 'text-cyan-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.alertCount !== undefined && tab.alertCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-red-600 text-white font-bold animate-pulse">
                    {tab.alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
