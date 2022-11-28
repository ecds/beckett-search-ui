import { RefinementSelectFacet } from "@ecds/searchkit-sdk";
import { buildQuery } from "../../common/queryBuilder";
import { CustomDateRangeFacet } from "./CustomDateRangeFacet";
import { MinMaxDateFacet } from "./MinMaxDateFacet";

// kewyord field names to search on
export const fields = [
    { name: "recipients", boost: 2 },
    { name: "destinations", boost: 1 },
    { name: "origins", boost: 1 },
    { name: "mentions", boost: 1 },
    { name: "repositories", boost: 1 },
];

// search analyzers from seachkick, see
// https://www.rubydoc.info/gems/searchkick/0.1.3/Searchkick%2FSearch:search
export const analyzers = ["searchkick_search", "searchkick_search2"];

// Config for Searchkit SDK; see https://searchkit.co/docs/core/reference/searchkit-sdk
export const lettersSearchConfig = {
    name: "letters",
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
        new CustomDateRangeFacet({
            field: "date",
            identifier: "start_date",
            label: "Date",
        }),
        new CustomDateRangeFacet({
            field: "date",
            identifier: "end_date",
            label: "Date",
        }),
        new MinMaxDateFacet({
            field: "date",
            identifier: "min_date",
            label: "Minimum Date",
            minMax: "min",
        }),
        new MinMaxDateFacet({
            field: "date",
            identifier: "max_date",
            label: "Maximum Date",
            minMax: "max",
        }),
        new RefinementSelectFacet({
            field: "volume",
            identifier: "volume",
            label: "Published Volume",
            multipleSelect: true,
            order: "value",
            size: 100,
            display: "CustomListFacet",
        }),
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
        {
            id: "date_asc",
            label: "Date (Ascending)",
            field: { date: "asc" },
            defaultOption: true,
        },
        {
            id: "date_desc",
            label: "Date (Descending)",
            field: { date: "desc" },
        },
        {
            id: "recipient_asc",
            label: "Recipient (Ascending)",
            field: { recipients: "asc" },
        },
        {
            id: "recipient_desc",
            label: "Recipient (Descending)",
            field: { recipients: "desc" },
        },
        {
            id: "repository_asc",
            label: "Recipient (Ascending)",
            field: { repositories: "asc" },
        },
        {
            id: "repository_desc",
            label: "Recipient (Descending)",
            field: { repositories: "desc" },
        },
    ],
};
