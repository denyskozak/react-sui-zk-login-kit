import {useState} from "react";
import {useZKLoginContext} from "./useZKLoginContext";
import {useEphemeralKeyPair} from "./useEphemeralKeyPair";
import { Transaction } from "@mysten/sui/transactions";
import {useJwt} from "./useJwt";
import { genAddressSeed, getZkLoginSignature } from "@mysten/sui/zklogin";
import {useUserSalt} from "./useUserSalt";
import {useZkProof} from "./useZkProof";

export const useTransactionExecution = () => {
    const [executing, setExecuting] = useState(false);
    const [digest, setDigest] = useState<string | null>(null);
    const { client } = useZKLoginContext();

    const { decodedJwt } = useJwt();
    const { userSalt } = useUserSalt();
    const { zkProof } = useZkProof();
    const { ephemeralKeyPair } = useEphemeralKeyPair();

    const executeTransaction = async (
        transaction: Transaction,
    ): Promise<string | void> => {

        setExecuting(true);
        try {
            if (!ephemeralKeyPair) throw new Error('No ephemeralKeyPair setup');
            if (!decodedJwt) throw new Error('No decodedJwt setup');
            if (!zkProof) throw new Error('No zkProof setup');

            const { bytes, signature: userSignature } = await transaction.sign({
                client,
                signer: ephemeralKeyPair, // This must be the same ephemeral key pair used in the ZKP request
            });

            const addressSeed: string = genAddressSeed(
                BigInt(userSalt!),
                'sub',
                String(decodedJwt.sub),
                String(decodedJwt.aud),
            ).toString();

            const { epoch } = await client.getLatestSuiSystemState();

            const maxEpoch = Number(epoch) + 2; // live 2 epochs

            const zkLoginSignature = getZkLoginSignature({
                inputs: {
                    ...zkProof,
                    addressSeed,
                },
                maxEpoch,
                userSignature,
            });

            const result = await client.executeTransactionBlock({
                transactionBlock: bytes,
                signature: zkLoginSignature,
            });
            await client.waitForTransaction({ digest: result.digest });

            setDigest(result.digest);

            return result.digest;
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
