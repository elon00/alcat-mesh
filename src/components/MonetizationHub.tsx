import React, { useState } from 'react';
import { CreditCard, Sparkles, CheckCircle2, Shield, Zap, X, Play, RefreshCw, Download, Gift, Tag, Check, ShieldCheck, ArrowRight } from 'lucide-react';
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

  // Checkout modal state
  const [checkoutTier, setCheckoutTier] = useState<RevenueCatTier | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'crypto'>('card');
  const [invoiceReady, setInvoiceReady] = useState(false);

  const handleOpenCheckout = (tier: RevenueCatTier) => {
    if (tier === 'free_catvertising') {
      onSelectTier(tier);
      confetti({ particleCount: 30, spread: 40 });
      return;
    }
    setCheckoutTier(tier);
    setPromoCode('');
    setDiscountPercent(0);
    setPromoApplied(false);
    setPromoError('');
    setInvoiceReady(false);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'QUANTUM50') {
      setDiscountPercent(50);
      setPromoApplied(true);
      setPromoError('');
      confetti({ particleCount: 30, spread: 40 });
    } else if (promoCode.trim().toUpperCase() === 'ALCATVIP') {
      setDiscountPercent(30);
      setPromoApplied(true);
      setPromoError('');
      confetti({ particleCount: 30, spread: 40 });
    } else {
      setPromoError(isHi ? 'अमान्य प्रोमो कोड (ट्राय करें: QUANTUM50)' : 'Invalid promo code (Try: QUANTUM50)');
    }
  };

  const handleCompletePurchase = () => {
    if (!checkoutTier) return;
    setIsProcessing(true);
    setTimeout(() => {
      onSelectTier(checkoutTier);
      setIsProcessing(false);
      setShowAdBanner(false);
      setInvoiceReady(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 700);
  };

  const handleDownloadInvoice = () => {
    if (!checkoutTier) return;
    const basePrice = checkoutTier === 'pro_agentic' ? 19.99 : 99.99;
    const finalPrice = discountPercent > 0 ? basePrice * (1 - discountPercent / 100) : basePrice;

    const receipt = `# ALCAT WEB 4.0 SUBSCRIPTION INVOICE & TAX RECEIPT
========================================================================
Invoice Number:   INV-ALCAT-${Math.floor(100000 + Math.random() * 900000)}
Date:             ${new Date().toISOString()}
Payment Scheme:   RevenueCat Purchases SDK v8.4 (Stripe / In-App)
Customer Status:  Verified (Coinbase KYC Guardrail Active)

------------------------------------------------------------------------
ITEM                               QTY       UNIT PRICE       TOTAL
------------------------------------------------------------------------
${checkoutTier === 'pro_agentic' ? 'ALCAT Pro Agentic Subscription (1 Mo)' : 'ALCAT Quantum Enterprise SLA (1 Mo)'}
                                    1        $${basePrice.toFixed(2)} USD        $${basePrice.toFixed(2)} USD
Discount Promo: ${promoApplied ? promoCode.toUpperCase() + ` (-${discountPercent}%)` : 'NONE'}
                                             -$${(basePrice - finalPrice).toFixed(2)} USD
------------------------------------------------------------------------
GRAND TOTAL PAID:                            $${finalPrice.toFixed(2)} USD
TAX (VAT 0% Global Zero-Trust):              $0.00 USD
PAYMENT STATUS:                              PAID & CONFIRMED
PQC RECEIPT HASH:                            ML-DSA-65-${Math.random().toString(36).substring(2, 12).toUpperCase()}
========================================================================
Thank you for powering the Web 4.0 Autonomous Quantum Economy!
`;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ALCAT_INVOICE_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
      buttonText: isHi ? 'Pro में अपग्रेड करें ($19.99)' : 'Upgrade to Pro ($19.99)',
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
      buttonText: isHi ? 'एंटरप्राइज चुनें ($99.99)' : 'Subscribe Enterprise ($99.99)',
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
              Active Plan: {currentTier.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Catvertising Banner Demo */}
      {showAdBanner && currentTier === 'free_catvertising' && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg relative">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg">
              🐱
            </div>
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                Catvertising Sponsored Ad
              </span>
              <p className="text-xs text-slate-200 mt-0.5 font-medium">
                {isHi
                  ? 'Decentralized GPU Compute Nodes पर 20% की छूट पाएं! PQC सिक्योर टेस्टनेट।'
                  : 'Power your multi-agent swarm with high-speed decentralized quantum-safe GPUs.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleWatchRewardedAd}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all shadow"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isHi ? 'रिवॉर्ड वीडियो देखें' : 'Watch Rewarded Video'}</span>
            </button>
            <button
              onClick={() => setShowAdBanner(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Rewarded Video Modal */}
      {rewardedAdActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-3xl">
              🐱
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isHi ? 'Catvertising रिवॉर्डेड वीडियो सिमुलेशन' : 'Catvertising Rewarded Video Stream'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHi
                ? 'निःशुल्क X402 गैस कूपन अनलॉक करने हेतु विज्ञापन समाप्त होने की प्रतीक्षा करें।'
                : 'Watching sponsor stream for zero-gas Algorand micro-payment credits.'}
            </p>
            <div className="text-3xl font-black text-amber-400 font-mono py-2">{adTimer}s</div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-amber-500 h-full transition-all duration-1000"
                style={{ width: `${((5 - adTimer) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isSelected = currentTier === t.id;
          return (
            <div
              key={t.id}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${t.accentColor} ${
                isSelected ? 'shadow-xl shadow-cyan-500/10' : 'hover:border-slate-600'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.badge}</span>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-100">{t.name}</h3>
                  <div className="text-2xl font-black text-slate-100 font-mono mt-1">{t.price}</div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{t.desc}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {t.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/60">
                <button
                  onClick={() => handleOpenCheckout(t.id)}
                  disabled={isSelected}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? 'bg-slate-800 text-slate-500 cursor-default border border-slate-700'
                      : t.id === 'pro_agentic'
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                      : t.id === 'quantum_enterprise'
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>{isSelected ? (isHi ? 'वर्तमान एक्टिव प्लान' : 'Current Active Plan') : t.buttonText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Checkout Modal */}
      {checkoutTier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base">
                  {isHi ? 'RevenueCat सुरक्षित चेकआउट' : 'RevenueCat Secure Checkout'}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutTier(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {invoiceReady ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-emerald-400">
                  {isHi ? 'सब्सक्रिप्शन सफलतापूर्वक सक्रिय हुआ!' : 'Subscription Successfully Activated!'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isHi
                    ? 'आपका ALCAT प्लान अपग्रेड कर दिया गया है। टैक्स इनवॉइस रसीद डाउनलोड करने हेतु नीचे क्लिक करें।'
                    : 'Your entitlements have been updated across the quantum mesh.'}
                </p>
                <div className="flex items-center justify-center space-x-3 pt-2">
                  <button
                    onClick={handleDownloadInvoice}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isHi ? 'टैक्स इनवॉइस रसीद डाउनलोड करें' : 'Download Tax Invoice'}</span>
                  </button>
                  <button
                    onClick={() => setCheckoutTier(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    {isHi ? 'बंद करें' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Plan Summary */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">
                      {checkoutTier === 'pro_agentic' ? 'ALCAT Pro Agentic' : 'ALCAT Quantum Enterprise'}
                    </span>
                    <span className="text-slate-400 text-[11px]">Monthly Recurring Billing (Cancel Anytime)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      ${discountPercent > 0
                        ? ((checkoutTier === 'pro_agentic' ? 19.99 : 99.99) * (1 - discountPercent / 100)).toFixed(2)
                        : checkoutTier === 'pro_agentic'
                        ? '19.99'
                        : '99.99'}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-[10px] text-emerald-400 block line-through">
                        ${checkoutTier === 'pro_agentic' ? '19.99' : '99.99'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Promo Code Box */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block">{isHi ? 'डिस्काउंट प्रोमो कोड' : 'Have a Promo Code?'}</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try: QUANTUM50"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      {isHi ? 'लागू करें' : 'Apply'}
                    </button>
                  </div>
                  {promoApplied && (
                    <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isHi ? `प्रोमो कोड लागू हुआ (${discountPercent}% छूट)!` : `Promo Applied! ${discountPercent}% Discount Granted.`}</span>
                    </span>
                  )}
                  {promoError && <span className="text-[11px] text-rose-400">{promoError}</span>}
                </div>

                {/* Payment Methods */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block">{isHi ? 'भुगतान विधि' : 'Payment Method'}</label>
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'card' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      💳 Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'apple_pay' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      🍎 Apple Pay
                    </button>
                    <button
                      onClick={() => setPaymentMethod('google_pay')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'google_pay' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      🇬 Google Pay
                    </button>
                    <button
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'crypto' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      ⚡ Crypto
                    </button>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleCompletePurchase}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{isHi ? 'पेमेंट प्रोसेस हो रहा है...' : 'Processing Transaction via RevenueCat...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-slate-950" />
                      <span>{isHi ? 'भुगतान पूर्ण करें व एक्टिवेट करें' : 'Confirm & Activate Entitlement'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
