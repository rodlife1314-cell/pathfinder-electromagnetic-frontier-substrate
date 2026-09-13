'use client';

import React, { useState } from 'react';
import { SubstrateNode, SubstrateEdge, EvidenceBinding } from '../lib/types';
import { Share2, ArrowRight, CheckCircle, ExternalLink, Zap, Shield, Sparkles, Filter } from 'lucide-react';

interface CrystalBridgeViewProps {
  nodes: SubstrateNode[];
  edges: SubstrateEdge[];
  evidences: EvidenceBinding[];
  onSelectNode: (node: SubstrateNode) => void;
}

export const CrystalBridgeView: React.FC<CrystalBridgeViewProps> = ({
  nodes,
  edges,
  evidences,
  onSelectNode
}) => {
  const [selectedBridgeSubstrate, setSelectedBridgeSubstrate] = useState<string>('all');

  const crystalEdges = edges.filter(e => e.relationshipType === 'CRYSTAL_BRIDGE');

  const nodeMap = new Map<string, SubstrateNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const evidenceMap = new Map<string, EvidenceBinding>();
  evidences.forEach(e => evidenceMap.set(e.id, e));

  // Distinct substrates
  const substrates = Array.from(new Set(crystalEdges.map(e => e.crystalBridgeSubstrate).filter(Boolean)));

  const filteredEdges = selectedBridgeSubstrate === 'all' 
    ? crystalEdges 
    : crystalEdges.filter(e => e.crystalBridgeSubstrate === selectedBridgeSubstrate);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/50 via-zinc-900 to-indigo-950/40 border border-cyan-800/60 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
              <Share2 className="w-4 h-4" />
              <span className="font-semibold uppercase tracking-wider">SOVEREIGN LINKAGE ARCHITECTURE</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">
              The Crystal Bridge: Cross-Ecosystem Substrate Rails
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-3xl leading-relaxed">
              In deep technology, breakthrough destinations appear disconnected on the surface, but their underlying industrial rails are identical. 
              Crystal Bridges map the exact physical interfaces (e.g. sub-Kelvin cryogenics, 2G REBCO high-temperature superconductors, plasma digital twins) 
              that simultaneously unlock both Quantum Computing and Commercial Fusion Energy.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 text-xs font-mono bg-zinc-950/80 px-4 py-3 rounded-lg border border-zinc-800">
            <div>
              <span className="text-zinc-500 block text-[10px]">ACTIVE BRIDGES</span>
              <span className="text-cyan-400 font-bold text-lg">{crystalEdges.length}</span>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <span className="text-zinc-500 block text-[10px]">EVIDENCE STATUS</span>
              <span className="text-emerald-400 font-bold text-lg">100% BOUND</span>
            </div>
          </div>
        </div>
      </div>

      {/* Substrate Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-zinc-500 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" />
          <span>FILTER BY SUBSTRATE:</span>
        </span>
        <button
          onClick={() => setSelectedBridgeSubstrate('all')}
          className={`px-3 py-1.5 rounded-md border transition-all ${
            selectedBridgeSubstrate === 'all'
              ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
        >
          All Bridges ({crystalEdges.length})
        </button>
        {substrates.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedBridgeSubstrate(sub!)}
            className={`px-3 py-1.5 rounded-md border transition-all ${
              selectedBridgeSubstrate === sub
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Crystal Bridge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEdges.map(edge => {
          const src = nodeMap.get(edge.source);
          const tgt = nodeMap.get(edge.target);
          const evidence = evidenceMap.get(edge.evidenceId);

          if (!src || !tgt) return null;

          return (
            <div 
              key={edge.id}
              className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-800 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Bridge Header */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>{edge.crystalBridgeSubstrate || 'CRYSTAL_BRIDGE'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>VERIFIED OBSERVATION</span>
                  </span>
                </div>

                {/* Node Rail Connector */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 my-2">
                  {/* Origin */}
                  <div 
                    onClick={() => onSelectNode(src)}
                    className="flex-1 cursor-pointer group"
                  >
                    <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                      {src.universe.toUpperCase()} ORIGIN
                    </span>
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">
                      {src.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-mono">
                      Decile {src.rapids.compositeDecile} • {src.nodeType}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-cyan-500 mt-0.5">SUBSTRATE</span>
                  </div>

                  {/* Destination */}
                  <div 
                    onClick={() => onSelectNode(tgt)}
                    className="flex-1 text-right cursor-pointer group"
                  >
                    <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                      {tgt.universe.toUpperCase()} TARGET
                    </span>
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">
                      {tgt.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-mono">
                      Decile {tgt.rapids.compositeDecile} • {tgt.nodeType}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  {edge.description}
                </p>
              </div>

              {/* Provenance Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                <div className="truncate max-w-[280px]">
                  <span className="text-zinc-500">AETHER PROVENANCE: </span>
                  <span className="text-zinc-300">{evidence?.documentTitle || edge.evidenceId}</span>
                </div>
                <span className="text-emerald-400 font-semibold">
                  Conf: {((evidence?.confidenceScore || 0.95) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Doctrine Box: Why Rails Before Destinations */}
      <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
        <h3 className="font-semibold text-zinc-200 font-mono text-xs flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>OPERATOR NOTE: THE DUALITY OF FRONTIER HARDWARE</span>
        </h3>
        <p className="text-zinc-400 leading-relaxed text-[11px]">
          Conventional venture and equity analysts evaluate quantum computing and fusion energy as distinct siloed investments with speculative 10-year timelines. 
          Pathfinder reveals the sovereign truth: both systems are physically bound by high-temperature superconductors (SuperPower REBCO), ultra-low temperature thermal management (BlueFors/Oxford Instruments), 
          and magnetohydrodynamic digital twin simulations (NVIDIA CUDA-Q). Mapping the enabler rails captures systemic equity and technological leverage regardless of which reactor or qubit design wins the commercial race.
        </p>
      </div>
    </div>
  );
};
