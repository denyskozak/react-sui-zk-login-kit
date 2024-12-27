import { JwtPayload } from "jwt-decode";
export declare const useJwt: () => {
    encodedJwt: string | null;
    decodedJwt: JwtPayload | null;
    setJwtString: (jwtString: string | null) => void;
};
