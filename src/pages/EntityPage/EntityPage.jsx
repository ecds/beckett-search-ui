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
import { getFromApi } from "../common";
import "../common/result.css";
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
    return (
        <main className="result">
            <EuiPage paddingSize="l">
                <EuiPageBody>
                    <EuiPageContent>
                        <EuiPageContentHeader className="result-name">
                            <EuiPageContentHeaderSection>
                                <EuiTitle size="l">
                                    <h1
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={{
                                            __html: entity.label,
                                        }}
                                    />
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                        </EuiPageContentHeader>
                        <section>
                            <EuiTitle>
                                <h2 className="capital-label result-heading">
                                    {entity?.e_type
                                        .toString()
                                        .replaceAll("_", " ")}
                                    {" "}
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
                        </section>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
