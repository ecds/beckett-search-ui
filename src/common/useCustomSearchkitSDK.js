import createInstance from "@ecds/searchkit-sdk";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { buildQuery } from "./queryBuilder";
import { routeToState } from "./searchRouting";

/**
 * Hook that performs a search using chosen configuration.
 * Adapted from @searchkit/sdk, but customized to allow changing operator.
 *
 * @param {object} kwargs Object of options for the hook
 * @param {Array<string>} kwargs.analyzers List of input analyzer names
 * @param {object} kwargs.config Initial search config
 * @param {Array<object>} kwargs.fields List of Field objects ({ name, boost })
 * @returns {object} Response in the form { results: SearchkitResponse; loading: boolean }
 */
export const useCustomSearchkitSDK = ({
    config,
    analyzers,
    fields,
}) => {
    const [results, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(null);
    const [dateRangeLoading, setDateRangeLoading] = useState(true);
    const [searchParams, _] = useSearchParams();
    const [yearRange, setYearRange] = useState(null);

    if (config?.name === "letters") {
        // initial request to get global date range with no filters/query
        useEffect(() => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            async function fetchDateData() {
                setDateRangeLoading(true);
                const request = createInstance({
                    ...config,
                    query: buildQuery({ analyzers, fields }),
                });
                const response = await request.execute({
                    facets: true,
                    hits: { size: 0 },
                });
                // get min and max date facet values
                const min = response?.facets?.find((f) => f.identifier === "min_date")
                    ?.value || null;
                const minDate = min ? moment(min) : null;
                const max = response?.facets?.find((f) => f.identifier === "max_date")
                    ?.value || null;
                const maxDate = max ? moment(max) : null;
                setDateRange({ minDate, maxDate });
                setDateRangeLoading(false);
            }
            fetchDateData();
        }, []); // (perform once, on page render)
    }

    if (config?.name === "entities") {
        // initial request to get global year range with no filters/query
        useEffect(() => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            async function fetchYearData() {
                const request = createInstance({
                    ...config,
                    query: buildQuery({ analyzers, fields }),
                });
                const response = await request.execute({
                    facets: true,
                    hits: { size: 0 },
                });
                // get min and max year facet values
                const minYear = response?.facets?.find((f) => f.identifier === "min_year")
                    ?.value || null;
                const maxYear = response?.facets?.find((f) => f.identifier === "max_year")
                    ?.value || null;
                setYearRange({ minYear, maxYear });
            }
            fetchYearData();
        }, []); // (perform once, on page render)
    }

    // other requests with filters applied, if/whenever they change
    useEffect(() => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        async function fetchData(vars) {
            setLoading(true);
            const request = createInstance({
                ...config,
                query: buildQuery({
                    analyzers,
                    fields:
                        !vars.scope || vars.scope === "keyword"
                            ? fields
                            : [{ name: vars.scope, boost: 10 }],
                    operator: vars.operator || "or",
                }),
            })
                .query(vars.query)
                .setFilters(vars.filters)
                .setSortBy(vars.sortBy);

            const response = await request.execute({
                facets: true,
                hits: {
                    size: vars.page.size,
                    from: vars.page.from,
                },
            });
            setLoading(false);
            setResponse(response);
        }
        if (searchParams) {
            fetchData(routeToState(searchParams));
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
