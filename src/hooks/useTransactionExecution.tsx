import {useState} from "react";
import {useZKLoginContext} from "./useZKLoginContext";
import {useEphemeralKeyPair} from "./useEphemeralKeyPair";

export const useTransactionExecution = () => {
    const [executing, setExecuting] = useState(false);
    const [digest, setDigest] = useState<string | null>(null);
    const { client: suiClient } = useZKLoginContext();
    const { ephemeralKeyPair } = useEphemeralKeyPair();

    const executeTransaction = async (
        transaction: Uint8Array,
    ) => {
        setExecuting(true);
        try {
            if (!ephemeralKeyPair) throw new Error('No ephemeralKeyPair setup')
            const response = await suiClient.signAndExecuteTransaction({
                transaction,
                signer: ephemeralKeyPair,
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
