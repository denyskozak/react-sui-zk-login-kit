import {useZKLoginContext} from "./useZKLoginContext";
import {useCallback} from "react";

export const useUserSalt = () => {
    const {state, dispatch} = useZKLoginContext();

    const addUserSalt = useCallback((salt: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("userSalt", salt);
        }

        dispatch({type: "SET_USER_SALT", payload: salt});
    }, []);

    const clearUserSalt = useCallback(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("userSalt");
        }

        dispatch({type: "DELETE_USER_SALT"});
    }, []);

    return {
        userSalt: state.userSalt,
        setUserSalt: addUserSalt,
        clearUserSalt,
    };
};
