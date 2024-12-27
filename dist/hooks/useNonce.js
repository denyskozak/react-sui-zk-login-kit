import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { useZKLoginContext } from "./useZKLoginContext";
export const useNonce = () => {
    const { state, dispatch } = useZKLoginContext();
    const generateRandomnessValue = () => {
        const randomValue = generateRandomness();
        dispatch({ type: "SET_RANDOMNESS", payload: randomValue });
        return randomValue;
    };
    const generateNonceValue = (secretKey, randomnessValue, maxEpoch) => {
        const nonceValue = generateNonce(Ed25519Keypair.fromSecretKey(secretKey).getPublicKey(), maxEpoch, randomnessValue);
        dispatch({ type: "SET_NONCE", payload: nonceValue });
        return nonceValue;
    };
    return {
        randomness: state.randomness,
        nonce: state.nonce,
        generateRandomnessValue,
        generateNonceValue,
    };
};
