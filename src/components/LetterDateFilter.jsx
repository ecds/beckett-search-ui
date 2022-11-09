import { EuiDatePicker, EuiDatePickerRange } from "@elastic/eui";
import moment from "moment";
import React from "react";
import { datesValid } from "../pages/common";

/**
 * Date picker component for filtering letters related to a single entity.
 *
 * @param {object} props React functional component props
 * @param {object} props.data Data returned from API (should contain min_date and max_date)
 * @param {boolean} props.loading True if data is currently loading
 * @param {object} props.dateRange Date range object with startDate and endDate keys
 * @param {Function} props.onChangeStart Change handler for start date input
 * @param {Function} props.onChangeEnd Change handler for end date input
 * @returns {React.Component} React functional component for the entity related letters date picker.
 */
export function LetterDateFilter({
    data,
    loading,
    dateRange,
    onChangeStart,
    onChangeEnd,
}) {
    return (
        <EuiDatePickerRange
            startDateControl={(
                <EuiDatePicker
                    selected={dateRange?.startDate}
                    onClear={onChangeStart}
                    onChange={onChangeStart}
                    isLoading={loading}
                    startDate={dateRange?.startDate}
                    endDate={dateRange?.endDate}
                    placeholder="from"
                    isInvalid={
                        !datesValid({
                            ...dateRange,
                            min: data?.min_date,
                            max: data?.max_date,
                        })
                    }
                    aria-label="Start date"
                    openToDate={dateRange?.startDate || moment(data.min_date)}
                />
            )}
            endDateControl={(
                <EuiDatePicker
                    isLoading={loading}
                    selected={dateRange?.endDate}
                    onClear={onChangeEnd}
                    onChange={onChangeEnd}
                    startDate={dateRange?.startDate}
                    endDate={dateRange?.endDate}
                    isInvalid={
                        !datesValid({
                            ...dateRange,
                            min: data?.min_date,
                            max: data?.max_date,
                        })
                    }
                    placeholder="to"
                    aria-label="End date"
                    openToDate={dateRange?.endDate || moment(data.max_date)}
                />
            )}
        />
    );
}
