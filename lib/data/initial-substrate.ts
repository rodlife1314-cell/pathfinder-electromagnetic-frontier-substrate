import {
  SubstrateNode,
  SubstrateEdge,
  EvidenceBinding,
  StopConditionAlert,
  GuildAgent,
  SystemVersioning,
  MissionDirective
} from '../types';

export const INITIAL_VERSIONING: SystemVersioning = {
  architectureVersion: 'v1.2.0',
  runtimeVersion: 'v2.4.1',
  datasetUniverseVersion: 'v0.4.0',
  activeMissionScope: 'Quantum & Fusion Infrastructure v0.2.4',
  graphSnapshotEpoch: 'Epoch-2026-07-13',
  consensusHash: '0x8f7c9e12...b94a'
};

export const INITIAL_EVIDENCE: EvidenceBinding[] = [
  {
    id: 'EVD-SEC-GFUZ-8K-2025',
    sourceId: 'SEC-EDGAR-0001844985-25-000014',
    sourceType: 'SEC_FILING',
    documentTitle: 'SEC Form 8-K: Notice of Consummation of Business Combination',
    filingReference: 'SEC Commission File No. 001-41120',
    exactQuote: 'On the Closing Date, the Company completed the previously announced merger with General Fusion Inc., resulting in General Fusion Corporation becoming a publicly traded entity on Nasdaq under the symbol GFUZ.',
    publicationDate: '2025-04-18',
    confidenceScore: 0.99,
    verifiedBy: 'Jemma',
    hashDigest: 'sha256:7e3a9c941b...a90f',
    isDisputed: false
  },
  {
    id: 'EVD-SEC-DJT-S4-2024',
    sourceId: 'SEC-EDGAR-0001193125-24-037190',
    sourceType: 'SEC_FILING',
    documentTitle: 'SEC Form S-4/A Registration Statement under the Securities Act of 1933',
    filingReference: 'Registration No. 333-264964',
    exactQuote: 'The registrant has entered into a prospective business combination agreement. As of the date of this report, operations remain concentrated in digital media. Any subsequent frontier technology or energy transactions remain contingent on final shareholder and regulatory closing conditions.',
    publicationDate: '2024-02-14',
    confidenceScore: 0.96,
    verifiedBy: 'Jemma',
    hashDigest: 'sha256:4f88102a...bb12',
    isDisputed: false
  },
  {
    id: 'EVD-ARPAE-HTS-2024',
    sourceId: 'DOE-ARPAE-BETHE-2024-09',
    sourceType: 'CONTRACT_RECORD',
    documentTitle: 'Department of Energy ARPA-E Final Milestone Report: REBCO Superconducting Tape',
    filingReference: 'Award DE-AR0001372',
    exactQuote: 'SuperPower Inc delivered 120 km of second-generation high-temperature superconducting (2G HTS) YBCO coated conductor tape achieving 700 A/cm critical current density at 20 K under 18 Tesla background magnetic field.',
    publicationDate: '2024-09-30',
    confidenceScore: 0.98,
    verifiedBy: 'Hermes',
    hashDigest: 'sha256:1a87bf23...98ec',
    isDisputed: false
  },
  {
    id: 'EVD-BLUEFORS-PAT-2024',
    sourceId: 'WIPO-PCT-EP2024-051882',
    sourceType: 'REGULATORY_REGISTER',
    documentTitle: 'Patent Specification: Automated Sub-Kelvin Dilution Refrigeration Manifold with Closed-Loop Helium-3 Recovery',
    filingReference: 'Publication WO2024109871A1',
    exactQuote: 'The modular multi-flange cryostat provides uninterrupted thermal sinking at 10 millikelvin with continuous cooling power exceeding 25 microwatts at base temperature, with zero net evaporative loss of helium isotopic inventory.',
    publicationDate: '2024-05-30',
    confidenceScore: 0.97,
    verifiedBy: 'Jemma',
    hashDigest: 'sha256:d82910fa...71cb',
    isDisputed: false
  },
  {
    id: 'EVD-CFS-SPARC-NATURE-2024',
    sourceId: 'DOI:10.1038/s41586-024-07312-x',
    sourceType: 'PEER_REVIEWED_PAPER',
    documentTitle: 'Nature: Demonstration of 20-Tesla Toroidal Field Superconducting Magnets for Compact Fusion',
    filingReference: 'Nature Vol 628, pp. 412-419',
    exactQuote: 'The SPARC Toroidal Field Model Coil (TFMC) sustained a steady magnetic field of 20.1 Tesla utilizing 267 kilometers of REBCO HTS tape, cooled by supercritical helium gas at 20 Kelvin, demonstrating the critical rail for net-energy magnetic confinement.',
    publicationDate: '2024-04-11',
    confidenceScore: 0.99,
    verifiedBy: 'Jemma',
    hashDigest: 'sha256:92cb55aa...3f18',
    isDisputed: false
  },
  {
    id: 'EVD-OXFORD-INST-LOG-2025',
    sourceId: 'TECH-AUDIT-OI-2025-01',
    sourceType: 'TECHNICAL_AUDIT_LOG',
    documentTitle: 'Oxford Instruments Cryofree System Delivery Audit & Acceptance Log',
    filingReference: 'Ref: OI-PROD-Q1-2025-882',
    exactQuote: 'Acceptance testing verified ProteoxMX dilution refrigerator integration with high-density coaxial and optical line-of-sight ports operating continuously at 7.2 mK, supporting 64-qubit quantum microwave readouts.',
    publicationDate: '2025-01-22',
    confidenceScore: 0.95,
    verifiedBy: 'Hermes',
    hashDigest: 'sha256:22fa49c1...00ae',
    isDisputed: false
  },
  {
    id: 'EVD-FORMFACTOR-Q2-2025',
    sourceId: 'SEC-EDGAR-FORMFACTOR-10Q-2025',
    sourceType: 'SEC_FILING',
    documentTitle: 'FormFactor Inc Form 10-Q Quarterly Report',
    filingReference: 'SEC File No. 000-50307',
    exactQuote: 'Cryogenic test and measurement systems revenue grew 34% year-over-year driven by delivery of automated cryogenic wafer probe stations operating below 4 Kelvin for multi-qubit superconducting integrated circuits.',
    publicationDate: '2025-05-08',
    confidenceScore: 0.97,
    verifiedBy: 'Jemma',
    hashDigest: 'sha256:e019b882...66df',
    isDisputed: false
  },
  {
    id: 'EVD-CUDA-Q-NVIDIA-2025',
    sourceId: 'IEEE-QUANTUM-2025-1102',
    sourceType: 'PEER_REVIEWED_PAPER',
    documentTitle: 'IEEE Computer: Hybrid GPU-Quantum Digital Twins in Magnetohydrodynamic Plasma Simulation',
    filingReference: 'IEEE Trans. Comp. Phys. 41(3)',
    exactQuote: 'Integrating CUDA-Q accelerated tensor network algorithms with 3D tokamak magnetohydrodynamic codes reduced plasma boundary equilibrium computation latency from 48 hours to 18 minutes on Grace Hopper superclusters.',
    publicationDate: '2025-03-15',
    confidenceScore: 0.94,
    verifiedBy: 'Hermes',
    hashDigest: 'sha256:589b33a1...c471',
    isDisputed: false
  },
  {
    id: 'EVD-DISPUTED-UNVERIFIED-LEAK',
    sourceId: 'UNV-LEAK-TWITTER-2026',
    sourceType: 'TECHNICAL_AUDIT_LOG',
    documentTitle: 'Unverified Social Media SMR Co-Location Claim',
    filingReference: 'Rumoured Unofficial Speculation #882',
    exactQuote: 'Anonymous sources allege immediate commercial SMR deployment binding direct fusion generator to AI data cluster.',
    publicationDate: '2026-01-10',
    confidenceScore: 0.21,
    verifiedBy: 'Operator',
    hashDigest: 'sha256:00000000...fail',
    isDisputed: true
  }
];

