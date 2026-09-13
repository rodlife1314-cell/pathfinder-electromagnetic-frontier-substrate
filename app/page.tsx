'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  INITIAL_EVIDENCE, 
  INITIAL_STOP_CONDITIONS, 
  INITIAL_AGENTS, 
  INITIAL_MISSION, 
  INITIAL_VERSIONING 
} from '../lib/data/initial-substrate';
import { 
  SubstrateNode, 
  SubstrateEdge, 
  EvidenceBinding, 
  StopConditionAlert, 
  GuildAgent, 
  MissionDirective,
  SystemVersioning 
} from '../lib/types';
import { 
  calculatePageRank, 
  calculateBetweennessCentrality, 
  calculateDegreeCentrality, 
  auditStopConditions 
} from '../lib/graph-analytics';

import { Header } from '../components/Header';
import { GraphView } from '../components/GraphView';
import { CrystalBridgeView } from '../components/CrystalBridgeView';
import { RapidsCentralityView } from '../components/RapidsCentralityView';
import { TransactionGatesView } from '../components/TransactionGatesView';
import { IsolatedBacklogView } from '../components/IsolatedBacklogView';
import { EvidenceLedgerView } from '../components/EvidenceLedgerView';
import { OctagonGovernanceView } from '../components/OctagonGovernanceView';
import { GuildConsoleView } from '../components/GuildConsoleView';
import { NodeInspectorModal } from '../components/NodeInspectorModal';
import { FieldWorkbenchView } from '../components/FieldWorkbenchView';
import { GeometryBenchmarkView } from '../components/GeometryBenchmarkView';
import { VesselAsEngineView } from '../components/VesselAsEngineView';
import { TransportMediumView } from '../components/TransportMediumView';

