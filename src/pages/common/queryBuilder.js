import { CustomQuery } from "@ecds/searchkit-sdk";

/**
 * Given a list of Field objects ({ name, boost }), the name of an analyzer for input,
 * and a search query term, returns a list of ElasticSearch match queries.
 *
 * @param {object} kwargs Object of keyword arguments
 * @param {string} kwargs.analyzer Analyzer name
 * @param {Array<object>} kwargs.fields Field objects ({ name, boost })
 * @param {string} kwargs.query Query string
 * @returns {Array<object>} Array of ElasticSearch "match" query objects
 */
export function buildMatchQueries({ analyzer, fields, query }) {
    // match query adapted from searchkick rails library
    return fields.map((field) => ({
        match: {
            [`${field.name}.analyzed`]: {
                query,
                boost: field.boost * 10,
                operator: "or", // TODO: support "and" operator
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
 * @returns {CustomQuery} Custom query to pass back to Searchkit config
 */
function buildQuery({ analyzers, fields }) {
    return new CustomQuery({
        /**
         * Given a query string, returns the bool object for ElasticSearch containing
         * the query with the published filter applied.
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
                    // filter to only "published" records
                    filter: {
                        term: {
                            published: {
                                value: true,
                            },
                        },
                    },
                    // ensure at least one "should", not only the filter, is applied
                    minimum_should_match: 1,
                },
            };
        },
    });
}

export { buildQuery };
