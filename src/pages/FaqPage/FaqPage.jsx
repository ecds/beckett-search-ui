import React from "react";
import { useLoaderData } from "react-router-dom";
import {
    EuiAccordion,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiSpacer,
    EuiText,
    EuiTitle,
} from "@elastic/eui";
import { getFromApi } from "../../common";

/**
 * Loader for all FAQ records.
 *
 * @returns {Promise<object>} Result of calling json() on API URL
 */
export function faqLoader() {
    return getFromApi("/faqs");
}

/**
 * HTML content for accordion button
 *
 * @param {string} content string
 * @returns {React.element} dangerously set HTML
 */
function buttonContent(content) {
    return (
        <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        />
    );
}

/**
 * Page for FAQs.
 *
 * @returns {React.Component} faq page component.
 */
export function FaqPage() {
    const faqs = useLoaderData();
    return (
        <main id="faq">
            <EuiPage paddingSize="l">
                <EuiPageBody component="section">
                    <EuiPageHeader>
                        <EuiPageHeaderSection>
                            <EuiTitle size="m">
                                <h1>Frequently Asked Questions</h1>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageContent>
                        <EuiPageContentBody>
                            {faqs.map((faq) => (
                                <EuiAccordion
                                    id="faq-accordion"
                                    key={faq.position}
                                    buttonContent={buttonContent(faq.question)}
                                >
                                    <EuiText size="m">
                                        <div
                                            // eslint-disable-next-line react/no-danger
                                            dangerouslySetInnerHTML={{
                                                __html: faq.question,
                                            }}
                                        />
                                    </EuiText>
                                    <EuiSpacer />
                                </EuiAccordion>
                            ))}
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
