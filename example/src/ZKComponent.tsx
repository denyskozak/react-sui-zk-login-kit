import {useJwt, ZKLogin} from "../../src";
import {useEffect, useState} from "react";
import {generateRandomness} from "@mysten/sui/zklogin";

// Example configuration
const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';

const providers = {
    google: {
        clientId: "648851101099-70tn7ksk6207uutiikv4d5783o0tmpmo.apps.googleusercontent.com",
        redirectURI: "http://localhost:5173/",
    },
    twitch: {
        clientId: "ltu7mhvfj4l04maulcjcqx1wm5e5zh",
        redirectURI: "http://localhost:5173",
    }
}

export const ZKComponent = () => {
    const {encodedJwt} = useJwt();
    const [userSalt, setUserSalt] = useState('');

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

            requestMock.then(salt => setUserSalt(String(salt)))
        }
    }, [encodedJwt]);

    return (
        <div>
            <ZKLogin
                providers={providers}
                userSalt={userSalt}
                proverProvider={SUI_PROVER_ENDPOINT}
            />
        </div>
    )
}