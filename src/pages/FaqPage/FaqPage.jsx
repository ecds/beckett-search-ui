import React from "react";
import { useLoaderData } from "react-router-dom";
import {
    EuiAccordion,
    EuiPage,
    EuiPageBody,
    EuiPageSection,
    EuiPageHeader,
    EuiPageHeaderSection,
    EuiPanel,
    EuiText,
    EuiTitle,
} from "@elastic/eui";
import { getFromApi } from "../../common";
import "./FaqPage.css";

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
        <main id="faq" className="faq-page">
            <EuiPage paddingSize="l">
                <EuiPageBody component="section">
                    <EuiPageHeader className="static-page-header">
                        <EuiPageHeaderSection>
                            <EuiTitle size="m">
                                <h1>Frequently Asked Questions</h1>
                            </EuiTitle>
                        </EuiPageHeaderSection>
                    </EuiPageHeader>
                    <EuiPageSection>
                        <EuiText>
                            <EuiPageSection>
                                {faqs.map((faq) => (
                                    <EuiAccordion
                                        key={faq.position}
                                        id="faq-accordion"
                                        buttonContent={buttonContent(
                                            faq.question,
                                        )}
                                    >
                                        <EuiPanel color="subdued">
                                            <p
                                                // eslint-disable-next-line react/no-danger
                                                dangerouslySetInnerHTML={{
                                                    __html: faq.answer,
                                                }}
                                            />
                                        </EuiPanel>
                                    </EuiAccordion>
                                ))}
                            </EuiPageSection>
                        </EuiText>
                    </EuiPageSection>
                </EuiPageBody>
            </EuiPage>
        </main>
    );
}