export const INITIAL_NODES: SubstrateNode[] = [
  // --- QUANTUM UNIVERSE NODES ---
  {
    id: 'node-bluefors',
    label: 'BlueFors Cryogenics',
    corporateEntityName: 'Bluefors Oy',
    universe: 'quantum',
    nodeType: 'ENABLER',
    status: 'ACTIVE',
    headquarters: 'Helsinki, Finland',
    primaryTechnology: 'Sub-Kelvin Dilution Refrigeration & He-3/He-4 Recovery Systems',
    summary: 'Global market leader in cryogen-free dilution refrigerators providing the sub-20mK thermal foundation essential for superconducting transmon qubits.',
    rapids: {
      cashFlow: 88,
      ecosystemPosition: 96,
      capitalIntensity: 62,
      governmentContracts: 81,
      aiIntegration: 58,
      supplyChainImportance: 98,
      scientificLeadership: 94,
      compositeScore: 88.5,
      compositeDecile: 9
    },
    centrality: {
      pageRank: 0.84,
      betweennessCentrality: 0.79,
      degreeCentrality: 7,
      inDegree: 5,
      outDegree: 2
    },
    crystalBridgeEligible: true,
    crystalBridgeTags: ['Cryogenic Infrastructure Rail', 'Helium Liquefaction Interface'],
    claims: [
      {
        id: 'claim-bf-1',
        statement: 'Provides sub-10 mK base temperature cryostats for over 70% of worldwide superconducting quantum laboratories.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-BLUEFORS-PAT-2024'],
        approvedByOperator: true
      },
      {
        id: 'claim-bf-2',
        statement: 'Cryocooler compressor systems share thermal dissipation metallurgy with tokamak magnet secondary chillers.',
        type: 'INFERENCE',
        evidenceIds: ['EVD-BLUEFORS-PAT-2024'],
        approvedByOperator: true
      }
    ],
    x: 180,
    y: 160
  },
  {
    id: 'node-oxford-inst',
    label: 'Oxford Instruments NanoScience',
    ticker: 'OXIG.L',
    corporateEntityName: 'Oxford Instruments plc',
    universe: 'quantum',
    nodeType: 'ENABLER',
    status: 'ACTIVE',
    headquarters: 'Abingdon, United Kingdom',
    primaryTechnology: 'Ultra-low Temperature Cryostats & Superconducting Magnets',
    summary: 'Manufactures high-reliability Proteox dilution refrigerators with dense RF cabling harnesses for multi-qubit microwave control.',
    rapids: {
      cashFlow: 84,
      ecosystemPosition: 91,
      capitalIntensity: 55,
      governmentContracts: 86,
      aiIntegration: 61,
      supplyChainImportance: 90,
      scientificLeadership: 91,
      compositeScore: 84.8,
      compositeDecile: 9
    },
    centrality: {
      pageRank: 0.72,
      betweennessCentrality: 0.64,
      degreeCentrality: 5,
      inDegree: 4,
      outDegree: 1
    },
    crystalBridgeEligible: true,
    crystalBridgeTags: ['Superconducting Magnet Coil Rail'],
    claims: [
      {
        id: 'claim-ox-1',
        statement: 'Supplies high-density microwave line-of-sight dilution refrigerators operating below 8 mK for commercial quantum testbeds.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-OXFORD-INST-LOG-2025'],
        approvedByOperator: true
      }
    ],
    x: 140,
    y: 310
  },
  {
    id: 'node-formfactor',
    label: 'FormFactor Inc',
    ticker: 'FORM',
    corporateEntityName: 'FormFactor Inc',
    universe: 'quantum',
    nodeType: 'SPECIALTY_TOOLING',
    status: 'ACTIVE',
    headquarters: 'Livermore, California, USA',
    primaryTechnology: 'Automated Cryogenic Wafer Probers & RF Probe Cards',
    summary: 'Essential semiconductor test and measurement enabler providing high-throughput wafer-level probing at 4 Kelvin before dilution packaging.',
    rapids: {
      cashFlow: 89,
      ecosystemPosition: 93,
      capitalIntensity: 48,
      governmentContracts: 76,
      aiIntegration: 65,
      supplyChainImportance: 94,
      scientificLeadership: 87,
      compositeScore: 84.1,
      compositeDecile: 9
    },
    centrality: {
      pageRank: 0.68,
      betweennessCentrality: 0.58,
      degreeCentrality: 4,
      inDegree: 3,
      outDegree: 1
    },
    crystalBridgeEligible: false,
    claims: [
      {
        id: 'claim-ff-1',
        statement: 'Commercial delivery of 4K automated cryogenic probe systems for superconducting silicon screening verified in Q2 2025 SEC filings.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-FORMFACTOR-Q2-2025'],
        approvedByOperator: true
      }
    ],
    x: 320,
    y: 220
  },
  {
    id: 'node-ibm-quantum',
    label: 'IBM Quantum',
    ticker: 'IBM',
    corporateEntityName: 'International Business Machines Corp',
    universe: 'quantum',
    nodeType: 'SYSTEM_INTEGRATOR',
    status: 'ACTIVE',
    headquarters: 'Yorktown Heights, New York, USA',
    primaryTechnology: 'Superconducting Transmon Processors & Quantum System Two',
    summary: 'System integrator deploying 133-qubit Heron and multi-chip quantum modular architectures inside cryogenic dilution enclosures.',
    rapids: {
      cashFlow: 92,
      ecosystemPosition: 88,
      capitalIntensity: 82,
      governmentContracts: 94,
      aiIntegration: 91,
      supplyChainImportance: 78,
      scientificLeadership: 96,
      compositeScore: 89.2,
      compositeDecile: 9
    },
    centrality: {
      pageRank: 0.77,
      betweennessCentrality: 0.61,
      degreeCentrality: 6,
      inDegree: 2,
      outDegree: 4
    },
    crystalBridgeEligible: true,
    crystalBridgeTags: ['Quantum-Classical HPC Hybrid Rail'],
    claims: [
      {
        id: 'claim-ibm-1',
        statement: 'Deployed modular Quantum System Two requiring multi-meter cryogenic busbar connections between cryostats.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-OXFORD-INST-LOG-2025', 'EVD-BLUEFORS-PAT-2024'],
        approvedByOperator: true
      }
    ],
    x: 340,
    y: 90
  },

  // --- FUSION UNIVERSE NODES ---
  {
    id: 'node-superpower',
    label: 'SuperPower Inc (Furukawa)',
    corporateEntityName: 'SuperPower Inc / Furukawa Electric',
    universe: 'fusion',
    nodeType: 'MATERIAL_SUPPLIER',
    status: 'ACTIVE',
    headquarters: 'Schenectady, New York, USA',
    primaryTechnology: 'Second-Generation (2G) REBCO High-Temperature Superconducting Tapes',
    summary: 'The single most acute choke-point in commercial fusion energy: manufacturer of YBCO/REBCO coated conductor tapes capable of sustaining 20+ Tesla magnetic fields at 20 Kelvin.',
    rapids: {
      cashFlow: 76,
      ecosystemPosition: 99,
      capitalIntensity: 78,
      governmentContracts: 92,
      aiIntegration: 52,
      supplyChainImportance: 100,
      scientificLeadership: 97,
      compositeScore: 92.1,
      compositeDecile: 10
    },
    centrality: {
      pageRank: 0.95,
      betweennessCentrality: 0.93,
      degreeCentrality: 9,
      inDegree: 7,
      outDegree: 2
    },
    crystalBridgeEligible: true,
    crystalBridgeTags: ['High-Temperature Superconductor (HTS) Rail', 'Extreme Magnetic Confinement'],
    claims: [
      {
        id: 'claim-sp-1',
        statement: 'Contracted supplier for ARPA-E BETHE program producing 2G HTS tapes with 700 A/cm critical current density.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-ARPAE-HTS-2024'],
        approvedByOperator: true
      },
      {
        id: 'claim-sp-2',
        statement: 'REBCO conductor architecture also functions as high-critical-field interconnects for quantum ground plane shielding.',
        type: 'INFERENCE',
        evidenceIds: ['EVD-CFS-SPARC-NATURE-2024'],
        approvedByOperator: true
      }
    ],
    x: 520,
    y: 200
  },
  {
    id: 'node-cfs',
    label: 'Commonwealth Fusion Systems (CFS)',
    corporateEntityName: 'Commonwealth Fusion Systems LLC',
    universe: 'fusion',
    nodeType: 'SYSTEM_INTEGRATOR',
    status: 'ACTIVE',
    headquarters: 'Devens, Massachusetts, USA',
    primaryTechnology: 'SPARC Tokamak & High-Field HTS Toroidal Field Magnets',
    summary: 'MIT spin-out building the SPARC net-energy demonstration tokamak powered by 20-Tesla HTS magnets; primary consumer of global REBCO tape capacity.',
    rapids: {
      cashFlow: 71,
      ecosystemPosition: 95,
      capitalIntensity: 96,
      governmentContracts: 89,
      aiIntegration: 78,
      supplyChainImportance: 87,
      scientificLeadership: 98,
      compositeScore: 88.4,
      compositeDecile: 9
    },
    centrality: {
      pageRank: 0.81,
      betweennessCentrality: 0.74,
      degreeCentrality: 6,
      inDegree: 2,
      outDegree: 4
    },
    crystalBridgeEligible: true,
    crystalBridgeTags: ['High-Temperature Superconductor (HTS) Rail'],
    claims: [
      {
        id: 'claim-cfs-1',
        statement: 'Demonstrated 20.1 Tesla toroidal field magnet coil utilizing 267 km of REBCO HTS tape published in Nature.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-CFS-SPARC-NATURE-2024'],
        approvedByOperator: true
      }
    ],
    x: 680,
    y: 110
  },
  {
    id: 'node-gfuz',
    label: 'General Fusion (GFUZ)',
    ticker: 'GFUZ',
    corporateEntityName: 'General Fusion Corporation',
    universe: 'fusion',
    nodeType: 'SYSTEM_INTEGRATOR',
    status: 'ACTIVE',
    transactionGate: 'TRADING_LIVE',
    transactionGateDetails: {
      lastUpdated: '2025-04-18',
      filingRef: 'SEC Form 8-K (001-41120)',
      statusSummary: 'Transaction CLOSED and TRADING_LIVE on Nasdaq. Pure-play active commercial fusion exposure verified via definitive regulatory filing.',
      purePlayExposure: true,
      contingentExposure: false,
      checklist: [
        { label: 'Definitive Merger Agreement executed', verified: true, filingEvidenceId: 'EVD-SEC-GFUZ-8K-2025' },
        { label: 'SEC Form S-4 declared effective', verified: true, filingEvidenceId: 'EVD-SEC-GFUZ-8K-2025' },
        { label: 'SPAC shareholder vote approved', verified: true, filingEvidenceId: 'EVD-SEC-GFUZ-8K-2025' },
        { label: 'Transaction consummation & 8-K filed', verified: true, filingEvidenceId: 'EVD-SEC-GFUZ-8K-2025' },
        { label: 'Ticker active and trading live (GFUZ)', verified: true, filingEvidenceId: 'EVD-SEC-GFUZ-8K-2025' }
      ]
    },
    headquarters: 'Richmond, British Columbia, Canada',
    primaryTechnology: 'Magnetized Target Fusion (MTF) with Liquid Metal Vortex',
    summary: 'Pure-play public fusion provider utilizing pneumatic piston-driven liquid lead-lithium compression cavity to achieve fusion temperatures.',
    rapids: {
      cashFlow: 64,
      ecosystemPosition: 84,
      capitalIntensity: 89,
      governmentContracts: 81,
      aiIntegration: 72,
      supplyChainImportance: 79,
      scientificLeadership: 89,
      compositeScore: 80.2,
      compositeDecile: 8
    },
    centrality: {
      pageRank: 0.65,
      betweennessCentrality: 0.51,
      degreeCentrality: 4,
      inDegree: 1,
      outDegree: 3
    },
    crystalBridgeEligible: false,
    claims: [
      {
        id: 'claim-gfuz-1',
        statement: 'Business combination consummated and trading on Nasdaq under symbol GFUZ as documented in Form 8-K.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-SEC-GFUZ-8K-2025'],
        approvedByOperator: true
      },
      {
        id: 'claim-gfuz-2',
        statement: 'Liquid metal wall minimizes high-energy neutron degradation of structural components.',
        type: 'INFERENCE',
        evidenceIds: ['EVD-SEC-GFUZ-8K-2025'],
        approvedByOperator: true
      }
    ],
    x: 740,
    y: 280
  },
  {
    id: 'node-djt',
    label: 'Trump Media (DJT)',
    ticker: 'DJT',
    corporateEntityName: 'Trump Media & Technology Group Corp',
    universe: 'fusion',
    nodeType: 'SYSTEM_INTEGRATOR',
    status: 'ACTIVE',
    transactionGate: 'ANNOUNCED',
    transactionGateDetails: {
      lastUpdated: '2024-02-14',
      filingRef: 'SEC Form S-4/A (333-264964)',
      statusSummary: 'Transaction state gate: ANNOUNCED. Prospective transaction with contingent exposure; operationally remains a media company until closure.',
      purePlayExposure: false,
      contingentExposure: true,
      checklist: [
        { label: 'Prospective business combination announced', verified: true, filingEvidenceId: 'EVD-SEC-DJT-S4-2024' },
        { label: 'SEC Form S-4/A Registration Statement', verified: true, filingEvidenceId: 'EVD-SEC-DJT-S4-2024' },
        { label: 'Definitive merger closure approval', verified: false },
        { label: 'Operational technology conversion completed', verified: false },
        { label: 'Direct energy / fusion asset titling confirmed', verified: false }
      ]
    },
    headquarters: 'Sarasota, Florida, USA',
    primaryTechnology: 'Contingent Capital Allocation Vehicle (Media core, speculative energy exposure)',
    summary: 'Contingent corporate entity under ANNOUNCED transaction state gate. Strict Pathfinder doctrine isolates this as prospective/contingent exposure until official regulatory closure filings occur.',
    rapids: {
      cashFlow: 38,
      ecosystemPosition: 29,
      capitalIntensity: 74,
      governmentContracts: 20,
      aiIntegration: 35,
      supplyChainImportance: 18,
      scientificLeadership: 12,
      compositeScore: 32.5,
      compositeDecile: 3
    },
    centrality: {
      pageRank: 0.22,
      betweennessCentrality: 0.08,
      degreeCentrality: 1,
      inDegree: 0,
      outDegree: 1
    },
    crystalBridgeEligible: false,
    claims: [
      {
        id: 'claim-djt-1',
        statement: 'Prospective deep-tech / energy merger announced in S-4 filings but pending final operational verification.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-SEC-DJT-S4-2024'],
        approvedByOperator: true
      },
      {
        id: 'claim-djt-2',
        statement: 'Does not constitute direct operating pure-play fusion infrastructure at present gate stage.',
        type: 'INFERENCE',
        evidenceIds: ['EVD-SEC-DJT-S4-2024'],
        approvedByOperator: true
      }
    ],
    x: 840,
    y: 390
  },

  // --- CROSS-SECTOR CRYSTAL BRIDGE INFRASTRUCTURE (AI & SEMICONDUCTORS) ---
  {
    id: 'node-nvidia',
    label: 'NVIDIA (CUDA-Q & HPC)',
    ticker: 'NVDA',
    corporateEntityName: 'NVIDIA Corporation',
    universe: 'ai_infra',
    nodeType: 'ENABLER',
    status: 'ACTIVE',
    headquarters: 'Santa Clara, California, USA',
    primaryTechnology: 'GPU Accelerated Simulation, CUDA-Q, & Digital Twins',
    summary: 'Crucial computational rail powering both real-time magneto-hydrodynamic plasma equilibrium simulations in fusion and quantum circuit noise modeling.',
    rapids: {
      cashFlow: 99,
      ecosystemPosition: 98,
      capitalIntensity: 74,
      governmentContracts: 95,
      aiIntegration: 100,
      supplyChainImportance: 97,
      scientificLeadership: 96,
      compositeScore: 96.8,
      compositeDecile: 10
    },
    centrality: {
      pageRank: 0.91,
      betweennessCentrality: 0.88,
      degreeCentrality: 8,
      inDegree: 5,
      outDegree: 3
    },
    crystalBridgeEligible: true,
    crystalBridgeTags: ['Plasma & Quantum Computational Digital Twins', 'AI Infrastructure Rail'],
    claims: [
      {
        id: 'claim-nv-1',
        statement: 'CUDA-Q accelerated plasma boundary solver benchmarks published in IEEE Trans. Comp. Phys.',
        type: 'OBSERVATION',
        evidenceIds: ['EVD-CUDA-Q-NVIDIA-2025'],
        approvedByOperator: true
      }
    ],
    x: 480,
    y: 360
  },

  // --- ISOLATED-NODE BACKLOG (Entities known to exist, 0 verified edges, blindspot sweeps) ---
  {
    id: 'node-helion-injector',
    label: 'Helion Field-Reversed Injectors',
    corporateEntityName: 'Helion Energy Inc - Magneto-Inertial Sub-Assembly',
    universe: 'fusion',
    nodeType: 'SPECIALTY_TOOLING',
    status: 'ISOLATED_BACKLOG',
    headquarters: 'Everett, Washington, USA',
    primaryTechnology: 'Direct Magnetic Energy Recovery Plasmoid Accelerators',
    summary: 'Known pulse compression hardware sub-tier. Currently marked ISOLATED: lacks verified primary vendor procurement evidence in public registers.',
    rapids: {
      cashFlow: 52,
      ecosystemPosition: 71,
      capitalIntensity: 90,
      governmentContracts: 45,
      aiIntegration: 61,
      supplyChainImportance: 82,
      scientificLeadership: 86,
      compositeScore: 70.1,
      compositeDecile: 7
    },
    centrality: {
      pageRank: 0.10,
      betweennessCentrality: 0.00,
      degreeCentrality: 0,
      inDegree: 0,
      outDegree: 0
    },
    crystalBridgeEligible: false,
    claims: [
      {
        id: 'claim-helion-1',
        statement: 'Proprietary solid-state capacitor switches lack audited Tier-1 supply chain disclosures.',
        type: 'OBSERVATION',
        evidenceIds: [],
        approvedByOperator: false,
        notes: 'Awaiting Hermes provenance sweep.'
      }
    ],
    x: 710,
    y: 470
  },
  {
    id: 'node-atlantic-quantum',
    label: 'Atlantic Quantum Fluxonium Foundry',
    corporateEntityName: 'Atlantic Quantum Inc',
    universe: 'quantum',
    nodeType: 'FABRICATION',
    status: 'ISOLATED_BACKLOG',
    headquarters: 'Cambridge, Massachusetts, USA',
    primaryTechnology: 'Fluxonium Qubit Architectures on Silicon Substrates',
    summary: 'Pioneering fluxonium qubits for higher coherence times. Marked ISOLATED: pending audited cleanroom foundry partner verification.',
    rapids: {
      cashFlow: 41,
      ecosystemPosition: 68,
      capitalIntensity: 84,
      governmentContracts: 72,
      aiIntegration: 51,
      supplyChainImportance: 70,
      scientificLeadership: 89,
      compositeScore: 66.4,
      compositeDecile: 6
    },
    centrality: {
      pageRank: 0.09,
      betweennessCentrality: 0.00,
      degreeCentrality: 0,
      inDegree: 0,
      outDegree: 0
    },
    crystalBridgeEligible: false,
    claims: [],
    x: 230,
    y: 450
  },
  {
    id: 'node-zap-electrodes',
    label: 'Zap Energy SMR Tungsten Foundry',
    corporateEntityName: 'Zap Energy Inc Core Metallurgy Unit',
    universe: 'fusion',
    nodeType: 'MATERIAL_SUPPLIER',
    status: 'ISOLATED_BACKLOG',
    headquarters: 'Seattle, Washington, USA',
    primaryTechnology: 'Sheared-Flow Stabilized Z-Pinch Refractory Electrodes',
    summary: 'High-purity tungsten alloy electrode casting facility. Marked ISOLATED: zero public contract links to mineral extractors.',
    rapids: {
      cashFlow: 48,
      ecosystemPosition: 63,
      capitalIntensity: 88,
      governmentContracts: 59,
      aiIntegration: 44,
      supplyChainImportance: 76,
      scientificLeadership: 81,
      compositeScore: 64.2,
      compositeDecile: 6
    },
    centrality: {
      pageRank: 0.08,
      betweennessCentrality: 0.00,
      degreeCentrality: 0,
      inDegree: 0,
      outDegree: 0
    },
    crystalBridgeEligible: false,
    claims: [],
    x: 880,
    y: 200
  }
];

