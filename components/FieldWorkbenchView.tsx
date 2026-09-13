'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  SourceState, 
  PolygonConfig, 
  simulatePolygonGeometry, 
  GeometrySimulationResult 
} from '../lib/electromagnetic-engine';
import { 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Zap, 
  Activity, 
  Maximize2, 
  Radio, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const FieldWorkbenchView: React.FC = () => {
  // Source State: N_0(t) = (x, y, z0)
  const [source, setSource] = useState<SourceState>({
    x: 0,
    y: 0,
    z0: 0.8,
    power: 45.0,
    frequency: 2.4, // GHz
    phase: 0
  });

  // Selected polygon ecosystem
  const [activeN, setActiveN] = useState<number>(6); // Default Hexagon (G_6 reference)
  const [circumradius, setCircumradius] = useState<number>(1.0); // R = 1.0m
  const [activeTab, setActiveTab] = useState<'visual' | 'nodal' | 'physics'>('visual');

  // Animation Trajectory State
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [trajectoryMode, setTrajectoryMode] = useState<'orbit' | 'figure8' | 'sweep'>('orbit');
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // SVG Dragging State for Yellow Source N_0
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const polygonConfig: PolygonConfig = useMemo(() => {
    const labels: Record<number, string> = {
      3: 'G₃ Equilateral Triangle',
      4: 'G₄ Regular Square',
      5: 'G₅ Regular Pentagon',
      6: 'G₆ Regular Hexagon [Optimal Reference]',
      8: 'G₈ Regular Octagon'
    };
    return {
      n: activeN,
      label: labels[activeN] || `G_${activeN} Regular Polygon`,
      radius: circumradius,
      apertureArea: 0.12 // normalized 0.12 m^2 total
    };
  }, [activeN, circumradius]);

  // Compute live Poynting integration and Jacobians
  const simulation: GeometrySimulationResult = useMemo(() => {
    return simulatePolygonGeometry(polygonConfig, source);
  }, [polygonConfig, source]);

  // Animation Loop
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      timeRef.current += 0.02;
      const t = timeRef.current;

      let nextX = 0;
      let nextY = 0;

      if (trajectoryMode === 'orbit') {
        const orbitRadius = 0.35 * circumradius;
        nextX = orbitRadius * Math.cos(t);
        nextY = orbitRadius * Math.sin(t);
      } else if (trajectoryMode === 'figure8') {
        const scale = 0.4 * circumradius;
        nextX = scale * Math.sin(t);
        nextY = scale * Math.sin(2 * t) / 2;
      } else if (trajectoryMode === 'sweep') {
        const sweepRange = 0.6 * circumradius;
        nextX = sweepRange * Math.sin(t);
        nextY = 0;
      }

      setSource(prev => ({
        ...prev,
        x: Number(nextX.toFixed(3)),
        y: Number(nextY.toFixed(3)),
        phase: (prev.phase + 0.1) % (2 * Math.PI)
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating, trajectoryMode, circumradius]);

  // Mouse Drag Handler for yellow source N_0(t)
  const handleMouseDown = () => {
    if (isAnimating) setIsAnimating(false);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const scaleFactor = (rect.width / 2) / (circumradius * 1.5);

    const rawX = (e.clientX - centerX) / scaleFactor;
    const rawY = (e.clientY - centerY) / scaleFactor;

    // Clamp within 1.2 * circumradius
    const maxR = circumradius * 1.2;
    const dist = Math.sqrt(rawX * rawX + rawY * rawY);
    const clampedDist = Math.min(dist, maxR);
    const angle = Math.atan2(rawY, rawX);

    setSource(prev => ({
      ...prev,
      x: Number((clampedDist * Math.cos(angle)).toFixed(3)),
      y: Number((clampedDist * Math.sin(angle)).toFixed(3))
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // SVG Coordinates mapping: canvas is 500x500, centered at (250, 250)
  const svgCenter = 250;
  const svgScale = 150 / circumradius;

  const sourceSvgX = svgCenter + source.x * svgScale;
  const sourceSvgY = svgCenter + source.y * svgScale;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs mb-1">
            <Radio className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">ELECTROMAGNETIC FIELD WORKBENCH</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Poynting Flux Redistribution: N₀(t) Trajectory & Nodal Capture Suite
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Investigating dynamic boundary interactions where the central propagating source{' '}
            <strong className="text-amber-300 font-mono">N₀(t) = (x(t), y(t), z₀)</strong> radiates Poynting flux{' '}
            <strong className="text-cyan-300 font-mono">S = E × H</strong> into polygonal receiver ecosystems{' '}
            <strong className="text-zinc-200 font-mono">G_n</strong>. Drag the yellow source to break spatial symmetry and observe instantaneous nodal absorption.
          </p>
        </div>

        {/* Quick Polygon Selector */}
        <div className="flex items-center space-x-1.5 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 shrink-0">
          {[3, 4, 5, 6, 8].map(n => (
            <button
              key={n}
              onClick={() => setActiveN(n)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                activeN === n
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              G{n} {n === 6 && '★'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Live Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 2D Poynting Canvas (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs font-mono pb-2 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-zinc-200">{polygonConfig.label}</span>
            </div>

            <div className="flex items-center space-x-3 text-zinc-400">
              <span>Source: <strong className="text-amber-300 font-mono">({source.x.toFixed(2)}m, {source.y.toFixed(2)}m)</strong></span>
              <span>Chord: <strong className="text-cyan-400 font-mono">{simulation.nearestChord.toFixed(2)}m</strong></span>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative w-full max-w-[480px] aspect-square bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden shadow-inner flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 500 500"
              className="w-full h-full cursor-crosshair select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#27272a" strokeWidth="0.5" />
                </pattern>
                {/* Radial Gradient for Poynting Source Glow */}
                <radialGradient id="sourceGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="500" height="500" fill="url(#grid)" />

              {/* Concentric Reference Circles */}
              <circle cx={svgCenter} cy={svgCenter} r={circumradius * svgScale} fill="none" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={svgCenter} cy={svgCenter} r={circumradius * svgScale * 0.5} fill="none" stroke="#27272a" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Wave Radiations from Yellow Source N_0(t) */}
              {[40, 80, 120, 160, 200].map((radius, idx) => (
                <circle
                  key={idx}
                  cx={sourceSvgX}
                  cy={sourceSvgY}
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="0.8"
                  strokeOpacity={0.4 - idx * 0.07}
                />
              ))}

              {/* Polygon Perimeter Boundary Wire */}
              <polygon
                points={simulation.nodalPowers.map(p => `${svgCenter + p.x * svgScale},${svgCenter + p.y * svgScale}`).join(' ')}
                fill="none"
                stroke={activeN === 6 ? '#10b981' : '#06b6d4'}
                strokeWidth="2"
                strokeOpacity="0.6"
              />

              {/* Poynting Flux Rays from Source to Each Receiver Node */}
              {simulation.nodalPowers.map((p) => {
                const nx = svgCenter + p.x * svgScale;
                const ny = svgCenter + p.y * svgScale;
                const powerRatio = p.powerWatts / (simulation.maxPowerNode ? simulation.nodalPowers[simulation.maxPowerNode - 1].powerWatts : 1);

                return (
                  <g key={p.nodeIndex}>
                    <line
                      x1={sourceSvgX}
                      y1={sourceSvgY}
                      x2={nx}
                      y2={ny}
                      stroke="#f59e0b"
                      strokeWidth={1 + powerRatio * 2}
                      strokeOpacity={0.2 + powerRatio * 0.5}
                      strokeDasharray="4 2"
                    />
                  </g>
                );
              })}

              {/* Polygon Receiver Nodes (P_1 ... P_n) */}
              {simulation.nodalPowers.map((p) => {
                const nx = svgCenter + p.x * svgScale;
                const ny = svgCenter + p.y * svgScale;
                const isMax = p.nodeIndex === simulation.maxPowerNode;

                return (
                  <g key={p.nodeIndex}>
                    {/* Outer Absorption Aura */}
                    <circle
                      cx={nx}
                      cy={ny}
                      r={10 + p.powerWatts * 35}
                      fill={isMax ? '#10b981' : '#06b6d4'}
                      fillOpacity={0.25}
                    />

                    {/* Physical Receiver Node Marker */}
                    <circle
                      cx={nx}
                      cy={ny}
                      r="6"
                      fill={isMax ? '#34d399' : '#22d3ee'}
                      stroke="#09090b"
                      strokeWidth="2"
                    />

                    {/* Node Label & Live Power in mW */}
                    <text
                      x={nx}
                      y={ny - 12}
                      textAnchor="middle"
                      fill="#e4e4e7"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      P{p.nodeIndex} ({(p.powerWatts * 1000).toFixed(1)}mW)
                    </text>
                  </g>
                );
              })}

              {/* Central Geometric Origin Reference (0,0) */}
              <circle cx={svgCenter} cy={svgCenter} r="3" fill="#71717a" />
              <text x={svgCenter + 6} y={svgCenter + 4} fill="#71717a" fontSize="9" fontFamily="monospace">
                (0,0)
              </text>

              {/* Draggable Yellow Source N_0(t) */}
              <g>
                <circle cx={sourceSvgX} cy={sourceSvgY} r="32" fill="url(#sourceGlow)" />
                <circle
                  cx={sourceSvgX}
                  cy={sourceSvgY}
                  r="9"
                  fill="#fbbf24"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="cursor-grab active:cursor-grabbing"
                />
                <text
                  x={sourceSvgX}
                  y={sourceSvgY + 22}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  N₀(t)
                </text>
              </g>
            </svg>

            {/* Overlay Indicator */}
            <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-zinc-800 text-[10px] font-mono text-zinc-400">
              CLICK & DRAG <span className="text-amber-400 font-bold">N₀</span> TO DISTORT FIELD
            </div>
          </div>

          {/* Trajectory & Animation Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition-colors font-semibold ${
                  isAnimating
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAnimating ? 'Halt Sweep' : 'Animate Sweep'}</span>
              </button>

              <button
                onClick={() => {
                  setIsAnimating(false);
                  setSource(prev => ({ ...prev, x: 0, y: 0 }));
                }}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center space-x-1"
                title="Reset to Center (Cruise Gamma_0)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Center</span>
              </button>
            </div>

            {/* Trajectory Pattern Presets */}
            <div className="flex items-center space-x-1 text-[11px]">
              <span className="text-zinc-500 mr-1">PATH:</span>
              <button
                onClick={() => setTrajectoryMode('orbit')}
                className={`px-2 py-1 rounded ${trajectoryMode === 'orbit' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-zinc-400 hover:bg-zinc-800'}`}
              >
                Orbit
              </button>
              <button
                onClick={() => setTrajectoryMode('figure8')}
                className={`px-2 py-1 rounded ${trajectoryMode === 'figure8' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-zinc-400 hover:bg-zinc-800'}`}
              >
                Figure-8
              </button>
              <button
                onClick={() => setTrajectoryMode('sweep')}
                className={`px-2 py-1 rounded ${trajectoryMode === 'sweep' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-zinc-400 hover:bg-zinc-800'}`}
              >
                Linear
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Controls & Measurements (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-time Scalar Telemetry */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block border-b border-zinc-800 pb-2">
              MEASUREMENT TELEMETRY • {polygonConfig.label}
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">TOTAL CAPTURED</span>
                <span className="text-emerald-400 font-bold text-base">
                  {(simulation.totalCapturedWatts * 1000).toFixed(2)} mW
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  ({simulation.efficiencyPercent.toFixed(3)}% efficiency)
                </span>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">FIELD UNIFORMITY U</span>
                <span className={`font-bold text-base ${
                  simulation.fieldUniformityPercent > 80 ? 'text-cyan-400' : 'text-amber-400'
                }`}>
                  {simulation.fieldUniformityPercent.toFixed(1)}%
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  {source.x === 0 && source.y === 0 ? 'Symmetric (100%)' : 'Asymmetric Distorted'}
                </span>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">NEAREST CHORD c_n</span>
                <span className="text-zinc-200 font-bold text-base">
                  {simulation.nearestChord.toFixed(3)} m
                </span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">
                  c_n / R = {simulation.nearestChordRatio.toFixed(3)} {activeN === 6 && '(= 1.000)'}
                </span>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">AXIAL SENSITIVITY ||J_z||</span>
                <span className="text-amber-300 font-bold text-base">
                  {simulation.axialSensitivityNorm.toFixed(4)}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  ∂P/∂z₀ L2 gradient
                </span>
              </div>
            </div>
          </div>

          {/* Controlled Experimental Baseline Sliders */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3.5 text-xs font-mono">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold block border-b border-zinc-800 pb-2">
              CONTROLLED EXPERIMENTAL PARAMETERS
            </span>

            {/* Source Elevation z0 */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Source Elevation (Axial Height z₀):</span>
                <span className="text-amber-400 font-bold">{source.z0.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={source.z0}
                onChange={e => setSource(prev => ({ ...prev, z0: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Input Power */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Source Input Power (P_in):</span>
                <span className="text-emerald-400 font-bold">{source.power.toFixed(0)} W</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={source.power}
                onChange={e => setSource(prev => ({ ...prev, power: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Circumradius R */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Geometric Circumradius (R):</span>
                <span className="text-cyan-400 font-bold">{circumradius.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={circumradius}
                onChange={e => setCircumradius(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Detailed Nodal Vector Tab */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-[11px] text-zinc-300 font-bold uppercase">
                Nodal Vector [P₁ ... P{activeN}]
              </span>
              <span className="text-[10px] text-zinc-500">
                Max: Node {simulation.maxPowerNode}
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {simulation.nodalPowers.map(p => {
                const isMax = p.nodeIndex === simulation.maxPowerNode;
                const maxVal = simulation.nodalPowers[simulation.maxPowerNode - 1]?.powerWatts || 1;
                const pct = (p.powerWatts / maxVal) * 100;

                return (
                  <div key={p.nodeIndex} className="p-2 rounded bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className={isMax ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                        P{p.nodeIndex} ({p.x > 0 ? '+' : ''}{p.x.toFixed(2)}, {p.y > 0 ? '+' : ''}{p.y.toFixed(2)})
                      </span>
                      <span className="text-zinc-200 font-bold">
                        {(p.powerWatts * 1000).toFixed(2)} mW
                      </span>
                    </div>

                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isMax ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
