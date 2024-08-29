import moment from "moment";
import { EuiPageSection, EuiPagination, EuiTitle } from "@elastic/eui";
import React, { useEffect, useState } from "react";
import "./EntityRelatedLetters.css";
import { Link, useSearchParams } from "react-router-dom";
import { LetterDateFilter } from "./LetterDateFilter";
import { datesValid, getRelatedLetters } from "../common";

const dateFormat = "YYYY-MM-DD";

/**
 * Component for related letters on a single entity result page.
 *
 * @param {object} props React functional component props
 * @param {string} props.title Formatted name of relationship between entity and letters
 * @param {string} props.type Raw type of relationship between entity and letters
 * @param {string} props.uri URI for related letters endpoint
 * @returns {React.Component} React functional component for related letters
 */
export function EntityRelatedLetters({ title, type, uri }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();

    // get initial date range and filter states from search params, if possible
    const [dateRange, setDateRange] = useState({
        startDate: searchParams?.get(`${type}_startDate`)
            ? moment.utc(searchParams?.get(`${type}_startDate`))
            : null,
        endDate: searchParams?.get(`${type}_endDate`)
            ? moment.utc(searchParams?.get(`${type}_endDate`))
            : null,
    });
    const [filterState, setFilterState] = useState(
        searchParams
            ? Object.fromEntries(
                  Array.from(searchParams.entries())
                      // each param in the URL is scoped to a relationship like "type_key"
                      .filter(([key, _]) => key.includes(type))
                      .map(([key, val]) => [
                          key.split("_")[1],
                          // special handling for page numbers
                          key.includes("page") ? Number(val - 1) : val,
                      ]),
              )
            : {},
    );

    // validate date range before actually making a date filter API call
    useEffect(() => {
        if (dateRange && datesValid(dateRange)) {
            setFilterState((prevState) => ({
                ...prevState,
                ...dateRange,
                page:
                    prevState.startDate === dateRange.startDate &&
                    prevState.endDate === dateRange.endDate
                        ? prevState.page
                        : 0, // Always restart at first page if dates change
            }));
        }
    }, [dateRange]);

    // make API call and update URL search params whenever the filter state changes
    useEffect(() => {
        // handling API call:
        setLoading(true);
        // set page and date params for fetching data, and for URL search routing
        const params = {
            page: filterState?.page ? filterState.page + 1 : 1,
            startDate: filterState?.startDate
                ? moment.utc(filterState.startDate).format(dateFormat)
                : undefined,
            endDate: filterState?.endDate
                ? moment.utc(filterState.endDate).format(dateFormat)
                : undefined,
        };
        // remove (and keep track of) any undefined key/value pairs
        const deleted = [];
        Object.keys(params).forEach(
            (key) =>
                params[key] === undefined &&
                deleted.push(`${type}_${key}`) &&
                delete params[key],
        );
        /**
         * Asynchronously fetch the related letters matching the params
         */
        const fetchData = async () => {
            const response = await getRelatedLetters({
                uri,
                ...params,
            });
            setData(response);
            setLoading(false);
        };
        fetchData();

        // handling URL search params:
        // create URL search params in the format entitytype_key=value
        const updatedSearchParams = Object.assign(
            ...Object.entries(params).map(([key, val]) => ({
                [`${type}_${key}`]: val,
            })),
        );
        // update affected search params, but don't clobber unaffected existing ones
        setSearchParams(
            (prevParams) => {
                const prevParamsObj = {};
                // have to do it like this because URISearchParams can't use spread operator
                prevParams.forEach((value, key) => {
                    if (
                        !Object.prototype.hasOwnProperty.call(
                            updatedSearchParams,
                            key,
                        )
                    ) {
                        prevParamsObj[key] = value;
                    }
                });
                // also remove old params that have been deleted
                deleted.forEach((del) => delete prevParamsObj[del]);
                // now we can use spread :)
                return { ...prevParamsObj, ...updatedSearchParams };
            },
            { replace: true },
        ); // don't push another entry onto the history stack!
    }, [filterState]);

    return (
        <section>
            <div className="related-letters-header">
                <EuiTitle>
                    <h2 className="result-heading">{title}</h2>
                </EuiTitle>
                {data && (
                    <LetterDateFilter
                        minDate={moment.utc(data.min_date)}
                        maxDate={moment.utc(data.max_date)}
                        isValid={datesValid(dateRange)}
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
                    {loading &&
                        [
                            ...Array(
                                data && data?.total_pages > 1 ? 9 : 1,
                            ).keys(),
                        ].map((key) => (
                            <tr key={key}>
                                {[...Array(3).keys()].map((tdKey) => (
                                    <td key={tdKey}>
                                        <EuiPageSection lines={1} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    {!loading &&
                        data?.letters?.map((letter) => (
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
            {data?.total_pages > 1 && (
                <div className="related-letters-pagination">
                    <EuiPagination
                        aria-label={`Pagination for ${title}`}
                        pageCount={data.total_pages}
                        activePage={filterState?.page}
                        onPageClick={(page) =>
                            setFilterState((prevState) => ({
                                ...prevState,
                                page,
                            }))
                        }
                    />
                </div>
            )}
        </section>
    );
}