export const INITIAL_EDGES: SubstrateEdge[] = [
  // Quantum internal rails
  {
    id: 'edge-bf-ibm',
    source: 'node-bluefors',
    target: 'node-ibm-quantum',
    relationshipType: 'CRITICAL_DEPENDENCY',
    universeCross: false,
    description: 'Supplies high-cooling-power dilution refrigerator cryostats for IBM Quantum System Two modular assemblies.',
    evidenceId: 'EVD-BLUEFORS-PAT-2024',
    weight: 5,
    verified: true,
    observationType: 'OBSERVATION'
  },
  {
    id: 'edge-ox-ibm',
    source: 'node-oxford-inst',
    target: 'node-ibm-quantum',
    relationshipType: 'CRITICAL_DEPENDENCY',
    universeCross: false,
    description: 'Supplies high-density coaxial and optical line-of-sight ports for transmon qubit state readout.',
    evidenceId: 'EVD-OXFORD-INST-LOG-2025',
    weight: 4,
    verified: true,
    observationType: 'OBSERVATION'
  },
  {
    id: 'edge-ff-ibm',
    source: 'node-formfactor',
    target: 'node-ibm-quantum',
    relationshipType: 'CRITICAL_DEPENDENCY',
    universeCross: false,
    description: 'Supplies cryogenic wafer probers to qualify superconducting chips at 4 Kelvin before dilution refrigerator assembly.',
    evidenceId: 'EVD-FORMFACTOR-Q2-2025',
    weight: 4,
    verified: true,
    observationType: 'OBSERVATION'
  },

  // Fusion internal rails
  {
    id: 'edge-sp-cfs',
    source: 'node-superpower',
    target: 'node-cfs',
    relationshipType: 'CRITICAL_DEPENDENCY',
    universeCross: false,
    description: 'Supplies hundreds of kilometers of 2G REBCO HTS tape enabling SPARC 20-Tesla toroidal field magnet coils.',
    evidenceId: 'EVD-CFS-SPARC-NATURE-2024',
    weight: 5,
    verified: true,
    observationType: 'OBSERVATION'
  },
  {
    id: 'edge-sp-gfuz',
    source: 'node-superpower',
    target: 'node-gfuz',
    relationshipType: 'CRITICAL_DEPENDENCY',
    universeCross: false,
    description: 'Supplies specialized HTS conductor tapes for pulsed magnetic target plasma compression coils.',
    evidenceId: 'EVD-ARPAE-HTS-2024',
    weight: 4,
    verified: true,
    observationType: 'OBSERVATION'
  },
  {
    id: 'edge-djt-gfuz',
    source: 'node-djt',
    target: 'node-gfuz',
    relationshipType: 'CAPITAL_ALLOCATION',
    universeCross: false,
    description: 'Contingent proposed capital allocation rail under review; flagged at ANNOUNCED state gate pending regulatory verification.',
    evidenceId: 'EVD-SEC-DJT-S4-2024',
    weight: 2,
    verified: true,
    observationType: 'INFERENCE'
  },

  // --- CRYSTAL BRIDGES (Cross-Universe Interfaces) ---
  {
    id: 'edge-cb-superpower-bluefors',
    source: 'node-superpower',
    target: 'node-bluefors',
    relationshipType: 'CRYSTAL_BRIDGE',
    universeCross: true,
    crystalBridgeSubstrate: 'Cryogenic Superconducting Infrastructure Rail',
    description: 'Crystal Bridge: REBCO HTS tapes developed for fusion magnets provide thermal-shield ground plane wiring inside sub-Kelvin quantum cryostats.',
    evidenceId: 'EVD-ARPAE-HTS-2024',
    weight: 5,
    verified: true,
    observationType: 'OBSERVATION'
  },
  {
    id: 'edge-cb-nvidia-cfs',
    source: 'node-nvidia',
    target: 'node-cfs',
    relationshipType: 'CRYSTAL_BRIDGE',
    universeCross: true,
    crystalBridgeSubstrate: 'Plasma & Quantum Computational Digital Twins',
    description: 'Crystal Bridge: NVIDIA GPU simulation clusters run 3D magnetohydrodynamic digital twin simulations to predict plasma instabilities in tokamak confinement.',
    evidenceId: 'EVD-CUDA-Q-NVIDIA-2025',
    weight: 5,
    verified: true,
    observationType: 'OBSERVATION'
  },
  {
    id: 'edge-cb-nvidia-ibm',
    source: 'node-nvidia',
    target: 'node-ibm-quantum',
    relationshipType: 'CRYSTAL_BRIDGE',
    universeCross: true,
    crystalBridgeSubstrate: 'Quantum Circuit Compilation & Tensor Network Simulation',
    description: 'Crystal Bridge: CUDA-Q accelerates tensor network noise mitigation algorithms for quantum circuit calibration before physical hardware pulses.',
    evidenceId: 'EVD-CUDA-Q-NVIDIA-2025',
    weight: 4,
    verified: true,
    observationType: 'OBSERVATION'
  }
];

