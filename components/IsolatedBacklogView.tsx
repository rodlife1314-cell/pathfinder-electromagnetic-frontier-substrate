'use client';

import React, { useState } from 'react';
import { SubstrateNode, EvidenceBinding } from '../lib/types';
import { Layers, AlertCircle, Compass, PlusCircle, CheckCircle, Search, ArrowUpRight } from 'lucide-react';

interface IsolatedBacklogViewProps {
  nodes: SubstrateNode[];
  evidences: EvidenceBinding[];
  onSelectNode: (node: SubstrateNode) => void;
  onPromoteNode: (nodeId: string) => void;
}

export const IsolatedBacklogView: React.FC<IsolatedBacklogViewProps> = ({
  nodes,
  evidences,
  onSelectNode,
  onPromoteNode
}) => {
  const isolatedNodes = nodes.filter(n => n.status === 'ISOLATED_BACKLOG' || n.centrality.degreeCentrality === 0);
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, string>>({});

  const handleDispatchHermes = (nodeId: string) => {
    setDispatchStatus(prev => ({ ...prev, [nodeId]: 'HERMES_DISPATCHED' }));
    setTimeout(() => {
      setDispatchStatus(prev => ({ ...prev, [nodeId]: 'PROVENANCE_LOCATED' }));
    }, 1800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
            <Layers className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">ANALYTICAL BLINDSPOT RADAR</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Isolated-Node Backlog: Zero-Edge Supply Chain Enablers
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Pathfinder actively tracks technology providers and specialized tier-2 components that are known to exist physically, 
            but currently possess <strong>zero verified incoming or outgoing edges</strong> in official registers. 
            Rather than discarding them, keeping them in the active backlog prevents supply chain blindspots and drives targeted Hermes evidence sweeps.
          </p>
        </div>

        <div className="bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800 text-xs font-mono">
          <span className="text-zinc-500 block text-[10px]">CURRENT BLINDSPOTS</span>
          <span className="text-amber-400 font-bold text-lg">{isolatedNodes.length} Isolated Nodes</span>
        </div>
      </div>

      {/* Isolated Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isolatedNodes.map(node => {
          const status = dispatchStatus[node.id];

          return (
            <div 
              key={node.id}
              className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {node.universe} • {node.nodeType}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>DEGREE = 0</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-100">{node.label}</h3>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{node.primaryTechnology}</p>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{node.summary}</p>

                <div className="mt-4 p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>RAPIDS Decile:</span>
                    <span className="text-zinc-200 font-bold">Decile {node.rapids.compositeDecile}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Headquarters:</span>
                    <span className="text-zinc-300">{node.headquarters}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Verified Edges:</span>
                    <span className="text-red-400 font-bold">0 (Isolated)</span>
                  </div>
                </div>

                {status === 'HERMES_DISPATCHED' && (
                  <div className="mt-3 p-2 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-mono flex items-center space-x-2 animate-pulse">
                    <Compass className="w-3.5 h-3.5 animate-spin" />
                    <span>Hermes traversing DOE / patent registries...</span>
                  </div>
                )}

                {status === 'PROVENANCE_LOCATED' && (
                  <div className="mt-3 p-2 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Candidate procurement citation located! Ready to link.</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectNode(node)}
                  className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center space-x-1"
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>

                {status === 'PROVENANCE_LOCATED' ? (
                  <button
                    onClick={() => onPromoteNode(node.id)}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold"
                  >
                    Promote to Active
                  </button>
                ) : (
                  <button
                    onClick={() => handleDispatchHermes(node.id)}
                    disabled={status === 'HERMES_DISPATCHED'}
                    className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-mono flex items-center space-x-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Dispatch Hermes</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
