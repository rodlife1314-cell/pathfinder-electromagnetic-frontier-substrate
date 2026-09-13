'use client';

import React, { useState, useMemo } from 'react';
import { 
  SubstrateNode, 
  SubstrateEdge, 
  SectorUniverse, 
  NodeType,
  EvidenceBinding
} from '../lib/types';
import { 
  Filter, 
  Share2, 
  Search, 
  Info, 
  PlusCircle, 
  CheckCircle, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

interface GraphViewProps {
  nodes: SubstrateNode[];
  edges: SubstrateEdge[];
  evidences: EvidenceBinding[];
  selectedNode: SubstrateNode | null;
  onSelectNode: (node: SubstrateNode) => void;
  onAddEdge: (newEdge: SubstrateEdge) => void;
  highlightCrystalOnly?: boolean;
}

export const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  evidences,
  selectedNode,
  onSelectNode,
  onAddEdge,
  highlightCrystalOnly = false
}) => {
  const [selectedUniverse, setSelectedUniverse] = useState<string>('all');
  const [highlightCrystal, setHighlightCrystal] = useState<boolean>(highlightCrystalOnly);
  const [showIsolated, setShowIsolated] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddEdgeModalOpen, setIsAddEdgeModalOpen] = useState<boolean>(false);

  // New Edge Form State
  const [sourceNodeId, setSourceNodeId] = useState<string>('');
  const [targetNodeId, setTargetNodeId] = useState<string>('');
  const [edgeType, setEdgeType] = useState<'CRITICAL_DEPENDENCY' | 'CRYSTAL_BRIDGE' | 'CAPITAL_ALLOCATION'>('CRITICAL_DEPENDENCY');
  const [edgeDesc, setEdgeDesc] = useState<string>('');
  const [edgeEvidenceId, setEdgeEvidenceId] = useState<string>('');
  const [edgeSubstrate, setEdgeSubstrate] = useState<string>('Cryogenic Superconducting Infrastructure');
  const [edgeFormError, setEdgeFormError] = useState<string>('');

  // Filter nodes based on user controls
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      if (selectedUniverse !== 'all' && n.universe !== selectedUniverse) return false;
      if (!showIsolated && n.status === 'ISOLATED_BACKLOG') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return n.label.toLowerCase().includes(q) || 
               n.primaryTechnology.toLowerCase().includes(q) ||
               (n.ticker && n.ticker.toLowerCase().includes(q));
      }
      return true;
    });
  }, [nodes, selectedUniverse, showIsolated, searchQuery]);

  const activeNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Filter edges based on visible nodes & crystal bridge filter
  const filteredEdges = useMemo(() => {
    return edges.filter(e => {
      const hasBothNodes = activeNodeIds.has(e.source) && activeNodeIds.has(e.target);
      if (!hasBothNodes) return false;
      if (highlightCrystal && e.relationshipType !== 'CRYSTAL_BRIDGE') return false;
      return true;
    });
  }, [edges, activeNodeIds, highlightCrystal]);

  // Node position map
  const nodeMap = useMemo(() => {
    const map = new Map<string, SubstrateNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  const handleCreateEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceNodeId || !targetNodeId) {
      setEdgeFormError('Source and Target nodes are required.');
      return;
    }
    if (sourceNodeId === targetNodeId) {
      setEdgeFormError('Source and Target cannot be the same node.');
      return;
    }
    if (!edgeEvidenceId) {
      setEdgeFormError('OCTAGON RULE: Every edge MUST have a verified Aether Evidence ID binding.');
      return;
    }

    const src = nodeMap.get(sourceNodeId);
    const tgt = nodeMap.get(targetNodeId);
    const universeCross = src && tgt ? src.universe !== tgt.universe : false;

    const newEdge: SubstrateEdge = {
      id: `edge-${Date.now()}`,
      source: sourceNodeId,
      target: targetNodeId,
      relationshipType: edgeType,
      universeCross,
      description: edgeDesc || 'Operator-verified structural dependency edge.',
      evidenceId: edgeEvidenceId,
      weight: edgeType === 'CRYSTAL_BRIDGE' ? 5 : 4,
      verified: true,
      observationType: 'OBSERVATION',
      crystalBridgeSubstrate: edgeType === 'CRYSTAL_BRIDGE' ? edgeSubstrate : undefined
    };

    onAddEdge(newEdge);
    setIsAddEdgeModalOpen(false);
    setSourceNodeId('');
    setTargetNodeId('');
    setEdgeDesc('');
    setEdgeEvidenceId('');
    setEdgeFormError('');
  };

  const getUniverseColor = (universe: SectorUniverse) => {
    switch (universe) {
      case 'quantum':
        return {
          border: 'border-violet-500/80',
          bg: 'bg-violet-950/40',
          dot: 'bg-violet-400',
          text: 'text-violet-300',
          badge: 'bg-violet-900/60 text-violet-200 border-violet-700'
        };
      case 'fusion':
        return {
          border: 'border-amber-500/80',
          bg: 'bg-amber-950/40',
          dot: 'bg-amber-400',
          text: 'text-amber-300',
          badge: 'bg-amber-900/60 text-amber-200 border-amber-700'
        };
      case 'ai_infra':
        return {
          border: 'border-cyan-500/80',
          bg: 'bg-cyan-950/40',
          dot: 'bg-cyan-400',
          text: 'text-cyan-300',
          badge: 'bg-cyan-900/60 text-cyan-200 border-cyan-700'
        };
      case 'semiconductors':
        return {
          border: 'border-emerald-500/80',
          bg: 'bg-emerald-950/40',
          dot: 'bg-emerald-400',
          text: 'text-emerald-300',
          badge: 'bg-emerald-900/60 text-emerald-200 border-emerald-700'
        };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] bg-zinc-950 text-zinc-100">
      {/* Control Bar */}
      <div className="px-4 py-2.5 bg-zinc-900/70 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Universe Filter */}
          <div className="flex items-center space-x-1.5 bg-zinc-950 border border-zinc-700/80 rounded-md px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-500 text-[11px] font-mono">SECTOR:</span>
            <select
              id="select-universe-filter"
              value={selectedUniverse}
              onChange={e => setSelectedUniverse(e.target.value)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900">All Universes</option>
              <option value="quantum" className="bg-zinc-900">Quantum Substrate</option>
              <option value="fusion" className="bg-zinc-900">Fusion Substrate</option>
              <option value="ai_infra" className="bg-zinc-900">AI Infrastructure / HPC</option>
            </select>
          </div>

          {/* Toggle Crystal Bridges */}
          <button
            id="toggle-crystal-bridges-btn"
            onClick={() => setHighlightCrystal(!highlightCrystal)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all border ${
              highlightCrystal
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-900/30'
                : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>CRYSTAL BRIDGES ONLY {highlightCrystal ? '[ACTIVE]' : '[OFF]'}</span>
          </button>

          {/* Toggle Isolated Backlog */}
          <button
            id="toggle-isolated-backlog-btn"
            onClick={() => setShowIsolated(!showIsolated)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all border ${
              showIsolated
                ? 'bg-zinc-800 border-zinc-600 text-zinc-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ISOLATED BACKLOG {showIsolated ? 'VISIBLE' : 'HIDDEN'}</span>
          </button>

          {/* Search Node */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2 top-2" />
            <input
              id="search-node-input"
              type="text"
              placeholder="Search enabler, tech, ticker..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-7 pr-3 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 w-48"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
            <span className="text-zinc-200 font-semibold">{filteredNodes.length}</span> NODES • <span className="text-zinc-200 font-semibold">{filteredEdges.length}</span> VERIFIED EDGES
          </div>

          <button
            id="btn-add-verified-edge"
            onClick={() => setIsAddEdgeModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800/70 border border-emerald-600/70 text-emerald-200 rounded-md text-xs font-medium transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Verified Edge</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative flex-1 overflow-hidden bg-zinc-950 flex">
        {/* SVG Canvas Map */}
        <div className="relative flex-1 h-full overflow-auto p-4 cursor-default select-none">
          <svg 
            id="substrate-graph-svg"
            className="w-full h-full min-w-[950px] min-h-[580px]"
            viewBox="0 0 1000 560"
          >
            <defs>
              {/* Arrow markers */}
              <marker
                id="arrow-default"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#52525b" />
              </marker>

              <marker
                id="arrow-crystal"
                viewBox="0 0 10 10"
                refX="24"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
              </marker>

              <marker
                id="arrow-capital"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
              </marker>

              {/* Grid background pattern */}
              <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="0.5" strokeOpacity="0.4" />
                <circle cx="0" cy="0" r="1" fill="#3f3f46" fillOpacity="0.3" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#graph-grid)" />

            {/* Sector Universe Domain Boundaries (Visual Substrates) */}
            <g id="universe-regions" opacity="0.12">
              <rect x="50" y="40" width="380" height="480" rx="16" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6,6" />
              <text x="70" y="70" fill="#a78bfa" fontSize="14" fontFamily="monospace" fontWeight="bold">QUANTUM UNIVERSE SUBSTRATE</text>
              
              <rect x="460" y="40" width="490" height="480" rx="16" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="6,6" />
              <text x="480" y="70" fill="#fbbf24" fontSize="14" fontFamily="monospace" fontWeight="bold">FUSION UNIVERSE SUBSTRATE</text>
            </g>

            {/* Edges */}
            <g id="graph-edges">
              {filteredEdges.map(edge => {
                const src = nodeMap.get(edge.source);
                const tgt = nodeMap.get(edge.target);
                if (!src || !tgt || src.x === undefined || src.y === undefined || tgt.x === undefined || tgt.y === undefined) return null;

                const isCrystal = edge.relationshipType === 'CRYSTAL_BRIDGE';
                const isCapital = edge.relationshipType === 'CAPITAL_ALLOCATION';
                const markerId = isCrystal ? 'url(#arrow-crystal)' : isCapital ? 'url(#arrow-capital)' : 'url(#arrow-default)';

                // Calculate control point for curved cross-universe or critical bridges
                const dx = tgt.x - src.x;
                const dy = tgt.y - src.y;
                const cx = (src.x + tgt.x) / 2 - dy * 0.15;
                const cy = (src.y + tgt.y) / 2 + dx * 0.15;
                const pathD = `M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}`;

                return (
                  <g key={edge.id} className="transition-all">
                    {/* Wider transparent path for hover ease */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="16"
                      className="cursor-pointer"
                    >
                      <title>{edge.description}</title>
                    </path>

                    {/* Visible Line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isCrystal ? '#06b6d4' : isCapital ? '#d97706' : '#71717a'}
                      strokeWidth={isCrystal ? 2.5 : edge.weight >= 4 ? 2 : 1.2}
                      strokeDasharray={isCrystal ? '6,4' : isCapital ? '3,3' : 'none'}
                      markerEnd={markerId}
                      className={isCrystal ? 'animate-pulse' : ''}
                      opacity={isCrystal ? 0.95 : 0.65}
                    />

                    {/* Crystal Bridge Tag Badge along the curve */}
                    {isCrystal && edge.crystalBridgeSubstrate && (
                      <g transform={`translate(${cx}, ${cy})`}>
                        <rect
                          x="-65"
                          y="-10"
                          width="130"
                          height="20"
                          rx="4"
                          fill="#083344"
                          stroke="#0891b2"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#67e8f9"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          ⚡ CRYSTAL BRIDGE
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g id="graph-nodes">
              {filteredNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const uColors = getUniverseColor(node.universe);
                const isIsolated = node.status === 'ISOLATED_BACKLOG';

                return (
                  <g
                    key={node.id}
                    id={`node-elem-${node.id}`}
                    transform={`translate(${node.x || 100}, ${node.y || 100})`}
                    onClick={() => onSelectNode(node)}
                    className="cursor-pointer transition-transform duration-150 hover:scale-105"
                  >
                    {/* Selected halo */}
                    {isSelected && (
                      <circle
                        r="34"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="4,3"
                        className="animate-spin"
                        style={{ animationDuration: '8s' }}
                      />
                    )}

                    {/* Main Node Disc */}
                    <circle
                      r={node.centrality.pageRank > 0.8 ? 26 : 22}
                      fill={isIsolated ? '#27272a' : '#18181b'}
                      stroke={isIsolated ? '#71717a' : isSelected ? '#38bdf8' : node.crystalBridgeEligible ? '#06b6d4' : '#52525b'}
                      strokeWidth={isSelected ? 2.5 : node.crystalBridgeEligible ? 2 : 1.5}
                      strokeDasharray={isIsolated ? '3,3' : 'none'}
                    />

                    {/* Universe Color Core */}
                    <circle
                      r="7"
                      className={uColors.dot}
                      opacity={isIsolated ? 0.4 : 0.9}
                    />

                    {/* RAPIDS Decile Badge in node top corner */}
                    <g transform="translate(14, -18)">
                      <rect
                        x="-10"
                        y="-8"
                        width="20"
                        height="15"
                        rx="3"
                        fill={node.rapids.compositeDecile >= 9 ? '#065f46' : node.rapids.compositeDecile >= 7 ? '#854d0e' : '#3f3f46'}
                        stroke="#18181b"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#f4f4f5"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        D{node.rapids.compositeDecile}
                      </text>
                    </g>

                    {/* Transaction Gate Pill for corporate action nodes */}
                    {node.transactionGate && (
                      <g transform="translate(0, -28)">
                        <rect
                          x="-38"
                          y="-7"
                          width="76"
                          height="14"
                          rx="3"
                          fill={node.transactionGate === 'TRADING_LIVE' ? '#047857' : '#92400e'}
                          stroke="#18181b"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="7"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {node.transactionGate}
                        </text>
                      </g>
                    )}

                    {/* Node Label */}
                    <text
                      y="38"
                      textAnchor="middle"
                      fill={isSelected ? '#f4f4f5' : '#e4e4e7'}
                      fontSize="11"
                      fontFamily="system-ui, sans-serif"
                      fontWeight={isSelected ? 'bold' : '500'}
                      className="drop-shadow-md"
                    >
                      {node.label}
                    </text>

                    {/* Node Subtitle (Tech or Ticker) */}
                    <text
                      y="50"
                      textAnchor="middle"
                      fill="#a1a1aa"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {node.ticker ? `[${node.ticker}]` : node.nodeType}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Bottom Left Legend */}
          <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 max-w-sm backdrop-blur-sm pointer-events-auto">
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 mb-2">
              <span className="font-semibold text-zinc-200 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                <span>Substrate Rails & Semantics</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">HERMES TRAVERSAL</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2 font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-zinc-400">Quantum Rail</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-zinc-400">Fusion Rail</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-zinc-400">AI / HPC Rail</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 border border-dashed border-zinc-400" />
                <span className="text-zinc-400">Isolated Backlog</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-0.5 bg-cyan-400 border-b border-dashed border-cyan-300 inline-block" />
                <span className="text-cyan-300 font-semibold">Crystal Bridge: Cross-Domain Infrastructure</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-1 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[9px] font-mono">D1-D10</span>
                <span>RAPIDS Decile (Decile 10 = Systemic critical enabler)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Quick Summary Drawer (if node selected) */}
        {selectedNode && (
          <div className="w-80 border-l border-zinc-800 bg-zinc-900/95 backdrop-blur-md p-4 flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {selectedNode.universe} • {selectedNode.nodeType}
                </span>
                <button
                  id="close-inspector-btn"
                  onClick={() => onSelectNode(null as any)}
                  className="text-zinc-500 hover:text-zinc-300 text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-zinc-100">{selectedNode.label}</h3>
                {selectedNode.ticker && (
                  <span className="inline-block mt-0.5 font-mono text-xs text-cyan-400 font-semibold">
                    ${selectedNode.ticker}
                  </span>
                )}
                <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                  {selectedNode.summary}
                </p>
              </div>

              {/* RAPIDS Score Snapshot */}
              <div className="mt-4 p-3 rounded-md bg-zinc-950 border border-zinc-800">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400">RAPIDS SCORE</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.rapids.compositeScore.toFixed(1)} / 100 (Decile {selectedNode.rapids.compositeDecile})</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${selectedNode.rapids.compositeScore}%` }} 
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono text-zinc-400">
                  <div>PageRank: <span className="text-zinc-200">{selectedNode.centrality.pageRank.toFixed(2)}</span></div>
                  <div>Betweenness: <span className="text-zinc-200">{selectedNode.centrality.betweennessCentrality.toFixed(2)}</span></div>
                  <div>Direct Edges: <span className="text-zinc-200">{selectedNode.centrality.degreeCentrality}</span></div>
                  <div>Status: <span className="text-zinc-200">{selectedNode.status}</span></div>
                </div>
              </div>

              {/* Crystal Bridge Tag */}
              {selectedNode.crystalBridgeEligible && (
                <div className="mt-3 p-2.5 rounded-md bg-cyan-950/40 border border-cyan-800/60 text-xs">
                  <div className="flex items-center space-x-1 text-cyan-300 font-semibold mb-1">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Crystal Bridge Substrate Rail</span>
                  </div>
                  <p className="text-[11px] text-cyan-200/80">
                    Bridges cross-domain technical interfaces: {selectedNode.crystalBridgeTags?.join(', ')}
                  </p>
                </div>
              )}

              {/* Claims / Provenance Peek */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-2">
                  Claims & Evidence ({selectedNode.claims.length})
                </h4>
                <div className="space-y-2">
                  {selectedNode.claims.map(claim => (
                    <div key={claim.id} className="p-2 bg-zinc-950/60 border border-zinc-800/80 rounded text-[11px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                          claim.type === 'OBSERVATION' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {claim.type}
                        </span>
                        {claim.evidenceIds.length > 0 ? (
                          <span className="text-[9px] font-mono text-zinc-500">
                            Bound: {claim.evidenceIds[0]}
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-red-400">UNBOUND PROVENANCE</span>
                        )}
                      </div>
                      <p className="text-zinc-300 line-clamp-2">{claim.statement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-4">
              <button
                id="btn-inspect-full-node"
                onClick={() => onSelectNode(selectedNode)}
                className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded transition-colors"
              >
                Open Full Evidence Dossier
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Verified Edge (Fails-Closed Octagon Enforced) */}
      {isAddEdgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-lg w-full text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-zinc-100">Add Verified Dependency Rail</h3>
              </div>
              <button 
                onClick={() => setIsAddEdgeModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEdge} className="mt-4 space-y-3">
              {edgeFormError && (
                <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 font-mono text-[11px]">
                  {edgeFormError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">SOURCE ENABLER (Rail Origin)</label>
                  <select
                    value={sourceNodeId}
                    onChange={e => setSourceNodeId(e.target.value)}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                    required
                  >
                    <option value="">Select source node...</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label} ({n.universe})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1">TARGET DEPENDANT (Consumer)</label>
                  <select
                    value={targetNodeId}
                    onChange={e => setTargetNodeId(e.target.value)}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                    required
                  >
                    <option value="">Select target node...</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label} ({n.universe})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1">RELATIONSHIP ARCHETYPE</label>
                <select
                  value={edgeType}
                  onChange={e => setEdgeType(e.target.value as any)}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                >
                  <option value="CRITICAL_DEPENDENCY">CRITICAL_DEPENDENCY (Core hardware/software dependency)</option>
                  <option value="CRYSTAL_BRIDGE">CRYSTAL_BRIDGE (Cross-domain physical or computational substrate)</option>
                  <option value="CAPITAL_ALLOCATION">CAPITAL_ALLOCATION (Financial or corporate vehicle allocation)</option>
                </select>
              </div>

              {edgeType === 'CRYSTAL_BRIDGE' && (
                <div>
                  <label className="block text-cyan-400 font-mono mb-1">CRYSTAL BRIDGE SUBSTRATE</label>
                  <input
                    type="text"
                    value={edgeSubstrate}
                    onChange={e => setEdgeSubstrate(e.target.value)}
                    placeholder="e.g. Cryogenics Rail, Plasma Digital Twins, HTS Tapes"
                    className="w-full p-2 bg-zinc-950 border border-cyan-800 rounded text-zinc-200 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-zinc-400 font-mono mb-1">DEPENDENCY DESCRIPTION</label>
                <textarea
                  value={edgeDesc}
                  onChange={e => setEdgeDesc(e.target.value)}
                  rows={2}
                  placeholder="State the verifiable engineering or operational dependency relationship..."
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-mono mb-1">
                  AETHER EVIDENCE ID (Octagon Provenance Binding Requirement)
                </label>
                <select
                  value={edgeEvidenceId}
                  onChange={e => setEdgeEvidenceId(e.target.value)}
                  className="w-full p-2 bg-zinc-950 border border-emerald-700/80 rounded text-zinc-200 focus:outline-none"
                  required
                >
                  <option value="">Select authenticated filing/paper in Aether...</option>
                  {evidences.filter(ev => !ev.isDisputed).map(ev => (
                    <option key={ev.id} value={ev.id}>
                      [{ev.id}] {ev.documentTitle} ({ev.filingReference})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  OCTAGON FAILS-CLOSED GUARD: No edge may exist in consensus without a verifiable primary document.
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddEdgeModalOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs"
                >
                  Audit & Commit Edge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
