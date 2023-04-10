import moment from "moment";

/**
 * Converts the current search state to a URL route.
 * Adapted from https://searchkit.co/docs/core/guides/url-synchronization
 *
 * @param {object} searchState Current search state
 * @returns {object} Route object
 */
export function stateToRoute(searchState) {
    // construct the routeState (adapted from Searchkit docs)
    const routeState = {
        query: searchState.query,
        sort: searchState.sortBy,
        size: Number(searchState.page?.size) || 25,
        from: Number(searchState.page?.from),
        scope: searchState.scope,
        op: searchState.operator,
    };
    searchState.filters.forEach((filter) => {
        // simplify filter representation
        // date filter is formatted differently
        if (filter.identifier === "start_date") {
            routeState.dateMin = filter.dateMin
                ? moment.utc(filter.dateMin).format("YYYY-MM-DD")
                : undefined;
        } else if (filter.identifier === "end_date") {
            routeState.dateMax = filter.dateMax
                ? moment.utc(filter.dateMax).format("YYYY-MM-DD")
                : undefined;
        } else if (filter.identifier === "start_year") {
            routeState.yearMin = filter.yearMin ? filter.yearMin : undefined;
        } else if (filter.identifier === "end_year") {
            routeState.yearMax = filter.yearMax ? filter.yearMax : undefined;
        } else if (filter.value) {
            if (Object.hasOwn(routeState, filter.identifier)) {
                routeState[filter.identifier].push(filter.value);
            } else {
                routeState[filter.identifier] = [filter.value];
            }
        }
    });
    // transform into the object to pass to createURL (adapted from Searchkit docs)
    return Object.keys(routeState).reduce((sum, key) => {
        const s = sum;
        if (
            (Array.isArray(routeState[key]) && routeState[key].length > 0) ||
            (!Array.isArray(routeState[key]) && !!routeState[key])
        ) {
            s[key] = routeState[key];
        }
        return s;
    }, {});
}
/**
 * Converts the current URL route to a search state.
 * Adapted from https://searchkit.co/docs/core/guides/url-synchronization
 *
 * @param {URLSearchParams} route Route object containing query, sort, filters, etc.
 * @returns {object} Search state object
 */
export function routeToState(route) {
    // construct the searchState (adapted from Searchkit docs)
    const searchState = {
        query: route.get("query") || "",
        sortBy: route.get("sort") || "",
        page: {
            size: Number(route.get("size")) || 25,
            from: Number(route.get("from")) || 0,
        },
        scope: route.get("scope") || "",
        operator: route.get("op") || "",
        filters: [],
    };
    // get filters state back into format expected by Searchkit
    Array.from(route.entries())
        .filter(
            ([key, _val]) =>
                ![
                    "query", // only process filters, not query/sort/size/from/scope/operator
                    "sort",
                    "size",
                    "from",
                    "scope",
                    "op",
                    "dateMin", // also handle date filters separately
                    "dateMax",
                    "yearMin",
                    "yearMax",
                ].includes(key),
        )
        .forEach(([identifier, val]) => {
            // map each value of each filter to objects
            if (Array.isArray(val)) {
                val.forEach((value) => {
                    searchState.filters.push({
                        identifier,
                        value,
                    });
                });
            } else {
                searchState.filters.push({
                    identifier,
                    value: val,
                });
            }
        });
    if (route.has("dateMin")) {
        searchState.filters.push({
            identifier: "start_date",
            dateMin: moment.utc(route.get("dateMin")).toISOString(),
        });
    }
    if (route.has("dateMax")) {
        searchState.filters.push({
            identifier: "end_date",
            dateMax: moment.utc(route.get("dateMax")).toISOString(),
        });
    }
    if (route.has("yearMin")) {
        searchState.filters.push({
            identifier: "start_year",
            yearMin: route.get("yearMin"),
        });
    }
    if (route.has("yearMax")) {
        searchState.filters.push({
            identifier: "end_year",
            yearMax: route.get("yearMax"),
        });
    }
    return searchState;
}

/**
 * Check if the passed search state is the default search state, so that it does not
 * overwrite non-default state.
 *
 * @param {object} state The search state to check
 * @returns {boolean} True if the search state is the default, false if not
 */
export function isDefault(state) {
    return (
        !state.query &&
        (!state.filters || state.filters.length === 0) &&
        (!state.sortBy || state.sortBy === "date_asc") &&
        (!state.operator || state.operator === "or") &&
        state.page?.from === 0
    );
}

/**
 * Convert a sort state to a sortBy string to use in URL routing.
 *
 * @param {object} sortState The sort state to convert
 * @returns {string} String representation of the sort for URL routing
 */
export function getSortByFromState(sortState) {
    let sortBy = sortState?.field;
    // relevance does not use direction
    if (sortState.direction && sortBy !== "relevance") {
        const dir = sortState.direction === 1 ? "asc" : "desc";
        sortBy = `${sortState.field}_${dir}`;
    }
    return sortBy;
}
