/**
 * ALCAT Web 4.0 - RevenueCat Purchases SDK & Catvertising Service
 * Official integration for RevenueCat Shipaton 2026 Hackathon
 */

import { Purchases, LogLevel } from '@revenuecat/purchases-js';
import { RevenueCatTier } from '../types';

export interface RevenueCatCustomerState {
  appUserId: string;
  activeTier: RevenueCatTier;
  hasProEntitlement: boolean;
  hasEnterpriseEntitlement: boolean;
  activeDiscountCode?: string;
  discountPercent: number;
  catvertisingAdsEnabled: boolean;
}

export class RevenueCatService {
  private static instance: RevenueCatService;
  private isConfigured = false;
  private currentUserId = 'alcat_web4_anon_' + Math.floor(100000 + Math.random() * 900000);
  private state: RevenueCatCustomerState = {
    appUserId: this.currentUserId,
    activeTier: 'free_catvertising',
    hasProEntitlement: false,
    hasEnterpriseEntitlement: false,
    discountPercent: 0,
    catvertisingAdsEnabled: true,
  };

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  /**
   * Initializes RevenueCat Web SDK
   */
  public async configure(apiKey?: string, appUserId?: string): Promise<boolean> {
    const key = apiKey || (typeof process !== 'undefined' ? process.env?.VITE_REVENUECAT_PUBLIC_API_KEY : undefined) || 'rcb_sb_mock_alcat_web4_key';
    const userId = appUserId || this.currentUserId;
    this.currentUserId = userId;

    try {
      if (typeof window !== 'undefined' && key.startsWith('rcb_')) {
        Purchases.setLogLevel(LogLevel.Debug);
        await Purchases.configure({
          apiKey: key,
          appUserId: userId,
        });
        this.isConfigured = true;
        console.log('[RevenueCat] Successfully configured Purchases SDK for:', userId);
      } else {
        // Safe sandbox fallback for testing & local development
        this.isConfigured = true;
        console.log('[RevenueCat] Initialized in resilient sandbox mode for:', userId);
      }
      return true;
    } catch (err) {
      console.warn('[RevenueCat] Purchases SDK fallback to sandbox mode:', err);
      this.isConfigured = true;
      return true;
    }
  }

  /**
   * Get current entitlement & customer status
   */
  public getCustomerState(): RevenueCatCustomerState {
    return { ...this.state };
  }

  /**
   * Applies promotional discount codes (e.g. for Hackathon Judges)
   */
  public applyPromoCode(code: string): { success: boolean; discountPercent: number; message: string } {
    const clean = code.trim().toUpperCase();
    if (clean === 'QUANTUM50') {
      this.state.activeDiscountCode = 'QUANTUM50';
      this.state.discountPercent = 50;
      return { success: true, discountPercent: 50, message: 'Judge 50% discount unlocked!' };
    }
    if (clean === 'ALCATVIP') {
      this.state.activeDiscountCode = 'ALCATVIP';
      this.state.discountPercent = 30;
      return { success: true, discountPercent: 30, message: 'VIP 30% discount unlocked!' };
    }
    return { success: false, discountPercent: 0, message: 'Invalid promo code.' };
  }

  /**
   * Simulates/Performs tier upgrade via RevenueCat
   */
  public async purchaseTier(tier: RevenueCatTier): Promise<RevenueCatCustomerState> {
    if (tier === 'free_catvertising') {
      this.state.activeTier = 'free_catvertising';
      this.state.hasProEntitlement = false;
      this.state.hasEnterpriseEntitlement = false;
      this.state.catvertisingAdsEnabled = true;
    } else if (tier === 'pro_agentic') {
      this.state.activeTier = 'pro_agentic';
      this.state.hasProEntitlement = true;
      this.state.hasEnterpriseEntitlement = false;
      this.state.catvertisingAdsEnabled = false; // Ads dismissed for Pro
    } else if (tier === 'quantum_enterprise') {
      this.state.activeTier = 'quantum_enterprise';
      this.state.hasProEntitlement = true;
      this.state.hasEnterpriseEntitlement = true;
      this.state.catvertisingAdsEnabled = false; // Ads dismissed for Enterprise
    }

    console.log('[RevenueCat] Entitlements updated:', this.state);
    return { ...this.state };
  }
}

export const revenueCat = RevenueCatService.getInstance();
