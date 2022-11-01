import { RefinementSelectFacet } from "@ecds/searchkit-sdk";
import { getEntitiesQuery } from "./entitiesQueryBuilder";

// kewyord field names to search on
const fields = [
    { name: "clean_label", boost: 10 },
    { name: "clean_description", boost: 5 },
    { name: "alternate_names", boost: 9 },
    { name: "alternate_spellings", boost: 8 },
];

// search analyzers from seachkick, see
// https://www.rubydoc.info/gems/searchkick/0.1.3/Searchkick%2FSearch:search
const analyzers = ["searchkick_search", "searchkick_search2"];

// Config for Searchkit SDK; see https://searchkit.co/docs/core/reference/searchkit-sdk
export const entitiesSearchConfig = {
    host: import.meta.env.VITE_SEARCHKIT_ENDPOINT,
    connectionOptions: {
        headers: {
            authorization: `ApiKey ${import.meta.env.VITE_SEARCHKIT_API_KEY}`,
        },
    },
    index: import.meta.env.VITE_SEARCHKIT_ENTITIES_INDEX,
    hits: {
        fields: ["id", "short_display", "e_type"],
    },
    query: getEntitiesQuery({ analyzers, fields }),
    facets: [
        new RefinementSelectFacet({
            field: "e_type",
            identifier: "e_type",
            label: "Entity Type",
            multipleSelect: true,
            order: "value",
            size: 100, // Show at most 100 facets (there won't be that many!)
        }),
    ],
    /**
     * Appends { published: true } filter when there is no query term.
     * Also removes "generic" type from facet list.
     *
     * @param {object} body The original request body object
     * @returns The modified request body for ElasticSearch
     */
    postProcessRequest: (body) => (body?.query
        ? body
        : {
            ...body,
            query: {
                bool: {
                    must: [{ term: { published: true } }],
                    must_not: [{ term: { e_type: "generic" } }],
                },
            },
        }),
};
