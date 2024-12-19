import { SuiClient } from "@mysten/sui/client";
import {SuiZKLogin} from "../../src";

// Example configuration
const FULLNODE_URL = "https://fullnode.devnet.sui.io/";
const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';
const CLIENT_ID = "648851101099-70tn7ksk6207uutiikv4d5783o0tmpmo.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/";

const suiClient = new SuiClient({ url: FULLNODE_URL });

export const ZKComponent = () => {

    return (
        <SuiZKLogin
            googleParams={{
                clientId: CLIENT_ID,
                redirectURI: REDIRECT_URI,
            }}
            suiClient={suiClient}
            proverProvider={SUI_PROVER_ENDPOINT}
            provider={'google'}
        />
    )
}