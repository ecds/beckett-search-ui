import React, { useState, useEffect } from "react";
import { EuiTitle, EuiDatePickerRange, EuiDatePicker } from "@elastic/eui";
import { useSearchkit } from "@searchkit/client";
import moment from "moment";

/**
 * DateRange facet display component, adapted from @searchkit/elastic-ui but with the
 * ability to use minimum and maximum date aggregations across the dataset.
 *
 * @param {object} props React functional component props
 * @param {object} props.data Results from ElasticSearch, which should include min and max date
 * aggregations.
 * @param {object} props.facet Facet Schema object returned from Searchkit
 * @param {boolean} props.loading Loading indicator boolean
 * @returns {React.Component} Date range React component
 */
function DateRangeFacet({ data, facet, loading }) {
    // adapted from @searchkit/elastic-ui
    const api = useSearchkit();
    const selectedOptions = api.getFiltersByIdentifier(facet.identifier);
    const selectedOption = selectedOptions && selectedOptions[0];
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (startDate && endDate) {
            if (selectedOption) {
                api.removeFilter(selectedOption);
            }
            api.addFilter({
                identifier: facet.identifier,
                dateMin: startDate.toISOString(),
                dateMax: endDate.toISOString(),
            });
            api.search();
        }
    }, [startDate, endDate]);

    // get min and max date facet values
    const minDate = data?.facets?.find((f) => f.identifier === "min_date")?.value || null;
    const maxDate = data?.facets?.find((f) => f.identifier === "max_date")?.value || null;

    const currentMinValue = moment(
        startDate || selectedOption?.dateMin || minDate,
    );
    const currentMaxValue = moment(
        endDate || selectedOption?.dateMax || maxDate,
    );

    return (
        <>
            <EuiTitle size="xxs">
                <h3>{facet.label}</h3>
            </EuiTitle>
            <EuiDatePickerRange
                startDateControl={(
                    <EuiDatePicker
                        isLoading={loading}
                        selected={startDate}
                        onChange={setStartDate}
                        startDate={startDate}
                        value={currentMinValue.format("L")}
                        endDate={endDate}
                        placeholder="from"
                        isInvalid={startDate > endDate}
                        aria-label="Start date"
                        openToDate={currentMinValue}
                    />
                )}
                endDateControl={(
                    <EuiDatePicker
                        isLoading={loading}
                        selected={endDate}
                        onChange={setEndDate}
                        startDate={startDate}
                        value={currentMaxValue.format("L")}
                        endDate={endDate}
                        isInvalid={startDate > endDate}
                        aria-label="End date"
                        placeholder="to"
                        openToDate={currentMaxValue}
                    />
                )}
            />
        </>
    );
}

DateRangeFacet.DISPLAY = "CustomDateFacet";

export default DateRangeFacet;
