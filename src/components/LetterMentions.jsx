import React from "react";
import { EuiTitle } from "@elastic/eui";
import { Link } from "react-router-dom";

/**
 * Convenience function to parse URI-formatted IDs into UUIDs.
 *
 * @param {string} uri URI to parse
 * @returns {string} Parsed UUID
 */
function parseId(uri) {
    const split = uri.split("/");
    return split[split.length - 1].replace(".json", "");
}

/**
 * Letter mentions section component
 *
 * @param {object} props React functional component props object
 * @param {object} props.mentions Mentions object returned from API
 * @returns {React.Component} Letter mentions section component
 */
export function LetterMentions({ mentions }) {
    return (
        <section>
            <EuiTitle>
                <h2 className="result-heading">
                    Entities Mentioned in the Letter
                </h2>
            </EuiTitle>
            <dl className="letter-metadata letter-mentions">
                {Object.entries(mentions).map(([key, value]) => (
                    <React.Fragment key={key}>
                        <dt className="capital-label">
                            {key.toString().trim().replaceAll("_", " ")}
                        </dt>
                        {value
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map(
                                (e) => e.label && (
                                    <dd key={parseId(e.id)}>
                                        <Link
                                            to={`/entities/${parseId(
                                                e.id,
                                            )}`}
                                            dangerouslySetInnerHTML={{
                                                __html: e.label,
                                            }}
                                        />
                                    </dd>
                                ),
                            )}
                    </React.Fragment>
                ))}
            </dl>
        </section>
    );
}
