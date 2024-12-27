import {useEffect, useLayoutEffect, useMemo} from "react";
import {Button} from "@mui/material";
import GoogleIcon from "./logos/google.svg"; // Replace with your icon or SVG
import TwitchIcon from "./logos/twitch.svg"; // Replace with your icon or SVG
import {useGoogleAuth} from "../../hooks/useGoogleAuth"; // Example of your hook
import {useEphemeralKeyPair, useJwt, useNonce, useUserSalt, useZkLoginAddress, useZkProof} from "../../hooks";
import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";
import {getTokenFromUrl} from "../../utilities";
import {getExtendedEphemeralPublicKey} from "@mysten/sui/zklogin";
import {useZKLoginContext} from "../../hooks/useZKLoginContext";
import {TwitchIconImg, IconImg, Icon, IconContainer, Typography, Container} from './zk-login.styles';

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
    const {generateEphemeralKeyPair, ephemeralKeyPair} = useEphemeralKeyPair();
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
            handleRedirectToGoogle(
                providers.google.clientId,
                providers.google.redirectURI,
                nonce
            );
        }
    };

    const renderProvider = {
        google: () => (
            <Icon
                key="google"
                onClick={handleGoogleLogin}
            >
                <IconImg src={GoogleIcon}/>
            </Icon>
        ),
        twitch: () => (
            <Icon
                key="twitch"
                onClick={handleGoogleLogin}
            >
                <TwitchIconImg src={TwitchIcon}/>
            </Icon>
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
