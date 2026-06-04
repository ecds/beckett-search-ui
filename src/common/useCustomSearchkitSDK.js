import { useEffect, useState } from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { buildQuery } from "./queryBuilder";
import { routeToState } from "./searchRouting";
import { executeSearch } from "./elasticsearchAdapter";

/**
 * Hook that performs a search against Elasticsearch 8 using the provided configuration.
 *
 * @param {object} kwargs Object of options for the hook
 * @param {Array<string>} kwargs.analyzers List of input analyzer names
 * @param {object} kwargs.config Search config (host, index, facets, sortOptions, etc.)
 * @param {Array<object>} kwargs.fields List of Field objects ({ name, boost })
 * @returns {object} Response in the form { results, loading, dateRange, dateRangeLoading, yearRange }
 */
export const useCustomSearchkitSDK = ({ config, analyzers, fields }) => {
    const [results, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(null);
    const [dateRangeLoading, setDateRangeLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [yearRange, setYearRange] = useState(null);

    if (config?.name === "letters") {
        // One-time request on mount to get the global date range (no filters/query).
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            async function fetchDateData() {
                setDateRangeLoading(true);
                const response = await executeSearch({
                    config,
                    searchState: { query: "", filters: [], page: { size: 0, from: 0 } },
                    facets: config.facets,
                });
                // get min and max date facet values
                const min =
                    response?.facets?.find((f) => f.identifier === "min_date")
                        ?.value ?? null;
                const max =
                    response?.facets?.find((f) => f.identifier === "max_date")
                        ?.value ?? null;
                setDateRange({
                    minDate: min ? moment.utc(min) : null,
                    maxDate: max ? moment.utc(max) : null,
                });
                setDateRangeLoading(false);
            }
            fetchDateData();
        }, []); // (perform once, on page render)
    }

    if (config?.name === "entities") {
        // One-time request on mount to get the global year range (no filters/query).
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            async function fetchYearData() {
                const response = await executeSearch({
                    config,
                    searchState: { query: "", filters: [], page: { size: 0, from: 0 } },
                    facets: config.facets,
                });
                // get min and max year facet values
                const minYear =
                    response?.facets?.find((f) => f.identifier === "min_year")
                        ?.value ?? null;
                const maxYear =
                    response?.facets?.find((f) => f.identifier === "max_year")
                        ?.value ?? null;
                setYearRange({ minYear, maxYear });
            }
            fetchYearData();
        }, []); // (perform once, on page render)
    }

    // Main search request — re-fires whenever URL search params change.
    useEffect(() => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        async function fetchData() {
            setLoading(true);
            const searchState = routeToState(searchParams);
            // Scope narrows the searched fields; operator comes from URL state.
            const scopeFields =
                !searchState.scope || searchState.scope === "keyword"
                    ? fields
                    : [{ name: searchState.scope, boost: 10 }];
            const queryFn = buildQuery({
                analyzers,
                fields: scopeFields,
                operator: searchState.operator || "or",
            });
            const response = await executeSearch({
                config,
                searchState,
                facets: config.facets,
                queryFn,
            });
            setLoading(false);
            setResponse(response);
        }
        if (searchParams) {
            fetchData();
        }
    }, [searchParams]);

    return {
        results,
        loading,
        dateRange,
        dateRangeLoading,
        yearRange,
    };
};
