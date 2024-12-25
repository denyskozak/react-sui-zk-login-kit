import { useState } from "react";
import { generateRandomness } from "@mysten/sui/zklogin";

export const useUserSalt = () => {
    const [userSalt, setUserSalt] = useState<string | null>(
        localStorage.getItem("userSalt")
    );

    const generateUserSalt = (salt: string) => {
        localStorage.setItem("userSalt", salt);
        setUserSalt(salt);
    };

    const clearUserSalt = () => {
        localStorage.removeItem("userSalt");
        setUserSalt(null);
    };

    return {
        userSalt,
        generateUserSalt,
        clearUserSalt,
    };
};
