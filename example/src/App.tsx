// import {ZKHooks} from "./ZKHooks.tsx";
import {ZKComponent} from "./ZKComponent.tsx";
import { ZKLoginProvider } from '../../src';
import { SuiClient } from '@mysten/sui/client';

const FULLNODE_URL = "https://fullnode.devnet.sui.io/";
const suiClient = new SuiClient({ url: FULLNODE_URL });

function App() {
  return (
    <ZKLoginProvider client={suiClient}>
      <ZKComponent />
    </ZKLoginProvider>
  )
}

export default App
