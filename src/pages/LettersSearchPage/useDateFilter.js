import { useState, useEffect } from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { datesValid, routeToState, stateToRoute } from "../../common";

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
    const [searchParams, setSearchParams] = useSearchParams();

    // if a filter already present on initialization, set initial state to that range
    const [dateRange, setDateRange] = useState({
        startDate: searchParams?.has("dateMin")
            ? moment(searchParams.get("dateMin"))
            : null,
        endDate: searchParams?.has("dateMax")
            ? moment(searchParams.get("dateMax"))
            : null,
    });

    // update filters when range is changed (to a valid range)
    useEffect(() => {
        if (
            (dateRange?.startDate || dateRange?.endDate)
            && ((dateRange.startDate
                && dateRange.startDate.format("YYYY-MM-DD")
                    !== searchParams.get("dateMin"))
                || (dateRange.endDate
                    && dateRange.endDate.format("YYYY-MM-DD")
                        !== searchParams.get("dateMax"))
                || !dateRange.startDate
                || !dateRange.endDate)
            && datesValid(dateRange)
        ) {
            setSearchParams((prevParams) => {
                // ensure other params don't get lost
                const state = routeToState(prevParams);
                let prevStart;
                let prevEnd;
                // remove start and end date from search params
                if (prevParams.has("dateMin")) {
                    prevStart = prevParams.get("dateMin");
                    state.filters = state.filters.filter(
                        (f) => f.identifier !== "start_date",
                    );
                }
                if (prevParams.has("dateMax")) {
                    prevEnd = prevParams.get("dateMax");
                    state.filters = state.filters.filter(
                        (f) => f.identifier !== "end_date",
                    );
                }
                // add each back if selected
                if (dateRange.startDate) {
                    state.filters.push({
                        identifier: "start_date",
                        dateMin: dateRange?.startDate?.toISOString(),
                    });
                }
                if (dateRange.endDate) {
                    state.filters.push({
                        identifier: "end_date",
                        dateMax: dateRange?.endDate?.toISOString(),
                    });
                }
                // reset page to 0 if date filter changed, to avoid empty/nonexistent page
                let page = {};
                if (
                    dateRange?.startDate?.format("YYYY-MM-DD") !== prevStart
                    || dateRange?.endDate?.format("YYYY-MM-DD") !== prevEnd
                ) {
                    page = {
                        page: {
                            size: 25,
                            from: 0,
                        },
                    };
                }
                return stateToRoute({
                    ...state,
                    ...page,
                });
            });
        }
    }, [dateRange]);

    return [dateRange, setDateRange];
}
