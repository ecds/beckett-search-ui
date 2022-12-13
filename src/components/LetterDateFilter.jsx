import {
    EuiDatePicker, EuiDatePickerRange, EuiSpacer, EuiText,
} from "@elastic/eui";
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
        <div>
            <EuiDatePickerRange
                startDateControl={(
                    <EuiDatePicker
                        aria-label="Start date"
                        endDate={dateRange?.endDate}
                        dateFormat={["MM/DD/YYYY", "YYYY"]}
                        isInvalid={!isValid}
                        isLoading={loading}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={onChangeStart}
                        onClear={onChangeStart}
                        openToDate={dateRange?.startDate || minDate}
                        placeholder="from"
                        selected={dateRange?.startDate}
                        startDate={dateRange?.startDate}
                    />
                )}
                endDateControl={(
                    <EuiDatePicker
                        aria-label="End date"
                        endDate={dateRange?.endDate}
                        dateFormat={["MM/DD/YYYY", "YYYY"]}
                        isInvalid={!isValid}
                        isLoading={loading}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={onChangeEnd}
                        onClear={onChangeEnd}
                        openToDate={dateRange?.endDate || maxDate}
                        placeholder="to"
                        selected={dateRange?.endDate}
                        startDate={dateRange?.startDate}
                    />
                )}
            />
            {!isValid && (
                <>
                    <EuiSpacer size="s" />
                    <EuiText color="danger" size="s">Error: Start date cannot be later than end date.</EuiText>
                    <EuiSpacer size="s" />
                </>
            )}
        </div>
    );
}
