export type SupportedLanguage = 'en' | 'hi';

export type NetworkType = 'algorand-testnet' | 'arbitrum-sepolia';

export type RevenueCatTier = 'free_catvertising' | 'pro_agentic' | 'quantum_enterprise';

export type ConwayAgentState = 
  | 'IDLE'
  | 'DISCOVER'
  | 'NEGOTIATE'
  | 'SIGN_PQC'
  | 'SETTLE_X402'
  | 'AUDIT_KYC'
  | 'COMPLETE'
  | 'FAILED';

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'ACTIVE' | 'PROCESSING' | 'STANDBY';
  state: ConwayAgentState;
  color: string;
  description: string;
  energyLevel: number;
  tasksCompleted: number;
  specialty: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'orchestrator' | 'agent';
  agentName?: string;
  agentAvatar?: string;
  text: string;
  timestamp: string;
  actionRequired?: string;
  metadata?: {
    pqcSignature?: string;
    conwayState?: string;
    m2mFee?: string;
    txHash?: string;
    stepIndex?: number;
  };
}

export interface ConwayCell {
  x: number;
  y: number;
  alive: boolean;
  agentId?: string;
  state: ConwayAgentState;
  energy: number;
}

export interface ConwayGridState {
  width: number;
  height: number;
  generation: number;
  population: number;
  entropy: number;
  cells: boolean[][];
  agentPositions: { [agentId: string]: { x: number; y: number } };
}

export interface X402PaymentRequest {
  id: string;
  resourceUri: string;
  serviceType: string;
  cost: number;
  currency: 'ALGO' | 'ETH' | 'USDC';
  paymentScheme: 'Algorand-X402' | 'Arbitrum-Stylus-M2M';
  status: '402_REQUIRED' | 'CHALLENGE_ISSUED' | 'PQC_SIGNED' | 'GAS_SPONSORED' | 'ATOMIC_CONFIRMED';
  senderAddress: string;
  recipientAddress: string;
  pqcSignature: string;
  sponsorRelay: string;
  txId?: string;
  timestamp: string;
}

export interface PqcKeyPair {
  algorithm: 'ML-KEM-768' | 'ML-DSA-65' | 'Kyber-768' | 'Dilithium-3';
  publicKey: string;
  privateKeyMasked: string;
  securityLevelBits: number;
  nistCategory: 'NIST Level 3 (AES-192 equivalent)' | 'NIST Level 5 (AES-256 equivalent)';
  latticeDimensions: string;
  shorQuantumResistance: 'IMMUNE' | 'CRACKABLE_IN_MINUTES';
  createdIso: string;
}

export interface SmartContractAuditResult {
  contractName: string;
  auditScore: number;
  pqcReadinessScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  vulnerabilities: Array<{
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    recommendation: string;
    pqcRelated: boolean;
  }>;
  complianceChecklist: {
    coinbaseKycVerified: boolean;
    ofacSanctionCompliant: boolean;
    gasLimitProtected: boolean;
    reentrancyGuardPresent: boolean;
    pqcSignatureSupported: boolean;
  };
  suggestedFix?: string;
}

export interface CodeTemplate {
  id: string;
  title: string;
  language: string;
  filename: string;
  category: 'RevenueCat' | 'SmartContract' | 'PQC' | 'Automaton' | 'CI_CD';
  description: string;
  code: string;
}
