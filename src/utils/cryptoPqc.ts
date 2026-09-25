import { PqcKeyPair } from '../types';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { sha256 } from '@noble/hashes/sha256.js';

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (!/^(?:[0-9a-fA-F]{2})*$/.test(cleanHex)) throw new Error('Invalid hexadecimal input');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

// In-memory key store for secret keys
const secretKeyStorage = new Map<string, Uint8Array>();

export function generatePqcKeyPair(algorithm: 'ML-KEM-768' | 'ML-DSA-65' = 'ML-DSA-65'): PqcKeyPair {
  const isKem = algorithm === 'ML-KEM-768';
  let pubBytes: Uint8Array;
  let secBytes: Uint8Array;

  if (isKem) {
    const pair = ml_kem768.keygen();
    pubBytes = pair.publicKey;
    secBytes = pair.secretKey;
  } else {
    const pair = ml_dsa65.keygen();
    pubBytes = pair.publicKey;
    secBytes = pair.secretKey;
  }

  const pubHex = bytesToHex(pubBytes);
  secretKeyStorage.set(pubHex, secBytes);

  const prefix = isKem ? 'kyber768' : 'dsa65';
  const pubKeyFormatted = pubHex;
  const privKeyMasked = `pqc:${prefix}:sec:[REDACTED]`;

  return {
    algorithm,
    publicKey: pubKeyFormatted,
    privateKeyMasked: privKeyMasked,
    securityLevelBits: 192,
    nistCategory: 'NIST Level 3 (AES-192 equivalent)',
    latticeDimensions: isKem ? 'Matrix size 3x3 over R_q (q=3329, n=256, 1184 bytes)' : 'Matrix size k=6, l=5 over R_q (q=8380417, n=256, 1952 bytes)',
    shorQuantumResistance: 'IMMUNE',
    createdIso: new Date().toISOString(),
  };
}

export function signWithMlDsa65(message: string, keyPair: PqcKeyPair): { signature: string; verified: boolean; timeMs: number } {
  const start = performance.now();
  const messageBytes = new TextEncoder().encode(message);

  const secKey = secretKeyStorage.get(keyPair.publicKey);
  if (keyPair.algorithm !== 'ML-DSA-65' || !secKey || secKey.length !== 4032) {
    throw new Error('An active ML-DSA-65 signing key is required');
  }
  const sigBytes = ml_dsa65.sign(messageBytes, secKey);
  const verified = ml_dsa65.verify(sigBytes, messageBytes, hexToBytes(keyPair.publicKey));
  const sigHex = bytesToHex(sigBytes);
  const elapsed = Math.round((performance.now() - start) * 100) / 100;

  return {
    signature: sigHex,
    verified,
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
