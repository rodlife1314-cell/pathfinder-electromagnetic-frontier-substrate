import { SubstrateNode, SubstrateEdge, CentralityMetrics, StopConditionAlert, EvidenceBinding } from './types';

/**
 * Computes PageRank for the nodes given the current edge topology.
 * Uses power iteration with standard damping factor d = 0.85.
 */
export function calculatePageRank(
  nodes: SubstrateNode[],
  edges: SubstrateEdge[],
  dampingFactor = 0.85,
  iterations = 25
): Record<string, number> {
  const n = nodes.length;
  if (n === 0) return {};

  const ranks: Record<string, number> = {};
  const outgoing: Record<string, string[]> = {};
  const incoming: Record<string, string[]> = {};

  nodes.forEach(node => {
    ranks[node.id] = 1 / n;
    outgoing[node.id] = [];
    incoming[node.id] = [];
  });

  edges.forEach(edge => {
    if (outgoing[edge.source] && incoming[edge.target]) {
      outgoing[edge.source].push(edge.target);
      incoming[edge.target].push(edge.source);
    }
  });

  for (let iter = 0; iter < iterations; iter++) {
    const nextRanks: Record<string, number> = {};
    let danglingSum = 0;

    nodes.forEach(node => {
      if (outgoing[node.id].length === 0) {
        danglingSum += ranks[node.id];
      }
    });

    nodes.forEach(node => {
      let sumIncoming = 0;
      incoming[node.id].forEach(srcId => {
        const outDeg = outgoing[srcId].length;
        if (outDeg > 0) {
          sumIncoming += ranks[srcId] / outDeg;
        }
      });

      nextRanks[node.id] =
        (1 - dampingFactor) / n +
        dampingFactor * (sumIncoming + danglingSum / n);
    });

    // Normalize
    let total = 0;
    nodes.forEach(node => {
      ranks[node.id] = nextRanks[node.id];
      total += ranks[node.id];
    });

    if (total > 0) {
      nodes.forEach(node => {
        ranks[node.id] /= total;
      });
    }
  }

  // Scale max rank to ~0.95 for display readability
  let max = 0;
  nodes.forEach(node => {
    if (ranks[node.id] > max) max = ranks[node.id];
  });

  const scaledRanks: Record<string, number> = {};
  nodes.forEach(node => {
    scaledRanks[node.id] = max > 0 ? Number(((ranks[node.id] / max) * 0.95).toFixed(2)) : 0.1;
  });

  return scaledRanks;
}

/**
 * Computes Degree Centrality for each node (in, out, and total).
 */
export function calculateDegreeCentrality(
  nodes: SubstrateNode[],
  edges: SubstrateEdge[]
): Record<string, { inDegree: number; outDegree: number; degree: number }> {
  const result: Record<string, { inDegree: number; outDegree: number; degree: number }> = {};

  nodes.forEach(node => {
    result[node.id] = { inDegree: 0, outDegree: 0, degree: 0 };
  });

  edges.forEach(edge => {
    if (result[edge.source]) result[edge.source].outDegree++;
    if (result[edge.target]) result[edge.target].inDegree++;
  });

  nodes.forEach(node => {
    const item = result[node.id];
    item.degree = item.inDegree + item.outDegree;
  });

  return result;
}

/**
 * Brandes algorithm for Betweenness Centrality on directed network.
 */
export function calculateBetweennessCentrality(
  nodes: SubstrateNode[],
  edges: SubstrateEdge[]
): Record<string, number> {
  const cb: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  nodes.forEach(node => {
    cb[node.id] = 0;
    adj[node.id] = [];
  });

  edges.forEach(edge => {
    if (adj[edge.source]) {
      adj[edge.source].push(edge.target);
    }
  });

  nodes.forEach(s => {
    const stack: string[] = [];
    const pred: Record<string, string[]> = {};
    const sigma: Record<string, number> = {};
    const dist: Record<string, number> = {};

    nodes.forEach(v => {
      pred[v.id] = [];
      sigma[v.id] = 0;
      dist[v.id] = -1;
    });

    sigma[s.id] = 1;
    dist[s.id] = 0;

    const queue: string[] = [s.id];

    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);

      (adj[v] || []).forEach(w => {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1;
          queue.push(w);
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v];
          pred[w].push(v);
        }
      });
    }

    const delta: Record<string, number> = {};
    nodes.forEach(v => {
      delta[v.id] = 0;
    });

    while (stack.length > 0) {
      const w = stack.pop()!;
      (pred[w] || []).forEach(v => {
        if (sigma[w] > 0) {
          delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
        }
      });
      if (w !== s.id) {
        cb[w] += delta[w];
      }
    }
  });

  // Scale betweenness between 0.0 and 1.0
  let max = 0;
  nodes.forEach(node => {
    if (cb[node.id] > max) max = cb[node.id];
  });

  const normalized: Record<string, number> = {};
  nodes.forEach(node => {
    normalized[node.id] = max > 0 ? Number((cb[node.id] / max).toFixed(2)) : 0;
  });

  return normalized;
}

