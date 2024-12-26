import React, {ReactNode, use, useCallback, useEffect, useLayoutEffect, useMemo} from "react";
import {Box, Button, IconButton} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Replace with your icon or SVG
import FacebookIcon from "@mui/icons-material/Facebook"; // Replace with your icon or SVG
import TwitchIcon from "@mui/icons-material/SportsEsports"; // Replace with your icon or SVG
import {useGoogleAuth} from "../../hooks/useGoogleAuth"; // Example of your hook
import {SuiClient} from "@mysten/sui/client";
import styled from '@emotion/styled';
import {useEphemeralKeyPair, useJwt, useNonce, useUserSalt, useZkLoginAddress, useZkProof} from "../../hooks";
import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";
import {getTokenFromUrl} from "../../utilities";
import {getExtendedEphemeralPublicKey} from "@mysten/sui/zklogin";
import {useZKLoginContext} from "../../hooks/useZKLoginContext";

// Styled Components
const Container = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "400px",
    maxHeight: "400px",
    margin: "auto",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
});

const Typography = styled.span`
    color: #000000;
    width: 100%;
    padding: 0;
    margin: 0;
`;

const IconContainer = styled(Box)({
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "16px",
});

const MoreOptionsButton = styled(Button)({
    marginTop: "20px",
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: "8px",
    textTransform: "none",
    padding: "8px 16px",
    "&:hover": {
        backgroundColor: "#e0e0e0",
    },
});

interface GoogleParams {
    redirectURI: string;
    clientId: string;
    jwt?: string;
}

interface TwitchParams {
}

type Providers = {
    google?: GoogleParams,
    twitch?: TwitchParams
};

type RenderProviders = Record<keyof Providers, () => JSX.Element>;

interface ZKLoginProps {
    providers: Providers;
    proverProvider: string;
    title?: string;
    userSalt?: string;
    // hooks
    onKeypairReceived?: (keypair: Ed25519Keypair) => void;
    onNonceReceived?: (nonce: string) => void;
    onJwtReceived?: (jwt: string) => void;
    onGenerateUserSaltClick?: (jwt: string) => void;
    observeTokenInURL?: boolean;

}

export const ZkLogin = (props: ZKLoginProps) => {
    const {
        providers,
        onKeypairReceived,
        onNonceReceived,
        onGenerateUserSaltClick,
        onJwtReceived,
        observeTokenInURL = true,
        proverProvider,
        userSalt,
        title = 'Sign In With Your Preferred Service'
    } = props;
    const {client: suiClient} = useZKLoginContext();
    const {handleRedirectToGoogle} = useGoogleAuth();
    const {generateEphemeralKeyPair, loadEphemeralKeyPair, ephemeralKeyPair} = useEphemeralKeyPair();
    const {generateNonceValue, generateRandomnessValue, randomness, nonce} = useNonce();
    const {setJwtString, decodedJwt, encodedJwt} = useJwt();
    const {setUserSalt, userSalt: storedUserSalt} = useUserSalt();
    const {generateZkLoginAddress, zkLoginAddress} = useZkLoginAddress();
    const {zkProof, loading: zkProofLoading, generateZkProof} = useZkProof();

    useEffect(() => {
        if (observeTokenInURL && window && window.location.hash) {
            const token = getTokenFromUrl();

            if (token) {
                setJwtString(token);
                onJwtReceived?.(token)
                window.location.hash = '';
            }
        }
    }, []);

    useEffect(() => {
        const zkProof = async () => {
            if (userSalt && encodedJwt && ephemeralKeyPair) {
                const extendedPublicKey = getExtendedEphemeralPublicKey(
                    ephemeralKeyPair.getPublicKey()
                );
                const {epoch} = await suiClient.getLatestSuiSystemState();

                const maxEpoch = Number(epoch) + 2; // live 2 epochs

                const result = await generateZkProof(proverProvider, {
                    jwt: encodedJwt,
                    extendedEphemeralPublicKey: extendedPublicKey,
                    maxEpoch,
                    jwtRandomness: randomness,
                    salt: userSalt,
                    keyClaimName: "sub",
                });

                if (result && result.proofPoints) {
                    setUserSalt(userSalt);
                    generateZkLoginAddress(encodedJwt, userSalt);
                }
            }
        };

        zkProof().catch((error) => console.error('Error User Salt Proof ZK Login component', error));
    }, [userSalt]);

    useEffect(() => {
        if (!ephemeralKeyPair) generateEphemeralKeyPair();
    }, []);

    useLayoutEffect(() => {
        const generateRandomnessAndNonce = async () => {
            if (ephemeralKeyPair && !randomness && !nonce) {
                const randomValue = generateRandomnessValue();
                const {epoch} = await suiClient.getLatestSuiSystemState();

                const maxEpoch = Number(epoch) + 2; // live 2 epochs
                const newNonce = generateNonceValue(ephemeralKeyPair.getSecretKey(), randomValue, maxEpoch);
                onNonceReceived?.(newNonce);
            }
        };

        generateRandomnessAndNonce().catch((error) => console.error('Error init ZK Login component', error));
    }, [ephemeralKeyPair]);

    const providerList = useMemo(() => Object.entries(providers), [providers]);

    const handleGoogleLogin = () => {
        if (providers.google && nonce) {
            console.log('nonce ', nonce)
            handleRedirectToGoogle(
                providers.google.clientId,
                providers.google.redirectURI,
                nonce
            );
        }
    };

    const renderProvider = {
        google: () => (
            <IconButton
                key="google"
                onClick={handleGoogleLogin}
                style={{
                    backgroundColor: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "8px",
                }}
            >
                <GoogleIcon style={{fontSize: "32px"}}/>
            </IconButton>
        ),
        twitch: () => (
            <IconButton
                key="twitch"
                onClick={handleGoogleLogin}
                style={{
                    backgroundColor: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "8px",
                }}
            >
                <TwitchIcon style={{fontSize: "32px"}}/>
            </IconButton>
        )
    };

    const icons = () => providerList.map(([id]) => renderProvider[id as keyof Providers]?.());

    return (
        <Container>
            <Typography>
                {title}
            </Typography>

            {/*If have JWT and no userSalt*/}
            {zkProofLoading && (
                <Typography>
                    Loading ZK Proof ...
                </Typography>
            )}

            {/*If have JWT and userSalt*/}
            {decodedJwt && storedUserSalt && zkLoginAddress && (
                <>
                    <Typography>
                        Your
                        address: <Typography>...{String(zkLoginAddress).slice(zkLoginAddress.length / 2, zkLoginAddress.length)}</Typography>
                    </Typography>
                    <Button onClick={() => navigator.clipboard.writeText(zkLoginAddress)}>Copy Address</Button>
                </>
            )}


            {!zkLoginAddress && (
                <IconContainer>
                    {icons()}
                </IconContainer>
            )}
        </Container>
    );
};
