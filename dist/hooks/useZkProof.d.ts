import { ZkProof } from "../types/zf-proof";
export declare const useZkProof: () => {
    zkProof: ZkProof | null;
    loading: boolean;
    generateZkProof: <T>(endpoint: string, payload: T) => Promise<ZkProof | undefined>;
};
