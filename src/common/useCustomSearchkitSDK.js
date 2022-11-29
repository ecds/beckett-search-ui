import createInstance from "@ecds/searchkit-sdk";
import { useEffect, useState } from "react";
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
 * @param {string?} kwargs.scope An optional argument to limit the search to a single field
 * @returns {object} Response in the form { results: SearchkitResponse; loading: boolean }
 */
export const useCustomSearchkitSDK = ({
    config,
    analyzers,
    fields,
    variables,
    operator,
    scope,
}) => {
    const [results, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        async function fetchData(vars, oper) {
            setLoading(true);
            const request = createInstance({
                ...config,
                query: buildQuery({
                    analyzers,
                    fields:
                        !scope || scope === "keyword"
                            ? fields
                            : [{ name: scope, boost: 10 }],
                    operator: oper,
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

        if (variables) {
            fetchData(variables, operator);
        }
    }, [variables, operator]);

    return { results, loading };
};
