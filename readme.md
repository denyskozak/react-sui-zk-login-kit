[![NPM Version](https://img.shields.io/npm/v/react-sui-zk-login-kit)](https://www.npmjs.com/package/react-sui-zk-login-kit)

[![welcome](https://raw.githubusercontent.com/denyskozak/react-sui-zk-login-kit/refs/heads/main/welcome.png)](https://www.npmjs.com/package/react-sui-zk-login-kit)

A 🛠️ React hooks library for implementing `zkLogin` 🔐 authentication and transaction flows on the **Sui blockchain**. This library provides modular, reusable hooks to handle ephemeral key management, nonce generation, JWT parsing, ZK proof generation, and more.

### Zk Login Intro [youtube video](https://www.youtube.com/watch?v=60dwcV8Xogg&pp=ygUHemtMb2dpbg%3D%3D)
### What is zkLogin? [youtube video](https://www.youtube.com/watch?v=CZSH9B7j-AY)

---

## ⚡ **Hooks Overview**
> useEphemeralKeyPair - Manages ephemeral key pair lifecycle (generate, access, and clear keys).

> useNonce - Handles nonce and randomness generation for authentication.

> useJwt - Parses and manages JWT payloads (decode and extract information).

> useUserSalt - Manages user salt storage (generate, access, and clear salts).

> useZkLoginAddress - Generates zkLogin addresses from JWT and salt.

> useZkProof - Generates ZK proofs for secure authentication.

> useTransactionExecution - Executes Sui transactions with ZK proofs.

### Todo

- [ ] make zero deps
- [ ] add tests
- [ ] record video instruction

### In Progress

- [ ] add test environment

### Done ✓

- [x] add Google OAuth 
- [x] add Twitch OAuth
- [x] publish npm package
- [x] add hooks
- [x] add component