import { useState } from "react";
import { jwtToAddress } from "@mysten/sui/zklogin";

import { useZKLoginContext } from "./useZKLoginContext";

export const useZkLoginAddress = () => {
    const { state, dispatch } = useZKLoginContext();

    const generateZkLoginAddress = (jwt: string, userSalt: string) => {
        const address = jwtToAddress(jwt, userSalt);
        dispatch({ type: "SET_ZK_LOGIN_ADDRESS", payload: address });
    };

    return {
        zkLoginAddress: state.zkLoginAddress,
        generateZkLoginAddress,
    };
};
