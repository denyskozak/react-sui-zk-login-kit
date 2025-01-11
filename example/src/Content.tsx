import {useEffect} from "react";
import {generateRandomness} from "@mysten/sui/zklogin";
import {Box, Button, Stack, Typography} from "@mui/material";
import {GitHub} from "@mui/icons-material";
import {ExecuteTx} from "./components/ExecuteTx.tsx";
import {CopyToClipboard} from "./components/CopyToClipboard.tsx";
import {ZKLogin, useZKLogin} from "../../src";

import backgroundImage from "./assets/bg.webp";

// Example configuration
const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';

const providers = {
    google: {
        clientId: "648851101099-uit5tqa2gf0nr1vvpjorc87k2u4minip.apps.googleusercontent.com",
        redirectURI: "https://demo.react-sui-zk-login.com",
    },
    twitch: {
        clientId: "ltu7mhvfj4l04maulcjcqx1wm5e5zh",
        redirectURI: "https://demo.react-sui-zk-login.com",
    }
}

export const Content = () => {
    const {encodedJwt, setUserSalt, address, logout} = useZKLogin();

    useEffect(() => {
        // if we have jwt we can do request on your server
        // for generate user salt and associate user jwt with salt for login later
        if (encodedJwt) {
            // in real scenario
            // we can request server with jwt to generate user salt based on this jwt
            // and associate jwt with user salt in a database
            // bonus - send user salt to user email on your server for safe
            const requestMock = new Promise(
                (resolve): void =>
                    resolve(localStorage.getItem("userSalt") || generateRandomness() // fake user salt for test
                    )
            );

            // set userSalt for start auth process
            requestMock.then(salt => setUserSalt(String(salt)))
        }
    }, [setUserSalt, encodedJwt]);

    return (
        <Box>
            <Box sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
            }}>
                <Box sx={{position: 'absolute', bottom: 20}}>
                    <CopyToClipboard/>
                </Box>
                <Box sx={{position: 'absolute', left: 20, top: 20}}>
                    <Button sx={{color: 'white'}} onClick={() => {
                        window.open('https://github.com/denyskozak/react-sui-zk-login-kit', '_blank')
                    }}>
                        <GitHub/>
                    </Button>
                </Box>
                <Box sx={{position: 'absolute', left: 100, top: 30}}>
                    <Typography>Dev Network</Typography>
                </Box>
                {address && <Box sx={{position: 'absolute', right: 20, top: 20}}>
                    <Button sx={{color: 'white'}} onClick={() => {
                        logout();
                    }}>
                        Logout
                    </Button>
                </Box>}
                <Box sx={{ position: 'absolute', top: address ? '5%' : '15%'}}>
                    <Typography variant="h2" sx={{fontWeight: 500}}>React Sui ZK Login Kit</Typography>
                </Box>
                <Stack alignItems="center"
                       sx={{
                           backgroundImage: `url(${backgroundImage})`,
                           backgroundRepeat: "no-repeat",
                           backgroundSize: "cover",
                           width: "100%",
                           height: address ? 500 : 300,
                           justifyContent: "center",
                           margin: 'auto',
                           position: 'relative'
                       }}
                >
                    {/*ZK LOGIN COMPONENT*/}
                    <ZKLogin
                        providers={providers}
                        proverProvider={SUI_PROVER_ENDPOINT}
                    />
                    {address && (
                        <ExecuteTx address={address}/>
                    )}
                </Stack>
            </Box>
        </Box>
    )
}