import React, { useState, useEffect } from "react";
import { EuiTitle } from "@elastic/eui";
import { useSearchkit } from "@searchkit/client";
import moment from "moment";
import { LetterDateFilter } from "./LetterDateFilter";
import { datesValid } from "../pages/common";

/**
 * DateRange facet display component, adapted from @searchkit/elastic-ui but with the
 * ability to use minimum and maximum date aggregations across the dataset.
 *
 * @param {object} props React functional component props
 * @param {object} props.data Results from ElasticSearch, which should include min and max date
 * aggregations.
 * @param {boolean} props.loading Loading indicator boolean
 * @returns {React.Component} Date range React component
 */
function DateRangeFacet({ data, loading }) {
    // adapted from @searchkit/elastic-ui
    const api = useSearchkit();
    const startDateFilters = api.getFiltersByIdentifier("start_date");
    const selectedStartDate = startDateFilters && startDateFilters[0];
    const endDateFilters = api.getFiltersByIdentifier("end_date");
    const selectedEndDate = endDateFilters && endDateFilters[0];

    // if a filter already present on mount, set initial state to that range
    const [dateRange, setDateRange] = useState({
        startDate: selectedStartDate?.dateMin
            ? moment(selectedStartDate.dateMin)
            : null,
        endDate: selectedEndDate?.dateMax
            ? moment(selectedEndDate.dateMax)
            : null,
    });

    // get min and max date facet values
    const min = data?.facets?.find((f) => f.identifier === "min_date")?.value || null;
    const minDate = min ? moment(min) : null;
    const max = data?.facets?.find((f) => f.identifier === "max_date")?.value || null;
    const maxDate = max ? moment(max) : null;

    // update filters when range is changed
    useEffect(() => {
        api.removeFiltersByIdentifier("start_date");
        api.removeFiltersByIdentifier("end_date");
        if (
            dateRange
            && (dateRange.startDate || dateRange.endDate)
            && datesValid({ ...dateRange })
        ) {
            if (dateRange.startDate) {
                api.addFilter({
                    identifier: "start_date",
                    dateMin: dateRange?.startDate?.toISOString(),
                });
            }
            if (dateRange.endDate) {
                api.addFilter({
                    identifier: "end_date",
                    dateMax: dateRange?.endDate?.toISOString(),
                });
            }
        }
        api.search();
    }, [dateRange]);

    useEffect(() => {
        // handle search state generated from URL query params
        if (
            (selectedStartDate?.dateMin && !dateRange.startDate)
            || (selectedEndDate?.dateMax && !dateRange.endDate)
        ) {
            setDateRange(() => ({
                startDate: selectedStartDate?.dateMin
                    ? moment(selectedStartDate.dateMin)
                    : null,
                endDate: selectedEndDate?.dateMax
                    ? moment(selectedEndDate.dateMax)
                    : null,
            }));
            api.search();
        } else if (!api.getFilters().length && (dateRange.startDate || dateRange.endDate)) {
            // handle "reset search" click
            setDateRange({ startDate: null, endDate: null });
        }
    }, [selectedStartDate, selectedEndDate]);

    return (
        <>
            <EuiTitle size="xxs">
                <h3>Date</h3>
            </EuiTitle>
            <LetterDateFilter
                dateRange={dateRange}
                isValid={datesValid({ ...dateRange })}
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
