/**
 * Convenience function to fetch a path from the API and call json() on the response.
 *
 * @param {string} path Path to query from the API
 */
export async function getFromApi(path) {
    const p = path.startsWith("/") ? path : `/${path}`;
    const data = await fetch(`${import.meta.env.VITE_API_ENDPOINT}${p}`);
    return data.json();
}