export const INITIAL_STOP_CONDITIONS: StopConditionAlert[] = [
  {
    id: 'STP-001',
    code: 'STP-MISSING-PROVENANCE',
    severity: 'WARNING',
    title: 'Isolated Backlog Node Detected: Missing Direct Provenance',
    triggerDescription: 'Node "Helion Field-Reversed Injectors" has zero verified incoming or outgoing edges and unbacked claim #claim-helion-1. Fails-closed guard active.',
    affectedNodeIds: ['node-helion-injector'],
    timestamp: '2026-09-12 21:04:12',
    resolved: false,
    resolutionAction: 'Dispatch Hermes to traverse official registers or solicit Operator verified manual source filing.'
  },
  {
    id: 'STP-002',
    code: 'STP-MATERIAL-CONFLICT',
    severity: 'WARNING',
    title: 'Contradictory Claim Filtered by Jemma: Unverified Speculation',
    triggerDescription: 'Filtered EVD-DISPUTED-UNVERIFIED-LEAK claiming immediate SMR commercial co-location. Octagon safety protocol blocked edge creation.',
    affectedNodeIds: ['node-djt'],
    timestamp: '2026-09-12 22:15:00',
    resolved: true,
    resolutionAction: 'Evidence marked isDisputed=true and excluded from the active consensus graph.'
  }
];

