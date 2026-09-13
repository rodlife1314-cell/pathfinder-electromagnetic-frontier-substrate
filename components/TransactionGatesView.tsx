'use client';

import React, { useState } from 'react';
import { SubstrateNode, TransactionGate, EvidenceBinding } from '../lib/types';
import { Radio, CheckCircle, AlertTriangle, FileText, ArrowRight, ShieldCheck, XCircle, Info, Lock } from 'lucide-react';

interface TransactionGatesViewProps {
  nodes: SubstrateNode[];
  evidences: EvidenceBinding[];
  onSelectNode: (node: SubstrateNode) => void;
}

const GATES: TransactionGate[] = [
  'RUMOURED',
  'ANNOUNCED',
  'FILED',
  'APPROVED',
  'CLOSED',
  'TRADING_LIVE'
];

export const TransactionGatesView: React.FC<TransactionGatesViewProps> = ({
  nodes,
  evidences,
  onSelectNode
}) => {
  const corporateNodes = nodes.filter(n => n.transactionGate !== undefined);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(corporateNodes[0]?.id || 'node-gfuz');
  const [testSimulatedGate, setTestSimulatedGate] = useState<TransactionGate | null>(null);
  const [simulationAlert, setSimulationAlert] = useState<string | null>(null);

  const activeNode = nodes.find(n => n.id === selectedNodeId) || corporateNodes[0];

  const evidenceMap = new Map<string, EvidenceBinding>();
  evidences.forEach(e => evidenceMap.set(e.id, e));

  const currentGate = testSimulatedGate || activeNode?.transactionGate || 'ANNOUNCED';
  const currentGateIndex = GATES.indexOf(currentGate);

  const handleSimulateGateChange = (gate: TransactionGate) => {
    const targetIndex = GATES.indexOf(gate);
    
    // Check if moving to CLOSED or TRADING_LIVE without required filings
    if (activeNode.id === 'node-djt' && targetIndex >= 4) {
      setSimulationAlert('OCTAGON VIOLATION: Cannot promote Trump Media (DJT) to CLOSED or TRADING_LIVE. Missing definitive SEC Form 8-K / closing filing evidence! Exposure remains CONTINGENT & ANNOUNCED.');
      return;
    }

    setSimulationAlert(null);
    setTestSimulatedGate(gate);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs mb-1">
            <Radio className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">CORPORATE ACTION STATE-MACHINE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Transaction-State Gates: Pure-Play vs. Contingent Exposure
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Market narratives often inflate speculative energy transactions before legal execution. 
            Pathfinder enforces a strict 6-gate state machine: no entity can be classified as pure-play frontier exposure 
            until regulatory consummation (Form 8-K / S-4 Effective) is cryptographically bound in Aether.
          </p>
        </div>

        {/* Corporate Entity Selector */}
        <div className="flex items-center space-x-2">
          {corporateNodes.map(node => (
            <button
              key={node.id}
              onClick={() => {
                setSelectedNodeId(node.id);
                setTestSimulatedGate(null);
                setSimulationAlert(null);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all border ${
                selectedNodeId === node.id
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {node.label} [{node.ticker}]
            </button>
          ))}
        </div>
      </div>

      {/* State Machine Stepper Visualizer */}
      <div className="p-6 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-zinc-100 font-mono">
              ACTIVE GATE PIPELINE: {activeNode.label}
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              activeNode.transactionGateDetails?.purePlayExposure 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {activeNode.transactionGateDetails?.purePlayExposure ? 'PURE-PLAY ACTIVE EXPOSURE' : 'CONTINGENT PROSPECTIVE EXPOSURE'}
            </span>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            Filing Ref: <span className="text-zinc-200">{activeNode.transactionGateDetails?.filingRef}</span>
          </span>
        </div>

        {/* The 6 Steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {GATES.map((gate, idx) => {
            const isPassed = idx <= currentGateIndex;
            const isCurrent = idx === currentGateIndex;

            return (
              <div 
                key={gate}
                onClick={() => handleSimulateGateChange(gate)}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer select-none ${
                  isCurrent
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md ring-1 ring-cyan-500/50'
                    : isPassed
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-600'
                }`}
              >
                <div className="text-[10px] font-mono text-zinc-500 mb-1">GATE 0{idx + 1}</div>
                <div className="text-xs font-bold font-mono tracking-wider">{gate}</div>
                <div className="mt-2 flex justify-center">
                  {isPassed ? (
                    <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-emerald-400'}`} />
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Simulation Alert if triggered */}
        {simulationAlert && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{simulationAlert}</span>
          </div>
        )}
      </div>

      {/* Side-by-Side Sovereign Case Study: GFUZ vs DJT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GFUZ Card */}
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>CASE A: GENERAL FUSION (GFUZ)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                TRADING_LIVE [CLOSED]
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              General Fusion completed its definitive SPAC business combination, consummated and filed under SEC Form 8-K. 
              Because legal closing occurred and trading commenced under $GFUZ, Pathfinder classifies this as a verified pure-play operating fusion exposure.
            </p>

            <h4 className="text-[11px] font-mono font-semibold text-zinc-400 uppercase mb-2">
              Regulatory Audit Checklist
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>1. Definitive Merger Agreement Filed</span>
                <span className="text-emerald-400">VERIFIED (SEC 8-K)</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>2. SEC Form S-4 Effective</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>3. Shareholder Vote Approval</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>4. Business Consummation (8-K)</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>5. Public Ticker Active ($GFUZ)</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>DOCTRINE VERDICT: Pure-Play Fusion Enabler</span>
            <button 
              onClick={() => onSelectNode(nodes.find(n => n.id === 'node-gfuz')!)}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              View Node Graph
            </button>
          </div>
        </div>

        {/* DJT Card */}
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <span className="text-xs font-bold text-amber-400 font-mono flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>CASE B: TRUMP MEDIA (DJT)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                ANNOUNCED [CONTINGENT]
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              Prospective or rumoured frontier technology and nuclear/fusion transactions remain in the prospective phase under SEC Form S-4/A. 
              Operationally, the entity remains concentrated in digital media. Pathfinder fails-closed: no fusion capacity or supply-chain links are attributed until legal closing filings appear.
            </p>

            <h4 className="text-[11px] font-mono font-semibold text-zinc-400 uppercase mb-2">
              Regulatory Audit Checklist
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>1. Prospective Agreement Disclosed</span>
                <span className="text-emerald-400">VERIFIED (S-4/A)</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>2. Core Media Revenue Dominance</span>
                <span className="text-amber-400">OBSERVED</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>3. Deep Tech Merger Final Closure</span>
                <span className="text-red-400">UNVERIFIED (HALTED)</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>4. Operational Asset Titling</span>
                <span className="text-red-400">UNVERIFIED</span>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <span>5. Operating Fusion Cashflow Rail</span>
                <span className="text-red-400">ZERO DIRECT EXPOSURE</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>DOCTRINE VERDICT: Prospective Contingent Only</span>
            <button 
              onClick={() => onSelectNode(nodes.find(n => n.id === 'node-djt')!)}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              View Node Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
