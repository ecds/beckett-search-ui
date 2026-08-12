import { describe, expect, it } from "vitest";

import { buildMatchQueries, buildQuery } from "./queryBuilder";

const fields = [
    { name: "title", boost: 2 },
    { name: "body", boost: 1 },
];

describe("buildMatchQueries", () => {
    it("builds one match query per field, boost scaled by 10", () => {
        expect(
            buildMatchQueries({
                analyzer: "english",
                fields,
                operator: "or",
                query: "letters",
            }),
        ).toEqual([
            {
                match: {
                    "title.analyzed": {
                        query: "letters",
                        boost: 20,
                        operator: "or",
                        analyzer: "english",
                    },
                },
            },
            {
                match: {
                    "body.analyzed": {
                        query: "letters",
                        boost: 10,
                        operator: "or",
                        analyzer: "english",
                    },
                },
            },
        ]);
    });
});

describe("buildQuery", () => {
    const build = buildQuery({ analyzers: ["english"], fields });

    it("puts the whole query in the should/dis_max clause when there are no exclusions", () => {
        const result = build("letters");
        expect(result.bool.should.dis_max.queries).toHaveLength(2);
        expect(result.bool.should.dis_max.queries[0].match["title.analyzed"].query).toBe(
            "letters",
        );
        // exclusions.join(" ") is still "" (not skipped), so must_not queries exist
        // with an empty match string rather than being an empty array.
        expect(result.bool.must_not).toHaveLength(2);
        expect(result.bool.must_not[0].match["title.analyzed"].query).toBe("");
    });

    it("splits '-token' exclusions into must_not, defaulting operator to 'or'", () => {
        const result = build("letters -unpublished");
        expect(
            result.bool.should.dis_max.queries[0].match["title.analyzed"].query,
        ).toBe("letters");
        expect(
            result.bool.must_not[0].match["title.analyzed"].query,
        ).toBe("unpublished");
        expect(result.bool.must_not[0].match["title.analyzed"].operator).toBe("or");
    });

    it("joins multiple exclusions with a space", () => {
        const result = build("letters -draft -unpublished");
        expect(
            result.bool.must_not[0].match["title.analyzed"].query,
        ).toBe("draft unpublished");
    });

    it("builds one match query per analyzer per field", () => {
        const multi = buildQuery({ analyzers: ["english", "standard"], fields })(
            "letters",
        );
        expect(multi.bool.should.dis_max.queries).toHaveLength(4);
    });

    it("defaults the inclusion operator to 'or' when none is given", () => {
        const result = build("letters");
        expect(result.bool.should.dis_max.queries[0].match["title.analyzed"].operator).toBe(
            "or",
        );
    });

    it("honors a custom inclusion operator, but exclusions always use 'or'", () => {
        const result = buildQuery({ analyzers: ["english"], fields, operator: "and" })(
            "letters -draft",
        );
        expect(result.bool.should.dis_max.queries[0].match["title.analyzed"].operator).toBe(
            "and",
        );
        expect(result.bool.must_not[0].match["title.analyzed"].operator).toBe("or");
    });
});
