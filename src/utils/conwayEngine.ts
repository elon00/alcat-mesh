import { ConwayAgentState, ConwayGridState } from '../types';

export const CONWAY_WIDTH = 28;
export const CONWAY_HEIGHT = 16;

export function createEmptyGrid(width = CONWAY_WIDTH, height = CONWAY_HEIGHT): boolean[][] {
  return Array.from({ length: height }, () => Array(width).fill(false));
}

export function createSeededGrid(pattern: 'glider' | 'pulsar' | 'agent_mesh' | 'random' = 'agent_mesh', width = CONWAY_WIDTH, height = CONWAY_HEIGHT): boolean[][] {
  const grid = createEmptyGrid(width, height);

  if (pattern === 'random') {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x] = Math.random() > 0.72;
      }
    }
    return grid;
  }

  if (pattern === 'agent_mesh') {
    // 4 Agent colony nodes with pulsating gliders connecting them
    const midY = Math.floor(height / 2);
    const midX = Math.floor(width / 2);
    
    // Central beacon
    grid[midY - 1][midX - 1] = true;
    grid[midY - 1][midX] = true;
    grid[midY][midX - 1] = true;
    grid[midY][midX + 2] = true;
    grid[midY + 1][midX + 1] = true;
    grid[midY + 1][midX + 2] = true;

    // Node A (Top-Left)
    grid[2][4] = true; grid[2][5] = true; grid[3][4] = true; grid[3][6] = true; grid[4][5] = true;
    // Node B (Top-Right)
    grid[2][width - 6] = true; grid[2][width - 5] = true; grid[3][width - 6] = true; grid[3][width - 4] = true; grid[4][width - 5] = true;
    // Node C (Bottom-Left)
    grid[height - 4][5] = true; grid[height - 4][6] = true; grid[height - 3][5] = true; grid[height - 2][7] = true;
    // Node D (Bottom-Right)
    grid[height - 4][width - 6] = true; grid[height - 4][width - 5] = true; grid[height - 3][width - 5] = true; grid[height - 2][width - 4] = true;

    return grid;
  }

  if (pattern === 'glider') {
    grid[1][2] = true;
    grid[2][3] = true;
    grid[3][1] = true;
    grid[3][2] = true;
    grid[3][3] = true;
    return grid;
  }

  if (pattern === 'pulsar') {
    const cy = Math.floor(height / 2);
    const cx = Math.floor(width / 2);
    const offsets = [-4, -2, 2, 4];
    for (const dy of offsets) {
      for (const dx of [-3, -2, -1, 1, 2, 3]) {
        if (cy + dy >= 0 && cy + dy < height && cx + dx >= 0 && cx + dx < width) {
          grid[cy + dy][cx + dx] = true;
        }
      }
    }
    return grid;
  }

  return grid;
}

export function computeNextGeneration(currentGrid: boolean[][]): { newGrid: boolean[][]; population: number; entropy: number } {
  const height = currentGrid.length;
  const width = currentGrid[0].length;
  const newGrid = createEmptyGrid(width, height);
  let population = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          const ny = (y + dy + height) % height;
          const nx = (x + dx + width) % width;
          if (currentGrid[ny][nx]) neighbors++;
        }
      }

      // Conway Rules (B3/S23)
      if (currentGrid[y][x]) {
        newGrid[y][x] = neighbors === 2 || neighbors === 3;
      } else {
        newGrid[y][x] = neighbors === 3;
      }

      if (newGrid[y][x]) population++;
    }
  }

  const totalCells = width * height;
  const density = population / totalCells;
  const entropy = Math.round((-density * Math.log2(density + 1e-9) - (1 - density) * Math.log2(1 - density + 1e-9)) * 1000) / 1000;

  return { newGrid, population, entropy };
}

export const INITIAL_AGENTS = [
  {
    id: 'agent-1',
    name: 'Agent Conway-A1',
    role: 'Automaton State Dispatcher',
    avatar: '🤖',
    status: 'ACTIVE' as const,
    state: 'DISCOVER' as ConwayAgentState,
    color: 'emerald',
    description: 'Partitions discrete cellular state spaces and evolves agent state transitions using B3/S23 automata rules.',
    energyLevel: 98,
    tasksCompleted: 412,
    specialty: 'Cellular Automata & FSM',
  },
  {
    id: 'agent-2',
    name: 'Agent Probe-X',
    role: 'Discovery & SLA Negotiator',
    avatar: '🔍',
    status: 'ACTIVE' as const,
    state: 'NEGOTIATE' as ConwayAgentState,
    color: 'cyan',
    description: 'Crawls decentralized oracles, queries API endpoints, and negotiates programmatic SLA contracts autonomously.',
    energyLevel: 91,
    tasksCompleted: 887,
    specialty: 'Autonomous Negotiation',
  },
  {
    id: 'agent-3',
    name: 'Agent QuantumShield',
    role: 'PQC SecOps & Lattice Signer',
    avatar: '🛡️',
    status: 'ACTIVE' as const,
    state: 'SIGN_PQC' as ConwayAgentState,
    color: 'indigo',
    description: 'Performs NIST ML-KEM-768 key encapsulation and generates ML-DSA-65 quantum-resistant signatures.',
    energyLevel: 100,
    tasksCompleted: 1204,
    specialty: 'Post-Quantum Lattice Cryptography',
  },
  {
    id: 'agent-4',
    name: 'Agent Paymaster',
    role: 'Algorand X402 & Arbitrum Settler',
    avatar: '⚡',
    status: 'ACTIVE' as const,
    state: 'SETTLE_X402' as ConwayAgentState,
    color: 'amber',
    description: 'Fulfills HTTP 402 micro-payment challenges via Algorand atomic groups and Arbitrum Stylus Rust contracts.',
    energyLevel: 89,
    tasksCompleted: 654,
    specialty: 'M2M Gasless Micro-Payments',
  },
];
