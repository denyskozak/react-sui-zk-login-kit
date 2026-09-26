import {useCallback, useState} from "react";
import {useZKLoginContext} from "./useZKLoginContext";
import {useEphemeralKeyPair} from "./useEphemeralKeyPair";
import {Transaction} from "@mysten/sui/transactions";
import {useJwt} from "./useJwt";
import {genAddressSeed, getZkLoginSignature} from "@mysten/sui/zklogin";
import {useUserSalt} from "./useUserSalt";
import {useZkProof} from "./useZkProof";

export const useTransactionExecution = (onTransactionFailed?: () => void) => {
    const [executing, setExecuting] = useState(false);
    const [digest, setDigest] = useState<string | null>(null);
    const {client} = useZKLoginContext();

    const {decodedJwt} = useJwt();
    const {userSalt} = useUserSalt();
    const {zkProof} = useZkProof();
    const {ephemeralKeyPair} = useEphemeralKeyPair();

    const executeTransaction = useCallback(async (
        transaction: Transaction,
    ): Promise<string | void> => {

        setExecuting(true);
        try {
            if (!ephemeralKeyPair) throw new Error('No ephemeralKeyPair setup');
            if (!decodedJwt) throw new Error('No decodedJwt setup');
            if (!zkProof) throw new Error('No zkProof setup');

            const bytes = await transaction.build({client});
            const {signature: userSignature} = await ephemeralKeyPair.signTransaction(bytes);

            const addressSeed: string = genAddressSeed(
                BigInt(userSalt!),
                'sub',
                String(decodedJwt.sub),
                String(decodedJwt.aud),
            ).toString();

            const {systemState: {epoch}} = await client.core.getCurrentSystemState();

            const maxEpoch = Number(epoch) + 2; // live 2 epochs

            const zkLoginSignature = getZkLoginSignature({
                inputs: {
                    ...zkProof,
                    addressSeed,
                },
                maxEpoch,
                userSignature,
            });

            const result = await client.core.executeTransaction({
                transaction: bytes,
                signatures: [zkLoginSignature],
            });

            if (result.$kind === 'FailedTransaction') {
                throw new Error('Transaction execution failed');
            }

            await client.core.waitForTransaction({result});

            const digest = result.Transaction.digest;

            setDigest(digest);

            return digest;
        } catch (error) {
            console.error("Transaction execution error:", error);
            onTransactionFailed?.();
        } finally {
            setExecuting(false);
        }
    }, [decodedJwt, userSalt, zkProof, ephemeralKeyPair]);

    return {
        executing,
        digest,
        executeTransaction,
    };
};
