import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Cpu, Layers, Activity, Download, Trash2, Edit3, Gauge } from 'lucide-react';
import { AgentInfo, ConwayAgentState, SupportedLanguage } from '../types';
import {
  CONWAY_WIDTH,
  CONWAY_HEIGHT,
  createSeededGrid,
  computeNextGeneration,
  createEmptyGrid,
} from '../utils/conwayEngine';
import confetti from 'canvas-confetti';

interface ConwayAutomatonVisualizerProps {
  agents: AgentInfo[];
  language: SupportedLanguage;
}

export const ConwayAutomatonVisualizer: React.FC<ConwayAutomatonVisualizerProps> = ({
  agents,
  language,
}) => {
  const isHi = language === 'hi';
  const [grid, setGrid] = useState<boolean[][]>(() => createSeededGrid('agent_mesh'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(1);
  const [population, setPopulation] = useState(48);
  const [entropy, setEntropy] = useState(0.842);
  const [speedMs, setSpeedMs] = useState(250);
  const [brushMode, setBrushMode] = useState<'draw' | 'erase'>('draw');
  const [activePattern, setActivePattern] = useState<'agent_mesh' | 'pulsar' | 'glider' | 'random'>('agent_mesh');

  // Agent location tracker in grid
  const [agentCoords, setAgentCoords] = useState<Record<string, { x: number; y: number }>>({
    'agent-1': { x: 4, y: 3 },
    'agent-2': { x: CONWAY_WIDTH - 5, y: 3 },
    'agent-3': { x: 5, y: CONWAY_HEIGHT - 3 },
    'agent-4': { x: CONWAY_WIDTH - 5, y: CONWAY_HEIGHT - 3 },
  });

  const stepSimulation = () => {
    const { newGrid, population: newPop, entropy: newEnt } = computeNextGeneration(grid);
    setGrid(newGrid);
    setPopulation(newPop);
    setEntropy(newEnt);
    setGeneration((g) => g + 1);

    // Gently drift agent nodes along cellular energy gradients
    setAgentCoords((prev) => {
      const next: Record<string, { x: number; y: number }> = {};
      for (const id of Object.keys(prev)) {
        const pos = prev[id];
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.floor(Math.random() * 3) - 1;
        next[id] = {
          x: Math.max(1, Math.min(CONWAY_WIDTH - 2, pos.x + dx)),
          y: Math.max(1, Math.min(CONWAY_HEIGHT - 2, pos.y + dy)),
        };
      }
      return next;
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(stepSimulation, speedMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, grid, speedMs]);

  const handlePatternChange = (pattern: 'agent_mesh' | 'pulsar' | 'glider' | 'random') => {
    setActivePattern(pattern);
    const seeded = createSeededGrid(pattern);
    setGrid(seeded);
    setGeneration(1);
    let pop = 0;
    seeded.forEach((row) => row.forEach((c) => c && pop++));
    setPopulation(pop);
  };

  const handleClearGrid = () => {
    const empty = createEmptyGrid();
    setGrid(empty);
    setPopulation(0);
    setEntropy(0);
    setGeneration(0);
    setIsPlaying(false);
  };

  const handleCellClick = (y: number, x: number) => {
    const next = grid.map((r, ry) =>
      r.map((c, cx) => {
        if (ry === y && cx === x) {
          return brushMode === 'draw' ? true : false;
        }
        return c;
      })
    );
    setGrid(next);
    let pop = 0;
    next.forEach((r) => r.forEach((cell) => cell && pop++));
    setPopulation(pop);
  };

  const handleExportGridJson = () => {
    const data = {
      spec: 'ALCAT Conway B3/S23 Grid State',
      generation,
      population,
      entropy,
      dimensions: { width: CONWAY_WIDTH, height: CONWAY_HEIGHT },
      agentPositions: agentCoords,
      matrix: grid,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ALCAT_CONWAY_GRID_GEN_${generation}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statePipeline: { state: ConwayAgentState; label: string; desc: string; color: string }[] = [
    { state: 'IDLE', label: '1. IDLE', desc: isHi ? 'सिस्टम स्टैंडबाय' : 'Standby & Listening', color: 'bg-slate-700' },
    { state: 'DISCOVER', label: '2. DISCOVER', desc: isHi ? 'API व ओरेकल खोज' : 'Querying API Nodes', color: 'bg-emerald-600' },
    { state: 'NEGOTIATE', label: '3. NEGOTIATE', desc: isHi ? 'SLA मूल्य मोलभाव' : 'Bargaining Dynamic SLA', color: 'bg-cyan-600' },
    { state: 'SIGN_PQC', label: '4. SIGN PQC', desc: isHi ? 'ML-DSA-65 हस्ताक्षर' : 'Dilithium Lattice Sign', color: 'bg-indigo-600' },
    { state: 'SETTLE_X402', label: '5. SETTLE X402', desc: isHi ? 'एटॉमिक माइक्रोपेमेंट' : 'Algorand Gasless Settle', color: 'bg-amber-600' },
    { state: 'AUDIT_KYC', label: '6. AUDIT & KYC', desc: isHi ? 'कॉइनबेस अनुपालन' : 'Zero-Knowledge Guardrail', color: 'bg-rose-600' },
    { state: 'COMPLETE', label: '7. COMPLETE', desc: isHi ? 'सफलतापूर्वक संपन्न' : 'State Equilibrium Reached', color: 'bg-teal-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">
                {isHi ? 'कॉनवे सेल्युलर ऑटोमेटन व एजेंट स्टेट मशीन' : 'Conway Cellular Automaton & Agent State Machine'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi
                ? 'Conway B3/S23 नियमों के तहत 2D ग्रिड पर मल्टी-एजेंट स्वार्म अपनी रणनीतियों और स्टेट्स को स्वतः रूपांतरित करता है।'
                : 'Decentralized multi-agent swarm evolves finite state machine transitions dynamically using cellular automata equilibrium rules.'}
            </p>
          </div>

          {/* Metrics telemetry & Export */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">GEN</span>
                <span className="text-cyan-300 font-bold">{generation}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">ALIVE</span>
                <span className="text-emerald-400 font-bold">{population}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">ENTROPY</span>
                <span className="text-indigo-400 font-bold">{entropy}</span>
              </div>
            </div>

            <button
              id="btn-export-conway-json"
              onClick={handleExportGridJson}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow"
              title="Export Grid JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHi ? 'एक्सपोर्ट' : 'Export'}</span>
            </button>
          </div>
        </div>

        {/* Pattern Presets & Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-conway-play-toggle"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow cursor-pointer ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? (isHi ? 'रोकें' : 'Pause') : isHi ? 'चलाएं' : 'Auto-Evolve'}</span>
            </button>

            <button
              id="btn-conway-step"
              onClick={stepSimulation}
              disabled={isPlaying}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>{isHi ? 'एक कदम' : 'Single Step'}</span>
            </button>

            <button
              id="btn-conway-reset"
              onClick={() => handlePatternChange(activePattern)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'रीसेट' : 'Reset'}</span>
            </button>

            <button
              id="btn-conway-clear"
              onClick={handleClearGrid}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'साफ करें' : 'Clear'}</span>
            </button>

            {/* Brush Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setBrushMode('draw')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  brushMode === 'draw' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✏️ {isHi ? 'ड्रा' : 'Draw'}
              </button>
              <button
                onClick={() => setBrushMode('erase')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  brushMode === 'erase' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🧹 {isHi ? 'इरेज़' : 'Erase'}
              </button>
            </div>
          </div>

          {/* Pattern Selector */}
          <div className="flex flex-wrap items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-500 px-2 font-medium">{isHi ? 'पैटर्न:' : 'Preset:'}</span>
            <button
              onClick={() => handlePatternChange('agent_mesh')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePattern === 'agent_mesh' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Agent Swarm Mesh
            </button>
            <button
              onClick={() => handlePatternChange('pulsar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePattern === 'pulsar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pulsar Core
            </button>
            <button
              onClick={() => handlePatternChange('glider')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePattern === 'glider' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Glider Carrier
            </button>
            <button
              onClick={() => handlePatternChange('random')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePattern === 'random' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Random Nebula
            </button>
          </div>
        </div>
      </div>

      {/* Conway 2D Grid Visualizer Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isHi
                ? `2D सेल्युलर मैट्रिक्स (${brushMode === 'draw' ? 'ड्रा मोड' : 'इरेज़ मोड'})`
                : `2D Cellular Lattice Matrix (${brushMode === 'draw' ? 'Click/Drag to Draw Cells' : 'Click/Drag to Erase Cells'})`}
            </span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">Grid: 28x16 | Rule: B3/S23 Life</span>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-28 gap-1 aspect-[28/16] bg-slate-900/60 p-2 sm:p-3 rounded-xl border border-slate-800/80 select-none overflow-auto">
          {grid.map((row, y) =>
            row.map((alive, x) => {
              // Check if any agent is situated here
              const matchedAgent = agents.find((a) => agentCoords[a.id]?.x === x && agentCoords[a.id]?.y === y);

              return (
                <div
                  key={`${y}-${x}`}
                  onClick={() => handleCellClick(y, x)}
                  className={`relative rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    matchedAgent
                      ? 'bg-amber-400 shadow-md shadow-amber-500/50 z-10 scale-125 ring-2 ring-amber-300'
                      : alive
                      ? 'bg-gradient-to-tr from-emerald-500 to-cyan-400 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-900 hover:bg-slate-800/60'
                  }`}
                  style={{ minWidth: '8px', minHeight: '8px' }}
                >
                  {matchedAgent && (
                    <span className="text-[8px] sm:text-[10px] leading-none absolute select-none">
                      {matchedAgent.avatar}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Legend of Agents on Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-900">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-base">{agent.avatar}</span>
              <div className="min-w-0">
                <p className="font-semibold text-[11px] truncate">{agent.name}</p>
                <p className="text-[10px] text-cyan-400 font-mono">
                  Pos: ({agentCoords[agent.id]?.x || 0}, {agentCoords[agent.id]?.y || 0})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State Machine Transition Architecture Flow */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>{isHi ? 'स्वायत्त एजेंट स्टेट मशीन जीवनचक्र (FSM)' : 'Autonomous Multi-Agent Finite State Machine (FSM)'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {statePipeline.map((step, idx) => (
            <div
              key={step.state}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-200">{step.label}</span>
                  <span className={`w-2 h-2 rounded-full ${step.color}`}></span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{step.desc}</p>
              </div>
              <div className="mt-2 text-[9px] font-mono text-cyan-500 uppercase">
                {idx < 6 ? '→ Transition Next' : '✔ Equilibrium'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
