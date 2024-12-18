![welcome](./welcome.png)

A 🛠️ React hooks library for implementing `zkLogin` 🔐 authentication and transaction flows on the **Sui blockchain**. This library provides modular, reusable hooks to handle ephemeral key management, nonce generation, JWT parsing, ZK proof generation, and more.

### Zk Login Intro [youtube video](https://www.youtube.com/watch?v=60dwcV8Xogg&pp=ygUHemtMb2dpbg%3D%3D)
### What is zkLogin? [youtube video](https://www.youtube.com/watch?v=CZSH9B7j-AY)

---

## 🚀 **Features**

✅ **Ephemeral Key Management**: Generate, load, and clear ephemeral key pairs.  
✅ **Nonce and Randomness Generation**: Create cryptographic nonces for authentication.  
✅ **JWT Handling**: Decode and manage JWT payloads.  
✅ **User Salt Management**: Generate and store user salts securely.  
✅ **ZkLogin Address**: Derive zkLogin addresses using JWT and salts.  
✅ **ZK Proofs**: Generate ZK proofs for secure authentication.  
✅ **Transaction Execution**: Execute Sui transactions with ZK proofs.

---

## 📦 **Installation**

> 🚧 **Work In Progress:** Package is under development and will be available soon!

For now, clone this repository and use it directly in your project.

---

## ⚡ **Hooks Overview**
> useEphemeralKeyPair - Manages ephemeral key pair lifecycle (generate, access, and clear keys).

> useNonce - Handles nonce and randomness generation for authentication.

> useJwt - Parses and manages JWT payloads (decode and extract information).

> useUserSalt - Manages user salt storage (generate, access, and clear salts).

> useZkLoginAddress - Generates zkLogin addresses from JWT and salt.

> useZkProof - Generates ZK proofs for secure authentication.

> useTransactionExecution - Executes Sui transactions with ZK proofs.