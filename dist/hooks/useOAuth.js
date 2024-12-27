import { useCallback } from "react";
export const useOAuth = (url) => {
    const handleRedirectTo = useCallback((clientId, redirectURI, nonce, scope = "openid") => {
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
    };
};
