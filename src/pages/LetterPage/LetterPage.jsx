import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
} from "@elastic/eui";
import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getFromApi } from "../common";
import "../common/result.css";
import "./LetterPage.css";

/**
 * Loader for individual letter records.
 *
 * @param {object} props Loader props
 * @param {object} props.params URL parameters
 * @returns {Promise<object>} Result of calling json() on API URL
 */
export function letterLoader({ params }) {
    return getFromApi(`/letters/${params.letterId}`);
}

/**
 * Convenience function to parse URI-formatted IDs into UUIDs.
 *
 * @param {string} uri URI to parse
 * @returns {string} Parsed UUID
 */
function parseId(uri) {
    const split = uri.split("/");
    return split[split.length - 1].replace(".json", "");
}

/**
 * Page for individual letter records.
 *
 * @returns {React.Component} Letter page component.
 */
export function LetterPage() {
    const letter = useLoaderData();
    const date = new Date(letter?.date);
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        date,
    );
    const recipients = letter?.recipients.map((r) => r.label).join(", ");
    const dateString = `${date.getDate()} ${month} ${date.getFullYear()}`;
    return (
        <main>
            <EuiPage paddingSize="l">
                <EuiPageBody component="section">
                    <EuiPageContent>
                        <EuiPageContentHeader className="result-name">
                            <EuiPageContentHeaderSection>
                                <EuiTitle size="l">
                                    <h1>
                                        {dateString}
                                        {" "}
                                        Letter to
                                        {" "}
                                        {recipients}
                                    </h1>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        <EuiTitle>
                            <h2>Letter Information</h2>
                        </EuiTitle>

                        {letter.mentions && (
                            <>
                                <EuiTitle>
                                    <h2>Entities Mentioned in the Letter</h2>
                                </EuiTitle>
                                {Object.entries(letter.mentions).map(
                                    ([key, value]) => (
                                        <React.Fragment key={key}>
                                            <EuiTitle size="s">
                                                <h3 className="capital-label result-heading">
                                                    {key
                                                        .toString()
                                                        .trim()
                                                        .replaceAll("_", " ")}
                                                </h3>
                                            </EuiTitle>
                                            <ul className="entities-list">
                                                {value
                                                    .sort((a, b) => a.label.localeCompare(
                                                        b.label,
                                                    ))
                                                    .map((e) => (
                                                        <li key={e.id}>
                                                            <Link
                                                                to={`/entities/${parseId(
                                                                    e.id,
                                                                )}`}
                                                                // eslint-disable-next-line max-len
                                                                // eslint-disable-next-line react/no-danger
                                                                dangerouslySetInnerHTML={{
                                                                    __html: e.label,
                                                                }}
                                                            />
                                                        </li>
                                                    ))}
                                            </ul>
                                        </React.Fragment>
                                    ),
                                )}
                            </>
                        )}
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
