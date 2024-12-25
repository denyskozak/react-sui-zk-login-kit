import { useState } from "react";
import { jwtToAddress } from "@mysten/sui/zklogin";

export const useZkLoginAddress = () => {
    const [zkLoginAddress, setZkLoginAddress] = useState<string | null>(sessionStorage.getItem("zkLoginAddress"));

    const generateZkLoginAddress = (jwt: string, userSalt: string) => {
        const address = jwtToAddress(jwt, userSalt);
        sessionStorage.setItem("zkLoginAddress", address);
        setZkLoginAddress(address);
    };

    return {
        zkLoginAddress,
        generateZkLoginAddress,
    };
};
