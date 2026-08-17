import React, { useState } from 'react';
import { FileCode, Copy, Check, Terminal, Layers, Download, Sparkles } from 'lucide-react';
import { CodeTemplate, SupportedLanguage } from '../types';
import { CODE_TEMPLATES } from '../utils/codeTemplates';

interface CodeBlueprintStudioProps {
  language: SupportedLanguage;
}

export const CodeBlueprintStudio: React.FC<CodeBlueprintStudioProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(CODE_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedTemplate.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const GLOBAL_STANDARD_PROMPT = `# ROLE & OBJECTIVE
Act as a Chief Systems Architect specializing in ALCAT (Autonomous Lattice Cellular Automata & Transactions), Web 4.0, Decentralized AI Orchestration, and Post-Quantum Cryptography (PQC). Your task is to design and generate the codebase for an application that integrates human-to-machine interfaces with autonomous machine-to-machine (M2M) micro-payments.

# SYSTEM ARCHITECTURE & COMPONENTS
1. Frontend & Monetization (Human Layer):
   - Conversational Chatbot interface (TypeScript/React Native/React).
   - RevenueCat Purchases SDK for fiat-based premium subscriptions.
   - Ad-based monetization for free tiers using Catvertising networks.

2. AI Orchestration (Agentic Automaton Layer):
   - Autonomous AI Agents executing multi-step logic based on Conway cellular automata principles and finite state machines.
   - Dynamic discovery, SLA negotiation, and API querying.

3. Blockchain & Payments (M2M Layer):
   - Algorand X402 protocol for frictionless, gas-sponsored micro-payments (HTTP 402 challenge-response).
   - Algorand Testnet (and Arbitrum Sepolia via Stylus Rust contracts where cross-chain execution is required) for atomic transaction groups and settlement.

4. Security & Compliance (Zero-Trust PQC Layer):
   - Agent-to-agent communications and wallet signatures using NIST-standardized Post-Quantum Cryptography (ML-KEM-768 for key exchange and ML-DSA-65 for digital signatures).
   - Embedded compliance guardrails (Coinbase KYC checks, OFAC sanction screening, and Smart Contract Security Audits).

# OUTPUT REQUIREMENTS
- Provide the system blueprint, API routing structure, and state database schema.
- Write the initialization scripts in TypeScript for RevenueCat and Rust for Arbitrum/Algorand smart contracts.
- Ensure strict unit-testing protocols optimized for CI/CD pipelines and Docker deployment.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(GLOBAL_STANDARD_PROMPT);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">
                {isHi ? 'ग्लोबल स्टैंडर्ड कोड ब्लूप्रिंट्स व सिस्टम आर्किटेक्चर' : 'Global Standard Code Blueprints & System Architecture'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi
                ? 'RevenueCat TypeScript SDK, Arbitrum Stylus Rust, Algorand PyTeal, NIST PQC QuantumShield और CI/CD वर्कफ़्लो।'
                : 'Production-grade reference implementations for Mobile Frontend, Rust Stylus contracts, Algorand AVM, PQC Lattice modules, and CI/CD pipelines.'}
            </p>
          </div>

          <button
            id="btn-copy-global-prompt"
            onClick={handleCopyPrompt}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow"
          >
            {promptCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{promptCopied ? (isHi ? 'प्रॉम्प्ट कॉपी हुआ!' : 'Prompt Copied!') : isHi ? 'सिस्टम प्रॉम्प्ट कॉपी करें' : 'Copy Global Standard Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Blueprint File Navigator */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            {isHi ? 'उपलब्ध ब्लूप्रिंट फाइल्स' : 'Architecture Modules'}
          </span>

          {CODE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-200 truncate">{tmpl.title}</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    {tmpl.language}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 truncate">{tmpl.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedTemplate.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedTemplate.filename}</p>
              </div>

              <button
                id="btn-copy-blueprint-code"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? (isHi ? 'कॉपी हो गया' : 'Copied!') : isHi ? 'कोड कॉपी करें' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 my-3 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              {selectedTemplate.description}
            </p>

            {/* Code Block */}
            <div className="relative">
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-[460px] scrollbar-thin leading-relaxed">
                <code>{selectedTemplate.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