export const INITIAL_AGENTS: GuildAgent[] = [
  {
    name: 'Octagon',
    role: 'Governance, Permissions & Fails-Closed Safety Guard',
    status: 'VERIFIED',
    currentAction: 'Active custody check: enforcing provenance bindings on all edge mutations.',
    metrics: {
      processedCount: 142,
      auditPassedRatio: '100% (Fails-Closed Active)'
    }
  },
  {
    name: 'Claudia',
    role: 'Routing, Task Decomposition & Orchestration',
    status: 'IDLE',
    currentAction: 'Standing by for Operator mission directive.',
    metrics: {
      processedCount: 68,
      auditPassedRatio: '98.5%'
    }
  },
  {
    name: 'Jemma',
    role: 'Evidence Auditor & Confidence Scoring',
    status: 'PROCESSING',
    currentAction: 'Cross-checking SEC Form 8-K filings against EDGAR official registers.',
    metrics: {
      processedCount: 94,
      auditPassedRatio: '96.8%'
    }
  },
  {
    name: 'Hermes',
    role: 'Graph Traversal & Source Relation Discovery',
    status: 'IDLE',
    currentAction: 'Monitoring Isolated-Node Backlog queue for provenance paths.',
    metrics: {
      processedCount: 184,
      auditPassedRatio: '95.2%'
    }
  },
  {
    name: 'Aether',
    role: 'Immutable Document Store & Knowledge Ledger',
    status: 'VERIFIED',
    currentAction: 'Consensus hash Epoch-2026-07-13 immutable lock confirmed.',
    metrics: {
      processedCount: 312,
      auditPassedRatio: '100%'
    }
  },
  {
    name: 'Delta',
    role: 'State Synchronization & Ledger Transitioning',
    status: 'IDLE',
    currentAction: 'Synchronized with local consensus state store.',
    metrics: {
      processedCount: 88,
      auditPassedRatio: '100%'
    }
  },
  {
    name: 'Simon',
    role: 'Schema Validation & Transaction Gate Verifier',
    status: 'VERIFIED',
    currentAction: 'Validating GFUZ vs DJT state-machine transaction gate compliance.',
    metrics: {
      processedCount: 110,
      auditPassedRatio: '100%'
    }
  }
];

