import React from "react";
import {
    EuiDualRange,
    EuiFormRow,
    EuiTitle,
} from "@elastic/eui";

/**
 * YearRange facet display component, adapted from @searchkit/elastic-ui but with the
 * ability to use minimum and maximum year aggregations across the dataset.
 *
 * @param {object} props - React functional component props
 * @param {number} props.minYear - Min year returned from API
 * @param {number} props.maxYear - Max year returned from API
 * @param {Function} props.setYearRange - Function to set year range state
 * @param {object} props.yearRange - Current year range state
 * @returns {React.Component} Year range React component
 */
function YearRangeFacet({
    minYear, maxYear, setYearRange, yearRange,
}) {
    /**
     * Handle change in start/end year of year filtering range
     *
     * @param {Array<number>} value - start and end years of year filtering range
     */
    const onRangeChange = (value) => {
        setYearRange((prevState) => ({
            ...prevState,
            startYear: value[0],
            endYear: value[1],
        }));
    };

    // Passing empty strings as the value allows the inputs to be blank,
    // though the range handles will still be placed at the min/max positions

    return (
        <>
            <EuiTitle size="xxs">
                <h3>Years</h3>
            </EuiTitle>
            <EuiFormRow>
                <EuiDualRange
                    value={[yearRange.startYear || "", yearRange.endYear || ""]}
                    onChange={onRangeChange}
                    fullWidth
                    min={minYear}
                    max={maxYear}
                    showInput="inputWithPopover"
                    showLabels
                    aria-label="Year filter input form"
                    prepend="From"
                    append="To"
                />
            </EuiFormRow>
        </>
    );
}

export default YearRangeFacet;
