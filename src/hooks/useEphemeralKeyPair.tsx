import { useState } from "react";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/bcs";

export const useEphemeralKeyPair = () => {
    const [ephemeralKeyPair, setEphemeralKeyPair] = useState<Ed25519Keypair | null>(null);

    const generateEphemeralKeyPair = () => {
        const keyPair = Ed25519Keypair.generate();
        sessionStorage.setItem("ephemeralKey", keyPair.getSecretKey()); // Ed25519
        setEphemeralKeyPair(keyPair);
    };

    const loadEphemeralKeyPair = () => {
        const privateKey = sessionStorage.getItem("ephemeralKey");
        if (privateKey) {
            setEphemeralKeyPair(Ed25519Keypair.fromSecretKey(fromBase64(privateKey)));
        }
    };

    const clearEphemeralKeyPair = () => {
        sessionStorage.removeItem("ephemeralKey");
        setEphemeralKeyPair(null);
    };

    return {
        ephemeralKeyPair,
        generateEphemeralKeyPair,
        loadEphemeralKeyPair,
        clearEphemeralKeyPair,
    };
};
