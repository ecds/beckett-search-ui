import { RefinementSelectFacet } from "@searchkit/sdk";
import { buildQuery } from "../../common";
import { CustomYearRangeFacet } from "./CustomYearRangeFacet";
import { MinMaxYearFacet } from "./MinMaxYearFacet";

// kewyord field names to search on
export const fields = [
    { name: "clean_label", boost: 20 },
    { name: "short_display", boost: 11 },
    { name: "full_display", boost: 10 },
    { name: "clean_description", boost: 5 },
    { name: "alternate_names", boost: 9 },
    { name: "alternate_spellings", boost: 8 },
];

// search scopes (keyword search, label search)
// values besides "keyword" must match names of fields in the index
export const scopeOptions = [
    { value: "keyword", text: "Keyword" },
    { value: "clean_label", text: "Label" },
];

// search analyzers from seachkick, see
// https://www.rubydoc.info/gems/searchkick/0.1.3/Searchkick%2FSearch:search
export const analyzers = ["searchkick_search", "searchkick_search2"];

// Config for Searchkit SDK; see https://searchkit.co/docs/core/reference/@searchkit/sdk
export const entitiesSearchConfig = {
    name: "entities",
    host: import.meta.env.VITE_SEARCHKIT_ENDPOINT,
    connectionOptions: {
        headers: {
            authorization: `ApiKey ${import.meta.env.VITE_SEARCHKIT_API_KEY}`,
        },
    },
    index: import.meta.env.VITE_SEARCHKIT_ENTITIES_INDEX,
    hits: {
        fields: [
            "artists",
            "attended_with",
            "authors",
            "clean_label",
            "composers",
            "countries",
            "directors",
            "e_type",
            "event_type",
            "id",
            "performed_by",
            "place",
            "places",
            "short_display",
            "translated_into",
            "translators",
            "years",
        ],
    },
    query: buildQuery({ analyzers, fields }),
    facets: [
        new CustomYearRangeFacet({
            field: "years",
            identifier: "start_year",
            label: "Start year",
        }),
        new CustomYearRangeFacet({
            field: "years",
            identifier: "end_year",
            label: "End year",
        }),
        new MinMaxYearFacet({
            field: "years",
            identifier: "min_year",
            minMax: "min",
        }),
        new MinMaxYearFacet({
            field: "years",
            identifier: "max_year",
            minMax: "max",
        }),
        new RefinementSelectFacet({
            field: "e_type",
            identifier: "e_type",
            label: "Entity Type",
            multipleSelect: false,
            order: "value",
            size: 100, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "artists",
            identifier: "artists",
            label: "Artists",
            multipleSelect: true,
            order: "value",
            size: 300, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "attended_with",
            identifier: "attended_with",
            label: "Attended with",
            multipleSelect: true,
            order: "value",
            size: 100, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "authors",
            identifier: "authors",
            label: "Authors",
            multipleSelect: true,
            order: "value",
            size: 900, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "composers",
            identifier: "composers",
            label: "Composers",
            multipleSelect: true,
            order: "value",
            size: 100, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "countries",
            identifier: "countries",
            label: "Countries",
            multipleSelect: true,
            order: "value",
            size: 100, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "directors",
            identifier: "directors",
            label: "Directors",
            multipleSelect: true,
            order: "value",
            size: 400, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "event_type",
            identifier: "event_type",
            label: "Event type",
            multipleSelect: true,
            order: "value",
            size: 100, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "performed_by",
            identifier: "performed_by",
            label: "Performed by",
            multipleSelect: true,
            order: "value",
            size: 700, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "place",
            identifier: "place",
            label: "Place",
            multipleSelect: true,
            order: "value",
            size: 200, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "places",
            identifier: "places",
            label: "Places",
            multipleSelect: true,
            order: "value",
            size: 250, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "translated_into",
            identifier: "translated_into",
            label: "Language translated into",
            multipleSelect: true,
            order: "value",
            size: 100, // Show at most n facets
        }),
        new RefinementSelectFacet({
            field: "translators",
            identifier: "translators",
            label: "Translators",
            multipleSelect: true,
            order: "value",
            size: 200, // Show at most n facets
        }),
    ],
    sortOptions: [
        { id: "relevance", label: "Relevance", field: "_score" },
        {
            id: "entity_asc",
            label: "Entity (Ascending)",
            field: { clean_label: "asc" },
            defaultOption: true,
        },
        {
            id: "entity_desc",
            label: "Entity (Descending)",
            field: { clean_label: "desc" },
        },
        {
            id: "type_asc",
            label: "Type (Ascending)",
            field: { e_type: "asc" },
        },
        {
            id: "type_desc",
            label: "Type (Descending)",
            field: { e_type: "desc" },
        },
    ],
};
