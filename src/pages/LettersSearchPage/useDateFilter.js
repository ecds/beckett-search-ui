import { useState, useEffect } from "react";
import moment from "moment";
import { useSearchkit } from "@searchkit/client";
import { datesValid } from "../../common";

/**
 * Hook to abstract date filter state management away from the Letters search page component.
 * Interfaces with Searchkit API to validate, read, and write start/end date filters; handles
 * search URL query params; and uses effects to ensure synchronization between frontend state
 * and Searchkit search state.
 *
 * @returns {Array<object, Function>} An array containing the current date frontend state and
 * the setState function for it.
 */
export function useDateFilter() {
    const api = useSearchkit();
    const startDateFilters = api.getFiltersByIdentifier("start_date");
    const selectedStartDate = startDateFilters && startDateFilters[0];
    const endDateFilters = api.getFiltersByIdentifier("end_date");
    const selectedEndDate = endDateFilters && endDateFilters[0];

    // if a filter already present on initialization, set initial state to that range
    const [dateRange, setDateRange] = useState({
        startDate: selectedStartDate?.dateMin
            ? moment(selectedStartDate.dateMin)
            : null,
        endDate: selectedEndDate?.dateMax
            ? moment(selectedEndDate.dateMax)
            : null,
    });

    // update filters when range is changed (to a valid range)
    useEffect(() => {
        api.removeFiltersByIdentifier("start_date");
        api.removeFiltersByIdentifier("end_date");
        if (
            dateRange
            && (dateRange.startDate || dateRange.endDate)
            && datesValid({ ...dateRange })
        ) {
            if (dateRange.startDate) {
                api.addFilter({
                    identifier: "start_date",
                    dateMin: dateRange?.startDate?.toISOString(),
                });
            }
            if (dateRange.endDate) {
                api.addFilter({
                    identifier: "end_date",
                    dateMax: dateRange?.endDate?.toISOString(),
                });
            }
        }
        api.search();
    }, [dateRange]);

    // handle search state generated from URL query params
    useEffect(() => {
        if (
            (selectedStartDate?.dateMin && !dateRange.startDate)
            || (selectedEndDate?.dateMax && !dateRange.endDate)
        ) {
            setDateRange(() => ({
                startDate: selectedStartDate?.dateMin
                    ? moment(selectedStartDate.dateMin)
                    : null,
                endDate: selectedEndDate?.dateMax
                    ? moment(selectedEndDate.dateMax)
                    : null,
            }));
            api.search();
        }
    }, [selectedStartDate, selectedEndDate]);

    return [dateRange, setDateRange];
}
