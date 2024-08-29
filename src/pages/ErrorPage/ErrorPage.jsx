import {
    EuiPage,
    EuiPageBody,
    EuiPageSection,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiTitle,
} from "@elastic/eui";
import React from "react";
import { useRouteError } from "react-router-dom";
import Navigation from "../../components/Navigation";

/**
 * Page component for error handling.
 *
 * @returns {React.Component} React component containing error message
 */
export function ErrorPage() {
    const error = useRouteError();
    return (
        <>
            <Navigation />
            <main>
                <EuiPage paddingSize="l">
                    <EuiPageBody component="section">
                        <EuiPageHeader>
                            <EuiPageHeaderSection>
                                <EuiTitle size="m">
                                    <h1>
                                        {`${error.status || ""} ${
                                            error.statusText || "Error"
                                        }`}
                                    </h1>
                                </EuiTitle>
                            </EuiPageHeaderSection>
                        </EuiPageHeader>
                        <EuiPageSection>
                            <EuiPageSection>
                                <p>This page could not be displayed.</p>
                            </EuiPageSection>
                        </EuiPageSection>
                    </EuiPageBody>
                </EuiPage>
            </main>
        </>
    );
}
