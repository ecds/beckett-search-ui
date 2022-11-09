import moment from "moment";
import { EuiLoadingContent, EuiPagination, EuiTitle } from "@elastic/eui";
import React, { useEffect, useState } from "react";
import "./EntityRelatedLetters.css";
import { Link } from "react-router-dom";
import { LetterDateFilter } from "./LetterDateFilter";
import { datesValid, getRelatedLetters } from "../pages/common";

const dateFormat = "YYYY-MM-DD";

/**
 * Component for related letters on a single entity result page.
 *
 * @param {object} props React functional component props
 * @param {string} props.title Type of relationship between entity and letters
 * @param {string} props.uri URI for related letters endpoint
 * @returns {React.Component} React functional component for related letters
 */
export function EntityRelatedLetters({ title, uri }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [filterState, setFilterState] = useState({});
    const [dateRange, setDateRange] = useState({});

    useEffect(() => {
        if (dateRange && data?.min_date && data.max_date) {
            if (
                datesValid({
                    ...dateRange,
                    min: data.min_date,
                    max: data.max_date,
                })
            ) {
                setFilterState((prevState) => ({
                    ...prevState,
                    ...dateRange,
                    page: 0, // Always restart at page 1 if dates change
                }));
            }
        }
    }, [dateRange]);

    useEffect(() => {
        setLoading(true);
        // eslint-disable-next-line jsdoc/require-jsdoc
        const fetchData = async () => {
            const response = await getRelatedLetters({
                uri,
                page: filterState?.page ? filterState.page + 1 : 1,
                startDate: filterState?.startDate
                    ? moment(filterState.startDate).format(dateFormat)
                    : undefined,
                endDate: filterState?.endDate
                    ? moment(filterState.endDate).format(dateFormat)
                    : undefined,
            });
            setData(response);
            setLoading(false);
        };
        fetchData();
    }, [filterState]);

    return (
        <section>
            <div className="related-letters-header">
                <EuiTitle>
                    <h2 className="result-heading">{title}</h2>
                </EuiTitle>
                {data && (
                    <LetterDateFilter
                        data={data}
                        loading={loading}
                        dateRange={dateRange}
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
                )}
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
                    {loading
                        && [
                            ...Array(
                                data && data?.total_pages > 1 ? 9 : 1,
                            ).keys(),
                        ].map((key) => (
                            <tr key={key}>
                                {[...Array(3).keys()].map((tdKey) => (
                                    <td key={tdKey}>
                                        <EuiLoadingContent lines={1} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    {!loading
                        && data?.letters?.map((letter) => (
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
            {data && data?.total_pages > 1 && (
                <div className="related-letters-pagination">
                    <EuiPagination
                        aria-label={`Pagination for ${title}`}
                        pageCount={data?.total_pages}
                        activePage={filterState?.page}
                        onPageClick={(page) => setFilterState((prevState) => ({
                            ...prevState,
                            page,
                        }))}
                    />
                </div>
            )}
        </section>
    );
}
