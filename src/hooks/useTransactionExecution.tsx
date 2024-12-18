import {useState} from "react";
import {SuiClient} from "@mysten/sui/client";

export const useTransactionExecution = (suiClient: SuiClient) => {
    const [executing, setExecuting] = useState(false);
    const [digest, setDigest] = useState<string | null>(null);

    const executeTransaction = async (
        transactionBlock: Uint8Array,
        signature: string
    ) => {
        setExecuting(true);
        try {
            const response = await suiClient.executeTransactionBlock({
                transactionBlock,
                signature,
            });
            setDigest(response.digest);
        } catch (error) {
            console.error("Transaction execution error:", error);
        } finally {
            setExecuting(false);
        }
    };

    return {
        executing,
        digest,
        executeTransaction,
    };
};
