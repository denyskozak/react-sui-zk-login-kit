import { useState } from "react";
import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export const useNonce = () => {
    const [nonce, setNonce] = useState<string | null>(sessionStorage.getItem("nonce"));
    const [randomness, setRandomness] = useState<string | null>(sessionStorage.getItem("randomness"));

    const generateRandomnessValue = () => {
        const randomValue = generateRandomness();
        sessionStorage.setItem("randomness", randomValue);
        setRandomness(randomValue);
    };

    const generateNonceValue = (secretKey: string, maxEpoch: number) => {
        if (!randomness) return;
        const nonceValue = generateNonce(Ed25519Keypair.fromSecretKey(secretKey).getPublicKey(), maxEpoch, randomness);
        sessionStorage.setItem("nonce", nonceValue);
        setNonce(nonceValue);
    };

    return {
        nonce,
        randomness,
        generateRandomnessValue,
        generateNonceValue,
    };
};
