import React, {FC, useEffect} from "react";
import {Box, Button, CircularProgress, Paper, Stack, styled, Typography} from "@mui/material";
import {SuiClient} from "@mysten/sui/client";
import {getExtendedEphemeralPublicKey} from "@mysten/sui/zklogin";
import {
    useEphemeralKeyPair,
    useNonce,
    useJwt,
    useUserSalt,
    useZkLoginAddress,
    useZkProof,
    useTransactionExecution,
    useGoogleAuth
} from "../hooks";

const Item = styled(Paper)(({theme}) => ({
    padding: theme.spacing(4),
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
}));

interface GoogleAuthParam {
    redirectURI: string;
    clientId: string;
}

interface SuiZKLoginProps {
    provider: 'google',
    googleParams: GoogleAuthParam,
    proverProvider: string,
    suiClient: SuiClient
}

export const SuiZKLogin = (props: SuiZKLoginProps) => {
    const { googleParams, proverProvider, suiClient } = props;

    const {ephemeralKeyPair, generateEphemeralKeyPair, loadEphemeralKeyPair} = useEphemeralKeyPair();
    const {nonce, randomness, generateRandomnessValue, generateNonceValue} = useNonce();
    const {decodedJwt, encodedJwt, setJwtString} = useJwt();
    const {userSalt, generateUserSalt} = useUserSalt();
    const {zkLoginAddress, generateZkLoginAddress} = useZkLoginAddress();
    const {zkProof, loading: zkProofLoading, generateZkProof} = useZkProof();
    const {handleRedirectToGoogle} = useGoogleAuth();
    const {executing, digest, executeTransaction} = useTransactionExecution(suiClient);

    useEffect(() => {
        loadEphemeralKeyPair();
        const token = new URLSearchParams(window.location.hash.substring(1)).get("id_token");
        if (token) {
            setJwtString(token);
            window.location.hash = "";
        }
    }, [loadEphemeralKeyPair, setJwtString]);

    const steps = [
        {
            title: "Generate Ephemeral Key Pair",
            action: (
                <Button onClick={generateEphemeralKeyPair} variant="contained">
                    Generate Key Pair
                </Button>
            ),
            content: ephemeralKeyPair?.getPublicKey()?.toBase64(),
        },
        {
            title: "Generate Randomness",
            action: (
                <Button onClick={generateRandomnessValue} variant="contained">
                    Generate Randomness
                </Button>
            ),
            content: randomness,
        },
        {
            title: "Generate Nonce",
            action: (
                <Button
                    onClick={async () => {
                        const {epoch} = await suiClient.getLatestSuiSystemState();
                        generateNonceValue(ephemeralKeyPair?.getSecretKey(), Number(epoch) + 2);
                    }}
                    variant="contained"
                >
                    Generate Nonce
                </Button>
            ),
            content: nonce,
        },
        {
            title: "Authenticate with Google",
            action: (
                <Button
                    onClick={() => handleRedirectToGoogle(googleParams.clientId, googleParams.redirectURI, nonce || "")}
                    variant="contained"
                >
                    Sign In with Google
                </Button>
            ),
            content: decodedJwt ? JSON.stringify(decodedJwt) : null,
        },
        {
            title: "Generate User Salt",
            action: (
                <Button onClick={generateUserSalt} variant="contained">
                    Generate User Salt
                </Button>
            ),
            content: userSalt,
        },
        {
            title: "Generate ZkLogin Address",
            action: (
                <Button
                    onClick={() => generateZkLoginAddress(encodedJwt, userSalt)}
                    variant="contained"
                    disabled={!encodedJwt || !userSalt}
                >
                    Generate Address
                </Button>
            ),
            content: zkLoginAddress,
        },
        {
            title: "Generate ZK Proof",
            action: (
                <Button
                    onClick={async () => {
                        const extendedPublicKey = getExtendedEphemeralPublicKey(ephemeralKeyPair?.getPublicKey());
                        const {epoch} = await suiClient.getLatestSuiSystemState();
                        await generateZkProof(proverProvider, {
                            jwt: encodedJwt,
                            extendedEphemeralPublicKey: extendedPublicKey,
                            maxEpoch: Number(epoch) + 2,
                            jwtRandomness: randomness,
                            salt: userSalt,
                            keyClaimName: "sub",
                        });
                    }}
                    variant="contained"
                    disabled={zkProofLoading}
                >
                    {zkProofLoading ? <CircularProgress size={24}/> : "Generate Proof"}
                </Button>
            ),
            content: zkProof ? JSON.stringify(zkProof) : null,
        },
        {
            title: "Execute Transaction",
            action: (
                <Button
                    onClick={async () => {
                        const transactionBlock = new Uint8Array();
                        await executeTransaction(transactionBlock, "");
                    }}
                    variant="contained"
                    disabled={executing}
                >
                    {executing ? <CircularProgress size={24}/> : "Execute Transaction"}
                </Button>
            ),
            content: digest,
        },
    ];

    return (
        <Box display="flex" flexDirection="column" gap={4}>
            {steps.map((step, index) => (
                <Item key={index}>
                    <Typography variant="h6">{step.title}</Typography>
                    {step.action}
                    {step.content && <Typography mt={2}>{step.content}</Typography>}
                </Item>
            ))}
        </Box>
    );
};
