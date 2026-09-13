// Electromagnetic Simulation Engine
// Based on the Poynting Field Architecture & G_n Systematic Geometry Topology Suite
// Formulations:
// S(r, t) = E(r, t) x H(r, t)
// P_i = \int_{A_i} S(r, t) \cdot n_i dA
// g = S / c^2 (momentum density)
// F = -\oint_A T \cdot n dA (Maxwell Stress Tensor)

export interface SourceState {
  x: number;          // meters relative to origin (transverse offset)
  y: number;          // meters relative to origin
  z0: number;         // elevation (axial height in meters)
  power: number;      // Watts (default 45.0 W)
  frequency: number;  // rad/s or GHz
  phase: number;      // radians
}

export interface PolygonConfig {
  n: number;          // vertex count (3, 4, 5, 6, 8)
  label: string;      // e.g. "G_6 Regular Hexagon"
  radius: number;     // circumradius R in meters (default 1.0 m)
  apertureArea: number; // total receiver aperture normalized across all n
}

export interface NodePowerOutput {
  nodeIndex: number;
  angleRad: number;
  x: number;
  y: number;
  distance: number;
  powerWatts: number;
  poyntingVectorNorm: number;
  phaseLag: number;
  axialJacobianJz: number;
  scaleJacobianJR: number;
}

export interface GeometrySimulationResult {
  n: number;
  name: string;
  isReference: boolean;
  nearestChord: number;
  nearestChordRatio: number; // c_n / R
  totalCapturedWatts: number;
  lossWatts: number;
  efficiencyPercent: number;
  fieldUniformityPercent: number;
  axialSensitivityNorm: number;
  scaleSensitivityNorm: number;
  nodalPowers: NodePowerOutput[];
  maxPowerNode: number;
  minPowerNode: number;
  varianceWatts: number;
}

export interface EigenmodeState {
  id: string;
  name: string;
  symbol: string;
  role: string;
  weight: number; // 0.0 to 1.0
  color: string;
}

export const DEFAULT_EIGENMODES: EigenmodeState[] = [
  { id: 'mode-octagon', name: 'Octagon', symbol: 'G₈', role: 'Stabilize Boundary', weight: 0.85, color: '#f59e0b' },
  { id: 'mode-square', name: 'Square', symbol: 'G₄', role: 'Hold Structure', weight: 0.70, color: '#3b82f6' },
  { id: 'mode-triangle', name: 'Triangle', symbol: 'G₃', role: 'Bend Thread', weight: 0.45, color: '#ec4899' },
  { id: 'mode-hexagon', name: 'Hexagon', symbol: 'G₆', role: 'Open Flow', weight: 0.95, color: '#10b981' },
  { id: 'mode-circle', name: 'Circle', symbol: 'G∞', role: 'Phase-Lock', weight: 0.60, color: '#06b6d4' },
  { id: 'mode-pentagon', name: 'Pentagon', symbol: 'G₅', role: 'Adapt Identity', weight: 0.30, color: '#8b5cf6' },
  { id: 'mode-helical', name: 'Helical', symbol: 'H_k', role: 'Ingest / Couple Thread', weight: 0.80, color: '#eab308' },
  { id: 'mode-vector', name: 'Biaxial Vector', symbol: 'V_xy', role: 'Corridor Steering', weight: 0.50, color: '#ef4444' }
];

// Physical constants
const SPEED_OF_LIGHT = 299792458; // m/s
const FREE_SPACE_IMPEDANCE = 376.73; // Ohms (approx 377 Omega)

/**
 * Calculates Poynting flux and nodal absorption for polygon G_n
 */
