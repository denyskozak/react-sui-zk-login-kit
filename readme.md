[![NPM Version](https://img.shields.io/npm/v/react-sui-zk-login-kit)](https://www.npmjs.com/package/react-sui-zk-login-kit)

<div align="center">

## ✨ [**Link to Demo**](https://demo.react-sui-zk-login.com) ✨

</div>

[![welcome](https://raw.githubusercontent.com/denyskozak/react-sui-zk-login-kit/refs/heads/main/welcome.png)](https://www.npmjs.com/package/react-sui-zk-login-kit)

---

# react-sui-zk-login-kit

React Kit for seamless ZK Login integration for Sui blokchain
---

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
npm install react-sui-zk-login-kit
```

```bash
yarn add react-sui-zk-login-kit
```

---

## Usage

### Example Usage in Your App

**App.tsx**

```tsx
import {SuiClient} from '@mysten/sui/client';
import {Content} from "./Content";
import {ZKLoginProvider} from 'react-sui-zk-login-kit';

const FULLNODE_URL = "https://fullnode.devnet.sui.io/";
const suiClient = new SuiClient({url: FULLNODE_URL});

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
            // make you request to server 
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
            userSalt={userSalt}
            proverProvider={SUI_PROVER_ENDPOINT}
        />
    )
}
```

---

## Documentation

### Types

#### `ZKLogin` Component Props

| Name             | Type        | Description                              |
|------------------|-------------|------------------------------------------|
| `providers`      | `Providers` | OAuth providers configuration.           |
| `proverProvider` | `string`    | URL of the prover service for ZK proofs. |
| `title`          | `string?`   | Title text for the component.            |
| `subTitle`       | `string?`   | Subtitle text for the component.         |
| `userSalt`       | `string?`   | Optional user-specific salt.             |

#### `useZKLogin` Hook Return

| Name                 | Type                                                    | Description                                 |
|----------------------|---------------------------------------------------------|---------------------------------------------|
| `encodedJwt`         | `string \| null`                                        | JWT string from the authentication process. |
| `userSalt`           | `string`                                                | User-specific salt.                         |
| `address`            | `string          `                                      | null`                                       | User's Sui blockchain address.              |
| `logout`             | `() => void`                                            | Function to log out the user.               |
| `setUserSalt`        | `(value: ((prevState: string) => string) `              | string) => void`                            | Function to set the user salt.          |
| `keypair`            | `Ed25519Keypair          `                              | null`                                       | Ephemeral keypair for cryptographic operations. |
| `executeTransaction` | `(transaction: Transaction) => Promise<string \| void>` | Executes a Sui blockchain transaction.      |
| `client`             | `SuiClient`                                             | The Sui blockchain client instance.         |
| `decodedJwt`         | `JwtPayload`                                            | null`                                       | Decoded JWT payload.                        |

---

### Error Handling

All asynchronous operations may throw errors. Common errors include:

- Network issues
- Invalid JWT tokens
- Failed ZK proof generation

Ensure proper error handling for a robust user experience.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with detailed descriptions of your
changes.

---

## About

Developed with ❤️ by [Denys Kozak](https://github.com/denyskozak). Donations are appreciated at
`0x66aaa7eac8a801e6eab665cb9b9127e4f41bd10455606091088235f89cbb149b`.

---

## License

[MIT](https://opensource.org/licenses/MIT)
