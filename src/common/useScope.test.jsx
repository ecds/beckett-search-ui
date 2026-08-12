import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { SearchProvider } from "./SearchContext";
import { useScope } from "./useScope";

const useHarness = (...args) => {
    const [scope, setScope] = useScope(...args);
    const [searchParams] = useSearchParams();
    return { scope, setScope, searchParams };
};

const wrapperFor = (initialEntry) =>
    function Wrapper({ children }) {
        return (
            <MemoryRouter initialEntries={[initialEntry]}>
                <SearchProvider>{children}</SearchProvider>
            </MemoryRouter>
        );
    };

describe("useScope", () => {
    it("defaults to 'keyword' when no scope param is present", () => {
        const { result } = renderHook(useHarness, { wrapper: wrapperFor("/") });
        expect(result.current.scope).toBe("keyword");
    });

    it("initializes from the URL's scope param", () => {
        const { result } = renderHook(useHarness, {
            wrapper: wrapperFor("/?query=godot&scope=title"),
        });
        expect(result.current.scope).toBe("title");
    });

    it("does not sync to the URL while the search state is still default", () => {
        const { result } = renderHook(useHarness, { wrapper: wrapperFor("/") });
        expect(result.current.searchParams.has("scope")).toBe(false);
    });

    it("resets the page to 0 when the scope changes", () => {
        const { result } = renderHook(useHarness, {
            wrapper: wrapperFor("/?query=godot&scope=keyword&from=50&size=25"),
        });
        expect(result.current.searchParams.get("from")).toBe("50");

        act(() => {
            result.current.setScope("title");
        });

        expect(result.current.searchParams.get("scope")).toBe("title");
        // from=0 is dropped from the URL entirely (stateToRoute treats 0 as falsy)
        expect(result.current.searchParams.has("from")).toBe(false);
    });

    it("leaves the page alone when the scope is unchanged", () => {
        const { result } = renderHook(useHarness, {
            wrapper: wrapperFor("/?query=godot&scope=keyword&from=50&size=25"),
        });
        expect(result.current.searchParams.get("from")).toBe("50");
    });
});
