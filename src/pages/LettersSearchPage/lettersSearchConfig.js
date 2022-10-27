import { RefinementSelectFacet } from "@ecds/searchkit-sdk";
import { buildQuery } from "../common/queryBuilder";

// kewyord field names to search on
const fields = [
    { name: "recipients", boost: 2 },
    { name: "destinations", boost: 1 },
    { name: "origins", boost: 1 },
    { name: "mentions", boost: 1 },
    { name: "repositories", boost: 1 },
];

// search analyzers from seachkick, see
// https://www.rubydoc.info/gems/searchkick/0.1.3/Searchkick%2FSearch:search
const analyzers = ["searchkick_search", "searchkick_search2"];

// Config for Searchkit SDK; see https://searchkit.co/docs/core/reference/searchkit-sdk
export const lettersSearchConfig = {
    host: import.meta.env.VITE_SEARCHKIT_ENDPOINT,
    connectionOptions: {
        headers: {
            authorization: `ApiKey ${import.meta.env.VITE_SEARCHKIT_API_KEY}`,
        },
    },
    index: import.meta.env.VITE_SEARCHKIT_LETTERS_INDEX,
    hits: {
        fields: ["id", "recipients", "repositories", "date"],
    },
    query: buildQuery({ analyzers, fields }),
    facets: [
        // TODO: Add this facet (and modify searchkit if necessary) when vaild values are determined
        // new RefinementSelectFacet({
        //     field: "volume",
        //     identifier: "volume",
        //     label: "Published Volume",
        //     multipleSelect: true,
        //     order: "value",
        //     size: 100,
        // }),
        new RefinementSelectFacet({
            field: "language",
            identifier: "language",
            label: "Language",
            multipleSelect: true,
            order: "value",
            size: 100,
            display: "CustomListFacet",
        }),
        new RefinementSelectFacet({
            field: "repositories",
            identifier: "repository",
            label: "Repository",
            multipleSelect: true,
            order: "count",
            size: 200,
            display: "CustomListFacet",
        }),
    ],
    sortOptions: [
        { id: "relevance", label: "Relevance", field: "_score" },
        { id: "date", label: "Date", field: { date: "asc" } },
    ],
    /**
     * Appends { published: true } filter and sorts by date when there is no query term.
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
                },
            },
            sort: [{ date: "asc" }],
        }),
};
