import {Button, CircularProgress, Paper, Stack, styled, Typography} from "@mui/material";
import { useEphemeralKeyPair } from "../../src/hooks/useEphemeralKeyPair";
import { useNonce } from "../../src/hooks/useNonce";
import { useJwt } from "../../src/hooks/useJwt";
import { useUserSalt } from "../../src/hooks/useUserSalt";
import { useZkLoginAddress } from "../../src/hooks/useZkLoginAddress";
import { useZkProof } from "../../src/hooks/useZkProof";
import { useTransactionExecution } from "../../src/hooks/useTransactionExecution";
import { SuiClient } from "@mysten/sui/client";
import { getExtendedEphemeralPublicKey } from "@mysten/sui/zklogin";
import {useEffect} from "react";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(4),
    textAlign: 'center',
    width: '80%',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

// Example configuration
const FULLNODE_URL = "https://fullnode.devnet.sui.io/";
const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';
const CLIENT_ID = "648851101099-70tn7ksk6207uutiikv4d5783o0tmpmo.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/";

const suiClient = new SuiClient({ url: FULLNODE_URL });

function getTokenFromUrl() {
    // Get the hash part of the URL
    const hash = window.location.hash;

    // Remove the leading '#' and split the hash into key-value pairs
    const params = new URLSearchParams(hash.substring(1));

    // Extract the `id_token` parameter
    return params.get("id_token");
}

export const ZkLoginDemo = () => {
    const { ephemeralKeyPair, generateEphemeralKeyPair, loadEphemeralKeyPair, clearEphemeralKeyPair } =
        useEphemeralKeyPair();
    const { nonce, randomness, generateRandomnessValue, generateNonceValue } =
        useNonce();
    const { decodedJwt, encodedJwt, setJwtString } = useJwt();
    const { userSalt, generateUserSalt, clearUserSalt } = useUserSalt();
    const { zkLoginAddress, generateZkLoginAddress } = useZkLoginAddress();
    const { zkProof, loading: zkProofLoading, generateZkProof } = useZkProof();
    const {
        executing,
        digest,
        executeTransaction,
    } = useTransactionExecution(suiClient);

    useEffect(() => {
        loadEphemeralKeyPair();

        if (window.location.hash) {
            const token = getTokenFromUrl();
            setJwtString(token);
            window.location.hash = '';
        }
    }, []);

    // Step 1: Generate Ephemeral Key Pair
    const handleGenerateEphemeralKey = () => {
        generateEphemeralKeyPair();
    };

    // Step 2: Generate Randomness and Nonce
    const handleGenerateRandomness = () => {
        generateRandomnessValue();
    };

    // Step 3: Generate Randomness and Nonce
    const handleGenerateNonce = async () => {
        if (ephemeralKeyPair) {
            const { epoch } = await suiClient.getLatestSuiSystemState();

            const maxEpoch = Number(epoch) + 2; // live 2 epochs
            generateNonceValue(ephemeralKeyPair.getSecretKey(), maxEpoch);
        }
    };

    // Step 4: Handle Google Authentication
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

    // Step 5: Generate User Salt
    const handleGenerateUserSalt = () => {
        generateUserSalt();
    };

    // Step 6: Generate ZkLogin Address
    const handleGenerateZkLoginAddress = () => {
        if (decodedJwt && encodedJwt && userSalt) {
            generateZkLoginAddress(encodedJwt, userSalt);
        }
    };

    // Step 7: Generate ZK Proof
    const handleGenerateZkProof = async () => {
        if (ephemeralKeyPair && randomness && zkLoginAddress) {
            const extendedPublicKey = getExtendedEphemeralPublicKey(
                ephemeralKeyPair.getPublicKey()
            );
            const { epoch } = await suiClient.getLatestSuiSystemState();

            const maxEpoch = Number(epoch) + 2; // live 2 epochs
            await generateZkProof(SUI_PROVER_ENDPOINT, {
                jwt: encodedJwt,
                extendedEphemeralPublicKey: extendedPublicKey,
                maxEpoch,
                jwtRandomness: randomness,
                salt: userSalt,
                keyClaimName: "sub",
            });
        }
    };

    // Step 8: Execute Transaction
    const handleExecuteTransaction = async () => {
        if (ephemeralKeyPair && zkProof) {
            // Example transaction block
            const transactionBlock = new Uint8Array([/* Transaction block data */]);
            const signature = '';
            await executeTransaction(transactionBlock, signature);
        }
    };

    const steps = [
        (<Item>
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
        </Item>),
        (<Item>
            {/* Step 2: Generate Randomness */}
            <Typography variant="h6">Step 2: Generate Randomness</Typography>
            <Button onClick={handleGenerateRandomness}>
                Generate Randomness and Nonce
            </Button>
            <Typography>Randomness: {randomness}</Typography>
        </Item>),
        (<Item>
            {/* Step 3: Generate Nonce */}
            <Typography variant="h6">Step 3: Generate Nonce</Typography>
            <Button onClick={handleGenerateNonce}>
                Generate Randomness and Nonce
            </Button>
            <Typography>Nonce: {nonce}</Typography>
        </Item>),
        (<Item>
            {/* Step 4: Google Authentication */}
            <Typography variant="h6">Step 4: Authenticate with Google</Typography>
            <Button onClick={handleGoogleAuth}>Sign In with Google</Button>
            {decodedJwt && <Typography>Decoded JWT: {JSON.stringify(decodedJwt)}</Typography>}
        </Item>),
        (<Item>

            {/* Step 5: Generate User Salt */}
            <Typography variant="h6">Step 5: Generate User Salt</Typography>
            <Button onClick={handleGenerateUserSalt}>Generate User Salt</Button>
            <Typography>User Salt: {userSalt}</Typography>
        </Item>),
        (<Item>
            {/* Step 6: Generate ZkLogin Address */}
            <Typography variant="h6">Step 6: Generate ZkLogin Address</Typography>
            <Button onClick={handleGenerateZkLoginAddress}>
                Generate ZkLogin Address
            </Button>
            <Typography>ZkLogin Address: {zkLoginAddress}</Typography>
        </Item>),
        (<Item>
            {/* Step 7: Generate ZK Proof */}
            <Typography variant="h6">Step 7: Generate ZK Proof</Typography>
            <Button onClick={handleGenerateZkProof} disabled={zkProofLoading}>
                {zkProofLoading ? <CircularProgress size={24} /> : "Generate ZK Proof"}
            </Button>
            {zkProof && <Typography>ZK Proof: {JSON.stringify(zkProof)}</Typography>}
        </Item>),
        (<Item>
            {/* Step 8: Execute Transaction */}
            <Typography variant="h6">Step 8: Execute Transaction</Typography>
            <Button onClick={handleExecuteTransaction} disabled={executing}>
                {executing ? <CircularProgress size={24} /> : "Execute Transaction"}
            </Button>
            {digest && <Typography>Transaction Digest: {digest}</Typography>}
        </Item>)
    ]
    return (
        <Stack spacing={4}>
            {steps[0]}
            {ephemeralKeyPair && steps[1]}
            {randomness && steps[2]}
            {nonce && steps[3]}
            {encodedJwt && steps[4]}
            {userSalt && steps[5]}
            {zkLoginAddress && steps[6]}
            {zkProof && steps[7]}
        </Stack>
    );
};
