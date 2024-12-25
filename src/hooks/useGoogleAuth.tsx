import {useCallback} from "react";

export const useGoogleAuth = () => {
    const handleRedirectToGoogle = useCallback((clientId: string, redirectURI: string, nonce: string) => {
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURI,
            response_type: "id_token",
            scope: "openid email",
            nonce: nonce || "",
        });
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }, []);

    return {
        handleRedirectToGoogle
    }
}