import { describe, expect, it } from "vitest";
import moment from "moment";

import { datesValid, formatDate } from "./dateUtil";

describe("formatDate", () => {
    it("formats a date string as 'D Month YYYY'", () => {
        expect(formatDate("1929-03-22")).toBe("22 March 1929");
    });

    it("returns undefined for a falsy input", () => {
        expect(formatDate(undefined)).toBeUndefined();
    });
});

describe("datesValid", () => {
    it("is valid when start is before end", () => {
        expect(
            datesValid({ startDate: moment("2020-01-01"), endDate: moment("2020-01-02") })
        ).toBe(true);
    });

    it("is invalid when start is after end", () => {
        expect(
            datesValid({ startDate: moment("2020-01-02"), endDate: moment("2020-01-01") })
        ).toBe(false);
    });

    it("is valid when either date is missing", () => {
        expect(datesValid({ startDate: undefined, endDate: undefined })).toBe(true);
    });
});
