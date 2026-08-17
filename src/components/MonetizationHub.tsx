import React, { useState } from 'react';
import { CreditCard, Sparkles, CheckCircle2, Shield, Zap, X, Play, RefreshCw } from 'lucide-react';
import { RevenueCatTier, SupportedLanguage } from '../types';
import confetti from 'canvas-confetti';

interface MonetizationHubProps {
  currentTier: RevenueCatTier;
  onSelectTier: (tier: RevenueCatTier) => void;
  language: SupportedLanguage;
  showAdBanner: boolean;
  setShowAdBanner: (show: boolean) => void;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  currentTier,
  onSelectTier,
  language,
  showAdBanner,
  setShowAdBanner,
}) => {
  const isHi = language === 'hi';
  const [isProcessing, setIsProcessing] = useState(false);
  const [rewardedAdActive, setRewardedAdActive] = useState(false);
  const [adTimer, setAdTimer] = useState(5);

  const handleUpgrade = (tier: RevenueCatTier) => {
    setIsProcessing(true);
    setTimeout(() => {
      onSelectTier(tier);
      setIsProcessing(false);
      setShowAdBanner(false);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 600);
  };

  const handleWatchRewardedAd = () => {
    setRewardedAdActive(true);
    setAdTimer(5);

    const interval = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRewardedAdActive(false);
          confetti({
            particleCount: 30,
            spread: 40,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const tiers = [
    {
      id: 'free_catvertising' as RevenueCatTier,
      name: isHi ? 'फ्री (Catvertising Ads)' : 'Free Tier (Catvertising)',
      price: '$0 / mo',
      desc: isHi
        ? 'विज्ञापन-समर्थित मुफ्त स्तर। Catvertising नेटवर्क द्वारा मोनेटाइज़ किया जाता है।'
        : 'Ad-supported tier monetized via Catvertising SDK network.',
      features: [
        isHi ? 'मूल कॉनवे 2D ऑटोमेटन सिमुलेटर' : 'Standard Conway 2D cellular automaton',
        isHi ? 'दैनिक 5 X402 M2M माइक्रोपेमेंट्स' : 'Up to 5 X402 M2M micro-transactions / day',
        isHi ? 'बेसिक चैटबॉट सहायता' : 'Standard Agent Chatbot access',
        isHi ? 'Catvertising बैनर विज्ञापन शामिल' : 'Catvertising sponsored interstitial banners',
      ],
      badge: isHi ? 'मूल' : 'Standard',
      buttonText: isHi ? 'वर्तमान प्लान' : 'Current Plan',
      accentColor: 'border-slate-700 bg-slate-900/60',
    },
    {
      id: 'pro_agentic' as RevenueCatTier,
      name: 'Pro Agentic',
      price: '$19.99 / mo',
      desc: isHi
        ? 'स्वतंत्र डेवलपर्स और AI शोधकर्ताओं के लिए पूर्ण स्वायत्त स्वार्म।'
        : 'For autonomous agents needing continuous M2M liquidity and no ads.',
      features: [
        isHi ? 'सभी विज्ञापन हमेशा के लिए हटाएं' : '100% Ad-Free experience',
        isHi ? 'असीमित कॉनवे मल्टी-एजेंट स्वाार्म' : 'Unlimited Conway multi-agent orchestration',
        isHi ? 'Algorand X402 गैस प्रायोजन रिले' : 'Algorand X402 Gas Sponsor Relay (Zero Gas)',
        isHi ? 'NIST ML-DSA-65 पोस्ट-क्वांटम सिग्नेचर' : 'Full NIST ML-DSA-65 post-quantum signing',
        isHi ? 'Coinbase KYC अनुपालन सत्यापन' : 'Coinbase KYC auto-verification guardrail',
      ],
      badge: isHi ? 'लोकप्रिय' : 'Popular',
      buttonText: isHi ? 'Pro में अपग्रेड करें (Apple / Google Pay)' : 'Upgrade to Pro (Apple/Google Pay)',
      accentColor: 'border-cyan-500/60 bg-gradient-to-b from-cyan-950/40 to-slate-900/90 ring-1 ring-cyan-500/40',
    },
    {
      id: 'quantum_enterprise' as RevenueCatTier,
      name: 'Quantum Enterprise Web4',
      price: '$99.99 / mo',
      desc: isHi
        ? 'संस्थागत और उच्च-मूल्य वेब 4.0 अर्थव्यवस्थाओं के लिए।'
        : 'Mission-critical post-quantum HSM security and Arbitrum Stylus Rust contracts.',
      features: [
        isHi ? 'ML-KEM-768 + ML-DSA-65 HSM एन्क्लेव' : 'Dedicated NIST Level 5 PQC Enclave',
        isHi ? 'Arbitrum Stylus Rust + Algorand AVM' : 'Arbitrum Stylus Rust + Algorand AVM',
        isHi ? 'प्राथमिकता गैसलेस रिले नोड्स' : 'High-throughput prioritized relay nodes',
        isHi ? 'स्मार्ट कॉन्ट्रैक्ट AI वल्नरेबिलिटी स्कैनर' : 'Continuous Gemini Smart Contract Auditor',
        isHi ? '24/7 SLA और अनुपालन लॉगिंग' : '24/7 Zero-Trust SLA & Audit logs',
      ],
      badge: 'Enterprise',
      buttonText: isHi ? 'एंटरप्राइज चुनें' : 'Subscribe Enterprise',
      accentColor: 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 to-slate-900/90 ring-1 ring-indigo-500/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">
                {isHi ? 'RevenueCat व Catvertising मोनेटाइज़ेशन लेयर' : 'RevenueCat SDK & Catvertising Monetization Layer'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi
                ? 'फिएट-आधारित प्रीमियम सब्सक्रिप्शन (Apple Pay / Google Pay) और मुफ्त टियर के लिए Catvertising इन-ऐप विज्ञापन।'
                : 'Fiat subscription entitlement management via RevenueCat Purchases SDK alongside Catvertising ad monetization.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
              Active: {currentTier.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Catvertising Banner Demo */}
      {showAdBanner && currentTier === 'free_catvertising' && (
        <div className="bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl relative animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
              🐾
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                  Catvertising Ad Network
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {isHi ? 'QuantumCloud AI: तेज GPU नोड्स' : 'QuantumCloud AI: 50% Off GPU Compute Clusters'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isHi
                  ? 'यह विज्ञापन Catvertising SDK के ज़रिए दिखाया जा रहा है। विज्ञापन हटाने के लिए Pro लें।'
                  : 'Sponsored Ad by Catvertising. Upgrade to Pro Agentic via RevenueCat to eliminate ads.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleWatchRewardedAd}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all shadow"
            >
              <Play className="w-3 h-3 fill-slate-950" />
              <span>{isHi ? 'रिवॉर्ड वीडियो देखें (+50 PQC टोकन)' : 'Watch Rewarded Video'}</span>
            </button>
            <button
              onClick={() => setShowAdBanner(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
              title="Close Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Rewarded Ad Modal Simulator */}
      {rewardedAdActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mx-auto">
              🐱
            </div>
            <h3 className="font-bold text-lg text-slate-100">
              {isHi ? 'Catvertising स्पॉन्सर्ड वीडियो चल रहा है' : 'Catvertising Sponsored Stream'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHi
                ? 'वीडियो पूरा होने पर आपको मुफ्त PQC कंप्यूट क्रेडिट प्राप्त होगा।'
                : 'Watch to the end to claim free Post-Quantum Agentic compute gas credits.'}
            </p>

            <div className="text-3xl font-mono font-bold text-amber-400 py-2">
              00:0{adTimer}s
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 transition-all duration-1000"
                style={{ width: `${((5 - adTimer) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Subscription Pricing Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isSelected = currentTier === t.id;
          return (
            <div
              key={t.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between shadow-xl transition-all ${
                t.accentColor
              } ${isSelected ? 'ring-2 ring-emerald-500/60' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {t.badge}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHi ? 'सक्रिय' : 'Active'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-100">{t.name}</h3>
                <div className="mt-2 text-2xl font-black text-slate-100 font-mono">{t.price}</div>
                <p className="text-xs text-slate-400 mt-2">{t.desc}</p>

                <div className="mt-5 space-y-2 pt-4 border-t border-slate-800">
                  {t.features.map((f, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  id={`btn-select-tier-${t.id}`}
                  onClick={() => handleUpgrade(t.id)}
                  disabled={isSelected || isProcessing}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : t.id === 'pro_agentic'
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : t.id === 'quantum_enterprise'
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center space-x-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isHi ? 'RevenueCat सिंक हो रहा है...' : 'Syncing RevenueCat SDK...'}</span>
                    </span>
                  ) : isSelected ? (
                    isHi ? 'वर्तमान सक्रिय प्लान' : 'Current Active Plan'
                  ) : (
                    t.buttonText
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
