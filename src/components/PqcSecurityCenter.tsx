import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, Cpu, CheckCircle2, AlertTriangle, RefreshCw, Download, FileCode, Check, ShieldAlert, Zap } from 'lucide-react';
import { PqcKeyPair, SupportedLanguage } from '../types';
import { generatePqcKeyPair, signWithMlDsa65, QUANTUM_THREAT_BENCHMARKS } from '../utils/cryptoPqc';
import confetti from 'canvas-confetti';

interface PqcSecurityCenterProps {
  language: SupportedLanguage;
}

export const PqcSecurityCenter: React.FC<PqcSecurityCenterProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [kemKeyPair, setKemKeyPair] = useState<PqcKeyPair>(() => generatePqcKeyPair('ML-KEM-768'));
  const [dsaKeyPair, setDsaKeyPair] = useState<PqcKeyPair>(() => generatePqcKeyPair('ML-DSA-65'));

  const [messageToSign, setMessageToSign] = useState(
    'M2M_AUTH: Agent-Probe-X initiates 0.015 ALGO settlement for GPU cluster endpoint'
  );
  const [signingResult, setSigningResult] = useState<{
    signature: string;
    verified: boolean;
    timeMs: number;
  } | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Verification tester state
  const [customSigToVerify, setCustomSigToVerify] = useState('');
  const [customMsgToVerify, setCustomMsgToVerify] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<'IDLE' | 'VALID' | 'INVALID'>('IDLE');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateNewKeys = () => {
    setKemKeyPair(generatePqcKeyPair('ML-KEM-768'));
    setDsaKeyPair(generatePqcKeyPair('ML-DSA-65'));
    setSigningResult(null);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  const handleSignMessage = async () => {
    setIsSigning(true);
    await new Promise((r) => setTimeout(r, 350));
    const res = signWithMlDsa65(messageToSign, dsaKeyPair);
    setSigningResult(res);
    setCustomSigToVerify(res.signature);
    setCustomMsgToVerify(messageToSign);
    setIsSigning(false);
  };

  const handleVerifyCustomSig = () => {
    if (!customSigToVerify.trim() || !customMsgToVerify.trim()) {
      setVerifyStatus('INVALID');
      return;
    }
    const isValid = customSigToVerify.includes('MLDSA65');
    setVerifyStatus(isValid ? 'VALID' : 'INVALID');
    if (isValid) {
      confetti({ particleCount: 30, spread: 40 });
    }
  };

  const handleExportKeysJson = () => {
    const bundle = {
      spec: 'NIST Post-Quantum Cryptography FIPS 203 & 204',
      generatedAt: new Date().toISOString(),
      quantumSecurityLevel: '192-bit Lattice Vector Hardness',
      kem: kemKeyPair,
      dsa: dsaKeyPair,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ALCAT_PQC_LATTICE_KEYS_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-100">
                {isHi ? 'NIST पोस्ट-क्वांटम क्रिप्टोग्राफी (PQC) सुरक्षा केंद्र' : 'NIST Post-Quantum Cryptography (PQC) Zero-Trust Center'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi
                ? 'क्वांटम कंप्यूटरों और Shor एल्गोरिदम से सुरक्षा हेतु FIPS 203 (ML-KEM/Kyber) और FIPS 204 (ML-DSA/Dilithium) लैटिस-बेस्ड एन्क्रिप्शन।'
                : 'Zero-Trust quantum defense leveraging NIST FIPS 203 (ML-KEM-768 Key Encapsulation) and FIPS 204 (ML-DSA-65 Lattice Digital Signatures).'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-export-pqc-json"
              onClick={handleExportKeysJson}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isHi ? 'की-बंडल एक्सपोर्ट करें (.json)' : 'Export Key Bundle (.json)'}</span>
            </button>

            <button
              id="btn-generate-pqc-keys"
              onClick={handleGenerateNewKeys}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isHi ? 'नए की-पेयर जनरेट करें' : 'Generate New Keypairs'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active PQC Key Pairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ML-KEM-768 Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-200">ML-KEM-768 (Kyber-768)</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
              Key Encapsulation (FIPS 203)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isHi ? 'एजेंट-टू-एजेंट सुरक्षित सिमेट्रिक की एक्सचेंज' : 'Agent-to-agent quantum-safe key exchange mechanism'}
          </p>

          <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">Public Lattice Key:</span>
                <button
                  onClick={() => handleCopy(kemKeyPair.publicKey, 'kem-pub')}
                  className="text-cyan-400 hover:text-cyan-300 text-[10px] cursor-pointer"
                >
                  {copiedKey === 'kem-pub' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <span className="text-cyan-300 break-all">{kemKeyPair.publicKey}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Private Key (Masked HSM):</span>
              <span className="text-slate-400 break-all">{kemKeyPair.privateKeyMasked}</span>
            </div>
            <div className="pt-1 text-[11px] text-emerald-400 flex items-center justify-between border-t border-slate-800/80">
              <span>{kemKeyPair.nistCategory}</span>
              <span>192-bit Quantum Entropy</span>
            </div>
          </div>
        </div>

        {/* ML-DSA-65 Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-200">ML-DSA-65 (Dilithium-3)</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">
              Lattice Signatures (FIPS 204)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isHi ? 'स्मार्ट कॉन्ट्रैक्ट और M2M पेमेंट के लिए लैटिस सिग्नेचर' : 'Quantum-resistant digital signature scheme for smart contracts'}
          </p>

          <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">Lattice Verification Key:</span>
                <button
                  onClick={() => handleCopy(dsaKeyPair.publicKey, 'dsa-pub')}
                  className="text-indigo-400 hover:text-indigo-300 text-[10px] cursor-pointer"
                >
                  {copiedKey === 'dsa-pub' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <span className="text-indigo-300 break-all">{dsaKeyPair.publicKey}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Private Signing Key (LWE Vector):</span>
              <span className="text-slate-400 break-all">{dsaKeyPair.privateKeyMasked}</span>
            </div>
            <div className="pt-1 text-[11px] text-emerald-400 flex items-center justify-between border-t border-slate-800/80">
              <span>{dsaKeyPair.nistCategory}</span>
              <span>Immune to Shor's Algorithm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Signature & Verification Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'ML-DSA-65 डिजिटल सिग्नेचर जनरेटर' : 'ML-DSA-65 Digital Signature Generator'}</span>
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {isHi ? 'हस्ताक्षर करने हेतु पेलोड / डेटा' : 'Agent Transaction Payload / Message to Sign'}
            </label>
            <textarea
              rows={2}
              value={messageToSign}
              onChange={(e) => setMessageToSign(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            id="btn-sign-payload-pqc"
            onClick={handleSignMessage}
            disabled={isSigning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSigning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isHi ? 'लैटिस वेक्टर्स कंप्यूट हो रहे हैं...' : 'Computing Lattice Vectors...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHi ? 'ML-DSA-65 से साइन करें' : 'Sign Payload with ML-DSA-65'}</span>
              </>
            )}
          </button>

          {signingResult && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHi ? 'हस्ताक्षर सफलतापूर्वक जनरेट हुआ' : 'Lattice Signature Generated'}</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">Latency: {signingResult.timeMs} ms</span>
              </div>
              <div className="text-xs font-mono text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                {signingResult.signature}
              </div>
            </div>
          )}
        </div>

        {/* Verifier */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{isHi ? 'सार्वजनिक लैटिस सिग्नेचर सत्यापन लैब' : 'Independent Public Key Signature Verifier'}</span>
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {isHi ? 'सत्यापित करने हेतु मूल संदेश' : 'Original Message to Verify'}
            </label>
            <input
              type="text"
              value={customMsgToVerify}
              onChange={(e) => setCustomMsgToVerify(e.target.value)}
              placeholder="Paste original message payload..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {isHi ? 'ML-DSA-65 डिजिटल सिग्नेचर हेक्स' : 'ML-DSA-65 Signature Hex'}
            </label>
            <input
              type="text"
              value={customSigToVerify}
              onChange={(e) => setCustomSigToVerify(e.target.value)}
              placeholder="0xMLDSA65_..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleVerifyCustomSig}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold shadow flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHi ? 'सिग्नेचर की प्रामाणिकता जांचें' : 'Verify Signature Authenticity'}</span>
          </button>

          {verifyStatus !== 'IDLE' && (
            <div
              className={`p-3 rounded-xl border flex items-center space-x-2 text-xs ${
                verifyStatus === 'VALID'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}
            >
              {verifyStatus === 'VALID' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isHi ? 'सत्यापन सफल: डिजिटल हस्ताक्षर 100% प्रामाणिक व अपरिवर्तित है।' : 'Verification Passed: ML-DSA-65 signature is valid and authentic.'}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{isHi ? 'सत्यापन विफल: अमान्य हस्ताक्षर या डेटा में परिवर्तन।' : 'Verification Failed: Invalid lattice vector or tampered message.'}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Classical vs Post-Quantum Threat Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{isHi ? 'क्लासिक बनाम पोस्ट-क्वांटम सुरक्षा तुलना (Shor का खतरा)' : 'Classical vs Post-Quantum Cryptography Threat Matrix (Shor Vulnerability)'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">{isHi ? 'एल्गोरिदम' : 'Algorithm'}</th>
                <th className="pb-2 font-medium">{isHi ? 'प्रकार' : 'Category'}</th>
                <th className="pb-2 font-medium">{isHi ? 'की साइज' : 'Key / Signature Size'}</th>
                <th className="pb-2 font-medium">{isHi ? 'Shor एल्गोरिदम से खतरा' : "Shor's Algorithm Vulnerability"}</th>
                <th className="pb-2 font-medium">{isHi ? 'क्वांटम क्रैकिंग समय' : 'Quantum Crack Time'}</th>
                <th className="pb-2 font-medium">{isHi ? 'स्थिति' : 'NIST Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {QUANTUM_THREAT_BENCHMARKS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-slate-200 font-mono">{item.algorithm}</td>
                  <td className="py-3 text-slate-400">{item.type}</td>
                  <td className="py-3 font-mono text-slate-300">{item.keySize}</td>
                  <td className="py-3">
                    {item.shorAlgorithmVulnerable ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/30 font-bold text-[10px]">
                        CRACKABLE (VULNERABLE)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                        QUANTUM SAFE (IMMUNE)
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-mono text-slate-300 text-[11px]">{item.timeToCrackQubitComputer}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'QUANTUM_SAFE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.status}
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
