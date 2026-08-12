import { describe, expect, it } from "vitest";

import {
    getSortByFromState,
    isDefault,
    routeToState,
    stateToRoute,
} from "./searchRouting";

describe("stateToRoute", () => {
    it("carries over query/sort/size/from/scope/op and drops empty values", () => {
        const route = stateToRoute({
            query: "godot",
            sortBy: "date_asc",
            page: { size: 25, from: 10 },
            scope: "letters",
            operator: "and",
            filters: [],
        });
        expect(route).toEqual({
            query: "godot",
            sort: "date_asc",
            size: 25,
            from: 10,
            scope: "letters",
            op: "and",
        });
    });

    it("drops query/sort/scope/op when falsy, but size always defaults to 25", () => {
        const route = stateToRoute({
            query: "",
            sortBy: "",
            page: { size: 25, from: 0 },
            scope: "",
            operator: "",
            filters: [],
        });
        expect(route).toEqual({ size: 25 });
    });

    it("groups generic filters by identifier into arrays", () => {
        const route = stateToRoute({
            page: {},
            filters: [
                { identifier: "author", value: "Beckett" },
                { identifier: "author", value: "Joyce" },
                { identifier: "language", value: "en" },
            ],
        });
        expect(route.author).toEqual(["Beckett", "Joyce"]);
        expect(route.language).toEqual(["en"]);
    });

    it("formats start_date/end_date filters as YYYY-MM-DD", () => {
        const route = stateToRoute({
            page: {},
            filters: [
                { identifier: "start_date", dateMin: "1929-03-22T00:00:00.000Z" },
                { identifier: "end_date", dateMax: "1965-12-31T00:00:00.000Z" },
            ],
        });
        expect(route.dateMin).toBe("1929-03-22");
        expect(route.dateMax).toBe("1965-12-31");
    });

    it("carries start_year/end_year filters through as-is", () => {
        const route = stateToRoute({
            page: {},
            filters: [
                { identifier: "start_year", yearMin: "1957" },
                { identifier: "end_year", yearMax: "1965" },
            ],
        });
        expect(route.yearMin).toBe("1957");
        expect(route.yearMax).toBe("1965");
    });
});

describe("routeToState", () => {
    it("reads query/sort/size/from/scope/op, defaulting size to 25 and from to 0", () => {
        const state = routeToState(new URLSearchParams("query=godot&sort=date_asc&scope=letters&op=and"));
        expect(state).toMatchObject({
            query: "godot",
            sortBy: "date_asc",
            scope: "letters",
            operator: "and",
            page: { size: 25, from: 0 },
        });
    });

    it("turns unrecognized params into filters", () => {
        const state = routeToState(new URLSearchParams("author=Beckett&language=en"));
        expect(state.filters).toEqual([
            { identifier: "author", value: "Beckett" },
            { identifier: "language", value: "en" },
        ]);
    });

    it("parses dateMin/dateMax into start_date/end_date filters", () => {
        const state = routeToState(new URLSearchParams("dateMin=1929-03-22&dateMax=1965-12-31"));
        const start = state.filters.find((f) => f.identifier === "start_date");
        const end = state.filters.find((f) => f.identifier === "end_date");
        expect(start.dateMin).toBe(new Date("1929-03-22T00:00:00.000Z").toISOString());
        expect(end.dateMax).toBe(new Date("1965-12-31T00:00:00.000Z").toISOString());
    });

    it("parses yearMin/yearMax into start_year/end_year filters", () => {
        const state = routeToState(new URLSearchParams("yearMin=1957&yearMax=1965"));
        expect(state.filters).toEqual([
            { identifier: "start_year", yearMin: "1957" },
            { identifier: "end_year", yearMax: "1965" },
        ]);
    });
});

describe("stateToRoute / routeToState round-trip", () => {
    it("round-trips a query with generic filters", () => {
        const route = new URLSearchParams();
        route.set("query", "godot");
        route.set("author", "Beckett");
        const state = routeToState(route);
        const backToRoute = stateToRoute(state);
        expect(backToRoute).toMatchObject({ query: "godot", author: ["Beckett"] });
    });

    it("round-trips date filters", () => {
        const route = new URLSearchParams("dateMin=1929-03-22&dateMax=1965-12-31");
        const state = routeToState(route);
        const backToRoute = stateToRoute(state);
        expect(backToRoute.dateMin).toBe("1929-03-22");
        expect(backToRoute.dateMax).toBe("1965-12-31");
    });
});

describe("isDefault", () => {
    const defaultState = {
        query: "",
        filters: [],
        sortBy: "date_asc",
        operator: "or",
        page: { from: 0 },
    };

    it("is true for the default state", () => {
        expect(isDefault(defaultState)).toBe(true);
    });

    it("is true when sortBy/operator are simply absent", () => {
        expect(isDefault({ filters: [], page: { from: 0 } })).toBe(true);
    });

    it.each([
        ["query", { ...defaultState, query: "godot" }],
        ["filters", { ...defaultState, filters: [{ identifier: "author", value: "x" }] }],
        ["sortBy", { ...defaultState, sortBy: "date_desc" }],
        ["operator", { ...defaultState, operator: "and" }],
        ["page.from", { ...defaultState, page: { from: 1 } }],
    ])("is false when %s differs from the default", (_label, state) => {
        expect(isDefault(state)).toBe(false);
    });
});

describe("getSortByFromState", () => {
    it("appends _asc/_desc direction suffixes", () => {
        expect(getSortByFromState({ field: "date", direction: 1 })).toBe("date_asc");
        expect(getSortByFromState({ field: "date", direction: -1 })).toBe("date_desc");
    });

    it("omits the direction suffix for relevance sorting", () => {
        expect(getSortByFromState({ field: "relevance", direction: 1 })).toBe(
            "relevance",
        );
    });

    it("returns the bare field when there is no direction", () => {
        expect(getSortByFromState({ field: "date" })).toBe("date");
    });
});
