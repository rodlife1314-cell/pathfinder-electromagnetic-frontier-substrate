'use client';

import React from 'react';
import { StopConditionAlert, GuildAgent } from '../lib/types';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle, Lock, RefreshCw, XCircle, Terminal } from 'lucide-react';

interface OctagonGovernanceViewProps {
  alerts: StopConditionAlert[];
  agents: GuildAgent[];
  onResolveAlert: (alertId: string) => void;
  onTriggerAuditSweep: () => void;
}

export const OctagonGovernanceView: React.FC<OctagonGovernanceViewProps> = ({
  alerts,
  agents,
  onResolveAlert,
  onTriggerAuditSweep
}) => {
  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const octagonAgent = agents.find(a => a.name === 'Octagon');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 border border-red-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-400 font-mono text-xs mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">FAILS-CLOSED GOVERNANCE LAYER</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            OCTAGON Sentinel: Safety, Custody & Stop Conditions
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Octagon enforces strict cryptographic custody and fails-closed gatekeeping over the evidence architecture. 
            If any claim lacks verifiable primary evidence, if transaction state gates are unverified, or if sources conflict, 
            operations halt instantly until sovereign Operator adjudication.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onTriggerAuditSweep}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-mono flex items-center space-x-2 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Integrity Sweep</span>
          </button>
        </div>
      </div>

      {/* 4 Core Stop Conditions Doctrine Rulebox */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px]">RULE 01</span>
            <Lock className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="font-bold text-zinc-200">PROVENANCE BINDING</div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Claim lacks complete source_id + evidence_id bindings in Aether.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px]">RULE 02</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-bold text-zinc-200">MATERIAL CONFLICT</div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Primary sources conflict on material operational facts or filing status.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px]">RULE 03</span>
            <XCircle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="font-bold text-zinc-200">TRANSACTION STATE GATE</div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Corporate action promoted to TRADING_LIVE without 8-K / closing filing.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px]">RULE 04</span>
            <Lock className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="font-bold text-zinc-200">UNVERIFIED EDGE</div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Graph relationship modeled as verified without direct citation.
          </p>
        </div>
      </div>

      {/* Active Unresolved Stop Conditions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h3 className="font-bold text-sm text-zinc-200 font-mono flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>ACTIVE STOP CONDITIONS ({unresolvedAlerts.length})</span>
          </h3>
          <span className="text-xs font-mono text-zinc-500">Fails-Closed Enforcement Active</span>
        </div>

        {unresolvedAlerts.length === 0 ? (
          <div className="p-8 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-200">Zero Active Stop Conditions</h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              All active nodes, edges, and claims pass cryptographic provenance bindings and transaction state gate validation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {unresolvedAlerts.map(alert => (
              <div 
                key={alert.id}
                className="p-4 rounded-xl bg-red-950/30 border border-red-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-red-900 text-red-100 font-mono font-bold text-[10px]">
                      {alert.code}
                    </span>
                    <span className="font-bold text-zinc-100 font-mono">{alert.title}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-[11px] max-w-2xl">{alert.triggerDescription}</p>
                  <p className="text-amber-400 font-mono text-[10px] mt-1">
                    Remedy: {alert.resolutionAction}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500">{alert.timestamp}</span>
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs transition-colors"
                  >
                    Operator Sign-off (Resolve)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <h4 className="text-xs font-mono text-zinc-400 uppercase">
            Resolved Stop Conditions History ({resolvedAlerts.length})
          </h4>
          <div className="space-y-2">
            {resolvedAlerts.map(alert => (
              <div key={alert.id} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 text-xs flex items-center justify-between opacity-70">
                <div>
                  <span className="text-zinc-400 font-mono font-bold mr-2">{alert.code}: {alert.title}</span>
                  <span className="text-emerald-400 text-[11px] font-mono">RESOLVED BY OPERATOR</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{alert.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
