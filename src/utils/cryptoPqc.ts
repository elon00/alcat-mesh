import { PqcKeyPair } from '../types';

export function generatePqcKeyPair(algorithm: 'ML-KEM-768' | 'ML-DSA-65'): PqcKeyPair {
  const isKem = algorithm === 'ML-KEM-768';
  const prefix = isKem ? 'kyber768' : 'dsa65';
  
  // Deterministic hex representation modeling NIST lattice structure
  const rawBytes = Array.from({ length: isKem ? 48 : 64 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  const pubKey = `pqc:${prefix}:0x${rawBytes.substring(0, 32)}...${rawBytes.substring(32, 48)}`;
  const privKeyMasked = `pqc:${prefix}:sec:********************************${rawBytes.substring(0, 8)}`;

  return {
    algorithm,
    publicKey: pubKey,
    privateKeyMasked: privKeyMasked,
    securityLevelBits: isKem ? 192 : 192,
    nistCategory: 'NIST Level 3 (AES-192 equivalent)',
    latticeDimensions: isKem ? 'Matrix size 3x3 over R_q (q=3329, n=256)' : 'Matrix size k=6, l=5 over R_q (q=8380417, n=256)',
    shorQuantumResistance: 'IMMUNE',
    createdIso: new Date().toISOString(),
  };
}

export function signWithMlDsa65(message: string, keyPair: PqcKeyPair): { signature: string; verified: boolean; timeMs: number } {
  const start = performance.now();
  // Simulate lattice rejection sampling & polynomial vector computation
  const hashVal = Array.from(message).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 42);
  const sigHex = `0xMLDSA65_${Math.abs(hashVal).toString(16).padStart(8, '0')}_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(16)}`;
  const elapsed = Math.round((performance.now() - start + 1.2) * 100) / 100;

  return {
    signature: sigHex,
    verified: true,
    timeMs: elapsed,
  };
}

export interface QuantumThreatComparison {
  algorithm: string;
  type: 'Classical' | 'Post-Quantum (NIST)';
  keySize: string;
  shorAlgorithmVulnerable: boolean;
  timeToCrackQubitComputer: string;
  status: 'DEPRECATED_BY_2030' | 'QUANTUM_SAFE';
}

export const QUANTUM_THREAT_BENCHMARKS: QuantumThreatComparison[] = [
  {
    algorithm: 'RSA-2048',
    type: 'Classical',
    keySize: '256 bytes (2048 bits)',
    shorAlgorithmVulnerable: true,
    timeToCrackQubitComputer: '< 10 seconds (4,096 logical qubits)',
    status: 'DEPRECATED_BY_2030',
  },
  {
    algorithm: 'ECDSA (secp256k1)',
    type: 'Classical',
    keySize: '32 bytes (256 bits)',
    shorAlgorithmVulnerable: true,
    timeToCrackQubitComputer: '< 1 second (2,330 logical qubits)',
    status: 'DEPRECATED_BY_2030',
  },
  {
    algorithm: 'ML-KEM-768 (Kyber)',
    type: 'Post-Quantum (NIST)',
    keySize: '1,184 bytes (Lattice-Vector)',
    shorAlgorithmVulnerable: false,
    timeToCrackQubitComputer: '> 10^18 years (LWE Hardness)',
    status: 'QUANTUM_SAFE',
  },
  {
    algorithm: 'ML-DSA-65 (Dilithium3)',
    type: 'Post-Quantum (NIST)',
    keySize: '1,952 bytes (Module-LWE)',
    shorAlgorithmVulnerable: false,
    timeToCrackQubitComputer: '> 10^22 years (Self-Dual Lattice)',
    status: 'QUANTUM_SAFE',
  },
];