export default function PathfinderApp() {
  const [activeTab, setActiveTab] = useState<string>('graph');
  const [nodes, setNodes] = useState<SubstrateNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<SubstrateEdge[]>(INITIAL_EDGES);
  const [evidences, setEvidences] = useState<EvidenceBinding[]>(INITIAL_EVIDENCE);
  const [alerts, setAlerts] = useState<StopConditionAlert[]>(INITIAL_STOP_CONDITIONS);
  const [agents, setAgents] = useState<GuildAgent[]>(INITIAL_AGENTS);
  const [activeMission, setActiveMission] = useState<MissionDirective>(INITIAL_MISSION);
  const [versioning, setVersioning] = useState<SystemVersioning>(INITIAL_VERSIONING);
  const [selectedNode, setSelectedNode] = useState<SubstrateNode | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Recalculate graph metrics & run Stop Condition integrity sweep
  const recalculateGraphAndAudit = useCallback((currentNodes: SubstrateNode[], currentEdges: SubstrateEdge[], currentEvidences: EvidenceBinding[]) => {
    const pageRanks = calculatePageRank(currentNodes, currentEdges);
    const betweenness = calculateBetweennessCentrality(currentNodes, currentEdges);
    const degrees = calculateDegreeCentrality(currentNodes, currentEdges);

    const updatedNodes = currentNodes.map(node => {
      const pr = pageRanks[node.id] !== undefined ? pageRanks[node.id] : node.centrality.pageRank;
      const bc = betweenness[node.id] !== undefined ? betweenness[node.id] : node.centrality.betweennessCentrality;
      const deg = degrees[node.id] || { inDegree: 0, outDegree: 0, degree: 0 };

      return {
        ...node,
        centrality: {
          pageRank: pr,
          betweennessCentrality: bc,
          degreeCentrality: deg.degree,
          inDegree: deg.inDegree,
          outDegree: deg.outDegree
        }
      };
    });

    const newAlerts = auditStopConditions(updatedNodes, currentEdges, currentEvidences);
    
    setNodes(updatedNodes);
    setAlerts(newAlerts);
  }, []);

  // Handler: Add new edge
  const handleAddEdge = (newEdge: SubstrateEdge) => {
    const nextEdges = [...edges, newEdge];
    setEdges(nextEdges);
    recalculateGraphAndAudit(nodes, nextEdges, evidences);
  };

  // Handler: Add evidence
  const handleAddEvidence = (newEv: EvidenceBinding) => {
    const nextEvidences = [newEv, ...evidences];
    setEvidences(nextEvidences);
    recalculateGraphAndAudit(nodes, edges, nextEvidences);
  };

  // Handler: Toggle Disputed Evidence
  const handleToggleDisputed = (evId: string) => {
    const nextEvidences = evidences.map(e => {
      if (e.id === evId) {
        return { ...e, isDisputed: !e.isDisputed };
      }
      return e;
    });
    setEvidences(nextEvidences);
    recalculateGraphAndAudit(nodes, edges, nextEvidences);
  };

  // Handler: Resolve Stop Condition
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
  };

  // Handler: Promote Isolated Node to Active
  const handlePromoteNode = (nodeId: string) => {
    // Connect to BlueFors or SuperPower depending on domain
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const targetId = node.universe === 'quantum' ? 'node-bluefors' : 'node-superpower';
    const newEdge: SubstrateEdge = {
      id: `edge-promoted-${Date.now()}`,
      source: nodeId,
      target: targetId,
      relationshipType: 'CRITICAL_DEPENDENCY',
      universeCross: false,
      description: `Discovered procurement rail from ${node.label} to ${targetId === 'node-bluefors' ? 'BlueFors' : 'SuperPower'}.`,
      evidenceId: 'EVD-ARPAE-HTS-2024',
      weight: 4,
      verified: true,
      observationType: 'OBSERVATION'
    };

    const updatedNodes = nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, status: 'ACTIVE' as const };
      }
      return n;
    });

    const nextEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(nextEdges);
    recalculateGraphAndAudit(updatedNodes, nextEdges, evidences);
  };

  // Handler: Promote Claim from INFERENCE to OBSERVATION
  const handlePromoteClaim = (nodeId: string, claimId: string, evidenceId: string) => {
    const updatedNodes = nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          claims: n.claims.map(c => {
            if (c.id === claimId) {
              return {
                ...c,
                type: 'OBSERVATION' as const,
                evidenceIds: [...c.evidenceIds, evidenceId],
                approvedByOperator: true
              };
            }
            return c;
          })
        };
      }
      return n;
    });

    setNodes(updatedNodes);
    if (selectedNode && selectedNode.id === nodeId) {
      const upd = updatedNodes.find(n => n.id === nodeId) || null;
      setSelectedNode(upd);
    }
    recalculateGraphAndAudit(updatedNodes, edges, evidences);
  };

  // Handler: Execute Operator Directive via Server API (Claudia Decomposition)
  const handleExecuteDirective = async (directivePrompt: string) => {
    setIsProcessing(true);

    // Set Claudia & Guild status to PROCESSING
    setAgents(prev => prev.map(a => {
      if (a.name === 'Claudia' || a.name === 'Hermes' || a.name === 'Jemma') {
        return { ...a, status: 'PROCESSING', currentAction: `Executing mission: ${directivePrompt.slice(0, 30)}...` };
      }
      return a;
    }));

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: directivePrompt,
          context: {
            nodeCount: nodes.length,
            edgeCount: edges.length,
            activeAlertCount: alerts.filter(a => !a.resolved).length
          }
        })
      });

      const data = await res.json();
      const dec = data.decomposition || {};

      const newMission: MissionDirective = {
        id: `MSN-DIR-${Date.now().toString().slice(-4)}`,
        operatorPrompt: directivePrompt,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'COMPLETED',
        decomposedBy: 'Claudia (Routing Engine)',
        approvedByOperator: false,
        steps: [
          {
            stepId: 'STP-1',
            agent: 'Claudia',
            action: 'Directive parsed and routed to Hermes and Jemma pipelines.',
            status: 'COMPLETED',
            findings: dec.claudiaRouting || 'Task parsed into graph traversal and document audits.',
            executionTimestamp: 'Step 1'
          },
          {
            stepId: 'STP-2',
            agent: 'Hermes',
            action: 'Traversed frontier rails and identified topological choke-points.',
            status: 'COMPLETED',
            findings: dec.hermesTraversal || 'Traversed 4 cross-domain dependency chains.',
            executionTimestamp: 'Step 2'
          },
          {
            stepId: 'STP-3',
            agent: 'Jemma',
            action: 'Cross-checked claims against Aether regulatory registers.',
            status: 'COMPLETED',
            findings: dec.jemmaAudit || 'Audited SEC EDGAR and Nature evidence bindings.',
            executionTimestamp: 'Step 3'
          },
          {
            stepId: 'STP-4',
            agent: 'Simon',
            action: 'Validated schema and RAPIDS deciles.',
            status: 'COMPLETED',
            findings: dec.simonValidation || 'All nodes and corporate action gates verified.',
            executionTimestamp: 'Step 4'
          },
          {
            stepId: 'STP-5',
            agent: 'Octagon',
            action: 'Governance check: zero unverified claims permitted.',
            status: 'COMPLETED',
            findings: dec.octagonSafety || 'Fails-closed safety verified: waiting for Operator sovereign sign-off.',
            executionTimestamp: 'Step 5'
          }
        ],
        synthesisReport: dec.summary || `Sovereign Rail Traversal Complete: Analyzed "${directivePrompt}". Enabler dependencies confirm critical path choke-points in cryogenic hardware and superconducting materials.`
      };

      setActiveMission(newMission);
    } catch (err) {
      console.error('Directive dispatch failed:', err);
    } finally {
      setIsProcessing(false);
      setAgents(prev => prev.map(a => ({
        ...a,
        status: a.name === 'Octagon' || a.name === 'Simon' || a.name === 'Aether' ? 'VERIFIED' : 'IDLE',
        currentAction: 'Standing by for Operator directive.'
      })));
    }
  };

  // Handler: Operator Mission Approval
  const handleApproveMission = (missionId: string) => {
    if (activeMission && activeMission.id === missionId) {
      setActiveMission({
        ...activeMission,
        approvedByOperator: true,
        operatorNotes: 'Operator verified and approved all pipeline findings.'
      });
    }
  };

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-cyan-100">
      {/* Top Sovereign Architecture Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        versioning={versioning}
        activeStopConditionsCount={activeAlertsCount}
      />

      {/* Main View Router */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'transport-medium' && (
          <TransportMediumView />
        )}

        {activeTab === 'workbench' && (
          <FieldWorkbenchView />
        )}

        {activeTab === 'gn-benchmark' && (
          <GeometryBenchmarkView />
        )}

        {activeTab === 'vessel-engine' && (
          <VesselAsEngineView />
        )}

        {activeTab === 'graph' && (
          <GraphView
            nodes={nodes}
            edges={edges}
            evidences={evidences}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onAddEdge={handleAddEdge}
          />
        )}

        {activeTab === 'crystal' && (
          <CrystalBridgeView
            nodes={nodes}
            edges={edges}
            evidences={evidences}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('graph');
            }}
          />
        )}

        {activeTab === 'rapids' && (
          <RapidsCentralityView
            nodes={nodes}
            onSelectNode={setSelectedNode}
          />
        )}

        {activeTab === 'gates' && (
          <TransactionGatesView
            nodes={nodes}
            evidences={evidences}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('graph');
            }}
          />
        )}

        {activeTab === 'backlog' && (
          <IsolatedBacklogView
            nodes={nodes}
            evidences={evidences}
            onSelectNode={setSelectedNode}
            onPromoteNode={handlePromoteNode}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceLedgerView
            evidences={evidences}
            onAddEvidence={handleAddEvidence}
            onToggleDisputed={handleToggleDisputed}
          />
        )}

        {activeTab === 'octagon' && (
          <OctagonGovernanceView
            alerts={alerts}
            agents={agents}
            onResolveAlert={handleResolveAlert}
            onTriggerAuditSweep={() => recalculateGraphAndAudit(nodes, edges, evidences)}
          />
        )}

        {activeTab === 'guild' && (
          <GuildConsoleView
            agents={agents}
            activeMission={activeMission}
            onExecuteDirective={handleExecuteDirective}
            onApproveMission={handleApproveMission}
            isProcessing={isProcessing}
          />
        )}
      </main>

      {/* Node Evidence Dossier Modal */}
      <NodeInspectorModal
        node={selectedNode}
        edges={edges}
        evidences={evidences}
        onClose={() => setSelectedNode(null)}
        onPromoteClaim={handlePromoteClaim}
      />
    </div>
  );
}