/**
 * Audit system: scans graph for Stop Condition violations.
 */
export function auditStopConditions(
  nodes: SubstrateNode[],
  edges: SubstrateEdge[],
  evidences: EvidenceBinding[]
): StopConditionAlert[] {
  const alerts: StopConditionAlert[] = [];
  const evidenceMap = new Map<string, EvidenceBinding>();
  evidences.forEach(e => evidenceMap.set(e.id, e));

  // 1. Missing Provenance Check
  nodes.forEach(node => {
    // Check if isolated node has unverified claims
    if (node.status === 'ISOLATED_BACKLOG') {
      const unverifiedClaims = node.claims.filter(c => c.evidenceIds.length === 0);
      if (unverifiedClaims.length > 0) {
        alerts.push({
          id: `STP-PROV-${node.id}`,
          code: 'STP-MISSING-PROVENANCE',
          severity: 'WARNING',
          title: `Missing Provenance: ${node.label}`,
          triggerDescription: `Node has ${unverifiedClaims.length} claim(s) lacking complete source_id / evidence bindings. Fails-closed rule enforced.`,
          affectedNodeIds: [node.id],
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          resolved: false,
          resolutionAction: 'Operator must provide authenticated citation or reject claim.'
        });
      }
    }
  });

  // 2. Unverified Edges Check
  edges.forEach(edge => {
    if (!edge.evidenceId || !evidenceMap.has(edge.evidenceId)) {
      alerts.push({
        id: `STP-EDGE-${edge.id}`,
        code: 'STP-UNVERIFIED-EDGE',
        severity: 'CRITICAL',
        title: `Unverified Edge Dependency: ${edge.source} -> ${edge.target}`,
        triggerDescription: `Edge ${edge.id} lacks valid evidence binding in Aether repository. Graph traversal halted on this branch.`,
        affectedNodeIds: [edge.source, edge.target],
        affectedEdgeIds: [edge.id],
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        resolved: false,
        resolutionAction: 'Attach verified primary document evidence ID before traversal.'
      });
    }
  });

  // 3. Material Conflict Check
  evidences.forEach(ev => {
    if (ev.isDisputed) {
      alerts.push({
        id: `STP-CONFLICT-${ev.id}`,
        code: 'STP-MATERIAL-CONFLICT',
        severity: 'WARNING',
        title: `Material Conflict Detected: ${ev.documentTitle}`,
        triggerDescription: `Evidence ${ev.id} flagged as disputed or conflicting. Confidence score: ${(ev.confidenceScore * 100).toFixed(0)}%.`,
        affectedNodeIds: [],
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        resolved: false,
        resolutionAction: 'Requires Operator manual resolution to incorporate or purge.'
      });
    }
  });

  // 4. Transaction-State Gate Audit
  nodes.forEach(node => {
    if (node.transactionGate && node.transactionGateDetails) {
      const unverifiedItems = node.transactionGateDetails.checklist.filter(c => !c.verified);
      if (node.transactionGate === 'TRADING_LIVE' && unverifiedItems.length > 0) {
        alerts.push({
          id: `STP-GATE-${node.id}`,
          code: 'STP-UNVERIFIED-GATE',
          severity: 'CRITICAL',
          title: `Unverified Transaction Gate State: ${node.label}`,
          triggerDescription: `Corporate action claimed TRADING_LIVE but contains ${unverifiedItems.length} unverified checklist gates.`,
          affectedNodeIds: [node.id],
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          resolved: false,
          resolutionAction: 'Demote transaction gate state until regulatory filing 8-K / S-4 is audited.'
        });
      }
    }
  });

  return alerts;
}
