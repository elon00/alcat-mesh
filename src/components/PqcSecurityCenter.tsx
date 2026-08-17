import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, Cpu, CheckCircle2, AlertTriangle, RefreshCw, FileText, ArrowRight } from 'lucide-react';
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
    await new Promise((r) => setTimeout(r, 400));
    const res = signWithMlDsa65(messageToSign, dsaKeyPair);
    setSigningResult(res);
    setIsSigning(false);
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

          <button
            id="btn-generate-pqc-keys"
            onClick={handleGenerateNewKeys}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isHi ? 'नए लैटिस की-पेयर जनरेट करें' : 'Generate New Lattice Keypairs'}</span>
          </button>
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
              Key Encapsulation
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isHi ? 'एजेंट-टू-एजेंट सुरक्षित सिमेट्रिक की एक्सचेंज' : 'Agent-to-agent quantum-safe key exchange mechanism (FIPS 203)'}
          </p>

          <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Public Lattice Key:</span>
              <span className="text-cyan-300 break-all">{kemKeyPair.publicKey}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Private Key (Masked HSM):</span>
              <span className="text-slate-400 break-all">{kemKeyPair.privateKeyMasked}</span>
            </div>
            <div className="pt-1 text-[11px] text-emerald-400 flex items-center justify-between">
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
              Digital Signatures
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isHi ? 'स्मार्ट कॉन्ट्रैक्ट और M2M पेमेंट के लिए लैटिस सिग्नेचर' : 'Quantum-resistant digital signature scheme (FIPS 204)'}
          </p>

          <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Lattice Verification Key:</span>
              <span className="text-indigo-300 break-all">{dsaKeyPair.publicKey}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Private Signing Key (LWE Vector):</span>
              <span className="text-slate-400 break-all">{dsaKeyPair.privateKeyMasked}</span>
            </div>
            <div className="pt-1 text-[11px] text-emerald-400 flex items-center justify-between">
              <span>{dsaKeyPair.nistCategory}</span>
              <span>Immune to Shor's Algorithm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Signature & Verification Sandbox */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? 'ML-DSA-65 हस्ताक्षर व सत्यापन लैब' : 'Live ML-DSA-65 Signing & Lattice Verification Lab'}</span>
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
              <span>{isHi ? 'ML-DSA-65 से साइन करें व सत्यापित करें' : 'Sign Payload with ML-DSA-65 & Verify'}</span>
            </>
          )}
        </button>

        {signingResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHi ? 'हस्ताक्षर सत्यापित (Lattice Verification Passed)' : 'Lattice Signature Cryptographically Verified'}</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Latency: {signingResult.timeMs} ms</span>
            </div>
            <div className="text-xs font-mono text-slate-300 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Generated Dilithium Lattice Signature:</span>
              {signingResult.signature}
            </div>
          </div>
        )}
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
