/* eslint-disable react/no-danger */
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
} from "@elastic/eui";
import React from "react";
import { Navigate, useLoaderData } from "react-router-dom";
import { LetterMentions } from "../../components/LetterMentions";
import { LetterMetadata } from "../../components/LetterMetadata";
import { formatDate, getFromApi } from "../common";
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
 * Page for individual letter records.
 *
 * @returns {React.Component} Letter page component.
 */
export function LetterPage() {
    const letter = useLoaderData();
    if (letter.status === 404) {
        return <Navigate replace to="/404" />;
    }
    const dateString = letter?.metadata?.date
        ? formatDate(letter.metadata.date)
        : "";
    const excludedMeta = ["id", "date", "label"];
    return (
        <main className="result">
            <EuiPage paddingSize="l">
                <EuiPageBody>
                    <EuiPageContent>
                        <EuiPageContentHeader className="result-name">
                            <EuiPageContentHeaderSection>
                                <EuiTitle size="l">
                                    <h1>
                                        {dateString}
                                        {" "}
                                        Letter to
                                        {" "}
                                        {letter?.metadata?.recipient}
                                    </h1>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        {letter.metadata && (
                            <LetterMetadata
                                metadata={letter.metadata}
                                excluded={excludedMeta}
                            />
                        )}
                        {letter.mentions && (
                            <LetterMentions mentions={letter.mentions} />
                        )}
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
