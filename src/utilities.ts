export const getTokenFromUrl = (): [string | null, URLSearchParams]  => {
    // Get the hash part of the URL
    const hash = window.location.hash;

    // Remove the leading '#' and split the hash into key-value pairs
    const params = new URLSearchParams(hash.substring(1));

    // Extract the `id_token` parameter
    const token = params.get("id_token");

    // Delete the `id_token` parameter
    params.delete("id_token");

    return [token, params];
}