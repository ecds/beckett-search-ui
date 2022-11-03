import React from "react";
import { EuiTitle } from "@elastic/eui";

/**
 * Letter metadata section component
 *
 * @param {object} props React functional component props object
 * @param {object} props.metadata Metadata object returned from API
 * @param {Array<string>} props.excluded Array of keys to exclude from metadata section
 * @returns {React.Component} Letter metadata section component
 */
export function LetterMetadata({ metadata, excluded }) {
    return (
        <section>
            <EuiTitle>
                <h2 className="result-heading">Letter Information</h2>
            </EuiTitle>
            <dl className="letter-metadata">
                {Object.entries(metadata).map(
                    ([key, value]) => !excluded.includes(key)
                        && value && (
                        <React.Fragment key={key}>
                            <dt className="capital-label">
                                {key.toString().trim().replaceAll("_", " ")}
                            </dt>
                            <dd
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: value,
                                }}
                            />
                        </React.Fragment>
                    ),
                )}
            </dl>
        </section>
    );
}
