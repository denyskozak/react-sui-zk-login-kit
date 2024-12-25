import React, {ReactNode, use, useCallback, useEffect, useLayoutEffect, useMemo} from "react";
import {Box, Button, Typography, IconButton} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Replace with your icon or SVG
import FacebookIcon from "@mui/icons-material/Facebook"; // Replace with your icon or SVG
import TwitchIcon from "@mui/icons-material/SportsEsports"; // Replace with your icon or SVG
import {useGoogleAuth} from "../../hooks/useGoogleAuth"; // Example of your hook
import {SuiClient} from "@mysten/sui/client";
import styled from '@emotion/styled';
import {useEphemeralKeyPair, useJwt, useNonce, useUserSalt, useZkLoginAddress} from "../../hooks";
import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";
import {getTokenFromUrl} from "../../utilities";

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
    suiClient: SuiClient;
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
        suiClient,
        title = 'Sign In With Your Preferred Service'
    } = props;
    const {handleRedirectToGoogle} = useGoogleAuth();
    const {generateEphemeralKeyPair, loadEphemeralKeyPair, ephemeralKeyPair} = useEphemeralKeyPair();
    const {generateNonceValue, generateRandomnessValue, nonce} = useNonce();
    const {setJwtString, decodedJwt, encodedJwt} = useJwt();
    const {generateUserSalt, userSalt: storedUserSalt} = useUserSalt();
    const {generateZkLoginAddress, zkLoginAddress} = useZkLoginAddress();

    useEffect(() => {
        if (observeTokenInURL && window && window.location.hash) {
            const [token, cleanHashParams] = getTokenFromUrl();

            if (token) {
                setJwtString(token);
                onJwtReceived?.(token)
                window.location.hash = cleanHashParams.toString();
            }
        }
    }, []);

    useEffect(() => {

        if (userSalt && encodedJwt) {
            generateUserSalt(userSalt);
            generateZkLoginAddress(encodedJwt, userSalt);
        }
    }, [userSalt]);

    useLayoutEffect(() => {
        const init = async () => {
            // Step 1
            let keypair = loadEphemeralKeyPair();
            if (!keypair) {
                keypair = generateEphemeralKeyPair();
            }
            onKeypairReceived?.(keypair);

            // Step 2
            const randomValue = generateRandomnessValue();
            const {epoch} = await suiClient.getLatestSuiSystemState();

            const maxEpoch = Number(epoch) + 2; // live 2 epochs
            const nonce = generateNonceValue(keypair.getSecretKey(), randomValue, maxEpoch);
            onNonceReceived?.(nonce);
        };

        init().catch((error) => console.error('Error init ZK Login component', error));
    }, []);

    const providerList = useMemo(() => Object.entries(providers), [providers]);

    const handleGoogleLogin = () => {
        if (providers.google && nonce) {
            handleRedirectToGoogle(
                providers.google.clientId,
                providers.google.redirectURI,
                nonce
            );
        }
    };

    const renderProvider = useMemo<RenderProviders>(() => (
        {
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
        }
    ), []);

    const icons = () => providerList.map(([id]) => renderProvider[id as keyof Providers]?.());

    return (
        <Container>
            <Typography variant="h6" style={{color: '#000000'}}>
                {title}
            </Typography>

            {/*If have JWT and no userSalt*/}
            {decodedJwt && !userSalt && <>
                <Typography style={{color: '#000000'}}>
                    Have key?
                </Typography>
                <Button onClick={() => encodedJwt && onGenerateUserSaltClick?.(encodedJwt)}>No</Button>
            </>}

            {/*If have JWT and userSalt*/}
            {decodedJwt && storedUserSalt && (
                <>
                    <Typography style={{color: '#000000'}}>
                        Save Your Key: <code>{userSalt}</code>
                    </Typography>
                    <Typography style={{color: '#000000'}}>
                        Your address: <code>{zkLoginAddress}</code>
                    </Typography>
                    <Button onClick={() => navigator.clipboard.writeText(storedUserSalt)}>Copy</Button>
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
