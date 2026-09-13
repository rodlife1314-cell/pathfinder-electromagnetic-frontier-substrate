export type SectorUniverse = 'quantum' | 'fusion' | 'ai_infra' | 'semiconductors';

export type NodeType = 
  | 'ENABLER' 
  | 'SYSTEM_INTEGRATOR' 
  | 'FABRICATION' 
  | 'MATERIAL_SUPPLIER' 
  | 'RESEARCH_LAB' 
  | 'SPECIALTY_TOOLING';

export type NodeStatus = 'ACTIVE' | 'ISOLATED_BACKLOG' | 'PENDING_AUDIT';

export type ClaimType = 'OBSERVATION' | 'INFERENCE';

export type TransactionGate = 
  | 'RUMOURED' 
  | 'ANNOUNCED' 
  | 'FILED' 
  | 'APPROVED' 
  | 'CLOSED' 
  | 'TRADING_LIVE';

export interface RAPIDSScores {
  cashFlow: number;              // CF (0-100)
  ecosystemPosition: number;     // EP (0-100)
  capitalIntensity: number;      // CI (0-100)
  governmentContracts: number;   // GC (0-100)
  aiIntegration: number;         // AI (0-100)
  supplyChainImportance: number; // SC (0-100)
  scientificLeadership: number;  // SL (0-100)
  compositeScore: number;        // Weighted index (0-100)
  compositeDecile: number;       // Decile 1 - 10
}

export interface CentralityMetrics {
  pageRank: number;              // Recursive influence (0.0 - 1.0)
  betweennessCentrality: number; // Bottleneck vulnerability (0.0 - 1.0)
  degreeCentrality: number;      // Total direct verified connections
  inDegree: number;              // Downstream dependants
  outDegree: number;             // Upstream requirements
}

export interface EvidenceBinding {
  id: string;
  sourceId: string;
  sourceType: 'SEC_FILING' | 'REGULATORY_REGISTER' | 'PEER_REVIEWED_PAPER' | 'TECHNICAL_AUDIT_LOG' | 'CONTRACT_RECORD';
  documentTitle: string;
  filingReference: string;
  exactQuote: string;
  publicationDate: string;
  confidenceScore: number; // 0.0 to 1.0
  verifiedBy: 'Jemma' | 'Hermes' | 'Operator';
  hashDigest: string;
  isDisputed: boolean;
}

export interface NodeClaim {
  id: string;
  statement: string;
  type: ClaimType;
  evidenceIds: string[];
  approvedByOperator: boolean;
  notes?: string;
}

export interface SubstrateNode {
  id: string;
  label: string;
  universe: SectorUniverse;
  nodeType: NodeType;
  status: NodeStatus;
  ticker?: string;
  corporateEntityName?: string;
  transactionGate?: TransactionGate;
  transactionGateDetails?: {
    lastUpdated: string;
    filingRef: string;
    statusSummary: string;
    purePlayExposure: boolean;
    contingentExposure: boolean;
    checklist: Array<{ label: string; verified: boolean; filingEvidenceId?: string }>;
  };
  rapids: RAPIDSScores;
  centrality: CentralityMetrics;
  claims: NodeClaim[];
  crystalBridgeEligible: boolean;
  crystalBridgeTags?: string[];
  summary: string;
  primaryTechnology: string;
  headquarters: string;
  x?: number;
  y?: number;
}

export type EdgeRelationshipType = 
  | 'CRITICAL_DEPENDENCY' 
  | 'CRYSTAL_BRIDGE' 
  | 'CAPITAL_ALLOCATION' 
  | 'JOINT_DEVELOPMENT' 
  | 'OFFTAKE_CONTRACT';

export interface SubstrateEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: EdgeRelationshipType;
  universeCross: boolean;
  description: string;
  evidenceId: string;
  weight: number; // 1 to 5
  verified: boolean;
  observationType: ClaimType;
  crystalBridgeSubstrate?: string; // e.g. "Cryogenics Interface", "Plasma Digital Twin", "HTS Tape"
}

export interface StopConditionAlert {
  id: string;
  code: 'STP-MISSING-PROVENANCE' | 'STP-MATERIAL-CONFLICT' | 'STP-UNVERIFIED-GATE' | 'STP-UNVERIFIED-EDGE';
  severity: 'CRITICAL' | 'WARNING';
  title: string;
  triggerDescription: string;
  affectedNodeIds: string[];
  affectedEdgeIds?: string[];
  timestamp: string;
  resolved: boolean;
  resolutionAction?: string;
}

export interface GuildAgent {
  name: 'Claudia' | 'Jemma' | 'Delta' | 'Simon' | 'Hermes' | 'Aether' | 'Octagon';
  role: string;
  status: 'IDLE' | 'PROCESSING' | 'ALERT' | 'VERIFIED';
  currentAction: string;
  metrics: {
    processedCount: number;
    auditPassedRatio: string;
  };
}

export interface MissionStep {
  stepId: string;
  agent: string;
  action: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  findings?: string;
  executionTimestamp?: string;
}

export interface MissionDirective {
  id: string;
  operatorPrompt: string;
  timestamp: string;
  status: 'ROUTING' | 'EXECUTING' | 'WAITING_OPERATOR' | 'COMPLETED' | 'REJECTED';
  decomposedBy: string;
  steps: MissionStep[];
  approvedByOperator: boolean;
  operatorNotes?: string;
  synthesisReport?: string;
}

export interface SystemVersioning {
  architectureVersion: string; // e.g. "v1.2.0"
  runtimeVersion: string;      // e.g. "v2.4.1"
  datasetUniverseVersion: string; // e.g. "v0.4.0"
  activeMissionScope: string;  // e.g. "Quantum & Fusion Substrates v0.2.4"
  graphSnapshotEpoch: string;  // e.g. "Epoch-2026-07-13"
  consensusHash: string;
}
