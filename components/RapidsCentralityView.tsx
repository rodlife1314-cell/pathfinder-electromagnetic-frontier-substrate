'use client';

import React, { useState, useMemo } from 'react';
import { SubstrateNode } from '../lib/types';
import { BarChart3, TrendingUp, Filter, Award, ShieldAlert, ArrowUpDown, Info } from 'lucide-react';

interface RapidsCentralityViewProps {
  nodes: SubstrateNode[];
  onSelectNode: (node: SubstrateNode) => void;
}

type SortField = 'compositeScore' | 'pageRank' | 'betweennessCentrality' | 'degreeCentrality' | 'cashFlow' | 'supplyChainImportance' | 'scientificLeadership';

export const RapidsCentralityView: React.FC<RapidsCentralityViewProps> = ({
  nodes,
  onSelectNode
}) => {
  const [sortField, setSortField] = useState<SortField>('compositeScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedUniverse, setSelectedUniverse] = useState<string>('all');
  const [selectedEnablerForDeepDive, setSelectedEnablerForDeepDive] = useState<SubstrateNode | null>(nodes[0] || null);

  const filteredAndSortedNodes = useMemo(() => {
    return nodes
      .filter(n => selectedUniverse === 'all' || n.universe === selectedUniverse)
      .sort((a, b) => {
        let valA: number;
        let valB: number;

        if (sortField === 'compositeScore') {
          valA = a.rapids.compositeScore;
          valB = b.rapids.compositeScore;
        } else if (sortField === 'pageRank') {
          valA = a.centrality.pageRank;
          valB = b.centrality.pageRank;
        } else if (sortField === 'betweennessCentrality') {
          valA = a.centrality.betweennessCentrality;
          valB = b.centrality.betweennessCentrality;
        } else if (sortField === 'degreeCentrality') {
          valA = a.centrality.degreeCentrality;
          valB = b.centrality.degreeCentrality;
        } else {
          valA = a.rapids[sortField as keyof typeof a.rapids] as number;
          valB = b.rapids[sortField as keyof typeof b.rapids] as number;
        }

        return sortAsc ? valA - valB : valB - valA;
      });
  }, [nodes, selectedUniverse, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const activeEnabler = selectedEnablerForDeepDive || nodes[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Header */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">EVALUATION METHODOLOGY</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            RAPIDS Scorecard & Live Centrality Metrics
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            <strong className="text-zinc-200 font-mono">RAPIDS</strong> (Row-based Attributes Portfolio and Influence Decisive Score) evaluates each mapped enabler 
            across seven sovereign pillars: Cash Flow, Ecosystem Position, Capital Intensity, Government Contracts, AI Integration, Supply Chain, and Scientific Leadership. 
            Combined with Live Centrality (PageRank & Betweenness), this isolates the single points of failure across frontier hardware.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-zinc-500 ml-2" />
          <select
            value={selectedUniverse}
            onChange={e => setSelectedUniverse(e.target.value)}
            className="bg-transparent text-zinc-200 focus:outline-none p-1 cursor-pointer"
          >
            <option value="all" className="bg-zinc-900">All Sectors</option>
            <option value="quantum" className="bg-zinc-900">Quantum Substrate</option>
            <option value="fusion" className="bg-zinc-900">Fusion Substrate</option>
            <option value="ai_infra" className="bg-zinc-900">AI Infrastructure</option>
          </select>
        </div>
      </div>

      {/* Selected Enabler 7-Pillar Spotlight Bar */}
      {activeEnabler && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {activeEnabler.universe} • {activeEnabler.nodeType}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  activeEnabler.rapids.compositeDecile >= 9 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : 'bg-zinc-800 text-zinc-300'
                }`}>
                  DECILE {activeEnabler.rapids.compositeDecile}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mt-1 flex items-center space-x-2">
                <span>{activeEnabler.label}</span>
                {activeEnabler.ticker && <span className="text-xs font-mono text-cyan-400 font-semibold">${activeEnabler.ticker}</span>}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">{activeEnabler.summary}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-center min-w-[90px]">
                <span className="text-[10px] text-zinc-500 block">RAPIDS COMPOSITE</span>
                <span className="text-emerald-400 font-bold text-base">{activeEnabler.rapids.compositeScore.toFixed(1)}</span>
              </div>
              <div className="bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-center min-w-[90px]">
                <span className="text-[10px] text-zinc-500 block">PAGERANK (PR)</span>
                <span className="text-cyan-400 font-bold text-base">{activeEnabler.centrality.pageRank.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-center min-w-[90px]">
                <span className="text-[10px] text-zinc-500 block">BETWEENNESS (BC)</span>
                <span className="text-amber-400 font-bold text-base">{activeEnabler.centrality.betweennessCentrality.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 7-Pillar Progress Meters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 text-xs font-mono">
            {/* CF */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block">1. CASH FLOW (CF)</span>
              <span className="text-zinc-200 font-bold text-sm">{activeEnabler.rapids.cashFlow}/100</span>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeEnabler.rapids.cashFlow}%` }} />
              </div>
            </div>

            {/* EP */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block">2. ECOSYSTEM (EP)</span>
              <span className="text-zinc-200 font-bold text-sm">{activeEnabler.rapids.ecosystemPosition}/100</span>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${activeEnabler.rapids.ecosystemPosition}%` }} />
              </div>
            </div>

            {/* CI */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block">3. CAPEX (CI)</span>
              <span className="text-zinc-200 font-bold text-sm">{activeEnabler.rapids.capitalIntensity}/100</span>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeEnabler.rapids.capitalIntensity}%` }} />
              </div>
            </div>

            {/* GC */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block">4. GOV CONTR (GC)</span>
              <span className="text-zinc-200 font-bold text-sm">{activeEnabler.rapids.governmentContracts}/100</span>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-violet-500 h-full rounded-full" style={{ width: `${activeEnabler.rapids.governmentContracts}%` }} />
              </div>
            </div>

            {/* AI */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block">5. AI INTEGR (AI)</span>
              <span className="text-zinc-200 font-bold text-sm">{activeEnabler.rapids.aiIntegration}/100</span>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${activeEnabler.rapids.aiIntegration}%` }} />
              </div>
            </div>

            {/* SC */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block">6. SUPPLY CHAIN (SC)</span>
              <span className="text-zinc-200 font-bold text-sm">{activeEnabler.rapids.supplyChainImportance}/100</span>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${activeEnabler.rapids.supplyChainImportance}%` }} />
              </div>
            </div>

            {/* SL */}
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 block">7. SCIENTIFIC (SL)</span>
              <span className="text-zinc-200 font-bold text-sm">{activeEnabler.rapids.scientificLeadership}/100</span>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${activeEnabler.rapids.scientificLeadership}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparative Enabler Matrix Table */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg">
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="font-semibold text-zinc-200">SUBSTRATE ENABLER RANKINGS ({filteredAndSortedNodes.length})</span>
          <span>Click column header to re-sort deciles or centrality</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px]">
              <tr>
                <th className="p-3 pl-5">Enabler / Ticker</th>
                <th className="p-3">Sector</th>
                <th className="p-3 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('compositeScore')}>
                  <div className="flex items-center space-x-1">
                    <span>RAPIDS Decile</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('pageRank')}>
                  <div className="flex items-center space-x-1">
                    <span>PageRank (PR)</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('betweennessCentrality')}>
                  <div className="flex items-center space-x-1">
                    <span>Betweenness (BC)</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('degreeCentrality')}>
                  <div className="flex items-center space-x-1">
                    <span>Direct Edges</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-zinc-200" onClick={() => handleSort('supplyChainImportance')}>
                  <div className="flex items-center space-x-1">
                    <span>Supply Chain (SC)</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="p-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredAndSortedNodes.map(node => {
                const isSelected = activeEnabler?.id === node.id;
                return (
                  <tr 
                    key={node.id} 
                    onClick={() => setSelectedEnablerForDeepDive(node)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-zinc-800/80 text-zinc-100' : 'hover:bg-zinc-900/60'
                    }`}
                  >
                    <td className="p-3 pl-5">
                      <div className="font-semibold text-zinc-200 font-sans">{node.label}</div>
                      <div className="text-[10px] text-zinc-500">
                        {node.ticker ? `$${node.ticker} • ` : ''}{node.nodeType}
                      </div>
                    </td>
                    <td className="p-3 uppercase text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                        {node.universe}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        node.rapids.compositeDecile >= 9 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : node.rapids.compositeDecile >= 7 
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                      }`}>
                        D{node.rapids.compositeDecile} ({node.rapids.compositeScore.toFixed(0)})
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-cyan-400">
                      {node.centrality.pageRank.toFixed(2)}
                    </td>
                    <td className="p-3 font-semibold text-amber-400">
                      {node.centrality.betweennessCentrality.toFixed(2)}
                    </td>
                    <td className="p-3 text-zinc-400">
                      {node.centrality.degreeCentrality} ({node.centrality.inDegree} in / {node.centrality.outDegree} out)
                    </td>
                    <td className="p-3 text-zinc-300">
                      {node.rapids.supplyChainImportance}/100
                    </td>
                    <td className="p-3 pr-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNode(node);
                        }}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-sans"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
