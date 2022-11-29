import React from "react";
import { EuiTitle } from "@elastic/eui";
import moment from "moment";
import { LetterDateFilter } from "./LetterDateFilter";
import { datesValid } from "../common";

/**
 * DateRange facet display component, adapted from @searchkit/elastic-ui but with the
 * ability to use minimum and maximum date aggregations across the dataset.
 *
 * @param {object} props React functional component props
 * @param {moment.Moment} props.maxDate Max date returned from API, as a moment object
 * @param {moment.Moment} props.minDate Min date returned from API, as a moment object
 * @param {boolean} props.loading Loading indicator boolean
 * @param {object} props.dateRange Current date range state
 * @param {Function} props.setDateRange Function to set date range state
 * @returns {React.Component} Date range React component
 */
function DateRangeFacet({
    minDate, maxDate, dateRange, setDateRange, loading,
}) {
    return (
        <>
            <EuiTitle size="xxs">
                <h3>Date</h3>
            </EuiTitle>
            <LetterDateFilter
                dateRange={dateRange}
                isValid={datesValid({
                    ...dateRange,
                })}
                loading={loading}
                minDate={minDate}
                maxDate={maxDate}
                onChangeStart={(d) => {
                    setDateRange((prevState) => ({
                        ...prevState,
                        startDate: d instanceof moment ? d : null,
                    }));
                }}
                onChangeEnd={(d) => {
                    setDateRange((prevState) => ({
                        ...prevState,
                        endDate: d instanceof moment ? d : null,
                    }));
                }}
            />
        </>
    );
}

export default DateRangeFacet;
