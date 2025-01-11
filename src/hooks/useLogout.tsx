import {useZKLoginContext} from "./useZKLoginContext";
import {useCallback} from "react";

export const useLogout = () => {
    const {dispatch} = useZKLoginContext();

    const logout = useCallback(() => {
        dispatch({type: "RESET"});
    }, []);

    return {
        logout,
    };
};
