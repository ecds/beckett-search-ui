import moment from "moment";

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

/**
 * Check if a single date or range of dates is valid
 *
 * @param {object} dates Destructured arguments object
 * @param {moment.Moment} dates.startDate Moment object for start date from date picker
 * @param {moment.Moment} dates.endDate Moment object for end date from date picker
 * @param {moment.Moment} dates.min Min date returned from API, converted to Moment object
 * @param {moment.Moment} dates.max Max date returned from API, converted to Moment object
 * @returns True if no start/end dates are present or if all dates are valid
 */
export const datesValid = ({
    startDate, endDate, min, max,
}) => (startDate && endDate ? startDate < endDate : true)
    && (startDate && max ? startDate <= max : true)
    && (endDate && min ? endDate >= min : true);
