import { X402PaymentRequest } from '../types';

export const SAMPLE_X402_REQUESTS: X402PaymentRequest[] = [
  {
    id: 'X402-9901',
    resourceUri: 'https://api.quantum-oracle.org/v2/pricing/gpu-h100-cluster',
    serviceType: 'Decentralized High-Performance Compute',
    cost: 0.015,
    currency: 'ALGO',
    paymentScheme: 'Algorand-X402',
    status: 'ATOMIC_CONFIRMED',
    senderAddress: 'ALGO7XK2...9V3Q',
    recipientAddress: 'NODE_ORACLE_PROVIDER_7',
    pqcSignature: '0xMLDSA65_7b8f9e_verified_lattice',
    sponsorRelay: 'RELAY-SPONSOR-NODE-04',
    txId: 'ALGO-TESTNET-TX-849102',
    timestamp: '2 mins ago',
  },
  {
    id: 'X402-9902',
    resourceUri: 'https://sepolia.arbitrum.io/stylus/pqc-verifier',
    serviceType: 'Arbitrum Stylus PQC Lattice Verification Call',
    cost: 0.0004,
    currency: 'ETH',
    paymentScheme: 'Arbitrum-Stylus-M2M',
    status: 'ATOMIC_CONFIRMED',
    senderAddress: '0x4E89...2A1b',
    recipientAddress: '0x992B...78F1',
    pqcSignature: '0xMLDSA65_9c3d1a_verified_lattice',
    sponsorRelay: 'ARBITRUM-PAYMASTER-01',
    txId: '0x7c2a4f...990b12',
    timestamp: '5 mins ago',
  },
  {
    id: 'X402-9903',
    resourceUri: 'https://weather.iot-mesh.network/telemetry/station-39',
    serviceType: 'Sub-second IoT Real-time Stream Access',
    cost: 0.002,
    currency: 'ALGO',
    paymentScheme: 'Algorand-X402',
    status: 'ATOMIC_CONFIRMED',
    senderAddress: 'ALGO3MQ1...4K8L',
    recipientAddress: 'IOT_SENSOR_NETWORK_ROOT',
    pqcSignature: '0xMLDSA65_44a1bb_verified_lattice',
    sponsorRelay: 'RELAY-SPONSOR-NODE-02',
    txId: 'ALGO-TESTNET-TX-338192',
    timestamp: '12 mins ago',
  },
];

export function generateX402Header(resource: string, cost: number, currency: string, recipient: string): {
  httpStatus: number;
  headers: Record<string, string>;
  paymentPayload: Record<string, any>;
} {
  const challengeNonce = `nonce_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
  return {
    httpStatus: 402,
    headers: {
      'WWW-Authenticate': `X402-Algorand realm="Machine-To-Machine", token="${challengeNonce}"`,
      'X-Payment-Cost': `${cost} ${currency}`,
      'X-Payment-Recipient': recipient,
      'X-Fee-Delegation-Supported': 'true',
      'X-PQC-Signature-Required': 'ML-DSA-65',
    },
    paymentPayload: {
      protocol: 'X402-Micro-Settlement-v1.2',
      resource,
      amount: cost,
      asset: currency,
      recipient,
      challengeNonce,
      gasSponsorEnabled: true,
      supportedNetworks: ['Algorand-Testnet', 'Arbitrum-Sepolia-Stylus'],
    },
  };
}
