import { withSearchkitRouting } from "@searchkit/client";
import React from "react";
import moment from "moment";

/**
 * Higher-order component (HOC) for Searchkit routing. Just acts as a module for configuring
 * the existing withSearchkitRouting HOC.
 *
 * @param {React.Component} component The component to wrap in the HOC.
 * @returns {React.Component} The wrapped component.
 */
function withSearchRouting(component) {
    /**
     * Converts the current search state to a URL route.
     * Adapted from https://searchkit.co/docs/core/guides/url-synchronization
     *
     * @param {object} searchState Current search state
     * @returns {object} Route object
     */
    function stateToRoute(searchState) {
        // construct the routeState (adapted from Searchkit docs)
        const routeState = {
            query: searchState.query,
            sort: searchState.sortBy,
            size: Number(searchState.page?.size) || 25,
            from: Number(searchState.page?.from),
        };
        searchState.filters.forEach((filter) => {
            // simplify filter representation
            // date filter is formatted differently
            if (filter.dateMin || filter.dateMax) {
                routeState.dateMin = filter.dateMin
                    ? moment(new Date(filter.dateMin)).format("yyyy-MM-DD")
                    : undefined;
                routeState.dateMax = filter.dateMax
                    ? moment(new Date(filter.dateMax)).format("yyyy-MM-DD")
                    : undefined;
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
                (Array.isArray(routeState[key])
                    && routeState[key].length > 0)
                || (!Array.isArray(routeState[key]) && !!routeState[key])
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
     * @param {object} route Route object containing query, sort, filters, etc.
     * @returns {object} Search state object
     */
    function routeToState(route) {
        // construct the searchState (adapted from Searchkit docs)
        const searchState = {
            query: route.query || "",
            sortBy: route.sort,
            page: {
                size: Number(route.size) || 25,
                from: Number(route.from) || 0,
            },
            filters: [],
        };
        // get filters state back into format expected by Searchkit
        Object.entries(route)
            .filter(
                ([key, _val]) => ![
                    "query", // only process filters, not query/sort/size/from
                    "sort",
                    "size",
                    "from",
                    "dateMin", // handle date filters separately
                    "dateMax",
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
        if (route.dateMin || route.dateMax) {
            const { dateMin, dateMax } = route;
            searchState.filters.push({ identifier: "date", dateMin, dateMax });
        }
        return searchState;
    }

    /**
     * Constructs the URL from the routeState. adapted from defaultCreateURL, but using simpler
     * format for arrays (passing arrayFormat: "repeat" to the querystring module).
     *
     * @param {object} kwargs Object of keyword arguments.
     * @param {any} kwargs.qsModule The QueryString module to stringify objects into query strings.
     * @param {object} kwargs.routeState The route state created by stateToRoute.
     * @param {object} kwargs.location The current location object.
     * @returns {string} The resulting query URL.
     */
    function createURL({ qsModule, routeState, location }) {
        // adapted from searchkit/searchkit: packages/searchkit-client/src/history.ts
        if (location) {
            const {
                protocol, hostname, port = "", pathname, hash,
            } = location;
            const queryString = qsModule.stringify(routeState, {
                arrayFormat: "repeat",
            });
            const portWithPrefix = port === "" ? "" : `:${port}`;
            if (!queryString) {
                return `${protocol}//${hostname}${portWithPrefix}${pathname}${hash}`;
            }
            return `${protocol}//${hostname}${portWithPrefix}${pathname}?${queryString}${hash}`;
        }
        return `?${qsModule.stringify(routeState, { arrayFormat: "repeat" })}`;
    }

    return withSearchkitRouting(component, {
        stateToRoute,
        routeToState,
        createURL,
    });
}

export default withSearchRouting;
