'use client';

import React, { useState } from 'react';
import { GuildAgent, MissionDirective, SubstrateNode } from '../lib/types';
import { Terminal, Send, CheckCircle, Clock, ShieldAlert, Cpu, Bot, ArrowRight, UserCheck } from 'lucide-react';

interface GuildConsoleViewProps {
  agents: GuildAgent[];
  activeMission: MissionDirective;
  onExecuteDirective: (directivePrompt: string) => Promise<void>;
  onApproveMission: (missionId: string) => void;
  isProcessing: boolean;
}

export const GuildConsoleView: React.FC<GuildConsoleViewProps> = ({
  agents,
  activeMission,
  onExecuteDirective,
  onApproveMission,
  isProcessing
}) => {
  const [promptInput, setPromptInput] = useState('');

  const quickDirectives = [
    'Audit HTS REBCO tape supply chain bottlenecks between fusion magnets and quantum interconnects.',
    'Verify corporate transaction gate progression for GFUZ versus DJT with SEC EDGAR filings.',
    'Traverse sub-Kelvin helium-3 cryocooler rails from BlueFors to modular transmon testbeds.',
    'Perform provenance sweep on Isolated-Node Backlog entities.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isProcessing) return;
    onExecuteDirective(promptInput);
    setPromptInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
            <Terminal className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">COMMAND & ORCHESTRATION LAYER</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Operator Console & The Pathfinder Agent Guild
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Pathfinder is <strong>not a chatbot</strong> or autonomous executor. It coordinates specialized single-purpose roles 
            (Claudia, Jemma, Hermes, Delta, Simon, Octagon) while keeping final decision-making authority strictly with the <strong>Operator</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-300">Operator Sovereign Authority: <strong className="text-emerald-400">ENFORCED</strong></span>
        </div>
      </div>

      {/* Operator Directive Input Box */}
      <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-3">
        <label className="block text-xs font-mono text-zinc-300 font-semibold uppercase">
          Issue Sovereign Mission Directive to Claudia
        </label>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Terminal className="w-4 h-4 text-cyan-500 absolute left-3 top-3" />
            <input
              type="text"
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              placeholder="e.g. Audit cryogenic rails from sub-Kelvin quantum dilution to tokamak magnet cooling..."
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-700/80 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
              disabled={isProcessing}
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing || !promptInput.trim()}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold text-xs font-mono rounded-lg transition-colors flex items-center space-x-1.5 shrink-0"
          >
            {isProcessing ? (
              <span>Orchestrating...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Directive</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Directives */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-[10px] font-mono text-zinc-500">QUICK DIRECTIVES:</span>
          {quickDirectives.map((d, i) => (
            <button
              key={i}
              onClick={() => onExecuteDirective(d)}
              disabled={isProcessing}
              className="text-[11px] font-mono text-zinc-400 hover:text-cyan-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              {d.length > 55 ? `${d.slice(0, 52)}...` : d}
            </button>
          ))}
        </div>
      </div>

      {/* Active Mission Pipeline Breakdown */}
      {activeMission && (
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  MISSION {activeMission.id}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  activeMission.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  activeMission.status === 'EXECUTING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse' :
                  'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {activeMission.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mt-1 font-mono">
                &ldquo;{activeMission.operatorPrompt}&rdquo;
              </h3>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-zinc-500">Decomposed by: <strong className="text-cyan-400">{activeMission.decomposedBy}</strong></span>
              {!activeMission.approvedByOperator ? (
                <button
                  onClick={() => onApproveMission(activeMission.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition-colors"
                >
                  Approve Findings
                </button>
              ) : (
                <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                  OPERATOR APPROVED
                </span>
              )}
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Claudia Task Pipeline & Guild Traversal Steps ({activeMission.steps.length})
            </h4>
            <div className="space-y-2">
              {activeMission.steps.map((step, idx) => (
                <div 
                  key={step.stepId}
                  className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-2"
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-cyan-400">{step.agent}</strong>
                        <span className="text-zinc-500">|</span>
                        <span className="text-zinc-300">{step.action}</span>
                      </div>
                      {step.findings && (
                        <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                          ↳ Findings: <span className="text-emerald-300 font-mono">{step.findings}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                    <span className="text-[10px] text-zinc-500">{step.executionTimestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      step.status === 'COMPLETED' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800' :
                      step.status === 'IN_PROGRESS' ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800 animate-pulse' :
                      'text-zinc-500'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Synthesis Report */}
          {activeMission.synthesisReport && (
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 mt-3 text-xs leading-relaxed">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                SYNTHESIS & EVIDENCE PROJECTION
              </span>
              <p className="text-zinc-300 font-serif text-xs leading-relaxed">
                {activeMission.synthesisReport}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Guild Agents Operational Grid */}
      <div>
        <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          The Pathfinder Agent Guild Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {agents.map(agent => (
            <div key={agent.name} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-zinc-200">{agent.name}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  agent.status === 'PROCESSING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse' :
                  agent.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  agent.status === 'ALERT' ? 'bg-red-950 text-red-300 border border-red-800' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">{agent.role}</p>
              
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 truncate">
                {agent.currentAction}
              </div>

              <div className="flex justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/80">
                <span>Processed: {agent.metrics.processedCount}</span>
                <span className="text-emerald-400">{agent.metrics.auditPassedRatio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
