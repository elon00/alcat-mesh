/**
 * @license Apache-2.0
 * ALCAT EIP-6963 Multi-Wallet Provider Shield & Discovery Engine
 * Prevents window.ethereum collision exceptions and supports multi-wallet coexistence
 */

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}

type ProviderCallback = (providers: EIP6963ProviderDetail[]) => void;

class WalletProviderShield {
  private detectedProviders: Map<string, EIP6963ProviderDetail> = new Map();
  private listeners: Set<ProviderCallback> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    // 1. EIP-6963 Provider Announcement Listener
    window.addEventListener('eip6963:announceProvider', (event: any) => {
      if (event && event.detail && event.detail.info && event.detail.info.uuid) {
        const detail: EIP6963ProviderDetail = event.detail;
        this.detectedProviders.set(detail.info.uuid, detail);
        this.notifyListeners();
      }
    });

    // 2. Dispatch EIP-6963 Request to all wallet extensions
    try {
      window.dispatchEvent(new Event('eip6963:requestProvider'));
    } catch {
      // Ignore if event dispatch is restricted
    }

    // 3. Safe fallback detection for legacy window.ethereum without throwing collision errors
    setTimeout(() => {
      try {
        const anyWin = window as any;
        if (anyWin.ethereum && !this.detectedProviders.has('legacy-evm')) {
          const isMetaMask = !!anyWin.ethereum.isMetaMask;
          const isRabby = !!anyWin.ethereum.isRabby;
          const isCoinbase = !!anyWin.ethereum.isCoinbaseWallet;
          const name = isRabby ? 'Rabby Wallet' : isCoinbase ? 'Coinbase Wallet' : isMetaMask ? 'MetaMask' : 'EVM Web3 Wallet';

          this.detectedProviders.set('legacy-evm', {
            info: {
              uuid: 'legacy-evm',
              name,
              icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
              rdns: 'io.metamask',
            },
            provider: anyWin.ethereum,
          });
          this.notifyListeners();
        }
      } catch {
        // Safe absorption of strict property redefine errors
      }
    }, 200);
  }

  public getProviders(): EIP6963ProviderDetail[] {
    return Array.from(this.detectedProviders.values());
  }

  public subscribe(cb: ProviderCallback): () => void {
    this.listeners.add(cb);
    cb(this.getProviders());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyListeners() {
    const list = this.getProviders();
    this.listeners.forEach((cb) => cb(list));
  }

  /**
   * Safe provider accessor that never throws property collision errors
   */
  public getSafeEVMProvider(uuid?: string): any | null {
    if (uuid && this.detectedProviders.has(uuid)) {
      return this.detectedProviders.get(uuid)!.provider;
    }
    const all = this.getProviders();
    return all.length > 0 ? all[0].provider : null;
  }
}

export const walletShield = new WalletProviderShield();
