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
import { EntityRelatedLetters } from "../../components/EntityRelatedLetters";
import { getFromApi } from "../../common";
import "../../common/result.css";
import "./EntityPage.css";

/**
 * Loader for individual entity records.
 *
 * @param {object} props Loader props
 * @param {object} props.params URL parameters
 * @returns {Promise<object>} Result of calling json() on API URL
 */
export function entityLoader({ params }) {
    return getFromApi(`/entities/${params.entityId}`);
}

const relatedLettersMapping = {
    received: "Letters Received",
    sent: "Letters Sent",
    destination: "Destination Of",
    origin: "Origin Of",
    mention: "Mentioned In",
};

/**
 * Page for individual entity records.
 *
 * @returns {React.Component} entity page component.
 */
export function EntityPage() {
    const entity = useLoaderData();
    if (entity.status === 404) {
        return <Navigate replace to="/404" />;
    }
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
                                <h1
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: entity.label,
                                    }}
                                />
                            </EuiTitle>
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageSection>
                        <EuiPageSection>
                            <EuiPageSection>
                                <EuiTitle>
                                    <h2 className="capital-label result-meta-heading">
                                        {entity?.e_type
                                            .toString()
                                            .replaceAll("_", " ")}{" "}
                                        Information
                                    </h2>
                                </EuiTitle>
                                <div
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: entity.full_display,
                                    }}
                                    className="entity-details"
                                />
                            </EuiPageSection>
                            {entity.letters &&
                                Object.entries(entity.letters).map(
                                    ([key, value]) => (
                                        <React.Fragment key={key}>
                                            <EuiHorizontalRule />
                                            <EntityRelatedLetters
                                                title={
                                                    relatedLettersMapping[key]
                                                }
                                                type={key}
                                                uri={value}
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                        </EuiPageSection>
                    </EuiPageSection>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
