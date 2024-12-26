import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { useZKLoginContext } from "./useZKLoginContext";

export const useEphemeralKeyPair = () => {
    const { dispatch, state } = useZKLoginContext();

    const generateEphemeralKeyPair = () => {
        const keyPair = Ed25519Keypair.generate();
        dispatch({ type: "SET_EPHEMERAL_KEY_PAIR", payload: keyPair.getSecretKey() });
        return keyPair;
    };

    return {
        ephemeralKeyPair: state.ephemeralKeySecret ? Ed25519Keypair.fromSecretKey(state.ephemeralKeySecret) : null,
        generateEphemeralKeyPair,
    };
};
