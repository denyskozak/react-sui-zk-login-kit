import {useJwt} from "./useJwt";
import {useZkLoginAddress} from "./useZkLoginAddress";
import {useLogout} from "./useLogout";
import type { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {JwtPayload} from "jwt-decode";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import {useEphemeralKeyPair} from "./useEphemeralKeyPair";
import {useTransactionExecution} from "./useTransactionExecution";
import {useZKLoginContext} from "./useZKLoginContext";
import {useUserSalt} from "./useUserSalt";

interface UseZKLoginProps {
    onTransactionFailed?: () => void,
}

interface UseZKLogin {
    encodedJwt: string | null,
    logout: () => void,
    address: string | null,
    keypair: Ed25519Keypair | null,
    executeTransaction: (transaction: Transaction) => Promise<string | void>,
    client: SuiClient,
    decodedJwt: JwtPayload | null,
    userSalt: string | null,
    setUserSalt: (value: string) => void
}

// Main hook for most cases, others for specific usage
export const useZKLogin = (props?: UseZKLoginProps): UseZKLogin => {
    const {ephemeralKeyPair} = useEphemeralKeyPair();
    const {encodedJwt, decodedJwt} = useJwt();
    const {zkLoginAddress} = useZkLoginAddress();
    const {logout} = useLogout();
    const {executeTransaction} = useTransactionExecution(props?.onTransactionFailed);
    const {client} = useZKLoginContext();
    const {userSalt, setUserSalt} = useUserSalt();

    return {
        address: zkLoginAddress,
        keypair: ephemeralKeyPair,
        client,
        executeTransaction,
        encodedJwt,
        decodedJwt,
        logout,
        userSalt,
        setUserSalt
    }
}