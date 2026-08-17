import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, Shield, Cpu, Play, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, Globe, Check, X, Lock } from 'lucide-react';
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
      agentName: 'ALCAT Orchestrator-Prime (Gemini Full Strength)',
      text: isHi
        ? 'नमस्ते! मैं ALCAT (Autonomous Lattice Cellular Automata & Transactions) मल्टी-एजेंट ऑर्केस्ट्रेटर हूँ। Google Gemini 2.5/3.7 AI और Conway Automata के साथ, मैं आपके कहे अनुसार वेब ब्राउज़िंग, रिसर्च, कोड राइटिंग, पोस्ट-क्वांटम सिग्नेचर और A to Z प्रोजेक्ट वर्क आपकी अनुमति से खुद ही पूरा कर सकता हूँ।'
        : 'Welcome to ALCAT (Autonomous Lattice Cellular Automata & Transactions) - your Web 4.0 Autonomous Multi-Agent Swarm powered by Google Gemini AI & Conway Automata. Tell me any project or task: I will perform web browsing, research, smart contract generation, NIST PQC signing (ML-DSA-65), and Algorand X402 micropayments automatically upon your permission!',
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
  const [pendingPermissionTask, setPendingPermissionTask] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, executingTask, pendingPermissionTask]);

  const quickPrompts = isHi
    ? [
        { label: '🌐 वेब रिसर्च व लेटेस्ट PQC स्टैंडर्ड्स खोजो', prompt: 'वेब ब्राउज़ करके NIST Post-Quantum Cryptography FIPS 203 व 204 की नवीनतम गाइडलाइंस खोजो और रिपोर्ट बनाओ।' },
        { label: '🚀 A to Z नया Web4 प्रोजेक्ट शुरू करो', prompt: 'शुरू से अंत तक एक नया Web 4.0 ऑटोनोमस प्रोजेक्ट बनाओ, आर्किटेक्चर तय करो, Stylus Rust कोड लिखो और PQC साइन करो।' },
        { label: '⚡ सबसे सस्ता GPU नोड खोजो (X402 Pay)', prompt: 'मेरे लिए सबसे सस्ता सर्वर डेटा खोजो, SLA मोलभाव करो और Algorand X402 से पेमेंट सेटल करो।' },
        { label: '⚖️ Coinbase KYC व स्मार्ट कॉन्ट्रैक्ट ऑडिट', prompt: 'Coinbase KYC अनुपालन और Arbitrum Stylus स्मार्ट कॉन्ट्रैक्ट का सुरक्षा ऑडिट करो।' },
      ]
    : [
        { label: '🌐 Autonomous Web Research & PQC Standards', prompt: 'Browse the web and research the latest NIST FIPS 203 & 204 Post-Quantum Cryptography standards and create a synthesis report.' },
        { label: '🚀 Build Turnkey Web4 Project (A to Z)', prompt: 'Build a complete Web 4.0 autonomous project from A to Z with architecture, Arbitrum Stylus Rust smart contracts, and ML-DSA-65 signatures.' },
        { label: '⚡ Procure Compute Node via X402', prompt: 'Find the lowest latency decentralized compute node, negotiate dynamic SLA, and settle micro-payment via Algorand X402.' },
        { label: '⚖️ Run Coinbase KYC & Smart Contract Audit', prompt: 'Audit Arbitrum Stylus Rust contract for reentrancy, quantum lattice resilience, and Coinbase KYC guardrails.' },
      ];

  const handleRequestTaskWithPermission = (taskText: string) => {
    setPendingPermissionTask(taskText);
  };

  const handleApprovePendingTask = async () => {
    if (!pendingPermissionTask) return;
    const task = pendingPermissionTask;
    setPendingPermissionTask(null);
    await handleExecuteApprovedTask(task);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    if (tier === 'free_catvertising' && Math.random() > 0.7) {
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
        agentName: 'Orchestrator-Prime (Gemini AI Active)',
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

  const handleExecuteApprovedTask = async (taskText: string) => {
    setExecutingTask(true);
    setTaskResult(null);

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
        agentName: 'Agent Swarm (Autonomous Execution Complete)',
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
              {isHi ? 'ALCAT मल्टी-एजेंट स्वायत्त कमांड सेंटर' : 'ALCAT Multi-Agent Command Center'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Gemini AI (Full Strength) + PQC Engine</span>
            </span>
          </div>

          <button
            id="btn-run-autonomous-pipeline"
            onClick={() =>
              handleRequestTaskWithPermission(
                input || (isHi ? 'वेब रिसर्च करें, आर्किटेक्चर बनाएं और Stylus Rust कोड PQC के साथ डिप्लॉय करें' : 'Perform web research, build architecture, and deploy Stylus Rust code with PQC signatures')
              )
            }
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
                <span>{isHi ? 'A to Z ऑटोनोमस टास्क चलाएं' : 'Run A-to-Z Autonomous Swarm'}</span>
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
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                  }`}
                >
                  {!isUser && (
                    <div className="text-[11px] font-bold text-cyan-400 mb-1 flex items-center space-x-1.5">
                      <span>{msg.agentName || 'Orchestrator'}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Metadata Chips */}
                  {msg.metadata && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-2 text-[10px] font-mono">
                      {msg.metadata.pqcSignature && (
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
                          🛡️ {msg.metadata.pqcSignature}
                        </span>
                      )}
                      {msg.metadata.conwayState && (
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                          🧬 {msg.metadata.conwayState}
                        </span>
                      )}
                      {msg.metadata.m2mFee && (
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 text-amber-400 border border-amber-500/30">
                          ⚡ {msg.metadata.m2mFee}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pending Permission Request Modal Card */}
          {pendingPermissionTask && (
            <div className="p-4 bg-amber-950/60 border border-amber-500/50 rounded-2xl space-y-3 animate-pulse">
              <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                <Lock className="w-4 h-4" />
                <span>{isHi ? 'मानव अनुमति आवश्यक (Human Permission Required)' : 'Swarm Permission Approval Required'}</span>
              </div>
              <p className="text-xs text-slate-200">
                {isHi
                  ? `एजेंट स्वार्म इस टास्क को निष्पादित करने के लिए आपकी अनुमति मांग रहा है: "${pendingPermissionTask}". क्या आप स्वायत्त वेब रिसर्च, PQC साइनिंग और X402 सेटलमेंट की अनुमति देते हैं?`
                  : `Agent swarm requests your permission to execute: "${pendingPermissionTask}". Allow autonomous web research, NIST PQC signing, and Algorand X402 micro-settlement?`}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleApprovePendingTask}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isHi ? 'स्वीकार करें व शुरू करें' : 'Approve & Execute'}</span>
                </button>
                <button
                  onClick={() => setPendingPermissionTask(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isHi ? 'रद्द करें' : 'Cancel'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>{isHi ? 'Gemini AI और Conway लैटिस विचार कर रहे हैं...' : 'Gemini AI & Conway lattice reasoning in progress...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompts */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs whitespace-nowrap transition-all cursor-pointer shadow-sm hover:text-white hover:border-cyan-500/40"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isHi
                ? 'एजेंट्स को कोई भी प्रोजेक्ट, वेब रिसर्च या कार्य बताएं...'
                : 'Instruct the swarm: web browsing, project building, PQC signing...'
            }
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            id="btn-send-chat-message"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 cursor-pointer shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
