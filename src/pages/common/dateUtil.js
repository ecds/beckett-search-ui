/**
 * Format a date string (that is accepted by Date constructor) to the format
 * "22 March 1929"
 *
 * @param {string} date Date as string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const month = new Intl.DateTimeFormat("en-US", {
        month: "long",
    }).format(d);
    return `${d.getDate()} ${month} ${d.getFullYear()}`;
};
