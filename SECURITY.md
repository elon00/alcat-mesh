# Security Policy

## Supported Versions

| Version | Supported          | PQC Lattice Standard |
| ------- | ------------------ | -------------------- |
| 1.2.x   | :white_check_mark: | NIST FIPS 203 & 204  |
| 1.0.x   | :white_check_mark: | NIST ML-KEM-768      |
| < 1.0   | :x:                | Deprecated           |

## Quantum Threat & Cryptographic Disclosure

ALCAT is built around zero-trust post-quantum cryptographic primitives to guarantee resistance against Shor's algorithm and Grover's algorithm.

If you discover a vulnerability in the Post-Quantum Cryptographic key encapsulation (`ML-KEM-768`), digital signature verification (`ML-DSA-65`), or Algorand X402 payment delegation relays, please report it privately:

1. **Email**: security@alcat-mesh.org
2. **PGP / PQC Encrypted Report**: Encrypt your advisory with our NIST ML-KEM-768 public key listed in the Security Center.
3. We operate a coordinated disclosure process and offer bounties for verified critical vulnerabilities.
