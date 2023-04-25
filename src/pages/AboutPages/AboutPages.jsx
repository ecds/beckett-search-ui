import React from "react";
import { useLoaderData } from "react-router-dom";
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiText,
} from "@elastic/eui";
import { getFromApi } from "../../common";
import "./AboutPages.css";
/**
 * Loader for all FAQ records.
 *
 * @returns {Promise<object>} Result of calling json() on API URL
 */
export function aboutLoader() {
    return getFromApi("/faqs");
}

/**
 * Page for FAQs.
 *
 * @returns {React.Component} faq page component.
 */
export function AboutPages() {
    const content = useLoaderData();
    return (
        <main id="faq">
            <EuiPage paddingSize="l">
                <EuiPageBody component="section">
                    <EuiPageContent>
                        <EuiText>
                            <EuiPageContentBody className="about-page">
                                <article
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: content.body,
                                    }}
                                />
                            </EuiPageContentBody>
                        </EuiText>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
