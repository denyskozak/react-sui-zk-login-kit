import {useEffect, useLayoutEffect, useMemo} from "react";
import GoogleIcon from "./logos/google.svg"; // Replace with your icon or SVG
import TwitchIcon from "./logos/twitch.svg"; // Replace with your icon or SVG
import {useOAuth, useEphemeralKeyPair, useJwt, useNonce, useUserSalt, useZkLoginAddress, useZkProof} from "../../hooks";
import {getTokenFromUrl} from "../../utilities";
import {getExtendedEphemeralPublicKey} from "@mysten/sui/zklogin";
import {useZKLoginContext} from "../../hooks/useZKLoginContext";
import {TwitchIconImg, IconImg, Icon, IconContainer, Typography, Container, Code, Button} from './zk-login.styles';

interface GoogleParams {
    redirectURI: string;
    clientId: string;
    jwt?: string;
}

interface TwitchParams {
    redirectURI: string;
    clientId: string;
}

type Providers = {
    google?: GoogleParams,
    twitch?: TwitchParams
};

interface ZKLoginProps {
    providers: Providers;
    proverProvider: string;
    title?: string;
    subTitle?: string;
    userSalt?: string;
    observeTokenInURL?: boolean;
}

export const ZkLogin = (props: ZKLoginProps) => {
    const {
        providers,
        observeTokenInURL = true,
        proverProvider,
        userSalt,
        title = 'Sign In With',
        subTitle = 'Your Preferred Service'
    } = props;

    const {client: suiClient} = useZKLoginContext();
    const {handleRedirectTo: handleRedirectToGoogle} = useOAuth('https://accounts.google.com/o/oauth2/v2/auth');
    const {handleRedirectTo: handleRedirectToTwitch} = useOAuth('https://id.twitch.tv/oauth2/authorize');
    const {generateEphemeralKeyPair, ephemeralKeyPair} = useEphemeralKeyPair();
    const {generateNonceValue, generateRandomnessValue, randomness, nonce} = useNonce();
    const {setJwtString, encodedJwt} = useJwt();
    const {setUserSalt} = useUserSalt();
    const {generateZkLoginAddress, zkLoginAddress} = useZkLoginAddress();
    const {loading: zkProofLoading, generateZkProof} = useZkProof();

    // Step 1
    useEffect(() => {
        if (!ephemeralKeyPair) generateEphemeralKeyPair();
    }, []);

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
                window.location.hash = '';
            }
        }
    }, []);

    // Step 4
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
                <IconImg src={GoogleIcon}/>
            </Icon>
        ),
        twitch: (
            <Icon
                key="twitch"
                onClick={handleTwitchLogin}
            >
                <TwitchIconImg src={TwitchIcon}/>
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
            {zkProofLoading && (
                <Typography>
                    Loading ZK Proof ...
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


            {!zkLoginAddress && !zkProofLoading && (
                <IconContainer>
                    {providerList.map(([providerName]) => renderProvider[providerName as keyof Providers])}
                </IconContainer>
            )}
        </Container>
    );
};
