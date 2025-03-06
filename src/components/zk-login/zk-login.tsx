import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import GoogleIcon from "./logos/google.svg"; // Replace with your icon or SVG
import TwitchIcon from "./logos/twitch.svg"; // Replace with your icon or SVG
import {useOAuth, useEphemeralKeyPair, useJwt, useNonce, useUserSalt, useZkLoginAddress, useZkProof} from "../../hooks";
import {getTokenFromUrl} from "../../utilities";
import {getExtendedEphemeralPublicKey} from "@mysten/sui/zklogin";
import {useZKLoginContext} from "../../hooks/useZKLoginContext";
import {TwitchIconImg, IconImg, Icon, IconContainer, Typography, Container, Code, Button} from './zk-login.styles';


const getImage = (image: string | { src: string }) => typeof image === "object" ? image.src : image;

interface ProviderBase {
    clientId: string;
    redirectURI: string;
}

interface GoogleParams extends ProviderBase {
    jwt?: string;
}

type Providers = {
    google?: GoogleParams,
    twitch?: ProviderBase
};

interface ZKLoginProps {
    providers: Providers;
    proverProvider: string;
    title?: string;
    subTitle?: string;
    loadingText?: string;
    errorText?: string;
    observeTokenInURL?: boolean;
    disableRemoveHash?: boolean;
}

export const ZKLogin = (props: ZKLoginProps) => {
    const {
        providers,
        observeTokenInURL = true,
        proverProvider,
        title = 'Sign In With',
        subTitle = 'Your Preferred Service',
        loadingText = 'Loading ZK Proof ...',
        errorText = 'Unfortunately, ZK Proof failed, please try again',
        disableRemoveHash = false,
    } = props;

    const {client: suiClient} = useZKLoginContext();
    const {handleRedirectTo: handleRedirectToGoogle} = useOAuth('https://accounts.google.com/o/oauth2/v2/auth');
    const {handleRedirectTo: handleRedirectToTwitch} = useOAuth('https://id.twitch.tv/oauth2/authorize');
    const {generateEphemeralKeyPair, ephemeralKeyPair, ephemeralKeySecret} = useEphemeralKeyPair();
    const {generateNonceValue, generateRandomnessValue, randomness, nonce} = useNonce();
    const {setJwtString, encodedJwt} = useJwt();
    const {setUserSalt, userSalt} = useUserSalt();
    const {generateZkLoginAddress, zkLoginAddress} = useZkLoginAddress();
    const {generateZkProof} = useZkProof();

    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    function removeHash() {
        if (disableRemoveHash) return;
        history.pushState("", document.title, window.location.pathname
            + window.location.search);
    }

    // Step 1
    useEffect(() => {
        if (!ephemeralKeySecret) generateEphemeralKeyPair();
    }, [ephemeralKeySecret]);

    // Step 2
    useLayoutEffect(() => {
        const generateRandomnessAndNonce = async () => {
            if (ephemeralKeyPair && !randomness && !nonce) {
                const randomValue = generateRandomnessValue();
                const {epoch} = await suiClient.getLatestSuiSystemState();

                const maxEpoch = Number(epoch) + 2; // live 2 epochs
                generateNonceValue(ephemeralKeyPair.getSecretKey(), randomValue, maxEpoch);
            }
        };

        generateRandomnessAndNonce().catch((error) => console.error('Error init ZK Login component', error));
    }, [ephemeralKeyPair]);

    // Step 3
    useEffect(() => {
        if (observeTokenInURL && window && window.location.hash) {
            const token = getTokenFromUrl();
            if (token) {
                setJwtString(token);
            }
        }
    }, []);

    // Step 4
    useEffect(() => {
        const zkProof = async () => {
            try {
                if (userSalt && encodedJwt && ephemeralKeyPair) {
                    setLoading(true);
                    setShowError(false);
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
                        generateZkLoginAddress(encodedJwt, userSalt);
                        removeHash();
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error User Salt Proof ZK Login component', error);
                setLoading(false);
                setShowError(true);
                removeHash();
            }
        };

        zkProof();
    }, [setUserSalt, userSalt, ephemeralKeyPair]);

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

    const handleTwitchLogin = () => {
        if (providers.twitch && nonce) {
            handleRedirectToTwitch(
                providers.twitch.clientId,
                providers.twitch.redirectURI,
                nonce
            );
        }
    };

    const renderProvider = {
        google: (
            <Icon
                key="google"
                onClick={handleGoogleLogin}
            >
                <IconImg src={getImage(GoogleIcon)}/>
            </Icon>
        ),
        twitch: (
            <Icon
                key="twitch"
                onClick={handleTwitchLogin}
            >
                <TwitchIconImg src={getImage(TwitchIcon)}/>
            </Icon>
        )
    };

    return (
        <Container>
            {!zkLoginAddress && (
                <>
                    <Typography>
                        {title}
                    </Typography>
                    <Typography>
                        {subTitle}
                    </Typography>
                </>
            )}

            {/*If have JWT and no userSalt*/}
            {loading && (
                <Typography>
                    {loadingText}
                </Typography>
            )}

            {/*If have JWT and no userSalt*/}
            {showError && (
                <Typography>
                    {errorText}
                </Typography>
            )}

            {/*If have JWT and userSalt*/}
            {zkLoginAddress && (
                <>
                    <Typography>
                        Your
                        address: <Code>{zkLoginAddress}</Code>
                    </Typography>
                    <Button onClick={() => navigator.clipboard.writeText(zkLoginAddress)}>Copy Address</Button>
                </>
            )}


            {!zkLoginAddress && (
                <IconContainer>
                    {providerList.map(([providerName]) => renderProvider[providerName as keyof Providers])}
                </IconContainer>
            )}
        </Container>
    );
};
