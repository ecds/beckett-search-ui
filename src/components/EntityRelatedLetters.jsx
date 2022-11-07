import moment from "moment";
import { EuiDatePicker, EuiDatePickerRange, EuiTitle } from "@elastic/eui";
import { useState } from "react";
import "./EntityRelatedLetters.css";
import { Link } from "react-router-dom";

/**
 *
 * @param props
 * @param props.title
 * @param props.letters
 */
export function EntityRelatedLetters({ title, letters }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // min and max date for initial range
    const dates = letters.map((l) => new Date(l.date).getTime());
    const minDate = moment(Math.min(...dates));
    const maxDate = moment(Math.max(...dates));

    return (
        <section>
            <div className="related-letters-header">
                <EuiTitle>
                    <h2 className="result-heading">{title}</h2>
                </EuiTitle>
                <EuiDatePickerRange
                    startDateControl={(
                        <EuiDatePicker
                            selected={startDate}
                            onChange={setStartDate}
                            startDate={startDate}
                            value={startDate || minDate.format("L")}
                            endDate={endDate}
                            placeholder="from"
                            isInvalid={startDate > endDate}
                            aria-label="Start date"
                            openToDate={startDate || minDate}
                        />
                    )}
                    endDateControl={(
                        <EuiDatePicker
                            selected={endDate}
                            onChange={setEndDate}
                            startDate={startDate}
                            value={endDate || maxDate.format("L")}
                            endDate={endDate}
                            isInvalid={startDate > endDate}
                            placeholder="to"
                            aria-label="End date"
                            openToDate={endDate || maxDate}
                        />
                    )}
                />
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
