import { useState } from "react";
import { jwtToAddress } from "@mysten/sui/zklogin";

export const useZkLoginAddress = () => {
    const [zkLoginAddress, setZkLoginAddress] = useState<string | null>(null);

    const generateZkLoginAddress = (jwt: string, userSalt: string) => {
        const address = jwtToAddress(jwt, userSalt);
        setZkLoginAddress(address);
    };

    return {
        zkLoginAddress,
        generateZkLoginAddress,
    };
};
