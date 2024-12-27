import { ZKLoginState, ZKLoginAction } from "./actions";
export declare const zkLoginReducer: (state: ZKLoginState, action: ZKLoginAction) => ZKLoginState;
export declare const borrowInitState: () => {
    userSalt: string | null;
    ephemeralKeySecret: string | null;
    randomness: string | null;
    nonce: string | null;
    jwtString: string | null;
    decodedJwt: import("jwt-decode").JwtPayload | null;
    zkLoginAddress: string | null;
    zkProof: import("../types/zf-proof").ZkProof | null;
    transactionDigest: string | null;
};
