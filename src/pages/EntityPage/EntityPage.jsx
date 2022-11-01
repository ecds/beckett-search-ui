import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
} from "@elastic/eui";
import React from "react";
import { useLoaderData } from "react-router-dom";
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
    return (
        <main>
            <EuiPage paddingSize="l">
                <EuiPageBody component="section">
                    <EuiPageContent>
                        <EuiPageContentHeader className="result-header">
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
                        <EuiTitle>
                            <h2 className="capital-label">
                                {entity.e_type.toString().replaceAll("_", " ")}
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
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
