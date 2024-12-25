import { useState } from "react";
import axios from "axios";

interface ZkProof {
    proofPoints: Record<string, string[]>
}
export const useZkProof = () => {
    const [zkProof, setZkProof] = useState<ZkProof | null>(null); // Replace `any` with the actual ZK Proof type
    const [loading, setLoading] = useState(false);

    const generateZkProof = async <T,>(endpoint: string, payload: T) => {
        setLoading(true);
        try {
            const response = await axios.post(endpoint, payload, {
                headers: { "Content-Type": "application/json" },
            });
            const zkProof = response.data as ZkProof;
            setZkProof(zkProof);
            return zkProof;

        } catch (error) {
            console.error("Error generating ZK Proof:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        zkProof,
        loading,
        generateZkProof,
    };
};
