/**
 * Utilities for building Elasticsearch 8 queries and transforming responses.
 * Replaces the @searchkit/sdk query execution layer.
 */

/**
 * Build ES 8 filter clauses for the given facets and active search filters.
 *
 * @param {Array<object>} facets Facet instances
 * @param {Array<object>} activeFilters Active search filters
 * @returns {Array<object>} Array of ES filter clause objects
 */
function buildFilterClauses(facets, activeFilters) {
    const clauses = [];
    for (const facet of facets) {
        const relevant = activeFilters.filter(
            (f) => f.identifier === facet.getIdentifier(),
        );
        if (relevant.length) {
            const clause = facet.getFilters(relevant);
            if (clause) clauses.push(clause);
        }
    }
    return clauses;
}

/**
 * Build ES 8 aggregations, wrapping each in a filter that excludes its own
 * active filters so that facet counts reflect all other active constraints
 * (standard faceted-navigation pattern).
 *
 * @param {Array<object>} facets Facet instances
 * @param {Array<object>} activeFilters Active search filters
 * @returns {object} ES aggregations object
 */
function buildAggregations(facets, activeFilters) {
    const aggs = {};
    for (const facet of facets) {
        const innerAgg = facet.getAggregation();
        if (!innerAgg || !Object.keys(innerAgg).length) continue;

        if (facet.excludeOwnFilters) {
            const otherFilters = buildFilterClauses(
                facets.filter((f) => f.getIdentifier() !== facet.getIdentifier()),
                activeFilters,
            );
            if (otherFilters.length > 0) {
                const id = facet.getIdentifier();
                aggs[`${id}_wrapper`] = {
                    filter: { bool: { filter: otherFilters } },
                    aggs: innerAgg,
                };
            } else {
                Object.assign(aggs, innerAgg);
            }
        } else {
            Object.assign(aggs, innerAgg);
        }
    }
    return aggs;
}

/**
 * Extract the aggregation result for a facet, unwrapping any filter wrapper.
 *
 * @param {object} aggregations ES 8 aggregations response
 * @param {string} identifier Facet identifier
 * @returns {object} Aggregation result
 */
function extractAggResult(aggregations, identifier) {
    if (!aggregations) return {};
    const wrapperKey = `${identifier}_wrapper`;
    if (aggregations[wrapperKey]) {
        return aggregations[wrapperKey][identifier] ?? {};
    }
    return aggregations[identifier] ?? {};
}

/**
 * Build the ES 8 sort array from the sort config and current sortBy string.
 *
 * @param {Array<object>} sortOptions Config sort options array
 * @param {string} sortBy Current sort identifier
 * @returns {Array<object>} ES sort array
 */
function buildSort(sortOptions, sortBy) {
    if (!sortBy) {
        const defaultOption = sortOptions?.find((o) => o.defaultOption);
        if (defaultOption) {
            return defaultOption.field === "_score"
                ? [{ _score: "desc" }]
                : [defaultOption.field];
        }
        return [{ _score: "desc" }];
    }
    const option = sortOptions?.find((o) => o.id === sortBy);
    if (!option) return [{ _score: "desc" }];
    return option.field === "_score" ? [{ _score: "desc" }] : [option.field];
}

/**
 * Build the list of applied-filter display objects from active filters.
 *
 * @param {Array<object>} facets Facet instances
 * @param {Array<object>} activeFilters Active search filters
 * @returns {Array<object>} Applied filter display objects
 */
function buildAppliedFilters(facets, activeFilters) {
    const applied = [];
    for (const facet of facets) {
        const relevant = activeFilters.filter(
            (f) => f.identifier === facet.getIdentifier(),
        );
        for (const filter of relevant) {
            if (facet.getSelectedFilter) {
                applied.push(facet.getSelectedFilter(filter));
            }
        }
    }
    return applied;
}

/**
 * Execute an Elasticsearch 8 search request and return a transformed response
 * that matches the shape the UI components expect.
 *
 * @param {object} kwargs Arguments object
 * @param {object} kwargs.config Search configuration (host, index, connectionOptions, etc.)
 * @param {object} kwargs.searchState Current search state (query, filters, page, sortBy)
 * @param {Array<object>} kwargs.facets Facet instances
 * @param {Function} [kwargs.queryFn] Optional query-DSL builder; overrides config.query
 * @returns {Promise<object>} Transformed search response
 */
export async function executeSearch({ config, searchState, facets, queryFn }) {
    const { query, filters = [], page, sortBy } = searchState;

    const buildDSL = queryFn ?? config.query;
    const queryDSL = query ? buildDSL(query) : { match_all: {} };
    const filterClauses = buildFilterClauses(facets, filters);

    const esBody = {
        query:
            filterClauses.length > 0
                ? { bool: { must: queryDSL, filter: filterClauses } }
                : queryDSL,
        aggs: buildAggregations(facets, filters),
        sort: buildSort(config.sortOptions, sortBy),
        from: page?.from ?? 0,
        size: page?.size ?? 25,
        track_total_hits: true,
    };

    if (config.hits?.fields) {
        esBody._source = config.hits.fields;
    }

    const response = await fetch(
        `${config.host}/${config.index}/_search`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...config.connectionOptions?.headers,
            },
            body: JSON.stringify(esBody),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Elasticsearch request failed: ${response.status} ${response.statusText}`,
        );
    }

    const esResponse = await response.json();
    const total = esResponse.hits?.total?.value ?? 0;
    const size = page?.size ?? 25;
    const from = page?.from ?? 0;

    const hits = (esResponse.hits?.hits ?? []).map((hit) => ({
        id: hit._id,
        fields: Object.fromEntries(
            (config.hits?.fields ?? []).map((f) => [f, hit._source?.[f]]),
        ),
        rawHit: hit._source,
    }));

    const facetResults = facets.map((facet) => {
        const aggResult = extractAggResult(
            esResponse.aggregations,
            facet.getIdentifier(),
        );
        return facet.transformResponse(aggResult);
    });

    return {
        summary: {
            total,
            appliedFilters: buildAppliedFilters(facets, filters),
            query,
        },
        hits: {
            items: hits,
            page: {
                total,
                totalPages: Math.ceil(total / size),
                pageNumber: Math.floor(from / size),
                size,
                from,
            },
        },
        facets: facetResults,
    };
}
