import React, { useState } from 'react';
import { Zap, CheckCircle2, ArrowRight, Shield, Globe, Terminal, RefreshCw, Send, DollarSign } from 'lucide-react';
import { NetworkType, SupportedLanguage, X402PaymentRequest } from '../types';
import { SAMPLE_X402_REQUESTS, generateX402Header } from '../utils/x402Engine';
import confetti from 'canvas-confetti';

interface X402PaymentExplorerProps {
  network: NetworkType;
  language: SupportedLanguage;
  onDeductBalance: (amount: number, currency: 'ALGO' | 'ETH') => void;
}

export const X402PaymentExplorer: React.FC<X402PaymentExplorerProps> = ({
  network,
  language,
  onDeductBalance,
}) => {
  const isHi = language === 'hi';
  const [requests, setRequests] = useState<X402PaymentRequest[]>(SAMPLE_X402_REQUESTS);
  const [targetResource, setTargetResource] = useState('https://api.quantum-oracle.org/v2/pricing/gpu-h100-cluster');
  const [costAmount, setCostAmount] = useState(0.025);
  const [serviceName, setServiceName] = useState('Decentralized High-Performance GPU Compute');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStage, setSimulationStage] = useState<number>(0);
  const [activeChallengeData, setActiveChallengeData] = useState<any>(null);

  const currency = network === 'algorand-testnet' ? 'ALGO' : 'ETH';

  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    setSimulationStage(1); // 1: Send Request

    const headerResult = generateX402Header(
      targetResource,
      costAmount,
      currency,
      network === 'algorand-testnet' ? 'NODE_ORACLE_PROVIDER_7' : '0x992B...78F1'
    );
    setActiveChallengeData(headerResult);

    await new Promise((r) => setTimeout(r, 600));
    setSimulationStage(2); // 2: 402 Challenge Returned

    await new Promise((r) => setTimeout(r, 700));
    setSimulationStage(3); // 3: Agent ML-DSA-65 Signing

    await new Promise((r) => setTimeout(r, 700));
    setSimulationStage(4); // 4: Gasless Sponsor Relay Dispatch

    await new Promise((r) => setTimeout(r, 800));
    setSimulationStage(5); // 5: Atomic Group Settlement Confirmed

    const newTx: X402PaymentRequest = {
      id: `X402-${Math.floor(1000 + Math.random() * 9000)}`,
      resourceUri: targetResource,
      serviceType: serviceName,
      cost: costAmount,
      currency,
      paymentScheme: network === 'algorand-testnet' ? 'Algorand-X402' : 'Arbitrum-Stylus-M2M',
      status: 'ATOMIC_CONFIRMED',
      senderAddress: network === 'algorand-testnet' ? 'ALGO7XK2...9V3Q' : '0x4E89...2A1b',
      recipientAddress: network === 'algorand-testnet' ? 'NODE_ORACLE_PROVIDER_7' : '0x992B...78F1',
      pqcSignature: `0xMLDSA65_${Math.random().toString(36).substring(2, 8)}_lattice`,
      sponsorRelay: network === 'algorand-testnet' ? 'RELAY-SPONSOR-NODE-04' : 'ARBITRUM-PAYMASTER-01',
      txId: network === 'algorand-testnet' ? `ALGO-TX-${Math.floor(100000 + Math.random() * 900000)}` : `0x${Math.random().toString(16).substring(2, 14)}...`,
      timestamp: 'Just now',
    };

    setRequests((prev) => [newTx, ...prev]);
    onDeductBalance(costAmount, currency);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
    });

    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">
                {isHi ? 'Algorand X402 मशीन-टू-मशीन (M2M) माइक्रोपेमेंट प्रोटोकॉल' : 'Algorand X402 Machine-to-Machine (M2M) Micro-Payment Protocol'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi
                ? 'HTTP 402 "Payment Required" मानक के ज़रिए AI एजेंट्स बिना इंसानी हस्तक्षेप के गैस-प्रायोजित (Fee-Delegated) एटॉमिक ट्रांज़ैक्शन सेकंड्स में निष्पादित करते हैं।'
                : 'AI Agents autonomously negotiate and settle programmatic micropayments via HTTP 402 challenge-response standards and gas-sponsored atomic transaction groups.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-mono">
              Protocol: X402-Draft-RFC-9110
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-semibold">
              Zero Gas Fee Delegation
            </span>
          </div>
        </div>
      </div>

      {/* Live M2M Payment Sandbox Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Request Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{isHi ? 'M2M पेमेंट सिमुलेटर' : 'M2M Payment Sandbox'}</span>
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {isHi ? 'लक्षित रिसोर्स API URI' : 'Target Resource API URI'}
            </label>
            <input
              type="text"
              value={targetResource}
              onChange={(e) => setTargetResource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {isHi ? 'सर्विस का विवरण' : 'Service Type / Description'}
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {isHi ? 'भुगतान राशि' : 'Micro-Cost Amount'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.005"
                  value={costAmount}
                  onChange={(e) => setCostAmount(parseFloat(e.target.value) || 0.01)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-amber-400">{currency}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {isHi ? 'नेटवर्क सेटलमेंट' : 'Settlement Network'}
              </label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300">
                {network === 'algorand-testnet' ? 'Algorand Testnet (AVM)' : 'Arbitrum Sepolia (Stylus)'}
              </div>
            </div>
          </div>

          <button
            id="btn-dispatch-x402-payment"
            onClick={handleSimulatePayment}
            disabled={isSimulating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isHi ? 'प्रोटोकॉल निष्पादित हो रहा है...' : 'Executing X402 Pipeline...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>{isHi ? 'X402 M2M पेमेंट ट्रिगर करें' : 'Trigger X402 M2M Payment'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Protocol Flow Step Visualizer */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? '5-चरणीय स्वायत्त X402 प्रोटोकॉल फ्लो' : '5-Stage Autonomous X402 Protocol Flow'}</span>
            </h3>

            <div className="space-y-2.5">
              {[
                { stage: 1, title: '1. HTTP GET Resource Request', desc: isHi ? 'एजेंट डेटा रिसोर्स के लिए प्रारंभिक अनुरोध भेजता है' : 'Client Agent requests protected data oracle payload' },
                { stage: 2, title: '2. HTTP 402 Payment Required Challenge', desc: isHi ? 'सर्वर WWW-Authenticate: X402-Algorand हेडर और नॉनस टोकन लौटाता है' : 'Server returns HTTP 402 challenge nonce & micro-price specs' },
                { stage: 3, title: '3. ML-DSA-65 Quantum Lattice Signing', desc: isHi ? 'एजेंट पोस्ट-क्वांटम सिग्नेचर के साथ भुगतान अधिकृत करता है' : 'Agent generates NIST ML-DSA-65 quantum-resistant signature' },
                { stage: 4, title: '4. Gas-Sponsored Relay Injection', desc: isHi ? 'रिले नोड गैस फीस प्रायोजित करके एटॉमिक ग्रुप ब्लॉकचेन पर सबमिट करता है' : 'Paymaster Relay sponsors gas fees & dispatches atomic group' },
                { stage: 5, title: '5. Instant Atomic Settlement & Resource Unseal', desc: isHi ? 'ब्लॉकचेन पर पुष्टि के बाद डेटा स्ट्रीम तत्काल अनलॉक हो जाती है' : 'Instant finality reached; server unlocks payload to agent' },
              ].map((step) => {
                const isActive = simulationStage === step.stage;
                const isPassed = simulationStage > step.stage;
                return (
                  <div
                    key={step.stage}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                        : isPassed
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{step.title}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {isActive && <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />}
                    </div>
                    <p className="text-[11px] mt-0.5 text-slate-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {activeChallengeData && (
            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Generated HTTP 402 Header:</span>
              <pre className="mt-1 overflow-x-auto text-[10px] text-slate-300 leading-relaxed">
{JSON.stringify(activeChallengeData.headers, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? 'हालिया X402 M2M एटॉमिक ट्रांज़ैक्शन लेजर' : 'Recent X402 M2M Atomic Transaction Ledger'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">Tx ID</th>
                <th className="pb-2 font-medium">{isHi ? 'सर्विस' : 'Service Resource'}</th>
                <th className="pb-2 font-medium">{isHi ? 'राशि' : 'Cost'}</th>
                <th className="pb-2 font-medium">{isHi ? 'प्रोटोकॉल' : 'Scheme'}</th>
                <th className="pb-2 font-medium">PQC Signature</th>
                <th className="pb-2 font-medium">{isHi ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {requests.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 font-mono text-cyan-400 font-semibold">{tx.txId || tx.id}</td>
                  <td className="py-2.5 text-slate-200 max-w-[220px] truncate">{tx.serviceType}</td>
                  <td className="py-2.5 font-mono font-bold text-amber-400">
                    {tx.cost} {tx.currency}
                  </td>
                  <td className="py-2.5 text-slate-400 font-mono text-[11px]">{tx.paymentScheme}</td>
                  <td className="py-2.5 text-emerald-400 font-mono text-[11px] truncate max-w-[140px]">
                    {tx.pqcSignature}
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
