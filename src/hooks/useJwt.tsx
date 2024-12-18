import { useState, useEffect } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

export const useJwt = (jwtString?: string) => {
    const [decodedJwt, setDecodedJwt] = useState<JwtPayload | null>(null);
    const [encodedJwt, setEncodedJwt] = useState<string | null>(null);

    useEffect(() => {
        if (jwtString) {
            const decoded = jwtDecode<JwtPayload>(jwtString);
            setDecodedJwt(decoded);
            setEncodedJwt(jwtString);
        }
    }, [jwtString]);

    return {
        decodedJwt,
        encodedJwt,
    };
};
