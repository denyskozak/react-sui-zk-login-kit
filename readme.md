[![NPM Version](https://img.shields.io/npm/v/react-sui-zk-login-kit)](https://www.npmjs.com/package/react-sui-zk-login-kit)

<div align="center">

## 📺 [**Youtube Video Guide**](https://youtu.be/2qnjmKg3ugY?si=zHsCCZVYaXlklpIW) 📺
### [**Google Setup Guide**](https://www.youtube.com/watch?v=Hj_dR9gyYCA&t=15s)

</div>

[![welcome](https://raw.githubusercontent.com/denyskozak/react-sui-zk-login-kit/refs/heads/main/welcome.png)](https://www.npmjs.com/package/react-sui-zk-login-kit)

# react-sui-zk-login-kit

React Kit for seamless ZK Login integration for Sui blokchain

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Documentation](#documentation)
    - [Types](#types)
    - [Functions](#functions)
    - [Error Handling](#error-handling)
4. [Contributing](#contributing)
5. [About](#about)

---

## Installation

```bash
npm install react-sui-zk-login-kit @mysten/sui react react-dom
```

```bash
yarn add react-sui-zk-login-kit @mysten/sui react react-dom
```

---

## Usage

#### For Next JS

- use Provider and Component with 'use-client'
- if experience problem with default remove hash from url try "disableRemoveHash" prop

### Example Usage in Your React App

**App.tsx**

```tsx
import {SuiGrpcClient} from '@mysten/sui/grpc';
import {Content} from "./Content";
import {ZKLoginProvider} from 'react-sui-zk-login-kit';

const FULLNODE_URL = "https://fullnode.devnet.sui.io/";
const suiClient = new SuiGrpcClient({
    network: 'devnet',
    baseUrl: FULLNODE_URL,
});

function App() {
    return (
        <ZKLoginProvider client={suiClient}>
            <Content/>
        </ZKLoginProvider>
    )
}

export default App;
```

**Content.tsx**

```tsx
import {useEffect} from "react";
import {generateRandomness} from "@mysten/sui/zklogin";
import {ZKLogin, useZKLogin} from "react-sui-zk-login-kit";

const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';

// values can be stored in .env
const providers = {
    google: {
        clientId: "YOUR_GOOGLE_CLIENT_ID",
        redirectURI: "YOUR_REDIRECT_URI",
    },
    twitch: {
        clientId: "YOUR_TWITCH_CLIENT_ID",
        redirectURI: "YOUR_REDIRECT_URI",
    }
}

export const Content = () => {
    const {encodedJwt, userSalt, setUserSalt, address, logout} = useZKLogin();

    useEffect(() => {
        if (encodedJwt) {
            // make you request to your server 
            // for recive useSalt by jwt.iss (issuer id)
            const requestMock = new Promise(
                (resolve): void =>
                    resolve(localStorage.getItem("userSalt") || generateRandomness())
            );

            requestMock.then(salt => setUserSalt(String(salt)))
        }
    }, [encodedJwt]);

    return (
        <ZKLogin
            providers={providers}
            proverProvider={SUI_PROVER_ENDPOINT}
        />
    )
}
```

---

## Documentation

### Types

#### `ZKLogin` Component Props

| Name                 | Type         | Description                                                         |
|----------------------|--------------|---------------------------------------------------------------------|
| `providers`          | `Providers`  | OAuth providers configuration.                                      |
| `proverProvider`     | `string`     | URL of the prover service for ZK proofs.                            |
| `title?`             | `string`     | Title text for the component.                                       |
| `subTitle?`          | `string`     | Subtitle text for the component.                                    |
| `loadingText?`       | `string`     | Loading text                                                        |
| `errorText?`         | `string`     | Error text                                                          |
| `userSalt?`          | `string`     | Optional user-specific salt.                                        |
| `observeTokenInURL?` | `boolean`    | default - true Observer token in URL                                |
| `disableRemoveHash?` | `boolean`    | default - false (Mostly for NextJS) Disable removing hash from url. |
| `onSuccess?`         | `() => void` | On Success login hook                                               | Decoded JWT payload.                        |

#### `useZKLogin` Hook Props Object

| Name                   | Type         | Description                                  |
|------------------------|--------------|----------------------------------------------|
| `onTransactionFailed?` | `() => void` | Optional, hook on transaction failed execute |

#### `useZKLogin` Hook Return

| Name                 | Type                                                    | Description                                 |
|----------------------|---------------------------------------------------------|---------------------------------------------|
| `encodedJwt`         | `string \| null`                                        | JWT string from the authentication process. |
| `userSalt`           | `string`                                                | User-specific salt.                         |
| `address`            | `string \| null`                                        | Address                                     | User's Sui blockchain address.              |
| `logout`             | `() => void`                                            | Function to log out the user.               |
| `setUserSalt`        | `(value: string) => void`                               | Set new user salt                           | Function to set the user salt.          |
| `keypair`            | `Ed25519Keypair \| null`                                | User keypair                                | Ephemeral keypair for cryptographic operations. |
| `executeTransaction` | `(transaction: Transaction) => Promise<string \| void>` | Executes a Sui blockchain transaction.      |
| `client`             | `ClientWithCoreApi`                                     | A Sui gRPC, GraphQL, or compatible core API client. |

### Compatibility

- Version 1.1.12 and newer uses the ESM-only `@mysten/sui` 2.x API.
- TypeScript projects should use `moduleResolution: "Bundler"`, `"NodeNext"`, or `"Node16"`.
- Existing zkLogin addresses remain compatible because the kit explicitly uses Sui's legacy address derivation mode.
| `decodedJwt`         | `JwtPayload \| null`                                    | Decoded JWT from used Oauth                 | Decoded JWT payload.                        |

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with detailed descriptions of your
changes.

---

## License

[MIT](https://opensource.org/licenses/MIT)
