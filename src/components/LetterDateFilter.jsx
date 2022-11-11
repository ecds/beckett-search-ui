import { EuiDatePicker, EuiDatePickerRange } from "@elastic/eui";
import moment from "moment";
import React from "react";

/**
 * Date picker component for filtering letters related to a single entity.
 *
 * @param {object} props React functional component props
 * @param {object} props.dateRange Date range object with startDate and endDate keys
 * @param {boolean} props.loading True if data is currently loading
 * @param {moment.Moment} props.maxDate Max date returned from API, as a moment object
 * @param {moment.Moment} props.minDate Min date returned from API, as a moment object
 * @param {Function} props.onChangeEnd Change handler for end date input
 * @param {Function} props.onChangeStart Change handler for start date input
 * @param {boolean} props.isValid Validation for the data passed to this component
 * @returns {React.Component} React functional component for the entity related letters date picker.
 */
export function LetterDateFilter({
    dateRange,
    isValid,
    loading,
    maxDate,
    minDate,
    onChangeEnd,
    onChangeStart,
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
                    isInvalid={!isValid}
                    aria-label="Start date"
                    openToDate={dateRange?.startDate || minDate}
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
                    isInvalid={!isValid}
                    placeholder="to"
                    aria-label="End date"
                    openToDate={dateRange?.endDate || maxDate}
                />
            )}
        />
    );
}
