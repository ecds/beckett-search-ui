import { afterEach, describe, expect, it, vi } from "vitest";

import { getFromApi, getRelatedLetters } from "./fetch";

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("getFromApi", () => {
    it("normalizes a path with no leading slash and returns the parsed json", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            status: 200,
            json: () => Promise.resolve({ ok: true }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const result = await getFromApi("faqs");

        expect(fetchMock).toHaveBeenCalledWith(
            `${import.meta.env.VITE_API_ENDPOINT}/faqs`,
        );
        expect(result).toEqual({ ok: true });
    });

    it("does not duplicate a leading slash that's already present", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            status: 200,
            json: () => Promise.resolve({}),
        });
        vi.stubGlobal("fetch", fetchMock);

        await getFromApi("/faqs");

        expect(fetchMock).toHaveBeenCalledWith(
            `${import.meta.env.VITE_API_ENDPOINT}/faqs`,
        );
    });

    it("special-cases a 404 into a plain status object instead of parsing json", async () => {
        const json = vi.fn();
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({ status: 404, json }),
        );

        const result = await getFromApi("missing");

        expect(result).toEqual({ status: 404 });
        expect(json).not.toHaveBeenCalled();
    });
});

describe("getRelatedLetters", () => {
    it("requests the bare uri when no optional params are given", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ items: [] }),
        });
        vi.stubGlobal("fetch", fetchMock);

        await getRelatedLetters({ uri: "/api/letters/1/related" });

        expect(fetchMock).toHaveBeenCalledWith("/api/letters/1/related");
    });

    it("appends page/start_date/end_date query params when given", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ items: [] }),
        });
        vi.stubGlobal("fetch", fetchMock);

        await getRelatedLetters({
            uri: "/api/letters/1/related",
            page: 2,
            startDate: "1929-01-01",
            endDate: "1965-12-31",
        });

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/letters/1/related&page=2&start_date=1929-01-01&end_date=1965-12-31",
        );
    });
});
