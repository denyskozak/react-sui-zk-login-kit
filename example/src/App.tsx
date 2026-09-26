import {SuiGrpcClient} from '@mysten/sui/grpc';

import {Content} from "./Content.tsx";
import {ZKLoginProvider} from '../../src';

const FULLNODE_URL = "https://fullnode.devnet.sui.io/";
const suiClient = new SuiGrpcClient({network: 'devnet', baseUrl: FULLNODE_URL});

function App() {
    return (
        <ZKLoginProvider client={suiClient}>
            <Content/>
        </ZKLoginProvider>
    )
}

export default App
