import { EuiFlexGrid, EuiHorizontalRule, EuiFlexItem } from "@elastic/eui";
import React from "react";

/**
 * List of results for the Entities search view.
 *
 * @param {object} props Props for React functional component
 * @param {object} props.data Data returned by ElasticSearch
 * @returns Populated results list React component
 */
function EntitiesResults({ data }) {
    return (
        <EuiFlexGrid columns={1}>
            {data?.hits.items.map((hit) => (
                <React.Fragment
                    key={hit.id}
                >
                    <EuiFlexItem
                        dangerouslySetInnerHTML={{
                            __html: hit?.fields?.short_display,
                        }}
                    />
                    <EuiHorizontalRule />
                </React.Fragment>
            ))}
        </EuiFlexGrid>
    );
}

export default EntitiesResults;
