import React, { useState } from 'react';
import { ShieldCheck, Cpu, Globe, Zap, Sparkles, CreditCard, Activity, PlusCircle, Server, Check } from 'lucide-react';
import { NetworkType, RevenueCatTier, SupportedLanguage } from '../types';
import confetti from 'canvas-confetti';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
  tier: RevenueCatTier;
  setTierModalOpen: (open: boolean) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  walletBalance: { algo: number; eth: number };
  onClaimFaucet: () => void;
  onOpenSystemDiagnostics: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  network,
  setNetwork,
  tier,
  setTierModalOpen,
  language,
  setLanguage,
  walletBalance,
  onClaimFaucet,
  onOpenSystemDiagnostics,
}) => {
  const isHi = language === 'hi';

  const navItems = [
    { id: 'chat', label: isHi ? '🤖 AI चैटबॉट' : '🤖 AI Chatbot', icon: Sparkles },
    { id: 'automaton', label: isHi ? '🧬 कॉनवे ऑटोमेटन' : '🧬 Conway Automaton', icon: Cpu },
    { id: 'x402', label: isHi ? '⚡ X402 पेमेंट्स' : '⚡ X402 M2M Pay', icon: Zap },
    { id: 'pqc', label: isHi ? '🛡️ क्वांटम PQC' : '🛡️ Quantum PQC', icon: ShieldCheck },
    { id: 'monetization', label: isHi ? '💳 रेवेन्यूकैट (Ads)' : '💳 RevenueCat & Ads', icon: CreditCard },
    { id: 'compliance', label: isHi ? '⚖️ अनुपालन व ऑडिट' : '⚖️ Compliance & Audit', icon: ShieldCheck },
    { id: 'blueprints', label: isHi ? '📜 कोड ब्लूप्रिंट्स' : '📜 Code Blueprints', icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('chat')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-xl">🌌</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  ALCAT
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  PQC ML-DSA-65
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-medium">
                {isHi
                  ? 'मल्टी-एजेंट कॉनवे ऑटोमेशन व M2M माइक्रोपेमेंट प्लेटफॉर्म'
                  : 'Autonomous Lattice Cellular Automata & Transactions'}
              </p>
            </div>
          </div>

          {/* Right Controls: Network Selector, Faucet, Diagnostics, Tier, Language */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* System Diagnostics Trigger */}
            <button
              onClick={onOpenSystemDiagnostics}
              className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-mono text-cyan-300 cursor-pointer"
              title="View Live Network Diagnostics"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mesh: 24ms</span>
            </button>

            {/* Network Selector */}
            <div className="hidden md:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                id="btn-network-algorand"
                onClick={() => setNetwork('algorand-testnet')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  network === 'algorand-testnet'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Algorand X402
              </button>
              <button
                id="btn-network-arbitrum"
                onClick={() => setNetwork('arbitrum-sepolia')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  network === 'arbitrum-sepolia'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Arbitrum Stylus
              </button>
            </div>

            {/* Wallet Balance & Faucet Claim Button */}
            <div className="flex items-center space-x-1.5 bg-slate-800/90 rounded-lg border border-slate-700 px-2.5 py-1 text-xs">
              <span className="text-emerald-400 font-semibold font-mono">
                {network === 'algorand-testnet' ? `${walletBalance.algo.toFixed(2)} ALGO` : `${walletBalance.eth.toFixed(3)} ETH`}
              </span>
              <button
                id="btn-claim-faucet-quick"
                onClick={onClaimFaucet}
                className="text-cyan-400 hover:text-cyan-200 font-bold text-[11px] bg-cyan-950/60 hover:bg-cyan-900/60 px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center space-x-0.5 cursor-pointer"
                title="Claim Free Testnet Faucet"
              >
                <PlusCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Faucet</span>
              </button>
            </div>

            {/* RevenueCat Tier Badge */}
            <button
              id="btn-revenuecat-tier-badge"
              onClick={() => {
                setTierModalOpen(true);
                setCurrentTab('monetization');
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {tier === 'free_catvertising'
                  ? isHi ? 'फ्री' : 'Free Tier'
                  : tier === 'pro_agentic'
                  ? 'Pro Agentic'
                  : 'Enterprise'}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              id="btn-language-toggle"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center space-x-1 cursor-pointer"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
