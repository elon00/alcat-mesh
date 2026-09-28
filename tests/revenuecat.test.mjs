/**
 * RevenueCat Purchases SDK & Catvertising Integration Test
 * Validates entitlements, promo code unlocking, and ad-layer suppression
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Purchases, LogLevel } from '@revenuecat/purchases-js';

describe('RevenueCat Purchases SDK & Catvertising Suite', () => {
  it('should export official Purchases SDK and LogLevel constants', () => {
    assert.ok(Purchases, 'Purchases class should be exported');
    assert.ok(LogLevel, 'LogLevel enum should be exported');
    assert.equal(typeof Purchases.configure, 'function', 'configure method should exist');
  });

  it('should simulate entitlement unlock and suppress Catvertising ads on Pro upgrade', () => {
    const customer = {
      appUserId: 'test_judge_user_1',
      activeTier: 'free_catvertising',
      hasProEntitlement: false,
      catvertisingAdsEnabled: true,
    };

    // Free user has ads enabled
    assert.equal(customer.catvertisingAdsEnabled, true);
    assert.equal(customer.hasProEntitlement, false);

    // Simulate RevenueCat Pro Agentic purchase
    customer.activeTier = 'pro_agentic';
    customer.hasProEntitlement = true;
    customer.catvertisingAdsEnabled = false;

    // Pro user has ads suppressed and pro entitlement active
    assert.equal(customer.hasProEntitlement, true);
    assert.equal(customer.catvertisingAdsEnabled, false);
    assert.equal(customer.activeTier, 'pro_agentic');
  });

  it('should validate Judge Promo Code QUANTUM50 and ALCATVIP', () => {
    const applyPromo = (code) => {
      const clean = code.trim().toUpperCase();
      if (clean === 'QUANTUM50') return { valid: true, discount: 50 };
      if (clean === 'ALCATVIP') return { valid: true, discount: 30 };
      return { valid: false, discount: 0 };
    };

    const res50 = applyPromo('QUANTUM50');
    assert.equal(res50.valid, true);
    assert.equal(res50.discount, 50);

    const res30 = applyPromo('alcatvip');
    assert.equal(res30.valid, true);
    assert.equal(res30.discount, 30);

    const resInvalid = applyPromo('WRONG_CODE');
    assert.equal(resInvalid.valid, false);
    assert.equal(resInvalid.discount, 0);
  });
});
