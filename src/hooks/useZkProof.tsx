import { useState } from "react";
import axios from "axios";

export const useZkProof = () => {
    const [zkProof, setZkProof] = useState<any | null>(null); // Replace `any` with the actual ZK Proof type
    const [loading, setLoading] = useState(false);

    const generateZkProof = async <T,>(endpoint: string, payload: T) => {
        setLoading(true);
        try {
            console.log('payload ', payload)
            const response = await axios.post(endpoint, payload, {
                headers: { "Content-Type": "application/json" },
            });
            setZkProof(response.data);
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
