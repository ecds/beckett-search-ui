import { afterEach, describe, expect, it, vi } from "vitest";

import { executeSearch } from "./elasticsearchAdapter";
import { RefinementSelectFacet } from "./facets";

const config = {
    host: "https://es.example.com",
    index: "letters",
    sortOptions: [
        { id: "date_asc", field: "date", defaultOption: true },
        { id: "relevance", field: "_score" },
    ],
    hits: { fields: ["title", "date"] },
};

const authorFacet = new RefinementSelectFacet({
    field: "author.raw",
    identifier: "author",
    label: "Author",
});

const esResponse = (overrides = {}) => ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () =>
        Promise.resolve({
            hits: {
                total: { value: 2 },
                hits: [
                    { _id: "1", _source: { title: "Letter One", date: "1929-01-01" } },
                    { _id: "2", _source: { title: "Letter Two", date: "1930-01-01" } },
                ],
            },
            aggregations: {
                author: { buckets: [{ key: "Beckett", doc_count: 2 }] },
            },
            ...overrides,
        }),
});

const stubFetch = (response) => {
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("executeSearch", () => {
    it("posts a match_all query with no filters when there is no query string", async () => {
        const fetchMock = stubFetch(esResponse());

        await executeSearch({
            config,
            searchState: { filters: [], page: { from: 0, size: 25 } },
            facets: [authorFacet],
        });

        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toBe("https://es.example.com/letters/_search");
        const body = JSON.parse(options.body);
        expect(body.query).toEqual({ match_all: {} });
    });

    it("builds a query via queryFn and wraps it with filter clauses when filters are active", async () => {
        const fetchMock = stubFetch(esResponse());
        const queryFn = vi.fn().mockReturnValue({ match: { title: "godot" } });

        await executeSearch({
            config,
            searchState: {
                query: "godot",
                filters: [{ identifier: "author", value: "Beckett" }],
                page: { from: 0, size: 25 },
            },
            facets: [authorFacet],
            queryFn,
        });

        expect(queryFn).toHaveBeenCalledWith("godot");
        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.query).toEqual({
            bool: {
                must: { match: { title: "godot" } },
                filter: [{ term: { "author.raw": "Beckett" } }],
            },
        });
    });

    it("wraps aggregations to exclude a facet's own active filters", async () => {
        const fetchMock = stubFetch(esResponse());
        const languageFacet = new RefinementSelectFacet({
            field: "language.raw",
            identifier: "language",
            label: "Language",
        });

        await executeSearch({
            config,
            searchState: {
                filters: [{ identifier: "author", value: "Beckett" }],
                page: { from: 0, size: 25 },
            },
            facets: [authorFacet, languageFacet],
        });

        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        // "author"'s own aggregation is unwrapped (no other facets constrain it)
        expect(body.aggs.author).toBeDefined();
        // "language"'s aggregation is wrapped in a filter excluding the author filter
        expect(body.aggs.language_wrapper).toEqual({
            filter: { bool: { filter: [{ term: { "author.raw": "Beckett" } }] } },
            aggs: { language: expect.any(Object) },
        });
    });

    it("resolves the sort array from the default sort option when sortBy is absent", async () => {
        const fetchMock = stubFetch(esResponse());

        await executeSearch({
            config,
            searchState: { filters: [], page: {} },
            facets: [],
        });

        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.sort).toEqual(["date"]);
    });

    it("resolves _score sort to { _score: 'desc' }", async () => {
        const fetchMock = stubFetch(esResponse());

        await executeSearch({
            config,
            searchState: { filters: [], page: {}, sortBy: "relevance" },
            facets: [],
        });

        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.sort).toEqual([{ _score: "desc" }]);
    });

    it("defaults page.from to 0 and page.size to 25", async () => {
        const fetchMock = stubFetch(esResponse());

        await executeSearch({
            config,
            searchState: { filters: [] },
            facets: [],
        });

        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.from).toBe(0);
        expect(body.size).toBe(25);
    });

    it("throws when the response is not ok", async () => {
        stubFetch({ ok: false, status: 500, statusText: "Internal Server Error" });

        await expect(
            executeSearch({
                config,
                searchState: { filters: [], page: {} },
                facets: [],
            }),
        ).rejects.toThrow("Elasticsearch request failed: 500 Internal Server Error");
    });

    it("reshapes hits, pagination math, applied filters, and facet results", async () => {
        stubFetch(esResponse());

        const result = await executeSearch({
            config,
            searchState: {
                filters: [{ identifier: "author", value: "Beckett" }],
                page: { from: 25, size: 25 },
            },
            facets: [authorFacet],
        });

        expect(result.hits.items).toEqual([
            {
                id: "1",
                fields: { title: "Letter One", date: "1929-01-01" },
                rawHit: { title: "Letter One", date: "1929-01-01" },
            },
            {
                id: "2",
                fields: { title: "Letter Two", date: "1930-01-01" },
                rawHit: { title: "Letter Two", date: "1930-01-01" },
            },
        ]);
        expect(result.hits.page).toEqual({
            total: 2,
            totalPages: 1,
            pageNumber: 1,
            size: 25,
            from: 25,
        });
        expect(result.summary.total).toBe(2);
        expect(result.summary.appliedFilters).toEqual([
            {
                type: "ValueSelectedFilter",
                id: "author_Beckett",
                identifier: "author",
                label: "Author",
                value: "Beckett",
                display: "ListFacet",
            },
        ]);
        expect(result.facets).toEqual([
            {
                identifier: "author",
                label: "Author",
                type: "RefinementSelectFacet",
                display: "ListFacet",
                entries: [{ label: "Beckett", count: 2 }],
            },
        ]);
    });
});
