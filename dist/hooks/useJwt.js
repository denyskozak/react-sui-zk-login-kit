import { jwtDecode } from "jwt-decode";
import { useZKLoginContext } from "./useZKLoginContext";
export const useJwt = () => {
    const { state, dispatch } = useZKLoginContext();
    const setJwtString = (jwtString) => {
        const decodedJwt = jwtString ? jwtDecode(jwtString) : null;
        dispatch({ type: "SET_JWT", payload: { jwtString, decodedJwt } });
    };
    return {
        encodedJwt: state.jwtString,
        decodedJwt: state.decodedJwt,
        setJwtString,
    };
};
