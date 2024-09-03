/* eslint-disable react/no-danger */
import {
    EuiButtonEmpty,
    EuiHorizontalRule,
    EuiPage,
    EuiPageBody,
    EuiPageSection,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiTitle,
} from "@elastic/eui";
import React from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { LetterMentions } from "../../components/LetterMentions";
import { LetterMetadata } from "../../components/LetterMetadata";
import { formatDate, getFromApi } from "../../common";
import "../../common/result.css";
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
    const navigate = useNavigate();
    return (
        <main className="result">
            <EuiPage paddingSize="l">
                <EuiPageBody>
                    <div style={{ width: "100vw" }}>
                        <EuiButtonEmpty
                            type="button"
                            color="text"
                            iconType="arrowLeft"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Back
                        </EuiButtonEmpty>
                    </div>
                    <EuiPageHeader className="result-name">
                        <EuiPageHeaderSection>
                            <EuiTitle size="l">
                                <h1>
                                    {dateString} Letter to{" "}
                                    {letter?.metadata?.recipient}
                                </h1>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageSection>
                        <EuiTitle>
                            <h2 className="result-meta-heading">
                                Letter Information
                            </h2>
                        </EuiTitle>
                        {letter.metadata && (
                            <LetterMetadata
                                metadata={letter.metadata}
                                excluded={excludedMeta}
                            />
                        )}
                        <EuiHorizontalRule />
                        {letter.repositories && (
                            <LetterMetadata metadata={letter.repositories} />
                        )}
                        <EuiHorizontalRule />
                        {letter.publication_information && (
                            <LetterMetadata
                                metadata={{
                                    publication_information:
                                        letter.publication_information,
                                }}
                            />
                        )}
                        <EuiHorizontalRule />
                        {letter.mentions && (
                            <LetterMentions mentions={letter.mentions} />
                        )}
                    </EuiPageSection>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
