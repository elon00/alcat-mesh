import test from 'node:test';
import { generatePqcKeyPair as generateUiKey, signWithMlDsa65 } from '../src/utils/cryptoPqc.ts';

test('UI signing verifies the selected key and rejects missing or KEM keys', () => {
  const key = generateUiKey('ML-DSA-65');
  const result = signWithMlDsa65('hello', key);
  assert.equal(result.verified, true);
  assert.equal(result.signature.length, 6618);
  assert.equal(ml_dsa65.verify(Buffer.from(result.signature, 'hex'), new TextEncoder().encode('hello'), Buffer.from(key.publicKey, 'hex')), true);
  assert.throws(() => signWithMlDsa65('hello', { ...key, publicKey: '00' }));
  assert.throws(() => signWithMlDsa65('hello', generateUiKey('ML-KEM-768')));
  assert.ok(key.privateKeyMasked.endsWith('[REDACTED]'));
});
import assert from 'node:assert/strict';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha256.js';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import {
  generatePqcKeyPair,
  createPqcHybridSignature,
  verifyPqcSignature,
  encapsulateKEM,
  decapsulateKEM,
  hexToBytes
} from '../src/utils/pqcCrypto.js';

test('NIST TIER 1: RFC 5869 HKDF-SHA256 Known Answer Verification', () => {
  const ikm = new Uint8Array(22).fill(0x0b);
  const salt = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c]);
  const info = new Uint8Array([0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9]);
  const expectedOkm = '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865';
  const okm = Buffer.from(hkdf(sha256, ikm, salt, info, 42)).toString('hex');
  assert.equal(okm, expectedOkm, 'RFC 5869 OKM must match byte-for-byte');
});

test('NIST TIER 2: Canonical SHA-256 State Invariants', () => {
  const emptyHash = Buffer.from(sha256(new Uint8Array(0))).toString('hex');
  assert.equal(emptyHash, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const x402Root = Buffer.from(sha256(Buffer.from('SHOR x402 Root State'))).toString('hex');
  assert.equal(x402Root.length, 64);
});

test('NIST TIER 3: NIST FIPS 203 ML-KEM-768 Wire Invariants & Decap', () => {
  const keyPair = generatePqcKeyPair('ML-KEM-768');
  assert.equal(keyPair.keySizeBits, 1184 * 8);

  const { ciphertextHex, sharedSecretHex } = encapsulateKEM(keyPair.publicKey);
  assert.equal(ciphertextHex.length / 2, 1088, 'ML-KEM-768 ciphertext must be 1,088 bytes');
  assert.equal(sharedSecretHex.length / 2, 32, 'ML-KEM-768 shared secret must be 32 bytes');

  // Verify decapsulation
  const rawPair = ml_kem768.keygen(new Uint8Array(64).fill(0x55));
  const rawEnc = ml_kem768.encapsulate(rawPair.publicKey);
  const rawDec = ml_kem768.decapsulate(rawEnc.cipherText, rawPair.secretKey);
  assert.deepEqual(Buffer.from(rawEnc.sharedSecret), Buffer.from(rawDec));
});

test('NIST TIER 4: NIST FIPS 203 §7.3 Implicit Rejection', () => {
  const rawPair = ml_kem768.keygen(new Uint8Array(64).fill(0x33));
  const rawEnc = ml_kem768.encapsulate(rawPair.publicKey);
  const badCT = new Uint8Array(rawEnc.cipherText);
  badCT[10] ^= 0x77;
  const implicitKey = ml_kem768.decapsulate(badCT, rawPair.secretKey);
  assert.equal(implicitKey.length, 32);
  assert.notDeepEqual(Buffer.from(implicitKey), Buffer.from(rawEnc.sharedSecret));
});

test('NIST TIER 5: NIST FIPS 204 ML-DSA-65 Wire Invariants', () => {
  const keyPair = generatePqcKeyPair('ML-DSA-65');
  assert.equal(keyPair.keySizeBits, 1952 * 8);
  assert.equal(keyPair.publicKey.length / 2, 1952, 'ML-DSA-65 public key must be 1,952 bytes');
});

test('NIST TIER 6: NIST FIPS 204 ML-DSA-65 Signing & Verification', () => {
  const keyPair = generatePqcKeyPair('ML-DSA-65');
  const sig = createPqcHybridSignature('TX_ALGORAND_TEST_001', keyPair, 0.005, 'srv-quantum-ai');
  assert.ok(sig.hybridSignature.startsWith('ML-DSA-65.'));
  assert.equal(sig.mlDsaComponent.length / 2, 3309, 'ML-DSA-65 signature must be 3,309 bytes');

  const ver = verifyPqcSignature(sig.hybridSignature, 'TX_ALGORAND_TEST_001', keyPair.publicKey, 0.005, 'srv-quantum-ai');
  assert.equal(ver.valid, true);
  assert.equal(sig.ed25519Component, 'NOT_IMPLEMENTED');
  assert.equal(sig.quantumResistanceScore, 0);
});

test('NIST TIER 7: Wycheproof Negative & Adversarial Tests', () => {
  const keyPair = generatePqcKeyPair('ML-DSA-65');
  const sig = createPqcHybridSignature('TX_ALGORAND_TEST_002', keyPair, 0.005, 'srv-quantum-ai');

  // Corrupt signature
  const badSig = sig.hybridSignature.replace('ML-DSA-65.', 'CORRUPTED.');
  const verBad = verifyPqcSignature(badSig, 'TX_ALGORAND_TEST_002', keyPair.publicKey);
  assert.equal(verBad.valid, false);

  const digestOnly = sig.hybridSignature.split('.').slice(0, 2).join('.') + '.00';
  assert.equal(verifyPqcSignature(digestOnly, 'TX_ALGORAND_TEST_002', keyPair.publicKey).valid, false);

  const finalByte = parseInt(sig.hybridSignature.slice(-2), 16) ^ 1;
  const altered = sig.hybridSignature.slice(0, -2) + finalByte.toString(16).padStart(2, '0');
  assert.equal(verifyPqcSignature(altered, 'TX_ALGORAND_TEST_002', keyPair.publicKey, 0.005, 'srv-quantum-ai').valid, false);
});

test('Unavailable hybrid payment capability is not claimed', () => {
  const keyPair = generatePqcKeyPair('ML-DSA-65');
  const sig = createPqcHybridSignature('RQSQ6LBTNQEGROLRSKRCJPLVLUD6JOGAVY3QUTDDYGYBBHGAKDSA', keyPair, 0.005, 'srv-shor-orchestrator');
  assert.equal(sig.quantumResistanceScore, 0);
  assert.ok(sig.verificationProof.includes('ML_DSA_65_SIGNATURE'));
  assert.throws(() => createPqcHybridSignature('TX', generatePqcKeyPair('ML-KEM-768'), 1, 'service'));
});

test('seed normalization and strict hexadecimal parsing fail closed', () => {
  const dsa = generatePqcKeyPair('ML-DSA-65', new Uint8Array([1]));
  const kem = generatePqcKeyPair('ML-KEM-768', new Uint8Array([2]));
  assert.equal(dsa.publicKey.length / 2, 1952);
  assert.equal(kem.publicKey.length / 2, 1184);
  assert.throws(() => hexToBytes('not-hex'));
  assert.throws(() => hexToBytes('0'));
});
