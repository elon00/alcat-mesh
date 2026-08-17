/**
 * @license Apache-2.0
 * ALCAT Multi-RPC Failover & Resilience Engine
 * Provides automated latency tracking, circuit breaking, and healthy node routing
 */

export interface RpcEndpoint {
  url: string;
  network: 'algorand-testnet' | 'arbitrum-sepolia';
  latencyMs: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastChecked: number;
  failureCount: number;
}

export const DEFAULT_RPC_POOLS: RpcEndpoint[] = [
  // Algorand Testnet Pool
  {
    url: 'https://testnet-api.algonode.cloud',
    network: 'algorand-testnet',
    latencyMs: 38,
    status: 'ONLINE',
    lastChecked: Date.now(),
    failureCount: 0,
  },
  {
    url: 'https://node.testnet.algoexplorerapi.io',
    network: 'algorand-testnet',
    latencyMs: 72,
    status: 'ONLINE',
    lastChecked: Date.now(),
    failureCount: 0,
  },
  {
    url: 'https://academy-gcp-testnet.algorand.network',
    network: 'algorand-testnet',
    latencyMs: 95,
    status: 'ONLINE',
    lastChecked: Date.now(),
    failureCount: 0,
  },

  // Arbitrum Sepolia Pool
  {
    url: 'https://sepolia-rollup.arbitrum.io/rpc',
    network: 'arbitrum-sepolia',
    latencyMs: 44,
    status: 'ONLINE',
    lastChecked: Date.now(),
    failureCount: 0,
  },
  {
    url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
    network: 'arbitrum-sepolia',
    latencyMs: 65,
    status: 'ONLINE',
    lastChecked: Date.now(),
    failureCount: 0,
  },
  {
    url: 'https://public.stackup.sh/api/v1/node/arbitrum-sepolia',
    network: 'arbitrum-sepolia',
    latencyMs: 110,
    status: 'ONLINE',
    lastChecked: Date.now(),
    failureCount: 0,
  },
];

class RpcFailoverEngine {
  private pools: RpcEndpoint[] = [...DEFAULT_RPC_POOLS];

  public getActiveEndpoint(network: 'algorand-testnet' | 'arbitrum-sepolia'): RpcEndpoint {
    const candidates = this.pools
      .filter((e) => e.network === network && e.status !== 'OFFLINE')
      .sort((a, b) => a.latencyMs - b.latencyMs);

    return candidates.length > 0
      ? candidates[0]
      : this.pools.find((e) => e.network === network) || this.pools[0];
  }

  public getAllEndpoints(): RpcEndpoint[] {
    return [...this.pools];
  }

  public recordSuccess(url: string, latencyMs: number) {
    const target = this.pools.find((e) => e.url === url);
    if (target) {
      target.latencyMs = latencyMs;
      target.status = latencyMs < 300 ? 'ONLINE' : 'DEGRADED';
      target.failureCount = 0;
      target.lastChecked = Date.now();
    }
  }

  public recordFailure(url: string) {
    const target = this.pools.find((e) => e.url === url);
    if (target) {
      target.failureCount += 1;
      target.lastChecked = Date.now();
      if (target.failureCount >= 3) {
        target.status = 'OFFLINE';
      } else {
        target.status = 'DEGRADED';
      }
    }
  }
}

export const rpcEngine = new RpcFailoverEngine();
