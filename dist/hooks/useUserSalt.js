import { useZKLoginContext } from "./useZKLoginContext";
export const useUserSalt = () => {
    const { state, dispatch } = useZKLoginContext();
    const addUserSalt = (salt) => {
        localStorage.setItem("userSalt", salt);
        dispatch({ type: "SET_USER_SALT", payload: salt });
    };
    const clearUserSalt = () => {
        localStorage.removeItem("userSalt");
        dispatch({ type: "DELETE_USER_SALT" });
    };
    return {
        userSalt: state.userSalt,
        setUserSalt: addUserSalt,
        clearUserSalt,
    };
};
