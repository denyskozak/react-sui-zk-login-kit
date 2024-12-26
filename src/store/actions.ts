import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {JwtPayload} from "jwt-decode";
import {ZkProof} from "../types/zf-proof";

export interface ZKLoginState {
    ephemeralKeySecret: string | null;
    randomness: string | null;
    nonce: string | null;
    jwtString: string | null;
    decodedJwt: JwtPayload | null;
    userSalt: string | null;
    zkLoginAddress: string | null;
    zkProof: ZkProof | null;
    transactionDigest: string | null;
}

export const initialZKLoginState: ZKLoginState = {
    ephemeralKeySecret: null,
    randomness: null,
    nonce: null,
    jwtString: null,
    decodedJwt: null,
    userSalt: null,
    zkLoginAddress: null,
    zkProof: null,
    transactionDigest: null,
};

export type ZKLoginAction =
    { type: "SET_EPHEMERAL_KEY_PAIR"; payload: string }
    | { type: "SET_RANDOMNESS"; payload: string }
    | { type: "SET_NONCE"; payload: string }
    | { type: "SET_JWT"; payload: { jwtString:  string | null; decodedJwt: JwtPayload | null } }
    | { type: "SET_USER_SALT"; payload: string }
    | { type: "DELETE_USER_SALT"; }
    | { type: "SET_ZK_LOGIN_ADDRESS"; payload: string }
    | { type: "SET_ZK_PROOF"; payload: ZkProof }
    | { type: "SET_TRANSACTION_DIGEST"; payload: string };
