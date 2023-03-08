import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { datesValid, routeToState, stateToRoute } from "../../common";

/**
 * Hook to abstract year filter state management away from the Letters search page component.
 * Interfaces with Searchkit API to valiyear, read, and write start/end year filters; handles
 * search URL query params; and uses effects to ensure synchronization between frontend state
 * and Searchkit search state.
 *
 * @returns {Array<object, Function>} An array containing the current year frontend state and
 * the setState function for it.
 */
export function useYearFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    // if a filter already present on initialization, set initial state to that range
    const [yearRange, setYearRange] = useState({
        startYear: searchParams?.has("yearMin")
            ? searchParams.get("yearMin")
            : "",
        endYear: searchParams?.has("yearMax")
            ? searchParams.get("yearMax")
            : "",
    });

    // update filters when range is changed (to a valid range)
    useEffect(() => {
        if (
            (yearRange?.startYear || yearRange?.endYear)
            && (
              // only set new year range once all 4 digits of year are entered
                (!yearRange.startYear || yearRange.startYear > 999)
                && (!yearRange.endYear || yearRange.endYear > 999)
              )
            && (
                (yearRange?.startYear !== searchParams.get("yearMin"))
              || (yearRange?.endYear !== searchParams.get("yearMax"))
              || !yearRange.startYear
              || !yearRange.endYear
            )
            && datesValid(yearRange)
        ) {
            setSearchParams((prevParams) => {
                // ensure other params don't get lost
                const state = routeToState(prevParams);
                let prevStart;
                let prevEnd;
                // remove start and end year from search params
                if (prevParams.has("yearMin")) {
                    prevStart = prevParams.get("yearMin");
                    state.filters = state.filters.filter(
                        (f) => f.identifier !== "start_year",
                    );
                }
                if (prevParams.has("yearMax")) {
                    prevEnd = prevParams.get("yearMax");
                    state.filters = state.filters.filter(
                        (f) => f.identifier !== "end_year",
                    );
                }
                // add each back if selected
                if (yearRange.startYear || yearRange.startYear == 0) {
                    state.filters.push({
                        identifier: "start_year",
                        yearMin: yearRange.startYear,
                    });
                }
                if (yearRange.endYear) {
                    state.filters.push({
                        identifier: "end_year",
                        yearMax: yearRange.endYear,
                    });
                }
                // reset page to 0 if year filter changed, to avoid empty/nonexistent page
                let page = {};
                if (
                    yearRange?.startYear !== prevStart
                    || yearRange?.endYear !== prevEnd
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
    }, [yearRange]);

    return [yearRange, setYearRange];
}
