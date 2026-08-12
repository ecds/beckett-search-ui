import { describe, expect, it } from "vitest";

import { RefinementSelectFacet } from "./facets";

const makeFacet = (overrides = {}) =>
    new RefinementSelectFacet({
        field: "author.raw",
        identifier: "author",
        label: "Author",
        ...overrides,
    });

describe("RefinementSelectFacet", () => {
    it("defaults to excluding its own filters from facet counts", () => {
        expect(makeFacet().excludeOwnFilters).toBe(true);
    });

    describe("getAggregation", () => {
        it("orders by count desc by default, with a default size of 10", () => {
            expect(makeFacet().getAggregation()).toEqual({
                author: {
                    terms: { field: "author.raw", size: 10, order: { _count: "desc" } },
                },
            });
        });

        it("orders by key asc when order is 'value', honoring a custom size", () => {
            expect(makeFacet({ order: "value", size: 5 }).getAggregation()).toEqual({
                author: {
                    terms: { field: "author.raw", size: 5, order: { _key: "asc" } },
                },
            });
        });
    });

    describe("getFilters", () => {
        it("returns null when there are no values", () => {
            expect(makeFacet().getFilters([])).toBeNull();
        });

        it("builds a term clause for a single-select facet", () => {
            expect(makeFacet().getFilters([{ value: "Beckett" }])).toEqual({
                term: { "author.raw": "Beckett" },
            });
        });

        it("uses only the first value for a single-select facet even with multiple filters", () => {
            expect(
                makeFacet().getFilters([{ value: "Beckett" }, { value: "Joyce" }]),
            ).toEqual({ term: { "author.raw": "Beckett" } });
        });

        it("builds a terms clause for a multi-select facet", () => {
            const facet = makeFacet({ multipleSelect: true });
            expect(
                facet.getFilters([{ value: "Beckett" }, { value: "Joyce" }]),
            ).toEqual({ terms: { "author.raw": ["Beckett", "Joyce"] } });
        });
    });

    describe("getSelectedFilter", () => {
        it("builds a display object for the selected value", () => {
            expect(makeFacet().getSelectedFilter({ value: "Beckett" })).toEqual({
                type: "ValueSelectedFilter",
                id: "author_Beckett",
                identifier: "author",
                label: "Author",
                value: "Beckett",
                display: "ListFacet",
            });
        });

        it("honors a custom display hint", () => {
            expect(
                makeFacet({ display: "CheckboxFacet" }).getSelectedFilter({
                    value: "Beckett",
                }).display,
            ).toBe("CheckboxFacet");
        });
    });

    describe("transformResponse", () => {
        it("maps buckets to label/count entries", () => {
            const result = makeFacet().transformResponse({
                buckets: [
                    { key: "Beckett", doc_count: 12 },
                    { key: "Joyce", doc_count: 3 },
                ],
            });
            expect(result).toEqual({
                identifier: "author",
                label: "Author",
                type: "RefinementSelectFacet",
                display: "ListFacet",
                entries: [
                    { label: "Beckett", count: 12 },
                    { label: "Joyce", count: 3 },
                ],
            });
        });

        it("returns an empty entries array when there are no buckets", () => {
            expect(makeFacet().transformResponse({}).entries).toEqual([]);
        });
    });
});
