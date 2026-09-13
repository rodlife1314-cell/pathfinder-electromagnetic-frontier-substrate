'use client';

import React, { useState, useMemo } from 'react';
import { 
  simulatePolygonGeometry, 
  SourceState, 
  GeometrySimulationResult 
} from '../lib/electromagnetic-engine';
import { 
  Copy, 
  Check, 
  Sliders, 
  Layers, 
  BarChart3, 
  Sparkles, 
  HelpCircle, 
  Info,
  ExternalLink 
} from 'lucide-react';

export const GeometryBenchmarkView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  // Controlled Baseline Parameters
  const [sourceElevation, setSourceElevation] = useState<number>(0.8); // z0 = 0.8m
  const [inputPower, setInputPower] = useState<number>(45.0); // 45 W
  const [circumradius, setCircumradius] = useState<number>(1.0); // R = 1.0m
  const [transverseOffset, setTransverseOffset] = useState<number>(0.0); // dx = 0.0m on-axis baseline

  const source: SourceState = useMemo(() => ({
    x: transverseOffset,
    y: 0,
    z0: sourceElevation,
    power: inputPower,
    frequency: 2.4,
    phase: 0
  }), [transverseOffset, sourceElevation, inputPower]);

  // Run benchmark across all standard geometries
  const polygonPolys = useMemo(() => [
    { n: 3, label: 'Triangle (G₃)' },
    { n: 4, label: 'Square (G₄)' },
    { n: 5, label: 'Pentagon (G₅)' },
    { n: 6, label: 'Hexagon (G₆) [Reference]' },
    { n: 8, label: 'Octagon (G₈)' }
  ], []);

  const benchmarkResults: GeometrySimulationResult[] = useMemo(() => {
    return polygonPolys.map(poly => simulatePolygonGeometry(
      { n: poly.n, label: poly.label, radius: circumradius, apertureArea: 0.12 },
      source
    ));
  }, [polygonPolys, circumradius, source]);

  // Generate formatted benchmark report for clipboard export
  const benchmarkReportText = useMemo(() => {
    let report = `Electromagnetic Energy Distribution Simulation Report\n`;
    report += `Under strictly controlled and normalized source conditions, the electromagnetic field propagating from the central trajectory N_0(t) was simulated across regular polygonal receiver ecosystems G_n with vertices n in {3, 4, 5, 6, 8}.\n\n`;
    report += `1. Controlled Experimental Baseline\n`;
    report += `- Source Elevation (Axial Height z_0): ${sourceElevation.toFixed(2)} m\n`;
    report += `- Input Power (P_in): ${inputPower.toFixed(1)} W\n`;
    report += `- Geometric Radius (R): ${circumradius.toFixed(2)} m\n`;
    report += `- Total Receiver Aperture Area: 0.120 m² (normalized such that each node's aperture is 0.120/n m²)\n`;
    report += `- Substrate Relative Permittivity: 1.00\n`;
    report += `- Dissipative Conductivity: 0.002 S/m\n`;
    report += `- Transverse Perturbation dx: ${transverseOffset.toFixed(2)} m\n\n`;

    report += `2. Systematic Measurement Matrix\n`;
    report += `Geometry Ecosystem\tVertices (n)\tNearest Chord (c_n)\tCaptured (W)\tEfficiency (%)\tUniformity (%)\tAxial ||J_z||\tScale ||J_R||\n`;
    benchmarkResults.forEach(r => {
      report += `${r.name}\t${r.n}\t${r.nearestChord.toFixed(3)}m (${(r.nearestChordRatio).toFixed(3)}R)\t${r.totalCapturedWatts.toFixed(5)}W\t${r.efficiencyPercent.toFixed(3)}%\t${r.fieldUniformityPercent.toFixed(1)}%\t${r.axialSensitivityNorm.toFixed(4)}\t${r.scaleSensitivityNorm.toFixed(4)}\n`;
    });

    report += `\n3. Detailed Nodal Power Vectors & Sensitivity Jacobians\n`;
    benchmarkResults.forEach(r => {
      report += `\n--- ${r.name} ---\n`;
      report += `Nodal Power Vector P_${r.n} (W): [${r.nodalPowers.map(p => p.powerWatts.toFixed(5)).join(', ')}]\n`;
      report += `Axial Sensitivity Jacobian J_z: [${r.nodalPowers.map(p => p.axialJacobianJz.toFixed(4)).join(', ')}]\n`;
      report += `Geometric Scale Jacobian J_R: [${r.nodalPowers.map(p => p.scaleJacobianJR.toFixed(4)).join(', ')}]\n`;
    });

    report += `\n4. Physical Synthesis of Geometric Redistribution\n`;
    report += `- Hexagonal Geometry (G_6): Nearest chord length c_6 equals circumradius R (c_6 = R = ${circumradius.toFixed(2)}m). Synchronizes radial Poynting flux with boundary coupling.\n`;
    report += `- Parity Effects: On-axis (dx=0), cyclic symmetry is preserved. Under transverse offset (dx!=0), odd-order polygons (G_3, G_5) exhibit phase frustration due to lack of spatial inversion centers.\n`;
    report += `- Axial Sensitivity Scaling: Higher vertex count dampens sensitivity norm ||J_z|| monotonically, acting as a spatial low-pass filter.\n`;

    return report;
  }, [sourceElevation, inputPower, circumradius, transverseOffset, benchmarkResults]);

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(benchmarkReportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">G_n SYSTEMATIC TOPOLOGY SUITE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Electromagnetic Comparative Matrix & Sensitivity Jacobians
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Standardized benchmark comparing <strong className="text-zinc-200">G₃, G₄, G₅, G₆ [Reference], and G₈</strong> under strictly normalized aperture and source conditions. 
            Demonstrates how boundary topology governs Poynting capture efficiency, nearest-chord ratio, and gradient sensitivities.
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono flex items-center space-x-2 transition-colors shrink-0 shadow-md"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Benchmark Report Copied!' : 'Copy Benchmark Report'}</span>
        </button>
      </div>

      {/* Controlled Parameter Sliders */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-zinc-200">CONTROLLED BASELINE:</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-500">Elevation z₀:</span>
            <input
              type="number"
              step="0.1"
              value={sourceElevation}
              onChange={e => setSourceElevation(parseFloat(e.target.value) || 0.1)}
              className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-200"
            />
            <span className="text-zinc-500">m</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-zinc-500">Input Power:</span>
            <input
              type="number"
              step="5"
              value={inputPower}
              onChange={e => setInputPower(parseFloat(e.target.value) || 10)}
              className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-200"
            />
            <span className="text-zinc-500">W</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-zinc-500">Radius R:</span>
            <input
              type="number"
              step="0.1"
              value={circumradius}
              onChange={e => setCircumradius(parseFloat(e.target.value) || 0.5)}
              className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-200"
            />
            <span className="text-zinc-500">m</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-zinc-500">Transverse dx:</span>
            <input
              type="number"
              step="0.05"
              value={transverseOffset}
              onChange={e => setTransverseOffset(parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-zinc-200"
            />
            <span className="text-zinc-500">m</span>
          </div>
        </div>
      </div>

      {/* Systematic Benchmark Matrix Table */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono">
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            2. Systematic Measurement Matrix (Normalized Aperture = 0.120 m²)
          </span>
          <span className="text-zinc-500">G₆ = Reference Geometry Baseline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="py-2.5 px-3">Geometry Ecosystem</th>
                <th className="py-2.5 px-3">Vertices (n)</th>
                <th className="py-2.5 px-3">Nearest Chord (c_n)</th>
                <th className="py-2.5 px-3">Captured Power</th>
                <th className="py-2.5 px-3">Efficiency (η)</th>
                <th className="py-2.5 px-3">Uniformity (U)</th>
                <th className="py-2.5 px-3">Axial ||J_z||</th>
                <th className="py-2.5 px-3">Scale ||J_R||</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {benchmarkResults.map(r => (
                <tr 
                  key={r.n}
                  className={`transition-colors ${
                    r.isReference 
                      ? 'bg-emerald-950/20 hover:bg-emerald-950/30' 
                      : 'hover:bg-zinc-800/40'
                  }`}
                >
                  <td className="py-3 px-3 font-semibold text-zinc-200 flex items-center space-x-2">
                    {r.isReference && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                    <span>{r.name}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{r.n}</td>
                  <td className="py-3 px-3">
                    <span className="text-zinc-300 font-bold">{r.nearestChord.toFixed(3)}m</span>
                    <span className={`text-[10px] ml-1.5 ${r.n === 6 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                      ({r.nearestChordRatio.toFixed(3)} R)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    {(r.totalCapturedWatts * 1000).toFixed(2)} mW
                  </td>
                  <td className="py-3 px-3 text-cyan-300 font-bold">
                    {r.efficiencyPercent.toFixed(3)}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={r.fieldUniformityPercent > 85 ? 'text-cyan-400' : 'text-amber-400'}>
                      {r.fieldUniformityPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-amber-300">
                    {r.axialSensitivityNorm.toFixed(4)}
                  </td>
                  <td className="py-3 px-3 text-zinc-400">
                    {r.scaleSensitivityNorm.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Nodal Power Vectors & Sensitivity Jacobians Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
          3. Detailed Nodal Power Vectors [P₁...Pₙ] & Sensitivity Jacobians
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarkResults.map(r => (
            <div 
              key={r.n}
              className={`p-4 rounded-xl border text-xs font-mono space-y-3 ${
                r.isReference 
                  ? 'bg-zinc-900 border-emerald-800/80 shadow-emerald-950/20 shadow-lg' 
                  : 'bg-zinc-900/90 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-zinc-100">{r.name}</span>
                <span className="text-[10px] text-zinc-500">n = {r.n} vertices</span>
              </div>

              {/* Nodal Power Vector */}
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase mb-1">Nodal Power Vector P_{r.n} (mW):</span>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[11px] text-emerald-400 font-mono">
                  [{r.nodalPowers.map(p => (p.powerWatts * 1000).toFixed(2)).join(', ')}]
                </div>
              </div>

              {/* Axial Sensitivity Jacobian J_z */}
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase mb-1">Axial Sensitivity Jacobian J_z (∂P/∂z₀):</span>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[11px] text-amber-300 font-mono">
                  [{r.nodalPowers.map(p => p.axialJacobianJz.toFixed(4)).join(', ')}]
                </div>
              </div>

              {/* Geometric Scale Jacobian J_R */}
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase mb-1">Scale Jacobian J_R (∂P/∂R):</span>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[11px] text-cyan-300 font-mono">
                  [{r.nodalPowers.map(p => p.scaleJacobianJR.toFixed(4)).join(', ')}]
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between text-[10px] text-zinc-500">
                <span>Nearest Chord: {r.nearestChord.toFixed(2)}m</span>
                <span className="text-zinc-300 font-bold">||J_z|| = {r.axialSensitivityNorm.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Synthesis Section */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
          4. Physical Synthesis of Geometric Redistribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="font-mono text-emerald-400 font-bold text-xs uppercase block">
              The Hexagonal Resonance (G₆):
            </span>
            <p className="text-zinc-300 leading-relaxed">
              The regular hexagon exhibits the highest relative efficiency because its nearest-neighbor chord length is mathematically identical to its circumradius:
            </p>
            <div className="p-2 rounded bg-zinc-900 font-mono text-center text-cyan-300">
              c₆ = 2R · sin(π/6) = R
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              In a coupled substrate, c₆ = R synchronizes the radial phase delay with circumferential boundary wave propagation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="font-mono text-amber-400 font-bold text-xs uppercase block">
              Parity & Spatial Inversion Effects:
            </span>
            <p className="text-zinc-300 leading-relaxed">
              On-axis, all regular polygons preserve cyclic symmetry. However, under transverse perturbation (dx ≠ 0), odd-order polygons (G₃, G₅) lack spatial inversion centers (r → -r).
            </p>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Even polygons (G₄, G₆, G₈) split perturbations into balanced orthogonal dipole/quadrupole mode pairs, maintaining higher field uniformity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="font-mono text-cyan-400 font-bold text-xs uppercase block">
              Sensitivity Scaling (||J_z||):
            </span>
            <p className="text-zinc-300 leading-relaxed">
              As vertex count n increases, the axial sensitivity norm ||J_z|| decreases monotonically from Triangle down to Octagon.
            </p>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Higher vertex counts distribute Poynting flux over a denser boundary array, acting as a geometric spatial low-pass filter that dampens sensitivity to source oscillations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
