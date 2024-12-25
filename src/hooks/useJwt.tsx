import { useState, useEffect } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

export const useJwt = () => {
    const [decodedJwt, setDecodedJwt] = useState<JwtPayload | null>(null);
    const [encodedJwt, setEncodedJwt] = useState<string | null>( sessionStorage.getItem('jwt'));

    useEffect(() => {
        if (encodedJwt) {
            const decoded = jwtDecode<JwtPayload>(encodedJwt);
            setDecodedJwt(decoded);
        }
    }, [encodedJwt]);

    const setJwt = (jwt: string) => {
        setEncodedJwt(jwt);
        sessionStorage.setItem('jwt', jwt);
    }

    return {
        decodedJwt,
        encodedJwt,
        setJwtString: setJwt,
    };
};
