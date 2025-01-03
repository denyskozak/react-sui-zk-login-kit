import {useEffect} from "react";
import {Box, Button, CircularProgress, Paper, styled, Typography} from "@mui/material";
import {generateRandomness, getExtendedEphemeralPublicKey } from "@mysten/sui/zklogin";
import {
    useEphemeralKeyPair,
    useNonce,
    useJwt,
    useUserSalt,
    useZkLoginAddress,
    useZkProof,
    useTransactionExecution,
    useOAuth,
    getTokenFromUrl,
} from "../../src";
import {useZKLoginContext} from "../../src/hooks/useZKLoginContext.ts";

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
const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';
const CLIENT_ID = "648851101099-70tn7ksk6207uutiikv4d5783o0tmpmo.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/";

export const ZKHooks = () => {
    const {client: suiClient} = useZKLoginContext();

    const { ephemeralKeyPair, generateEphemeralKeyPair } =
        useEphemeralKeyPair();
    const { nonce, randomness, generateRandomnessValue, generateNonceValue } =
        useNonce();
    const { decodedJwt, encodedJwt, setJwtString } = useJwt();
    const { userSalt, setUserSalt } = useUserSalt();
    const { zkLoginAddress, generateZkLoginAddress } = useZkLoginAddress();
    const { zkProof, loading: zkProofLoading, generateZkProof } = useZkProof();
    const {handleRedirectTo: handleRedirectToGoogle} = useOAuth('https://accounts.google.com/o/oauth2/v2/auth');
    const {
        executing,
        digest,
    } = useTransactionExecution();

    useEffect(() => {
        if (window.location.hash) {
            const token = getTokenFromUrl();
            if (token) {
                setJwtString(token);
                window.location.hash = '';
            }

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
        if (ephemeralKeyPair && randomness) {
            const { epoch } = await suiClient.getLatestSuiSystemState();

            const maxEpoch = Number(epoch) + 2; // live 2 epochs
            generateNonceValue(ephemeralKeyPair.getSecretKey(), randomness, maxEpoch);
        }
    };

    // Step 4: Handle Google Authentication
    const handleGoogleAuth = () => {
        handleRedirectToGoogle(CLIENT_ID, REDIRECT_URI, nonce || "");
    };

    // Step 5: Generate User Salt
    const handleGenerateUserSalt = () => {
        setUserSalt(generateRandomness()); // need to be provider from your server. associated with jwt
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
            {decodedJwt && <Typography>Decoded JWT: <code> {JSON.stringify(decodedJwt)}</code></Typography>}
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
        <Box style={{ width: '100%', gap: 4, display: 'flex', flexDirection: 'column' }}>
            {steps[0]}
            {ephemeralKeyPair && steps[1]}
            {randomness && steps[2]}
            {nonce && steps[3]}
            {encodedJwt && steps[4]}
            {userSalt && encodedJwt && steps[5]}
            {zkLoginAddress && steps[6]}
            {zkProof && steps[7]}
        </Box>
    );
};
