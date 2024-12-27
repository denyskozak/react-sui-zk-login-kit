import { useState } from "react";
import { useZKLoginContext } from "./useZKLoginContext";
export const useTransactionExecution = () => {
    const [executing, setExecuting] = useState(false);
    const [digest, setDigest] = useState(null);
    const { client: suiClient } = useZKLoginContext();
    const executeTransaction = async (transactionBlock, signature) => {
        setExecuting(true);
        try {
            const response = await suiClient.executeTransactionBlock({
                transactionBlock,
                signature,
            });
            setDigest(response.digest);
        }
        catch (error) {
            console.error("Transaction execution error:", error);
        }
        finally {
            setExecuting(false);
        }
    };
    return {
        executing,
        digest,
        executeTransaction,
    };
};
