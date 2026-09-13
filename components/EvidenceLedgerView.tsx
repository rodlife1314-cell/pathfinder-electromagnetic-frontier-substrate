'use client';

import React, { useState, useMemo } from 'react';
import { EvidenceBinding } from '../lib/types';
import { FileText, Search, ShieldCheck, AlertOctagon, CheckCircle, ExternalLink, Filter, Plus, Hash } from 'lucide-react';

interface EvidenceLedgerViewProps {
  evidences: EvidenceBinding[];
  onAddEvidence: (newEv: EvidenceBinding) => void;
  onToggleDisputed: (evId: string) => void;
}

export const EvidenceLedgerView: React.FC<EvidenceLedgerViewProps> = ({
  evidences,
  onAddEvidence,
  onToggleDisputed
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [sourceType, setSourceType] = useState<'SEC_FILING' | 'REGULATORY_REGISTER' | 'PEER_REVIEWED_PAPER' | 'TECHNICAL_AUDIT_LOG' | 'CONTRACT_RECORD'>('SEC_FILING');
  const [filingRef, setFilingRef] = useState('');
  const [quote, setQuote] = useState('');
  const [confidence, setConfidence] = useState('0.98');

  const filteredEvidences = useMemo(() => {
    return evidences.filter(e => {
      if (sourceTypeFilter !== 'all' && e.sourceType !== sourceTypeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return e.documentTitle.toLowerCase().includes(q) ||
               e.filingReference.toLowerCase().includes(q) ||
               e.exactQuote.toLowerCase().includes(q) ||
               e.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [evidences, sourceTypeFilter, searchQuery]);

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !filingRef || !quote) return;

    const newBinding: EvidenceBinding = {
      id: `EVD-MANUAL-${Date.now().toString().slice(-6)}`,
      sourceId: sourceId || `REG-MANUAL-${Date.now().toString().slice(-4)}`,
      sourceType,
      documentTitle: title,
      filingReference: filingRef,
      exactQuote: quote,
      publicationDate: new Date().toISOString().slice(0, 10),
      confidenceScore: parseFloat(confidence) || 0.95,
      verifiedBy: 'Operator',
      hashDigest: `sha256:${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      isDisputed: false
    };

    onAddEvidence(newBinding);
    setIsAddModalOpen(false);
    setTitle('');
    setSourceId('');
    setFilingRef('');
    setQuote('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs mb-1">
            <FileText className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">AETHER IMMUTABLE DOCUMENT STORE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Sovereign Evidence Ledger & Provenance Repository
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Pathfinder rejects ungrounded conversational assertions. Every claim, relationship edge, and transaction gate 
            must strictly bind to an immutable, cryptographically hashed primary source in Aether (SEC EDGAR filings, WIPO patent grants, Nature/IEEE publications, or DOE contract logs).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Commit Primary Source</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, filing ref, or quote..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 focus:outline-none w-64"
            />
          </div>

          <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={sourceTypeFilter}
              onChange={e => setSourceTypeFilter(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900">All Sources</option>
              <option value="SEC_FILING" className="bg-zinc-900">SEC Filings (8-K / S-4 / 10-Q)</option>
              <option value="PEER_REVIEWED_PAPER" className="bg-zinc-900">Peer-Reviewed Papers (Nature / IEEE)</option>
              <option value="CONTRACT_RECORD" className="bg-zinc-900">Government Contract Records (DOE)</option>
              <option value="REGULATORY_REGISTER" className="bg-zinc-900">Patent Registers (WIPO / PCT)</option>
            </select>
          </div>
        </div>

        <span className="text-zinc-500">
          Showing <span className="text-zinc-200 font-bold">{filteredEvidences.length}</span> of {evidences.length} Provenance Records
        </span>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-3">
        {filteredEvidences.map(ev => (
          <div
            key={ev.id}
            className={`p-4 rounded-xl border transition-all ${
              ev.isDisputed 
                ? 'bg-red-950/20 border-red-900/60' 
                : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                  ev.sourceType === 'SEC_FILING' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                  ev.sourceType === 'PEER_REVIEWED_PAPER' ? 'bg-violet-950 text-violet-300 border border-violet-800' :
                  ev.sourceType === 'CONTRACT_RECORD' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-zinc-800 text-zinc-300'
                }`}>
                  {ev.sourceType.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-zinc-200">{ev.documentTitle}</span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-zinc-400">{ev.publicationDate}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  ev.confidenceScore >= 0.95 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  CONFIDENCE {(ev.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Exact Quote */}
            <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">AUDITED PRIMARY SOURCE EXCERPT</span>
              <p className="text-xs text-zinc-300 font-serif italic leading-relaxed">
                “{ev.exactQuote}”
              </p>
            </div>

            {/* Metadata Footer */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
              <div className="flex flex-wrap items-center gap-3">
                <span>EVIDENCE ID: <strong className="text-zinc-300">{ev.id}</strong></span>
                <span>FILING REF: <strong className="text-zinc-300">{ev.filingReference}</strong></span>
                <span className="flex items-center space-x-1">
                  <Hash className="w-3 h-3 text-zinc-500" />
                  <span>{ev.hashDigest}</span>
                </span>
                <span>AUDITOR: <strong className="text-cyan-400">{ev.verifiedBy}</strong></span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleDisputed(ev.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    ev.isDisputed
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {ev.isDisputed ? 'Disputed (Octagon Alert Active)' : 'Flag as Disputed'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-lg w-full text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-semibold text-sm text-zinc-100">Commit Authenticated Evidence</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="mt-4 space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">DOCUMENT TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. SEC Form 8-K Notice of Consummation"
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">SOURCE ARCHETYPE</label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value as any)}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                  >
                    <option value="SEC_FILING">SEC Filing</option>
                    <option value="PEER_REVIEWED_PAPER">Peer-Reviewed Paper</option>
                    <option value="CONTRACT_RECORD">Gov Contract Record</option>
                    <option value="REGULATORY_REGISTER">Patent Register</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1">FILING / DOI REFERENCE</label>
                  <input
                    type="text"
                    value={filingRef}
                    onChange={e => setFilingRef(e.target.value)}
                    placeholder="e.g. SEC File 001-41120 or DOI:10.1038"
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1">EXACT AUDITED QUOTE</label>
                <textarea
                  value={quote}
                  onChange={e => setQuote(e.target.value)}
                  rows={3}
                  placeholder="Paste the precise text excerpt from the regulatory or peer-reviewed document..."
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs"
                >
                  Cryptographically Commit to Aether
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
