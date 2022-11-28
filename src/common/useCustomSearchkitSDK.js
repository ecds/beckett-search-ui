import createInstance from "@ecds/searchkit-sdk";
import { useEffect, useState } from "react";
import moment from "moment";
import { buildQuery } from "./queryBuilder";

/**
 * Hook that performs a search using chosen configuration.
 * Adapted from @searchkit/sdk, but customized to allow changing operator.
 *
 * @param {object} kwargs Object of options for the hook
 * @param {Array<string>} kwargs.analyzers List of input analyzer names
 * @param {object} kwargs.config Initial search config
 * @param {Array<object>} kwargs.fields List of Field objects ({ name, boost })
 * @param {string} kwargs.operator Search operator
 * @param {object} kwargs.variables Search state variables
 * @returns {object} Response in the form { results: SearchkitResponse; loading: boolean }
 */
export const useCustomSearchkitSDK = ({
    config,
    analyzers,
    fields,
    variables,
    operator,
}) => {
    const [results, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(null);
    const [dateRangeLoading, setDateRangeLoading] = useState(true);

    if (config?.name === "letters") {
        // initial request to get global date range with no filters/query
        useEffect(() => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            async function fetchData() {
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
            fetchData();
        }, []); // (perform once, on page render)
    }

    // other requests with filters applied, if/whenever they change
    useEffect(() => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        async function fetchData(vars, oper) {
            setLoading(true);
            const request = createInstance({
                ...config,
                query: buildQuery({ analyzers, fields, operator: oper }),
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

        if (variables) {
            fetchData(variables, operator);
        }
    }, [variables, operator]);

    return {
        results,
        loading,
        dateRange,
        dateRangeLoading,
    };
};
