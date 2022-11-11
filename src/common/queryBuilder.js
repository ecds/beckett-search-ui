import { CustomQuery } from "@ecds/searchkit-sdk";

/**
 * Given a list of Field objects ({ name, boost }), the name of an analyzer for input,
 * and a search query term, returns a list of ElasticSearch match queries.
 *
 * @param {object} kwargs Object of keyword arguments
 * @param {string} kwargs.analyzer Analyzer name
 * @param {Array<object>} kwargs.fields Field objects ({ name, boost })
 * @param {string} kwargs.query Query string
 * @param {string} kwargs.operator Search operator
 * @returns {Array<object>} Array of ElasticSearch "match" query objects
 */
export function buildMatchQueries({
    analyzer, fields, operator, query,
}) {
    // match query adapted from searchkick rails library
    return fields.map((field) => ({
        match: {
            [`${field.name}.analyzed`]: {
                query,
                boost: field.boost * 10,
                operator,
                analyzer,
            },
        },
    }));
}

/**
 * Given a list of Field objects ({ name, boost }) and input analyzer names, returns
 * the custom query for ElasticSearch/Searchkit.
 *
 * @param {object} kwargs Object of keyword arguments
 * @param {Array<string>} kwargs.analyzers List of input analyzer names
 * @param {Array<object>} kwargs.fields List of Field objects ({ name, boost })
 * @param {string} kwargs.operator Search operator
 * @returns {CustomQuery} Custom query to pass back to Searchkit config
 */
function buildQuery({ analyzers, fields, operator }) {
    return new CustomQuery({
        /**
         * Given a query string, returns the bool object for ElasticSearch containing
         * the query.
         *
         * @param {string} query The query string
         * @returns {object} The resulting query bool object for ElasticSearch.
         */
        queryFn: (query) => {
            // build array of match queries for each analyzer,
            // then flatten them into a single array of queries
            const queries = analyzers
                .map((analyzer) => buildMatchQueries({
                    analyzer,
                    fields,
                    operator: operator || "or",
                    query,
                }))
                .flat();
            return {
                bool: {
                    // should: dis_max adapted from searchkick rails library
                    should: [
                        {
                            dis_max: {
                                queries,
                            },
                        },
                    ],
                },
            };
        },
    });
}

export { buildQuery };
