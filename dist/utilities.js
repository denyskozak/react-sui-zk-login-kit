export const getTokenFromUrl = () => {
    // Get the hash part of the URL
    const hash = window.location.hash;
    // Remove the leading '#' and split the hash into key-value pairs
    const params = new URLSearchParams(hash.substring(1));
    // Extract the `id_token` parameter
    return params.get("id_token");
};
