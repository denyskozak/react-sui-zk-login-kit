import {useCallback} from "react";

export const useOAuth = (url: string) => {
    const handleRedirectTo = useCallback((clientId: string, redirectURI: string, nonce: string, scope = "openid") => {
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURI,
            response_type: "id_token",
            scope,
            nonce: nonce || "",
        });
        window.location.href = `${url}?${params}`;
    }, []);

    return {
        handleRedirectTo
    }
}