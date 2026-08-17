# Contributing to ALCAT

Thank you for your interest in contributing to ALCAT (Autonomous Lattice Cellular Automata & Transactions)!

## Development Workflow

1. **Fork and Clone the Repository**
2. **Install Node.js (v20+ or v22+) & Dependencies**:
   ```bash
   npm install
   ```
3. **Run Typecheck and Tests**:
   ```bash
   npm run lint
   npm test
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. **Verify Production Build**:
   ```bash
   npm run build
   ```

## Code Quality Standards

- **Zero-Error Policy**: `npm run lint` and `npm test` must always pass with 100% green status.
- **PQC Compliance**: Any cryptographic additions must adhere strictly to NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) specifications.
- **M2M Protocol Rules**: All payment endpoints must implement standard HTTP 402 challenge-response headers with zero-gas sponsorship support.
