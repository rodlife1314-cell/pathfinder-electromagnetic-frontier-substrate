'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  DEFAULT_EIGENMODES, 
  EigenmodeState, 
  calculateCorridorThrust 
} from '../lib/electromagnetic-engine';
import { 
  Compass, 
  Layers, 
  ShieldCheck, 
  Sliders, 
  Navigation, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Anchor, 
  Zap, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const VesselAsEngineView: React.FC = () => {
  // 8-Eigenmode Mixture State: a_k(t)
  const [eigenmodes, setEigenmodes] = useState<EigenmodeState[]>(DEFAULT_EIGENMODES);

  // Thread Offset State: delta_r in meters (-0.8m to +0.8m)
  const [threadOffset, setThreadOffset] = useState<number>(0.0); // 0 = Gamma_0 (Cruise)

  // Corridor Selection & Environment
  const [corridorMedium, setCorridorMedium] = useState<string>('Heliospheric Current Sheet (Scenario 450 km/s)');
  // Interactive flight computer optimization
  const [autoFlightControl, setAutoFlightControl] = useState<boolean>(true);
  const [selectedHarborOverride, setSelectedHarborOverride] = useState<'HARBOUR' | 'ENTER_CORRIDOR' | 'CRUISE_GAMMA_0' | 'VECTORING_GAMMA_DELTA' | 'JUNCTION' | null>(null);

  // Derive harbor stage dynamically based on thread offset or manual cycle
  const harborStage: 'HARBOUR' | 'ENTER_CORRIDOR' | 'CRUISE_GAMMA_0' | 'VECTORING_GAMMA_DELTA' | 'JUNCTION' = useMemo(() => {
    if (selectedHarborOverride) return selectedHarborOverride;
    return Math.abs(threadOffset) < 0.04 ? 'CRUISE_GAMMA_0' : 'VECTORING_GAMMA_DELTA';
  }, [selectedHarborOverride, threadOffset]);

  // Eigenmode weights map
  const weightsMap = useMemo(() => {
    const map: Record<string, number> = {};
    eigenmodes.forEach(m => { map[m.id] = m.weight; });
    return map;
  }, [eigenmodes]);

  // Compute live corridor dynamics
  const corridorDynamics = useMemo(() => {
    // 45 W nominal Poynting power base
    return calculateCorridorThrust(0.082, threadOffset, weightsMap);
  }, [threadOffset, weightsMap]);

  // Update an individual eigenmode weight
  const handleWeightChange = (id: string, newWeight: number) => {
    setEigenmodes(prev => prev.map(m => m.id === id ? { ...m, weight: newWeight } : m));
  };

  // Flight Computer Auto-Rebalance
  const handleAutoRebalance = () => {
    if (Math.abs(threadOffset) < 0.05) {
      // Cruise state: maximize symmetry and boundary stability
      setEigenmodes(prev => prev.map(m => {
        if (m.id === 'mode-hexagon') return { ...m, weight: 0.98 };
        if (m.id === 'mode-octagon') return { ...m, weight: 0.90 };
        if (m.id === 'mode-triangle') return { ...m, weight: 0.20 };
        if (m.id === 'mode-vector') return { ...m, weight: 0.15 };
        return m;
      }));
    } else {
      // Vectoring state: increase triangle bending and vector steering
      setEigenmodes(prev => prev.map(m => {
        if (m.id === 'mode-triangle') return { ...m, weight: 0.85 };
        if (m.id === 'mode-vector') return { ...m, weight: 0.90 };
        if (m.id === 'mode-octagon') return { ...m, weight: 0.65 };
        return m;
      }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* Doctrine Banner */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs mb-1">
            <Navigation className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">VESSEL AS ENGINE • CORRIDOR DOCTRINE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Field-Routing Propulsion & 8-Eigenmode Synthesis Flight Computer
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed italic font-serif">
            “The pilot does not turn the ship. The pilot bends the thread through the ship.”
            <span className="not-italic font-sans text-zinc-400 block mt-1">
              The vessel is not a conventional thruster-driven craft. It couples to, reshapes, and exchanges momentum with ambient electromagnetic corridors:
              <strong className="text-emerald-300 font-mono ml-1">Δp_vessel = -Δp_corridor</strong>.
            </span>
          </p>
        </div>

        {/* Operating State Mode Badge */}
        <div className="bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800 text-xs font-mono shrink-0">
          <span className="text-zinc-500 block text-[10px]">CURRENT COUPLING REGIME</span>
          <span className={`font-bold text-sm ${
            corridorDynamics.stateMode === 'CRUISE_GAMMA_0' ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {corridorDynamics.stateMode === 'CRUISE_GAMMA_0' ? 'Γ₀: Thread-Centred / Cruise' : 'Γ_δ: Thread-Offset / Vectoring'}
          </span>
        </div>
      </div>

      {/* Main Grid: Visual Steering Canvas & Flight Computer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Steering & Thread Coupling Canvas (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono pb-2 border-b border-zinc-800">
            <span className="font-bold text-zinc-200">
              FIELD THREAD ROUTING CANVAS • PASS THE THREAD THROUGH THE CENTRE
            </span>
            <span className="text-cyan-400">Offset: {threadOffset.toFixed(2)}m</span>
          </div>

          {/* SVG Visualizer: Superimposed Nested Geometries with Thread Passing Through */}
          <div className="relative w-full max-w-[480px] aspect-square bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
            <svg viewBox="0 0 500 500" className="w-full h-full select-none">
              {/* Center Coordinate and Reference Rings */}
              <circle cx="250" cy="250" r="160" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="250" cy="250" r="100" fill="none" stroke="#27272a" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Superimposed 8 Eigenmode Geometry Layers */}
              {/* 1. Circle G_inf (Cyan) */}
              <circle cx="250" cy="250" r="140" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity={weightsMap['mode-circle'] * 0.6} />

              {/* 2. Octagon G_8 (Amber) */}
              <polygon
                points={Array.from({ length: 8 }, (_, i) => {
                  const a = (i * 2 * Math.PI) / 8;
                  return `${250 + 130 * Math.cos(a)},${250 + 130 * Math.sin(a)}`;
                }).join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeOpacity={weightsMap['mode-octagon'] * 0.7}
              />

              {/* 3. Hexagon G_6 (Emerald) */}
              <polygon
                points={Array.from({ length: 6 }, (_, i) => {
                  const a = (i * 2 * Math.PI) / 6;
                  return `${250 + 115 * Math.cos(a)},${250 + 115 * Math.sin(a)}`;
                }).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity={weightsMap['mode-hexagon'] * 0.8}
              />

              {/* 4. Square G_4 (Blue) */}
              <polygon
                points={Array.from({ length: 4 }, (_, i) => {
                  const a = (i * 2 * Math.PI) / 4 + Math.PI / 4;
                  return `${250 + 95 * Math.cos(a)},${250 + 95 * Math.sin(a)}`;
                }).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.2"
                strokeOpacity={weightsMap['mode-square'] * 0.6}
              />

              {/* 5. Triangle G_3 (Pink) */}
              <polygon
                points={Array.from({ length: 3 }, (_, i) => {
                  const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
                  return `${250 + 85 * Math.cos(a)},${250 + 85 * Math.sin(a)}`;
                }).join(' ')}
                fill="none"
                stroke="#ec4899"
                strokeWidth="1.5"
                strokeOpacity={weightsMap['mode-triangle'] * 0.7}
              />

              {/* Central Vessel Coupling Core */}
              <circle cx="250" cy="250" r="14" fill="#18181b" stroke="#52525b" strokeWidth="2" />
              <text x="250" y="254" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">CORE</text>

              {/* THE CORRIDOR THREAD PASSING THROUGH THE VESSEL */}
              {/* Entry Thread from left */}
              <path
                d={`M 10 250 C 120 250, 180 ${250 + threadOffset * 120}, ${250 + threadOffset * 120} ${250 + threadOffset * 120} S 380 250, 490 250`}
                fill="none"
                stroke={corridorDynamics.stateMode === 'CRUISE_GAMMA_0' ? '#10b981' : '#f59e0b'}
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-150"
              />

              {/* Flux Thread Particles / Glow */}
              <circle
                cx={250 + threadOffset * 120}
                cy={250 + threadOffset * 120}
                r="7"
                fill={corridorDynamics.stateMode === 'CRUISE_GAMMA_0' ? '#34d399' : '#fbbf24'}
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Vector Force Arrows */}
              {corridorDynamics.stateMode === 'VECTORING_GAMMA_DELTA' && (
                <line
                  x1={250 + threadOffset * 120}
                  y1={250 + threadOffset * 120}
                  x2={250 + threadOffset * 120}
                  y2={250 + threadOffset * 120 - 45}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow)"
                />
              )}
            </svg>

            {/* Canvas Overlay Header */}
            <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-[11px] font-mono">
              <span className="text-zinc-500 block text-[9px]">CORRIDOR ENVIRONMENT</span>
              <span className="text-cyan-300 font-semibold">{corridorMedium}</span>
            </div>

            {/* Steer Instructions */}
            <div className="absolute bottom-3 text-center text-[11px] font-mono text-zinc-400 bg-zinc-950/80 px-3 py-1 rounded border border-zinc-800">
              ADJUST SLIDER TO BEND THREAD (VECTORING)
            </div>
          </div>

          {/* Thread Steering Slider */}
          <div className="w-full space-y-2 text-xs font-mono pt-2">
            <div className="flex justify-between items-center text-zinc-300">
              <span className="flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Thread Displacement (δr):</span>
              </span>
              <span className={`font-bold ${Math.abs(threadOffset) < 0.05 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {threadOffset.toFixed(2)} m {Math.abs(threadOffset) < 0.05 ? '(Cruise Γ₀)' : '(Vectoring Γ_δ)'}
              </span>
            </div>

            <input
              type="range"
              min="-0.75"
              max="0.75"
              step="0.02"
              value={threadOffset}
              onChange={e => setThreadOffset(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
              <span>Port Vector (-0.75m)</span>
              <button 
                onClick={() => setThreadOffset(0)}
                className="text-cyan-400 hover:underline"
              >
                Center Thread (Cruise Γ₀)
              </button>
              <span>Starboard Vector (+0.75m)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Impedance Matching, Thrust & 8-Eigenmodes (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Flight Computer Telemetry */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-zinc-200 uppercase tracking-wider">
                FLIGHT COMPUTER TELEMETRY
              </span>
              <button
                onClick={handleAutoRebalance}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-cyan-300 transition-colors"
              >
                Auto-Optimize a*(t)
              </button>
            </div>

            {/* Impedance Coupling Meter */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-400">Coupled Wave Impedance:</span>
                <span className="text-emerald-400 font-bold">
                  {corridorDynamics.vesselImpedanceOhms.toFixed(1)} Ω
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-500">
                <span>Free Space Target (Z₀):</span>
                <span>{corridorDynamics.referenceImpedanceOhms.toFixed(1)} Ω</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${Math.min(100, (corridorDynamics.vesselImpedanceOhms / 377) * 100)}%` }} 
                />
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center space-x-1 pt-0.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Impedance matched: Stable corridor coupling maintained.</span>
              </div>
            </div>

            {/* Net Corridor Thrust */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block">NET CORRIDOR THRUST</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {(corridorDynamics.axialThrustN * 1e6).toFixed(1)} µN
                </span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">Momentum Exchange</span>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block">STEERING TORQUE</span>
                <span className="text-amber-400 font-bold text-sm">
                  {(Math.abs(corridorDynamics.steeringTorqueNm) * 1e6).toFixed(1)} µN·m
                </span>
                <span className="text-[9px] text-zinc-500 block mt-0.5">Transverse Vector</span>
              </div>
            </div>
          </div>

          {/* 8-Eigenmode Synthesis Sliders: Psi(t) = sum a_k psi_k */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-zinc-200 uppercase tracking-wider">
                8-Eigenmode Synthesis [Ψ = ∑ a_k ψ_k]
              </span>
              <span className="text-[10px] text-zinc-500">State Vector a(t)</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {eigenmodes.map(mode => (
                <div key={mode.id} className="p-2 rounded bg-zinc-950 border border-zinc-800/80 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-zinc-200 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mode.color }} />
                      <span>{mode.name} ({mode.symbol})</span>
                    </span>
                    <span className="text-zinc-400 text-[10px]">{mode.role}</span>
                    <span className="text-zinc-200 font-bold">{(mode.weight * 100).toFixed(0)}%</span>
                  </div>

                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={mode.weight}
                    onChange={e => handleWeightChange(mode.id, parseFloat(e.target.value))}
                    className="w-full accent-zinc-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Nautical Vocabulary / Harbour Cycle */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs font-mono">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
              CORRIDOR NAUTICAL CYCLE
            </span>
            <div className="flex items-center justify-between text-[11px] p-2 bg-zinc-950 rounded border border-zinc-800">
              <span className={harborStage === 'HARBOUR' ? 'text-cyan-400 font-bold' : 'text-zinc-500'}>HARBOUR</span>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <span className={harborStage === 'CRUISE_GAMMA_0' ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>CRUISE (Γ₀)</span>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <span className={harborStage === 'VECTORING_GAMMA_DELTA' ? 'text-amber-400 font-bold' : 'text-zinc-400'}>VECTORING (Γ_δ)</span>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <span className="text-zinc-500">JUNCTION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
