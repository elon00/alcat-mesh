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

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [network, setNetwork] = useState<NetworkType>('algorand-testnet');
  const [tier, setTier] = useState<RevenueCatTier>('free_catvertising');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(true);
  const [walletBalance, setWalletBalance] = useState({ algo: 142.5, eth: 0.85 });

  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);

  const handleDeductBalance = (amount: number, currency: 'ALGO' | 'ETH') => {
    setWalletBalance((prev) => ({
      algo: currency === 'ALGO' ? Math.max(0, prev.algo - amount) : prev.algo,
      eth: currency === 'ETH' ? Math.max(0, prev.eth - amount) : prev.eth,
    }));
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
