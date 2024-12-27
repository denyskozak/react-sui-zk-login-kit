export declare const useZkLoginAddress: () => {
    zkLoginAddress: string | null;
    generateZkLoginAddress: (jwt: string, userSalt: string) => void;
};
