import { useState } from "react";
import axios from "axios";
import { useZKLoginContext } from "./useZKLoginContext";
export const useZkProof = () => {
    const { state, dispatch } = useZKLoginContext();
    const [loading, setLoading] = useState(false);
    const generateZkProof = async (endpoint, payload) => {
        setLoading(true);
        try {
            const response = await axios.post(endpoint, payload, {
                headers: { "Content-Type": "application/json" },
            });
            const zkProof = response.data;
            dispatch({ type: "SET_ZK_PROOF", payload: zkProof });
            return zkProof;
        }
        catch (error) {
            console.error("Error generating ZK Proof:", error);
        }
        finally {
            setLoading(false);
        }
    };
    return {
        zkProof: state.zkProof,
        loading,
        generateZkProof,
    };
};
