import { useState } from "react";

export const useUserSalt = () => {
    const [userSalt, setUserSalt] = useState<string | null>(
        localStorage.getItem("userSalt")
    );

    const addUserSalt = (salt: string) => {
        localStorage.setItem("userSalt", salt);
        setUserSalt(salt);
    };

    const clearUserSalt = () => {
        localStorage.removeItem("userSalt");
        setUserSalt(null);
    };

    return {
        userSalt,
        setUserSalt: addUserSalt,
        clearUserSalt,
    };
};
