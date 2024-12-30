import { useZKLoginContext } from "./useZKLoginContext";

export const useLogout = () => {
    const { dispatch } = useZKLoginContext();

    const logout = () => {
        dispatch({ type: "RESET" });
    };

    return {
        logout,
    };
};