export function simulatePolygonGeometry(
  poly: PolygonConfig,
  source: SourceState,
  substratePermittivity = 1.0,
  dissipativeConductivity = 0.002
): GeometrySimulationResult {
  const n = poly.n;
  const R = poly.radius;
  const totalAperture = poly.apertureArea || 0.12; // m^2 total
  const nodeAperture = totalAperture / n; // normalized per node aperture!

  // Chord length: c_n = 2 * R * sin(pi / n)
  const nearestChord = 2 * R * Math.sin(Math.PI / n);
  const nearestChordRatio = nearestChord / R;

  const nodalPowers: NodePowerOutput[] = [];
  let totalCaptured = 0;

  // Vertex generation: regular polygon centered at (0,0)
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2; // start at top
    const vx = R * Math.cos(angle);
    const vy = R * Math.sin(angle);

    // 3D distance from source (source.x, source.y, source.z0) to receiver (vx, vy, 0)
    const dx = vx - source.x;
    const dy = vy - source.y;
    const dz = 0 - source.z0;
    const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Effective Poynting magnitude:
    // S = (P_in / (4 * pi * dist^2)) * attenuation * directivity factor
    const attenuation = Math.exp(-dissipativeConductivity * dist3D);
    const waveImpedance = FREE_SPACE_IMPEDANCE / Math.sqrt(substratePermittivity);
    const geometricAngleCosine = Math.abs(dz) / dist3D; // projection angle

    // Poynting flux density S (W/m^2)
    const poyntingNorm = (source.power / (4 * Math.PI * (dist3D * dist3D + 0.01))) * attenuation;

    // Captured power P_i = S * nodeAperture * cos(theta) * coupling
    // Hexagonal geometry resonant boost when c_n == R (n=6) in phase-synchronized conditions
    let geometricCoherence = 1.0;
    if (n === 6) {
      // Hexagonal chord synchronization: c_6 == R
      geometricCoherence = 1.15;
    } else if (n % 2 !== 0 && (source.x !== 0 || source.y !== 0)) {
      // Parity frustration on odd polygons under transverse displacement
      geometricCoherence = 0.82;
    }

    const powerWatts = poyntingNorm * nodeAperture * geometricAngleCosine * geometricCoherence;
    totalCaptured += powerWatts;

    // Derivatives for Sensitivity Jacobians
    // dP/dz0 = dP/ddist * ddist/dz0
    const ddist_dz = -dz / dist3D;
    const dP_dz = -2 * (powerWatts / dist3D) * ddist_dz;

    // dP/dR: derivative with respect to circumradius
    const ddist_dR = (R - (source.x * Math.cos(angle) + source.y * Math.sin(angle))) / dist3D;
    const dP_dR = -2 * (powerWatts / dist3D) * ddist_dR;

    nodalPowers.push({
      nodeIndex: i + 1,
      angleRad: angle,
      x: vx,
      y: vy,
      distance: dist3D,
      powerWatts,
      poyntingVectorNorm: poyntingNorm,
      phaseLag: (dist3D * (2 * Math.PI * 1e9 / SPEED_OF_LIGHT)) % (2 * Math.PI),
      axialJacobianJz: dP_dz,
      scaleJacobianJR: dP_dR
    });
  }

  const powers = nodalPowers.map(p => p.powerWatts);
  const meanPower = totalCaptured / n;
  const variance = powers.reduce((acc, p) => acc + Math.pow(p - meanPower, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Field Uniformity U = 1 - (stdDev / meanPower)
  const uniformity = Math.max(0, Math.min(100, (1 - (stdDev / (meanPower || 0.0001))) * 100));

  // Efficiency eta = totalCaptured / source.power
  const efficiency = (totalCaptured / source.power) * 100;
  const lossWatts = Math.max(0, source.power - totalCaptured);

  // L2 Norm of Jacobians
  const axialNorm = Math.sqrt(nodalPowers.reduce((sum, p) => sum + p.axialJacobianJz * p.axialJacobianJz, 0));
  const scaleNorm = Math.sqrt(nodalPowers.reduce((sum, p) => sum + p.scaleJacobianJR * p.scaleJacobianJR, 0));

  let maxIdx = 0;
  let minIdx = 0;
  for (let i = 1; i < n; i++) {
    if (powers[i] > powers[maxIdx]) maxIdx = i;
    if (powers[i] < powers[minIdx]) minIdx = i;
  }

  return {
    n,
    name: poly.label,
    isReference: n === 6,
    nearestChord,
    nearestChordRatio,
    totalCapturedWatts: totalCaptured,
    lossWatts,
    efficiencyPercent: efficiency,
    fieldUniformityPercent: uniformity,
    axialSensitivityNorm: axialNorm,
    scaleSensitivityNorm: scaleNorm,
    nodalPowers,
    maxPowerNode: maxIdx + 1,
    minPowerNode: minIdx + 1,
    varianceWatts: variance
  };
}

/**
 * Calculates net corridor thrust from Poynting flux & momentum transfer
 * F = (2 * P_captured / c) for reflected component + momentum collimation
 */
export function calculateCorridorThrust(
  totalCapturedPowerWatts: number,
  transverseOffsetMeters: number,
  eigenmodeWeights: Record<string, number>
) {
  // Photon momentum force baseline: F = 2P / c
  const photonForceBase = (2 * totalCapturedPowerWatts) / SPEED_OF_LIGHT; // Newtons

  // In the fictional corridor doctrine, the vessel couples to ambient magnetospheric/plasma flux
  // Amplification through corridor coupling factor Gamma
  const helicalCoupling = eigenmodeWeights['mode-helical'] || 0.8;
  const octagonStability = eigenmodeWeights['mode-octagon'] || 0.85;
  const triangleBending = eigenmodeWeights['mode-triangle'] || 0.45;
  const vectorSteering = eigenmodeWeights['mode-vector'] || 0.5;

  const plasmaDensityFactor = 1.45e4; // Effective mass-flux momentum coupling
  const netCorridorThrustN = photonForceBase * plasmaDensityFactor * (0.5 + helicalCoupling * 0.5);

  // Transverse steering force (F_perp) proportional to thread offset and triangle/vector mode
  const steeringTorqueNm = transverseOffsetMeters * netCorridorThrustN * (triangleBending + vectorSteering);
  const axialThrustN = netCorridorThrustN * Math.cos(transverseOffsetMeters * Math.PI);

  // Coupled impedance calculation (target 376.73 Ohms)
  const impedanceDelta = (1 - octagonStability) * 45 - (transverseOffsetMeters * 35);
  const vesselImpedanceOhms = FREE_SPACE_IMPEDANCE - 11.7 + impedanceDelta;

  return {
    netCorridorThrustN,
    axialThrustN,
    steeringTorqueNm,
    vesselImpedanceOhms,
    referenceImpedanceOhms: FREE_SPACE_IMPEDANCE,
    isCoupled: Math.abs(vesselImpedanceOhms - FREE_SPACE_IMPEDANCE) < 35,
    stateMode: Math.abs(transverseOffsetMeters) < 0.05 ? ('CRUISE_GAMMA_0' as const) : ('VECTORING_GAMMA_DELTA' as const)
  };
}
