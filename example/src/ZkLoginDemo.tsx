import { useEffect } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useEphemeralKeyPair } from "../../lib/src/hooks/useEphemeralKeyPair";
import { useNonce } from "../../lib/src/hooks/useNonce";
import { useJwt } from "../../lib/src/hooks/useJwt";
import { useUserSalt } from "../../lib/src/hooks/useUserSalt";
import { useZkLoginAddress } from "../../lib/src/hooks/useZkLoginAddress";
import { useZkProof } from "../../lib/src/hooks/useZkProof";
import { useTransactionExecution } from "../../lib/src/hooks/useTransactionExecution";
import { SuiClient } from "@mysten/sui/client";
import { getExtendedEphemeralPublicKey } from "@mysten/sui/zklogin";

// Example configuration
const FULLNODE_URL = "https://fullnode.devnet.sui.io/";
const SUI_PROVER_ENDPOINT = "https://zkproof.example.com";
const CLIENT_ID = "your-google-client-id";
const REDIRECT_URI = "http://localhost:3000/callback";

const suiClient = new SuiClient({ url: FULLNODE_URL });

export const ZkLoginDemo = () => {
    const { ephemeralKeyPair, generateEphemeralKeyPair, clearEphemeralKeyPair } =
        useEphemeralKeyPair();
    const { nonce, randomness, generateRandomnessValue, generateNonceValue } =
        useNonce();
    const { decodedJwt, encodedJwt } = useJwt();
    const { userSalt, generateUserSalt, clearUserSalt } = useUserSalt();
    const { zkLoginAddress, generateZkLoginAddress } = useZkLoginAddress();
    const { zkProof, loading: zkProofLoading, generateZkProof } = useZkProof();
    const {
        executing,
        digest,
        executeTransaction,
    } = useTransactionExecution(suiClient);

    // Step 1: Generate Ephemeral Key Pair
    const handleGenerateEphemeralKey = () => {
        generateEphemeralKeyPair();
    };

    // Step 2: Generate Randomness and Nonce
    const handleGenerateRandomnessAndNonce = async () => {
        generateRandomnessValue();
        if (ephemeralKeyPair) {
            const maxEpoch = 10; // Example epoch
            generateNonceValue(ephemeralKeyPair.getSecretKey(), maxEpoch);
        }
    };

    // Step 3: Handle Google Authentication
    const handleGoogleAuth = () => {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: "id_token",
            scope: "openid",
            nonce: nonce || "",
        });
        const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        window.location.href = loginURL;
    };

    // Step 4: Generate User Salt
    const handleGenerateUserSalt = () => {
        generateUserSalt();
    };

    // Step 5: Generate ZkLogin Address
    const handleGenerateZkLoginAddress = () => {
        if (decodedJwt && encodedJwt && userSalt) {
            generateZkLoginAddress(encodedJwt, userSalt);
        }
    };

    // Step 6: Generate ZK Proof
    const handleGenerateZkProof = async () => {
        if (ephemeralKeyPair && randomness && zkLoginAddress) {
            const extendedPublicKey = getExtendedEphemeralPublicKey(
                ephemeralKeyPair.getPublicKey()
            );
            await generateZkProof(SUI_PROVER_ENDPOINT, {
                jwt: decodedJwt,
                extendedEphemeralPublicKey: extendedPublicKey,
                maxEpoch: 10,
                jwtRandomness: randomness,
                salt: userSalt,
            });
        }
    };

    // Step 7: Execute Transaction
    const handleExecuteTransaction = async () => {
        if (ephemeralKeyPair && zkProof) {
            // Example transaction block
            const transactionBlock = new Uint8Array([/* Transaction block data */]);
            const signature = '';
            await executeTransaction(transactionBlock, signature);
        }
    };

    return (
        <Stack spacing={4}>
            {/* Step 1: Generate Ephemeral Key Pair */}
            <Typography variant="h6">Step 1: Generate Ephemeral Key Pair</Typography>
            <Button onClick={handleGenerateEphemeralKey}>
                Generate Ephemeral Key Pair
            </Button>
            {ephemeralKeyPair && (
                <Typography>
                    PublicKey: {ephemeralKeyPair.getPublicKey().toBase64()}
                </Typography>
            )}

            {/* Step 2: Generate Randomness and Nonce */}
            <Typography variant="h6">Step 2: Generate Randomness and Nonce</Typography>
            <Button onClick={handleGenerateRandomnessAndNonce}>
                Generate Randomness and Nonce
            </Button>
            <Typography>Randomness: {randomness}</Typography>
            <Typography>Nonce: {nonce}</Typography>

            {/* Step 3: Google Authentication */}
            <Typography variant="h6">Step 3: Authenticate with Google</Typography>
            <Button onClick={handleGoogleAuth}>Sign In with Google</Button>
            {decodedJwt && <Typography>Decoded JWT: {JSON.stringify(decodedJwt)}</Typography>}

            {/* Step 4: Generate User Salt */}
            <Typography variant="h6">Step 4: Generate User Salt</Typography>
            <Button onClick={handleGenerateUserSalt}>Generate User Salt</Button>
            <Typography>User Salt: {userSalt}</Typography>

            {/* Step 5: Generate ZkLogin Address */}
            <Typography variant="h6">Step 5: Generate ZkLogin Address</Typography>
            <Button onClick={handleGenerateZkLoginAddress}>
                Generate ZkLogin Address
            </Button>
            <Typography>ZkLogin Address: {zkLoginAddress}</Typography>

            {/* Step 6: Generate ZK Proof */}
            <Typography variant="h6">Step 6: Generate ZK Proof</Typography>
            <Button onClick={handleGenerateZkProof} disabled={zkProofLoading}>
                {zkProofLoading ? <CircularProgress size={24} /> : "Generate ZK Proof"}
            </Button>
            {zkProof && <Typography>ZK Proof: {JSON.stringify(zkProof)}</Typography>}

            {/* Step 7: Execute Transaction */}
            <Typography variant="h6">Step 7: Execute Transaction</Typography>
            <Button onClick={handleExecuteTransaction} disabled={executing}>
                {executing ? <CircularProgress size={24} /> : "Execute Transaction"}
            </Button>
            {digest && <Typography>Transaction Digest: {digest}</Typography>}
        </Stack>
    );
};
