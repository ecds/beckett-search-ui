import moment from "moment";
import {
    EuiButtonEmpty,
    EuiDatePicker,
    EuiDatePickerRange,
    EuiTitle,
} from "@elastic/eui";
import React, { useState } from "react";
import "./EntityRelatedLetters.css";
import { Link } from "react-router-dom";

/**
 * Component for related letters on a single entity result page.
 *
 * @param {object} props React functional component props
 * @param {string} props.title Type of relationship between entity and letters
 * @param {Array<object>} props.letters Array of related letters
 * @returns {React.Component} React functional component for related letters
 */
export function EntityRelatedLetters({ title, letters }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // min and max date for initial range
    const dates = letters.map((l) => new Date(l.date).getTime());
    const minDate = moment(Math.min(...dates));
    const maxDate = moment(Math.max(...dates));

    /**
     * Click event handler to reset start and end date filter.
     */
    const resetFilter = () => {
        setStartDate(null);
        setEndDate(null);
    };
    /**
     * Validation for entered dates.
     *
     * @returns {boolean} True if invalid, false if valid.
     */
    const isInvalid = () => {
        if (startDate && endDate) {
            return startDate > endDate;
        }
        if (startDate) {
            return startDate > maxDate;
        }
        if (endDate) {
            return endDate < minDate;
        }
        return false;
    };

    return (
        <section>
            <div className="related-letters-header">
                <EuiTitle>
                    <h2 className="result-heading">{title}</h2>
                </EuiTitle>
                <div className="date-picker-container">
                    <EuiButtonEmpty
                        iconType="cross"
                        disabled={!(startDate || endDate)}
                        onClick={resetFilter}
                    >
                        Reset
                    </EuiButtonEmpty>
                    <EuiDatePickerRange
                        className={`date-picker${
                            startDate && endDate ? " both-active" : ""
                        }`}
                        startDateControl={(
                            <EuiDatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                startDate={startDate}
                                value={startDate || minDate.format("L")}
                                endDate={endDate}
                                placeholder="from"
                                isInvalid={isInvalid()}
                                aria-label="Start date"
                                openToDate={startDate || minDate}
                                className={startDate ? "active" : ""}
                            />
                        )}
                        endDateControl={(
                            <EuiDatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                startDate={startDate}
                                value={endDate || maxDate.format("L")}
                                endDate={endDate}
                                isInvalid={isInvalid()}
                                placeholder="to"
                                aria-label="End date"
                                openToDate={endDate || maxDate}
                                className={endDate ? "active" : ""}
                            />
                        )}
                    />
                </div>
            </div>
            <table className="related-letters search-results">
                <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Repository</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {letters
                        .filter(
                            (l) => (startDate
                                ? moment(l.date) >= startDate
                                : true)
                                && (endDate ? moment(l.date) <= endDate : true),
                        )
                        .map((letter) => (
                            <tr key={letter.id}>
                                <td>
                                    <Link
                                        className="to-record"
                                        to={`/letters/${letter.id}`}
                                    >
                                        <span>{letter.recipient}</span>
                                    </Link>
                                </td>
                                <td>{letter.repository}</td>
                                <td>{letter.date}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </section>
    );
}
