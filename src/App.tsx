/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AgentChatbot } from './components/AgentChatbot';
import { ConwayAutomatonVisualizer } from './components/ConwayAutomatonVisualizer';
import { X402PaymentExplorer } from './components/X402PaymentExplorer';
import { PqcSecurityCenter } from './components/PqcSecurityCenter';
import { MonetizationHub } from './components/MonetizationHub';
import { ComplianceAuditInspector } from './components/ComplianceAuditInspector';
import { CodeBlueprintStudio } from './components/CodeBlueprintStudio';
import { AgentInfo, NetworkType, RevenueCatTier, SupportedLanguage } from './types';
import { INITIAL_AGENTS } from './utils/conwayEngine';
import { Activity, ShieldCheck, Zap, X, Server, Cpu, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [network, setNetwork] = useState<NetworkType>('algorand-testnet');
  const [tier, setTier] = useState<RevenueCatTier>('free_catvertising');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(true);
  const [walletBalance, setWalletBalance] = useState({ algo: 142.5, eth: 0.85 });
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [faucetNotification, setFaucetNotification] = useState<string | null>(null);

  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);

  const handleDeductBalance = (amount: number, currency: 'ALGO' | 'ETH') => {
    setWalletBalance((prev) => ({
      algo: currency === 'ALGO' ? Math.max(0, prev.algo - amount) : prev.algo,
      eth: currency === 'ETH' ? Math.max(0, prev.eth - amount) : prev.eth,
    }));
  };

  const handleClaimFaucet = () => {
    if (network === 'algorand-testnet') {
      setWalletBalance((prev) => ({ ...prev, algo: prev.algo + 50 }));
      setFaucetNotification(language === 'hi' ? '+50.00 ALGO टेस्टनेट फॉसेट प्राप्त हुआ!' : '+50.00 ALGO Testnet Faucet Claimed!');
    } else {
      setWalletBalance((prev) => ({ ...prev, eth: prev.eth + 0.5 }));
      setFaucetNotification(language === 'hi' ? '+0.50 ETH आर्बिट्रम सेपोलिया प्राप्त हुआ!' : '+0.50 ETH Arbitrum Sepolia Claimed!');
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.2 },
    });

    setTimeout(() => setFaucetNotification(null), 3000);
  };

  const handleExecuteTask = async (taskDescription: string) => {
    try {
      const response = await fetch('/api/agents/orchestrate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription,
          language,
        }),
      });
      const data = await response.json();

      // Deduct micro-fee
      handleDeductBalance(0.015, 'ALGO');

      // Update agent stats
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          tasksCompleted: a.tasksCompleted + 1,
          energyLevel: Math.max(75, Math.min(100, a.energyLevel + (Math.random() > 0.5 ? 2 : -2))),
        }))
      );

      return data;
    } catch (err) {
      console.error('Failed to execute task:', err);
      throw err;
    }
  };

  const isHi = language === 'hi';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Faucet Claim Notification Toast */}
      {faucetNotification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{faucetNotification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        network={network}
        setNetwork={setNetwork}
        tier={tier}
        setTierModalOpen={setTierModalOpen}
        language={language}
        setLanguage={setLanguage}
        walletBalance={walletBalance}
        onClaimFaucet={handleClaimFaucet}
        onOpenSystemDiagnostics={() => setDiagnosticsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'chat' && (
          <AgentChatbot
            agents={agents}
            language={language}
            tier={tier}
            onExecuteTask={handleExecuteTask}
            onTriggerAd={() => setShowAdBanner(true)}
          />
        )}

        {currentTab === 'automaton' && (
          <ConwayAutomatonVisualizer agents={agents} language={language} />
        )}

        {currentTab === 'x402' && (
          <X402PaymentExplorer
            network={network}
            language={language}
            onDeductBalance={handleDeductBalance}
          />
        )}

        {currentTab === 'pqc' && <PqcSecurityCenter language={language} />}

        {currentTab === 'monetization' && (
          <MonetizationHub
            currentTier={tier}
            onSelectTier={setTier}
            language={language}
            showAdBanner={showAdBanner}
            setShowAdBanner={setShowAdBanner}
          />
        )}

        {currentTab === 'compliance' && <ComplianceAuditInspector language={language} />}

        {currentTab === 'blueprints' && <CodeBlueprintStudio language={language} />}
      </main>

      {/* System Diagnostics Modal */}
      {diagnosticsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base">
                  {isHi ? 'ALCAT लाइव मेश डायग्नोस्टिक्स' : 'ALCAT Mesh Live Diagnostics'}
                </h3>
              </div>
              <button
                onClick={() => setDiagnosticsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Mesh Latency / Ping:</span>
                <span className="text-emerald-400 font-bold">24 ms (Sub-second)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Post-Quantum Security:</span>
                <span className="text-indigo-400 font-bold">NIST FIPS 203 & 204 Active</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Algorand X402 Relays:</span>
                <span className="text-cyan-400 font-bold">4 Active Gas Nodes</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Conway Swarm Equilibrium:</span>
                <span className="text-amber-400 font-bold">Stable (Entropy 0.842)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Coinbase KYC Attestation:</span>
                <span className="text-emerald-400 font-bold">Zero-Knowledge Clean</span>
              </div>
            </div>

            <button
              onClick={() => setDiagnosticsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {isHi
              ? 'ALCAT • Web 4.0 क्वांटम ऑटोमेटन आर्किटेक्चर • ML-DSA-65 & ML-KEM-768 PQC'
              : 'ALCAT • Web 4.0 Quantum Automaton Architecture • NIST ML-DSA-65 & ML-KEM-768 PQC'}
          </p>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="text-emerald-400">Algorand X402 Active</span>
            <span>•</span>
            <span className="text-cyan-400">Arbitrum Stylus Ready</span>
            <span>•</span>
            <span className="text-amber-400">RevenueCat SDK Linked</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
