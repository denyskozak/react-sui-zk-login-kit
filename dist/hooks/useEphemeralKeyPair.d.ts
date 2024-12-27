import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
export declare const useEphemeralKeyPair: () => {
    ephemeralKeyPair: Ed25519Keypair | null;
    generateEphemeralKeyPair: () => Ed25519Keypair;
};
