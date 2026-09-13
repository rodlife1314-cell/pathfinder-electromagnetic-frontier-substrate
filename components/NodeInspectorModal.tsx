'use client';

import React, { useState } from 'react';
import { SubstrateNode, SubstrateEdge, EvidenceBinding, ClaimType } from '../lib/types';
import { X, ShieldCheck, FileText, CheckCircle, ArrowRight, Share2, AlertTriangle, Hash, ExternalLink } from 'lucide-react';

interface NodeInspectorModalProps {
  node: SubstrateNode | null;
  edges: SubstrateEdge[];
  evidences: EvidenceBinding[];
  onClose: () => void;
  onPromoteClaim: (nodeId: string, claimId: string, evidenceId: string) => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  edges,
  evidences,
  onClose,
  onPromoteClaim
}) => {
  const [selectedClaimToPromote, setSelectedClaimToPromote] = useState<string | null>(null);
  const [selectedEvidenceForPromotion, setSelectedEvidenceForPromotion] = useState<string>('');
  const [promotionError, setPromotionError] = useState<string>('');

  if (!node) return null;

  const evidenceMap = new Map<string, EvidenceBinding>();
  evidences.forEach(e => evidenceMap.set(e.id, e));

  // Find incoming and outgoing edges for this node
  const inboundEdges = edges.filter(e => e.target === node.id);
  const outboundEdges = edges.filter(e => e.source === node.id);

  const handlePromote = (claimId: string) => {
    if (!selectedEvidenceForPromotion) {
      setPromotionError('OCTAGON FAILS-CLOSED GUARD: You must bind an audited primary source to promote an INFERENCE to an OBSERVATION.');
      return;
    }
    onPromoteClaim(node.id, claimId, selectedEvidenceForPromotion);
    setSelectedClaimToPromote(null);
    setSelectedEvidenceForPromotion('');
    setPromotionError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-zinc-100 shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
              {node.universe} • {node.nodeType}
            </span>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
              <span>{node.label}</span>
              {node.ticker && <span className="text-xs font-mono text-cyan-400 font-semibold">${node.ticker}</span>}
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors font-mono"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {/* Summary & Core Tech */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <h3 className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-1">
              PRIMARY HARDWARE SUBSTRATE & SPECIFICATION
            </h3>
            <p className="text-sm font-semibold text-zinc-200">{node.primaryTechnology}</p>
            <p className="mt-2 text-zinc-300 leading-relaxed text-xs">{node.summary}</p>
            <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-zinc-500">
              <span>HQ: <strong className="text-zinc-300">{node.headquarters}</strong></span>
              <span>ENTITY: <strong className="text-zinc-300">{node.corporateEntityName || node.label}</strong></span>
              <span>STATUS: <strong className="text-zinc-300">{node.status}</strong></span>
            </div>
          </div>

          {/* Transaction Gate Checklist (If applicable) */}
          {node.transactionGate && node.transactionGateDetails && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                <span className="font-mono text-xs font-bold text-zinc-200 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>TRANSACTION-STATE GATE: {node.transactionGate}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Ref: {node.transactionGateDetails.filingRef}
                </span>
              </div>
              <p className="text-zinc-300 mb-3 text-xs leading-relaxed">
                {node.transactionGateDetails.statusSummary}
              </p>

              <div className="space-y-1.5 font-mono text-xs">
                {node.transactionGateDetails.checklist.map((item, i) => (
                  <div key={i} className="p-2 rounded bg-zinc-900 border border-zinc-800/60 flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className={item.verified ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                      {item.verified ? '✓ VERIFIED' : '— PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RAPIDS 7-Pillar & Centrality Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RAPIDS Decile Radar */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-amber-400">RAPIDS SCORECARD</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  DECILE {node.rapids.compositeDecile} ({node.rapids.compositeScore.toFixed(1)}/100)
                </span>
              </div>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-zinc-300">
                  <span>Cash Flow (CF):</span>
                  <span>{node.rapids.cashFlow}/100</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Ecosystem Position (EP):</span>
                  <span>{node.rapids.ecosystemPosition}/100</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Capital Intensity (CI):</span>
                  <span>{node.rapids.capitalIntensity}/100</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Gov Contracts (GC):</span>
                  <span>{node.rapids.governmentContracts}/100</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>AI Integration (AI):</span>
                  <span>{node.rapids.aiIntegration}/100</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Supply Chain Importance (SC):</span>
                  <span className="font-bold text-cyan-400">{node.rapids.supplyChainImportance}/100</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Scientific Leadership (SL):</span>
                  <span>{node.rapids.scientificLeadership}/100</span>
                </div>
              </div>
            </div>

            {/* Centrality Choke-Point Analysis */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-cyan-400">CENTRALITY INDEX</span>
                <span className="text-[10px] font-mono text-zinc-500">HERMES GRAPH ENGINE</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>PageRank (Recursive Authority):</span>
                    <span className="text-cyan-300 font-bold">{node.centrality.pageRank.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${node.centrality.pageRank * 100}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800/80">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Betweenness Centrality (Bottleneck):</span>
                    <span className="text-amber-300 font-bold">{node.centrality.betweennessCentrality.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${node.centrality.betweennessCentrality * 100}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block">TOTAL EDGES</span>
                    <span className="text-zinc-200 font-bold text-sm">{node.centrality.degreeCentrality}</span>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block">INBOUND</span>
                    <span className="text-zinc-200 font-bold text-sm">{node.centrality.inDegree}</span>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block">OUTBOUND</span>
                    <span className="text-zinc-200 font-bold text-sm">{node.centrality.outDegree}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claims, Observation vs Inference Taxonomy */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <span className="font-mono text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Audited Claims & Provenance ({node.claims.length})
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                Observation vs Inference Taxonomy
              </span>
            </div>

            {promotionError && (
              <div className="mb-3 p-2.5 rounded bg-red-950/70 border border-red-800 text-red-300 text-xs font-mono">
                {promotionError}
              </div>
            )}

            <div className="space-y-3">
              {node.claims.map(claim => {
                const boundEvidence = claim.evidenceIds.map(id => evidenceMap.get(id)).filter(Boolean);

                return (
                  <div 
                    key={claim.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        claim.type === 'OBSERVATION'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        [{claim.type}]
                      </span>

                      {claim.approvedByOperator ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>OPERATOR APPROVED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400">
                          AWAITING OPERATOR SIGN-OFF
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-200 leading-relaxed font-sans">{claim.statement}</p>

                    {/* Bound Citations */}
                    {boundEvidence.length > 0 ? (
                      <div className="pt-2 border-t border-zinc-900 space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block">BOUND CITATIONS:</span>
                        {boundEvidence.map(ev => (
                          <div key={ev!.id} className="text-[11px] font-mono text-cyan-400 bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
                            <strong>{ev!.documentTitle}</strong> ({ev!.filingReference})
                            <p className="text-zinc-400 font-serif italic text-[11px] mt-0.5">“{ev!.exactQuote}”</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-red-400 pt-1">
                        ⚠ Warning: Zero authenticated citations bound. Classified as unverified claim.
                      </div>
                    )}

                    {/* Promotion Action if INFERENCE */}
                    {claim.type === 'INFERENCE' && (
                      <div className="pt-2 border-t border-zinc-900">
                        {selectedClaimToPromote === claim.id ? (
                          <div className="space-y-2 p-2.5 bg-zinc-900 rounded-lg border border-zinc-700">
                            <span className="text-[10px] font-mono text-zinc-300 block font-bold">
                              ATTACH AUDITED CITATION TO PROMOTE TO OBSERVATION:
                            </span>
                            <select
                              value={selectedEvidenceForPromotion}
                              onChange={e => setSelectedEvidenceForPromotion(e.target.value)}
                              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 font-mono text-xs focus:outline-none"
                            >
                              <option value="">Select authenticated filing in Aether...</option>
                              {evidences.filter(e => !e.isDisputed).map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.documentTitle} ({ev.id})</option>
                              ))}
                            </select>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setSelectedClaimToPromote(null)}
                                className="px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded text-[10px] font-mono"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handlePromote(claim.id)}
                                className="px-3 py-1 bg-emerald-600 text-white font-bold rounded text-[10px] font-mono"
                              >
                                Confirm Promotion
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedClaimToPromote(claim.id)}
                            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                          >
                            Promote to OBSERVATION (Attach Citation) →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Rails (Inbound & Outbound) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="font-mono text-[11px] text-zinc-400 uppercase font-semibold block mb-2">
                UPSTREAM REQUIREMENTS ({inboundEdges.length})
              </span>
              {inboundEdges.length === 0 ? (
                <span className="text-zinc-600 font-mono text-[11px]">No upstream dependency edges mapped.</span>
              ) : (
                <div className="space-y-2 font-mono text-[11px]">
                  {inboundEdges.map(e => (
                    <div key={e.id} className="p-2 rounded bg-zinc-900 border border-zinc-800/80">
                      <div className="text-cyan-300 font-bold">{e.source}</div>
                      <div className="text-zinc-400 font-sans mt-0.5">{e.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="font-mono text-[11px] text-zinc-400 uppercase font-semibold block mb-2">
                DOWNSTREAM RECIPIENTS ({outboundEdges.length})
              </span>
              {outboundEdges.length === 0 ? (
                <span className="text-zinc-600 font-mono text-[11px]">No downstream dependant edges mapped.</span>
              ) : (
                <div className="space-y-2 font-mono text-[11px]">
                  {outboundEdges.map(e => (
                    <div key={e.id} className="p-2 rounded bg-zinc-900 border border-zinc-800/80">
                      <div className="text-amber-300 font-bold">{e.target}</div>
                      <div className="text-zinc-400 font-sans mt-0.5">{e.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">AETHER IMMUTABLE AUDIT COMPLIANT</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-lg transition-colors font-sans"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