export const INITIAL_MISSION: MissionDirective = {
  id: 'MSN-DIR-2026-001',
  operatorPrompt: 'Map structural dependency rails bridging sub-Kelvin quantum dilution refrigerators and fusion high-temperature superconductor magnet cryocoolers, auditing GFUZ vs DJT corporate action exposure.',
  timestamp: '2026-09-12 23:30:00',
  status: 'COMPLETED',
  decomposedBy: 'Claudia',
  approvedByOperator: true,
  operatorNotes: 'Operator confirmed findings. Crystal Bridge verified between SuperPower REBCO tapes and BlueFors dilution cryostats.',
  steps: [
    {
      stepId: 'STP-1',
      agent: 'Claudia',
      action: 'Decompose directive into graph traversal (Hermes) and regulatory audit (Jemma).',
      status: 'COMPLETED',
      findings: 'Substrate targets resolved: Quantum Sub-Kelvin Rails & Fusion Magnet Rails.',
      executionTimestamp: '23:30:02'
    },
    {
      stepId: 'STP-2',
      agent: 'Hermes',
      action: 'Traverse graph edges from BlueFors / Oxford Instruments to SuperPower REBCO.',
      status: 'COMPLETED',
      findings: 'Discovered Crystal Bridge Rail (edge-cb-superpower-bluefors): Superconducting ground plane wiring interface.',
      executionTimestamp: '23:30:08'
    },
    {
      stepId: 'STP-3',
      agent: 'Jemma',
      action: 'Audit regulatory filings for GFUZ (Form 8-K) and DJT (Form S-4/A).',
      status: 'COMPLETED',
      findings: 'Confirmed GFUZ is CLOSED & TRADING_LIVE (pure-play). Confirmed DJT is ANNOUNCED (contingent exposure).',
      executionTimestamp: '23:30:14'
    },
    {
      stepId: 'STP-4',
      agent: 'Simon',
      action: 'Validate schema integrity and RAPIDS decile ranking.',
      status: 'COMPLETED',
      findings: 'SuperPower (Decile 10, PR 0.95), NVIDIA (Decile 10, PR 0.91), BlueFors (Decile 9, PR 0.84).',
      executionTimestamp: '23:30:18'
    },
    {
      stepId: 'STP-5',
      agent: 'Octagon',
      action: 'Governance check: verify zero Stop Conditions tripped before Operator presentation.',
      status: 'COMPLETED',
      findings: 'Pass: All claims bound to valid Aether filing hashes.',
      executionTimestamp: '23:30:20'
    }
  ],
  synthesisReport: 'Structural Rail Analysis Complete: The deep-technology substrate relies on high-temperature superconducting coated conductor tapes (SuperPower) and automated sub-Kelvin cryogenics (BlueFors). Both quantum computing and fusion energy share the same acute cryogenic and superconducting materials supply bottleneck. Corporate exposure audits confirm GFUZ has crossed the definitive regulatory transaction gate (TRADING_LIVE), whereas DJT remains in ANNOUNCED state with contingent exposure.'
};
