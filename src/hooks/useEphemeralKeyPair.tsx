import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";
import {useZKLoginContext} from "./useZKLoginContext";
import {useCallback, useEffect, useState} from "react";

export const useEphemeralKeyPair = () => {
    const {dispatch, state} = useZKLoginContext();
    const [ephemeralKeyPair, setEphemeralKeyPair] = useState<Ed25519Keypair | null>(null);

    const generateEphemeralKeyPair = useCallback(() => {
        const keyPair = Ed25519Keypair.generate();
        dispatch({type: "SET_EPHEMERAL_KEY_PAIR", payload: keyPair.getSecretKey()});
        return keyPair;
    }, []);

    useEffect(() => {
        if (state.ephemeralKeySecret) {
            setEphemeralKeyPair(Ed25519Keypair.fromSecretKey(state.ephemeralKeySecret));
        }
    }, [state.ephemeralKeySecret]);

    return {
        ephemeralKeyPair,
        ephemeralKeySecret: state.ephemeralKeySecret,
        generateEphemeralKeyPair,
    };
};
