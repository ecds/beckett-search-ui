import { act, renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { executeSearch } from "./elasticsearchAdapter";
import { useCustomSearchkitSDK } from "./useCustomSearchkitSDK";

vi.mock("./elasticsearchAdapter", () => ({ executeSearch: vi.fn() }));

const fields = [{ name: "title", boost: 1 }];

const useHarness = (args) => {
    const [, setSearchParams] = useSearchParams();
    const sdk = useCustomSearchkitSDK(args);
    return { ...sdk, setSearchParams };
};

const wrapperFor =
    (initialEntry) =>
    ({ children }) => (
        <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    );

afterEach(() => {
    executeSearch.mockReset();
});

describe("useCustomSearchkitSDK", () => {
    it("fires the main search on mount and resolves loading/results", async () => {
        executeSearch.mockResolvedValue({ hits: { items: [] }, facets: [] });

        const { result } = renderHook(
            () => useHarness({ config: { name: "other" }, analyzers: ["standard"], fields }),
            { wrapper: wrapperFor("/?query=godot") },
        );

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.results).toEqual({ hits: { items: [] }, facets: [] });
        expect(executeSearch).toHaveBeenCalledWith(
            expect.objectContaining({
                searchState: expect.objectContaining({ query: "godot" }),
            }),
        );
    });

    it("re-fires the search when URL search params change", async () => {
        executeSearch.mockResolvedValue({ hits: { items: [] }, facets: [] });

        const { result } = renderHook(
            () => useHarness({ config: { name: "other" }, analyzers: ["standard"], fields }),
            { wrapper: wrapperFor("/?query=godot") },
        );
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(executeSearch).toHaveBeenCalledTimes(1);

        act(() => {
            result.current.setSearchParams({ query: "molloy" });
        });
        await waitFor(() => expect(executeSearch).toHaveBeenCalledTimes(2));

        expect(executeSearch).toHaveBeenLastCalledWith(
            expect.objectContaining({
                searchState: expect.objectContaining({ query: "molloy" }),
            }),
        );
    });

    it("narrows to a single field when a non-keyword scope is active", async () => {
        executeSearch.mockResolvedValue({ hits: { items: [] }, facets: [] });

        renderHook(
            () => useHarness({ config: { name: "other" }, analyzers: ["standard"], fields }),
            { wrapper: wrapperFor("/?query=godot&scope=author") },
        );

        await waitFor(() => expect(executeSearch).toHaveBeenCalled());
        expect(executeSearch.mock.calls[0][0].queryFn).toBeInstanceOf(Function);
        // buildQuery is called internally with scope-narrowed fields; verify indirectly
        // via the resulting query DSL touching only the scoped field.
        const dsl = executeSearch.mock.calls[0][0].queryFn("godot");
        const matchedFields = dsl.bool.should.dis_max.queries.map(
            (q) => Object.keys(q.match)[0],
        );
        expect(matchedFields).toEqual(["author.analyzed"]);
    });

    it("for a 'letters' config, fetches a one-time date range from min_date/max_date facets", async () => {
        executeSearch.mockImplementation(({ searchState }) => {
            if (searchState.page.size === 0) {
                return Promise.resolve({
                    facets: [
                        { identifier: "min_date", value: "1929-01-01" },
                        { identifier: "max_date", value: "1965-12-31" },
                    ],
                });
            }
            return Promise.resolve({ hits: { items: [] }, facets: [] });
        });

        const { result } = renderHook(
            () =>
                useHarness({
                    config: { name: "letters", facets: [] },
                    analyzers: ["standard"],
                    fields,
                }),
            { wrapper: wrapperFor("/?query=godot") },
        );

        expect(result.current.dateRangeLoading).toBe(true);
        await waitFor(() => expect(result.current.dateRangeLoading).toBe(false));

        expect(result.current.dateRange.minDate.format("YYYY-MM-DD")).toBe("1929-01-01");
        expect(result.current.dateRange.maxDate.format("YYYY-MM-DD")).toBe("1965-12-31");
    });

    it("for an 'entities' config, fetches a one-time year range from min_year/max_year facets", async () => {
        executeSearch.mockImplementation(({ searchState }) => {
            if (searchState.page.size === 0) {
                return Promise.resolve({
                    facets: [
                        { identifier: "min_year", value: "1906" },
                        { identifier: "max_year", value: "1989" },
                    ],
                });
            }
            return Promise.resolve({ hits: { items: [] }, facets: [] });
        });

        const { result } = renderHook(
            () =>
                useHarness({
                    config: { name: "entities", facets: [] },
                    analyzers: ["standard"],
                    fields,
                }),
            { wrapper: wrapperFor("/?query=godot") },
        );

        await waitFor(() =>
            expect(result.current.yearRange).toEqual({ minYear: "1906", maxYear: "1989" }),
        );
    });
});
