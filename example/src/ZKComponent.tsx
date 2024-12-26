import {ZkLogin} from "../../src";
import {useEffect, useState} from "react";
import { generateRandomness } from "@mysten/sui/zklogin";

// Example configuration
const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';
const CLIENT_ID = "648851101099-70tn7ksk6207uutiikv4d5783o0tmpmo.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/";

export const ZKComponent = () => {
    const [jwt, setJwt] = useState('');
    const [userSalt, setUserSalt] = useState('');

    useEffect(() => {
        // if we have jwt we can do request on your server
        // for generate user salt and associate user jwt with salt for login later
        if (jwt) {
            // in real scenario
            // we can request server with jwt to generate user salt based on this jwt
            // and associate jwt with user salt in a database
            // bonus - send user salt to user email on your server for safe
            const requestMock = new Promise((resolve) => resolve());

            const fakeUserSalt =  localStorage.getItem("userSalt") || generateRandomness(); // fake user salt for test
            requestMock.then(() => setUserSalt(fakeUserSalt))
        }
    }, [jwt]);
    return (
        <div>
            <ZkLogin
                providers={{
                    google: {
                        clientId: CLIENT_ID,
                        redirectURI: REDIRECT_URI,
                    },
                    twitch: {
                        clientId: CLIENT_ID,
                        redirectURI: REDIRECT_URI,
                    }
                }}
                userSalt={userSalt}
                proverProvider={SUI_PROVER_ENDPOINT}
                onJwtReceived={setJwt}
            />
        </div>
    )
}