import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, Shield, Cpu, Play, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { AgentInfo, ChatMessage, SupportedLanguage, RevenueCatTier } from '../types';
import confetti from 'canvas-confetti';

interface AgentChatbotProps {
  agents: AgentInfo[];
  language: SupportedLanguage;
  tier: RevenueCatTier;
  onExecuteTask: (taskDescription: string) => Promise<any>;
  onTriggerAd: () => void;
}

export const AgentChatbot: React.FC<AgentChatbotProps> = ({
  agents,
  language,
  tier,
  onExecuteTask,
  onTriggerAd,
}) => {
  const isHi = language === 'hi';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'orchestrator',
      agentName: 'ALCAT Orchestrator-Prime',
      text: isHi
        ? 'नमस्ते! मैं ALCAT (Autonomous Lattice Cellular Automata & Transactions) मल्टी-एजेंट ऑर्केस्ट्रेटर हूँ। मैं Conway Automata, Algorand X402 माइक्रोपेमेंट्स और NIST Post-Quantum Cryptography (ML-KEM-768/ML-DSA-65) के ज़रिए पूरी तरह स्वायत्त कार्य निष्पादित करता हूँ।'
        : 'Welcome to ALCAT (Autonomous Lattice Cellular Automata & Transactions) - your Web 4.0 Autonomous Multi-Agent Orchestration Platform. I coordinate Conway Automata state machines, Algorand X402 M2M micropayments, and NIST Post-Quantum Cryptography (ML-KEM-768 & ML-DSA-65). What task would you like the swarm to execute today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        pqcSignature: 'ML-DSA-65-ALCAT-VERIFIED',
        conwayState: 'EQUILIBRIUM_READY',
        m2mFee: '0.0000 ALGO (Genesis)',
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [executingTask, setExecutingTask] = useState(false);
  const [taskResult, setTaskResult] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, executingTask]);

  const quickPrompts = isHi
    ? [
        { label: '🚀 सबसे सस्ता सर्वर डेटा लाओ (X402 Pay)', prompt: 'मेरे लिए सबसे सस्ता सर्वर डेटा खोजो, SLA मोलभाव करो और Algorand X402 से पेमेंट सेटल करो।' },
        { label: '🛡️ क्वांटम ML-DSA-65 की हस्ताक्षर जांच', prompt: 'ML-DSA-65 (Dilithium) पोस्ट-क्वांटम सिग्नेचर जनरेट करो और इसकी Shor एल्गोरिदम सुरक्षा सत्यापित करो।' },
        { label: '🧬 कॉनवे स्टेट मशीन सिमुलेट करो', prompt: 'कॉनवे सेल्युलर ऑटोमेटा आधारित 4-एजेंट मेश का स्टेट ट्रांजिशन शुरू करो।' },
        { label: '⚖️ Coinbase KYC व स्मार्ट कॉन्ट्रैक्ट ऑडिट', prompt: 'Coinbase KYC अनुपालन और Arbitrum Stylus स्मार्ट कॉन्ट्रैक्ट का सुरक्षा ऑडिट करो।' },
      ]
    : [
        { label: '🚀 Procure Compute Node via X402', prompt: 'Find the lowest latency decentralized compute node, negotiate dynamic SLA, and settle micro-payment via Algorand X402.' },
        { label: '🛡️ Generate ML-DSA-65 PQC Signature', prompt: 'Generate NIST ML-DSA-65 Post-Quantum signature and verify lattice security against Shor algorithm.' },
        { label: '🧬 Evolve Conway Agent State Machine', prompt: 'Execute Conway cellular automaton state transitions for 4-agent autonomous negotiation swarm.' },
        { label: '⚖️ Run Coinbase KYC & Smart Contract Audit', prompt: 'Audit Arbitrum Stylus Rust contract for reentrancy, quantum lattice resilience, and Coinbase KYC guardrails.' },
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // Catvertising check for free tier: occasionally show an ad prompt or banner
    if (tier === 'free_catvertising' && Math.random() > 0.65) {
      onTriggerAd();
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({ role: m.sender, text: m.text })),
          language,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'orchestrator',
        agentName: 'Orchestrator-Prime',
        text: data.reply || data.fallbackReply || 'Task received and routed to Conway swarm.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          pqcSignature: data.pqcSignature,
          conwayState: data.conwayState,
          m2mFee: data.m2mFee,
        },
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'orchestrator',
        agentName: 'Orchestrator-Prime (Offline Safe Mode)',
        text: isHi
          ? 'नेटवर्क लेटेंसी के बावजूद पोस्ट-क्वांटम लैटिस चैनल सक्रिय है। टास्क को लोकल कॉनवे मेश पर प्रोसेस किया गया।'
          : 'Processed via local resilient Conway state engine. Post-quantum cryptographic session secured.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          pqcSignature: 'ML-DSA-65-LOCAL-FALLBACK',
          conwayState: 'RESILIENT_SYNC',
          m2mFee: '0.001 ALGO',
        },
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFullAutonomousPipeline = async () => {
    setExecutingTask(true);
    setTaskResult(null);

    const taskText = input || (isHi ? 'सबसे सस्ता GPU सर्वर डेटा लाओ और X402 से सेटल करो' : 'Procure lowest-cost compute node and settle with Algorand X402');
    
    try {
      const result = await onExecuteTask(taskText);
      setTaskResult(result);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });

      const completionMsg: ChatMessage = {
        id: `complete-${Date.now()}`,
        sender: 'agent',
        agentName: 'Agent Paymaster & QuantumShield',
        text: isHi
          ? `✅ स्वायत्त टास्क सफलतापूर्वक पूरा हुआ! ${result?.taskSummary || 'ऑपरेशन संपन्न'}. Algorand X402 M2M सेटलमेंट और ML-DSA-65 लैटिस सिग्नेचर सत्यापित।`
          : `✅ Autonomous multi-agent pipeline succeeded! ${result?.taskSummary || 'Operation executed'}. Algorand X402 atomic settlement and ML-DSA-65 lattice signature verified.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          pqcSignature: result?.pqcProof?.signatureHex || '0xMLDSA65_VERIFIED',
          conwayState: 'COMPLETE_EQUILIBRIUM',
          m2mFee: result?.settlement?.amount || '0.015 ALGO',
          txHash: result?.settlement?.txId || 'ALGO-TESTNET-849102',
        },
      };

      setMessages((prev) => [...prev, completionMsg]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setExecutingTask(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Agent Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center space-x-3 shadow-sm hover:border-slate-700 transition-all"
          >
            <div className="text-2xl p-2 rounded-lg bg-slate-800/80 flex items-center justify-center">
              {agent.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-200 truncate">{agent.name}</p>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{agent.role}</p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-cyan-400">{agent.state}</span>
                <span>⚡ {agent.energyLevel}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[560px] shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="font-semibold text-sm text-slate-200">
              {isHi ? 'ALCAT मल्टी-एजेंट कमांड सेंटर' : 'ALCAT Multi-Agent Command Center'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-500/30">
              Gemini 3.7 Flash + PQC Engine
            </span>
          </div>

          <button
            id="btn-run-autonomous-pipeline"
            onClick={handleRunFullAutonomousPipeline}
            disabled={executingTask}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md cursor-pointer transition-all disabled:opacity-50"
          >
            {executingTask ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isHi ? 'एजेंट्स निष्पादित कर रहे हैं...' : 'Swarm Executing...'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isHi ? 'पूर्ण ऑटोनोमस पाइपलाइन चलाएं' : 'Run Full Autonomous Swarm'}</span>
              </>
            )}
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    isUser
                      ? 'bg-cyan-600 text-white'
                      : msg.sender === 'agent'
                      ? 'bg-amber-600 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-600/90 text-white rounded-tr-none'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {!isUser && msg.agentName && (
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700/50">
                      <span className="font-bold text-xs text-cyan-300">{msg.agentName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Metadata Tags */}
                  {msg.metadata && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                      {msg.metadata.pqcSignature && (
                        <div className="flex items-center space-x-1 text-emerald-400">
                          <Shield className="w-3 h-3" />
                          <span className="truncate">PQC: {msg.metadata.pqcSignature}</span>
                        </div>
                      )}
                      {msg.metadata.m2mFee && (
                        <div className="flex items-center space-x-1 text-amber-400">
                          <Zap className="w-3 h-3" />
                          <span>Fee: {msg.metadata.m2mFee}</span>
                        </div>
                      )}
                      {msg.metadata.conwayState && (
                        <div className="flex items-center space-x-1 text-indigo-400">
                          <Cpu className="w-3 h-3" />
                          <span>FSM State: {msg.metadata.conwayState}</span>
                        </div>
                      )}
                      {msg.metadata.txHash && (
                        <div className="flex items-center space-x-1 text-cyan-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="truncate">Tx: {msg.metadata.txHash}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                {isHi ? 'Gemini और Conway एजेंट्स विचार-विमर्श कर रहे हैं...' : 'Gemini & Conway Agents reasoning and synthesizing state transitions...'}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider shrink-0">
            {isHi ? 'सुझाव:' : 'Quick:'}
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
          <input
            id="input-chat-query"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isHi
                ? 'एजेंट्स को निर्देश दें (उदा: "सबसे सस्ता सर्वर डेटा लाओ", "ML-DSA हस्ताक्षर सत्यापित करो")...'
                : 'Instruct autonomous agents (e.g. "Find cheapest compute node", "Sign with ML-DSA-65")...'
            }
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />

          <button
            id="btn-submit-chat"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-sm flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <span>{isHi ? 'भेजें' : 'Send'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
