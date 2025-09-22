/**
 * Convenience function to fetch a path from the API and call json() on the response.
 *
 * @param {string} path Path to query from the API
 */
export async function getFromApi(path) {
    const p = path.startsWith("/") ? path : `/${path}`;
    const data = await fetch(`${import.meta.env.VITE_API_ENDPOINT}${p}`);
    if (data.status === 404) return { status: 404 };
    return data.json();
}

/**
 * Convenience function to fetch letters related to an entity.
 *
 * @param {object} args Destructured arguments object
 * @param {string} args.uri Base URI for the related letters endpoint
 * @param {number} args.page Page number to request
 * @param {string} args.startDate Start date filter string, format "YYYY-MM-DD"
 * @param {string} args.endDate End date filter string, format "YYYY-MM-DD"
 * @returns {Promise<object>} Related letters data response from API
 */
export async function getRelatedLetters({ uri, page, startDate, endDate }) {
    const pageQuery = page ? `&page=${page}` : "";
    const startDateQuery = startDate ? `&start_date=${startDate}` : "";
    const endDateQuery = endDate ? `&end_date=${endDate}` : "";
    const data = await fetch(
        `${uri}${pageQuery}${startDateQuery}${endDateQuery}`,
    );
    return data.json();
}
