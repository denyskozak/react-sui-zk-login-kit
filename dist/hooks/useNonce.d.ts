export declare const useNonce: () => {
    randomness: string | null;
    nonce: string | null;
    generateRandomnessValue: () => string;
    generateNonceValue: (secretKey: string, randomnessValue: string, maxEpoch: number) => string;
};
