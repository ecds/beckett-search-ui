import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { SearchProvider, useSearchkit, useSearchkitVariables } from "./SearchContext";

const useHarness = () => ({
    api: useSearchkit(),
    variables: useSearchkitVariables(),
});

const wrapperFor =
    (initialEntry) =>
    ({ children }) => (
        <MemoryRouter initialEntries={[initialEntry]}>
            <SearchProvider>{children}</SearchProvider>
        </MemoryRouter>
    );

describe("SearchProvider", () => {
    describe("getFilters", () => {
        it("returns the filters derived from the URL", () => {
            const { result } = renderHook(useHarness, {
                wrapper: wrapperFor("/?author=Beckett"),
            });
            expect(result.current.api.getFilters()).toEqual([
                { identifier: "author", value: "Beckett" },
            ]);
        });
    });

    describe("isFilterSelected", () => {
        it("is true when the identifier/value pair is an active filter", () => {
            const { result } = renderHook(useHarness, {
                wrapper: wrapperFor("/?author=Beckett"),
            });
            expect(
                result.current.api.isFilterSelected({
                    identifier: "author",
                    value: "Beckett",
                }),
            ).toBe(true);
        });

        it("coerces the queried value to a string before comparing", () => {
            const { result } = renderHook(useHarness, {
                wrapper: wrapperFor("/?count=5"),
            });
            // URL-derived filter values are always strings; a numeric 5 should still match "5".
            expect(
                result.current.api.isFilterSelected({ identifier: "count", value: 5 }),
            ).toBe(true);
        });

        it("is false when no filter matches", () => {
            const { result } = renderHook(useHarness, {
                wrapper: wrapperFor("/?author=Beckett"),
            });
            expect(
                result.current.api.isFilterSelected({
                    identifier: "author",
                    value: "Joyce",
                }),
            ).toBe(false);
        });
    });

    describe("canResetSearch", () => {
        it("is false for the default (empty) search state", () => {
            const { result } = renderHook(useHarness, { wrapper: wrapperFor("/") });
            expect(result.current.api.canResetSearch()).toBe(false);
        });

        it("is true once a query is present", () => {
            const { result } = renderHook(useHarness, {
                wrapper: wrapperFor("/?query=godot"),
            });
            expect(result.current.api.canResetSearch()).toBe(true);
        });
    });

    describe("setPage", () => {
        it("updates the URL params, reflected in the next render's variables", () => {
            const { result } = renderHook(useHarness, {
                wrapper: wrapperFor("/?query=godot"),
            });

            act(() => {
                result.current.api.setPage({ size: 25, from: 50 });
            });

            expect(result.current.variables.page).toEqual({ size: 25, from: 50 });
        });
    });
});
