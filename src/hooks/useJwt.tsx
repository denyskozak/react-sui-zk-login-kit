import {JwtPayload, jwtDecode} from "jwt-decode";
import {useZKLoginContext} from "./useZKLoginContext";
import {useCallback} from "react";

export const useJwt = () => {
    const {state, dispatch} = useZKLoginContext();

    const setJwtString = useCallback((jwtString: string | null) => {
        try {
            const decodedJwt = jwtString ? jwtDecode<JwtPayload>(jwtString) : null;
            dispatch({type: "SET_JWT", payload: {jwtString, decodedJwt}});
        } catch (error) {
            console.log('error ', error)
        }
    }, []);

    return {
        encodedJwt: state.jwtString,
        decodedJwt: state.decodedJwt,
        setJwtString,
    };
};
